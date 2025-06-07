import Stripe from 'stripe';
import { stripe } from './stripe';
import { storage } from './storage';
import { sendEmail } from './email-service';

interface PaymentFailureResult {
  success: boolean;
  method: 'primary' | 'backup' | 'failed';
  message: string;
}

/**
 * Comprehensive payment failure handling with automatic backup card usage
 */
export class PaymentFailoverHandler {
  
  /**
   * Handle payment failure with smart retry logic
   */
  async handlePaymentFailure(customerId: string, invoiceId: string): Promise<PaymentFailureResult> {
    try {
      console.log(`🚨 Processing payment failure for customer: ${customerId}`);
      
      // Get user from database
      const user = await storage.getUserByStripeCustomerId(customerId);
      if (!user) {
        throw new Error('User not found for customer ID');
      }

      // Get all payment methods for this customer
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      const primaryCard = paymentMethods.data.find(pm => pm.id === user.primaryPaymentMethodId);
      const backupCard = paymentMethods.data.find(pm => pm.id === user.backupPaymentMethodId);

      // Strategy based on available payment methods
      if (backupCard && primaryCard) {
        return await this.handleUserWithBackupCard(user, invoiceId, primaryCard, backupCard);
      } else {
        return await this.handleUserWithSingleCard(user, invoiceId);
      }

    } catch (error) {
      console.error('Error in payment failure handler:', error);
      return {
        success: false,
        method: 'failed',
        message: 'System error processing payment failure'
      };
    }
  }

  /**
   * Handle users who have both primary and backup cards
   */
  private async handleUserWithBackupCard(
    user: any, 
    invoiceId: string, 
    primaryCard: Stripe.PaymentMethod, 
    backupCard: Stripe.PaymentMethod
  ): Promise<PaymentFailureResult> {
    
    console.log(`💳 Attempting backup card payment for user: ${user.username}`);
    
    try {
      // Retrieve the invoice
      const invoice = await stripe.invoices.retrieve(invoiceId);
      
      // Attempt payment with backup card
      const paymentResult = await stripe.invoices.pay(invoiceId, {
        payment_method: backupCard.id,
      });

      if (paymentResult.status === 'paid') {
        // Success! Update default payment method to the working backup card
        await stripe.customers.update(user.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: backupCard.id,
          },
        });

        // Update user's primary method to the successful backup
        await storage.updateUserPaymentMethods(user.id, {
          primaryPaymentMethodId: backupCard.id,
          backupPaymentMethodId: primaryCard.id, // Swap them
        });

        // Send success notification
        await this.sendPaymentSuccessEmail(user, 'backup');

        console.log(`✅ Backup card payment successful for user: ${user.username}`);
        
        return {
          success: true,
          method: 'backup',
          message: 'Payment successful with backup card'
        };
      }
    } catch (backupError) {
      console.log(`❌ Backup card also failed for user: ${user.username}`);
      // Both cards failed - treat like single card user
      return await this.handleUserWithSingleCard(user, invoiceId);
    }

    return {
      success: false,
      method: 'failed',
      message: 'Both payment methods failed'
    };
  }

  /**
   * Handle users with only one card or when both cards fail
   */
  private async handleUserWithSingleCard(user: any, invoiceId: string): Promise<PaymentFailureResult> {
    console.log(`📧 Starting grace period for user: ${user.username}`);
    
    // Set grace period (7 days from now)
    const gracePeriodEnd = new Date();
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);
    
    // Update user status to 'grace_period'
    await storage.updateUserSubscriptionStatus(user.id, {
      subscriptionStatus: 'past_due_grace_period',
      gracePeriodEnd: gracePeriodEnd,
      paymentRetryCount: 1,
    });

    // Send immediate failure notification with update link
    await this.sendPaymentFailureEmail(user, 1, gracePeriodEnd);

    // Schedule reminder emails (days 3, 5, 7)
    await this.scheduleGracePeriodReminders(user.id, gracePeriodEnd);

    return {
      success: false,
      method: 'failed',
      message: '7-day grace period initiated'
    };
  }

  /**
   * Send payment success email when backup card works
   */
  private async sendPaymentSuccessEmail(user: any, method: 'backup'): Promise<void> {
    const emailContent = `
      <h2>Payment Successful - Backup Card Used</h2>
      <p>Hi ${user.fullName || user.username},</p>
      
      <p>Good news! Your subscription payment was successful using your backup payment method.</p>
      
      <p><strong>What happened:</strong></p>
      <ul>
        <li>Your primary payment method was declined</li>
        <li>We automatically used your backup card</li>
        <li>Your subscription remains active</li>
        <li>We've made your backup card the new primary method</li>
      </ul>
      
      <p>You may want to update your payment information to ensure future payments go smoothly.</p>
      
      <p><a href="${process.env.BASE_URL}/update-payment" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Update Payment Info</a></p>
      
      <p>Thank you for being a valued USA Home professional!</p>
    `;

    await sendEmail({
      to: user.email,
      from: 'noreply@usahome.app',
      subject: '✅ Payment Successful - Backup Card Used',
      html: emailContent,
    });
  }

  /**
   * Send payment failure email with grace period info
   */
  private async sendPaymentFailureEmail(user: any, attemptNumber: number, gracePeriodEnd: Date): Promise<void> {
    const daysLeft = Math.ceil((gracePeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    const emailContent = `
      <h2>Payment Failed - Action Required</h2>
      <p>Hi ${user.fullName || user.username},</p>
      
      <p>We couldn't process your subscription payment. This could be due to:</p>
      <ul>
        <li>Insufficient funds</li>
        <li>Expired card</li>
        <li>Card declined by bank</li>
      </ul>
      
      <p><strong>Your account status:</strong></p>
      <ul>
        <li>Grace period: ${daysLeft} days remaining</li>
        <li>Your profile remains visible to clients</li>
        <li>No service interruption during grace period</li>
      </ul>
      
      <p style="color: #ff6b6b;"><strong>Please update your payment information within ${daysLeft} days to avoid account suspension.</strong></p>
      
      <p><a href="${process.env.BASE_URL}/update-payment" style="background-color: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Update Payment Now</a></p>
      
      <p>Need help? Contact us at support@usahome.app</p>
    `;

    await sendEmail({
      to: user.email,
      from: 'noreply@usahome.app',
      subject: `⚠️ Payment Failed - ${daysLeft} Days to Update`,
      html: emailContent,
    });
  }

  /**
   * Schedule reminder emails during grace period
   */
  private async scheduleGracePeriodReminders(userId: number, gracePeriodEnd: Date): Promise<void> {
    // This would integrate with your scheduling system
    // For now, log the schedule
    console.log(`📅 Scheduled reminders for user ${userId}:`);
    console.log(`- Day 3: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)}`);
    console.log(`- Day 5: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}`);
    console.log(`- Day 7: ${gracePeriodEnd}`);
  }

  /**
   * Process scheduled retry attempts during grace period
   */
  async processScheduledRetry(userId: number): Promise<void> {
    const user = await storage.getUser(userId);
    if (!user || user.subscriptionStatus !== 'past_due_grace_period') {
      return;
    }

    // Check if grace period has expired
    if (user.gracePeriodEnd && new Date() > user.gracePeriodEnd) {
      await this.suspendAccount(user);
      return;
    }

    // Attempt payment retry
    try {
      const pendingInvoices = await stripe.invoices.list({
        customer: user.stripeCustomerId,
        status: 'open',
        limit: 1,
      });

      if (pendingInvoices.data.length > 0) {
        await this.handlePaymentFailure(user.stripeCustomerId, pendingInvoices.data[0].id);
      }
    } catch (error) {
      console.error(`Retry failed for user ${userId}:`, error);
    }
  }

  /**
   * Suspend account after grace period expires
   */
  private async suspendAccount(user: any): Promise<void> {
    console.log(`🚫 Suspending account for user: ${user.username}`);
    
    await storage.updateUserSubscriptionStatus(user.id, {
      subscriptionStatus: 'suspended',
      isActive: false,
      suspendedAt: new Date(),
    });

    // Send suspension notification
    const emailContent = `
      <h2>Account Suspended - Payment Required</h2>
      <p>Hi ${user.fullName || user.username},</p>
      
      <p>Your USA Home professional account has been suspended due to payment failure.</p>
      
      <p><strong>What this means:</strong></p>
      <ul>
        <li>Your profile is hidden from clients</li>
        <li>You won't receive new leads</li>
        <li>Your data is safely stored</li>
      </ul>
      
      <p><strong>Reactivation is easy:</strong> Update your payment method and your account will be immediately restored.</p>
      
      <p><a href="${process.env.BASE_URL}/update-payment" style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reactivate Account</a></p>
    `;

    await sendEmail({
      to: user.email,
      from: 'noreply@usahome.app',
      subject: '🔒 Account Suspended - Easy Reactivation Available',
      html: emailContent,
    });
  }
}

export const paymentFailoverHandler = new PaymentFailoverHandler();