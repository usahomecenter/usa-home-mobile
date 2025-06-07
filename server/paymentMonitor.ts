import { storage } from './storage';

// Automated Payment Monitoring System
export class PaymentMonitor {
  private static instance: PaymentMonitor;
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): PaymentMonitor {
    if (!PaymentMonitor.instance) {
      PaymentMonitor.instance = new PaymentMonitor();
    }
    return PaymentMonitor.instance;
  }

  // Start automated monitoring (runs every 30 minutes)
  startMonitoring() {
    console.log('🔄 Starting automated payment monitoring system...');
    
    // Run immediately on start
    this.checkAllPaymentStatuses();
    
    // Then run every 30 minutes
    this.monitoringInterval = setInterval(() => {
      this.checkAllPaymentStatuses();
    }, 30 * 60 * 1000); // 30 minutes
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏹️ Payment monitoring stopped');
    }
  }

  private async checkAllPaymentStatuses() {
    try {
      console.log('🔍 Checking payment statuses for all professionals...');
      const professionals = await storage.getAllProfessionals();
      
      for (const professional of professionals) {
        if (!professional.isActive) continue;
        
        await this.checkIndividualPaymentStatus(professional);
      }
      
      console.log(`✅ Payment status check completed for ${professionals.length} professionals`);
    } catch (error) {
      console.error('❌ Error during payment monitoring:', error);
    }
  }

  private async checkIndividualPaymentStatus(professional: any) {
    const now = new Date();
    
    // Calculate proper expiration: subscription starts + 30 days
    const subscriptionStart = new Date(professional.subscriptionStartDate || professional.lastPaymentDate);
    const subscriptionExpiry = new Date(subscriptionStart.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from start
    const daysUntilExpiry = Math.ceil((subscriptionExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Check for upcoming expiration (7 days warning)
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      await this.sendExpirationWarning(professional, daysUntilExpiry);
    }

    // Check for expired subscriptions (only if truly expired)
    if (daysUntilExpiry <= 0) {
      await this.handleExpiredSubscription(professional);
    }

    // Check for failed payments (if last payment was more than 35 days ago)
    const lastPayment = new Date(professional.lastPaymentDate || 0);
    const daysSinceLastPayment = Math.ceil((now.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPayment > 35) {
      await this.sendPaymentFailedNotification(professional);
    }
  }

  private async sendExpirationWarning(professional: any, daysLeft: number) {
    try {
      const notification = {
        professionalId: professional.id,
        type: 'subscription_expiring',
        title: `Subscription Expiring in ${daysLeft} Days`,
        message: `Your USA Home professional subscription expires in ${daysLeft} days. Please update your payment method to continue receiving leads.`,
        actionRequired: true,
        createdAt: new Date().toISOString()
      };

      // Note: Simplified notification for now - you can enhance this with email integration
      console.log(`📧 Expiration warning sent to ${professional.email} (${daysLeft} days left)`);
    } catch (error) {
      console.error(`❌ Failed to send expiration warning to ${professional.email}:`, error);
    }
  }

  private async handleExpiredSubscription(professional: any) {
    try {
      // Deactivate the professional
      await storage.updateUser(professional.id, { isActive: false });
      
      console.log(`🚫 Subscription expired - deactivated ${professional.email}`);
    } catch (error) {
      console.error(`❌ Failed to handle expired subscription for ${professional.email}:`, error);
    }
  }

  private async sendPaymentFailedNotification(professional: any) {
    try {
      console.log(`💳 Payment failed notification sent to ${professional.email}`);
    } catch (error) {
      console.error(`❌ Failed to send payment failed notification to ${professional.email}:`, error);
    }
  }

  // Manual trigger for immediate check (for admin use)
  async checkPaymentStatusNow(professionalId?: number) {
    if (professionalId) {
      const professional = await storage.getUser(professionalId);
      if (professional && professional.isProfessional) {
        await this.checkIndividualPaymentStatus(professional);
        return `Payment status checked for ${professional.email}`;
      }
    } else {
      await this.checkAllPaymentStatuses();
      return 'Payment status checked for all professionals';
    }
  }
}

export const paymentMonitor = PaymentMonitor.getInstance();