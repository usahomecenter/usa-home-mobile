import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import sgMail from "@sendgrid/mail";

// Notification types for professionals
export type NotificationType = 
  | "payment_success"
  | "payment_failed" 
  | "subscription_expiring"
  | "subscription_expired"
  | "new_service_added"
  | "payment_method_updated"
  | "subscription_renewed";

export interface NotificationData {
  professionalId: number;
  type: NotificationType;
  title: string;
  message: string;
  actionRequired?: boolean;
  metadata?: Record<string, any>;
}

// Store notifications in database
export async function createNotification(data: NotificationData) {
  try {
    console.log("Creating notification for professional:", data.professionalId);
    
    // Use raw SQL for both operations to avoid conflicts
    const { pool } = await import("./db");
    
    // Check if professional exists
    const professionalCheck = await pool.query(
      'SELECT id, email, full_name FROM users WHERE id = $1 AND is_professional = true',
      [data.professionalId]
    );

    if (professionalCheck.rows.length === 0) {
      throw new Error(`Professional not found: ${data.professionalId}`);
    }

    const professional = professionalCheck.rows[0];
    console.log("Professional found:", professional.email);

    // Store notification in database
    const result = await pool.query(
      `INSERT INTO notifications (professional_id, type, title, message, action_required, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        data.professionalId,
        data.type,
        data.title,
        data.message,
        data.actionRequired || false,
        JSON.stringify(data.metadata || {})
      ]
    );

    const storedNotification = result.rows[0];
    console.log("Notification stored successfully:", storedNotification.id);

    // Send email notification
    await sendEmailNotification(professional, storedNotification);

    return storedNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Send email notification to professional
async function sendEmailNotification(professional: any, notification: any) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("SendGrid not configured, skipping email notification");
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const emailContent = generateEmailContent(notification);
  
  const msg = {
    to: professional.email,
    from: 'info@usahome.center',
    subject: `USA Home: ${notification.title}`,
    html: emailContent,
    text: notification.message
  };

  try {
    await sgMail.send(msg);
    console.log(`Notification email sent to ${professional.email}`);
  } catch (error) {
    console.error("Error sending notification email:", error);
  }
}

// Generate email content based on notification type
function generateEmailContent(notification: any): string {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">USA Home</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0;">Your Home Services Platform</p>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
  `;

  const baseEnd = `
      </div>
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© 2025 USA Home. All rights reserved.</p>
        <p>Contact us: info@usahome.center</p>
      </div>
    </div>
  `;

  let content = "";

  switch (notification.type) {
    case "payment_success":
      content = `
        <h2 style="color: #28a745; margin-bottom: 20px;">✅ Payment Successful</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Great news! Your payment has been processed successfully.
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> $${notification.metadata?.amount || 'N/A'}</p>
          <p><strong>Service:</strong> ${notification.metadata?.service || 'Professional Listing'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Your professional listing is now active and visible to potential clients.</p>
      `;
      break;

    case "payment_failed":
      content = `
        <h2 style="color: #dc3545; margin-bottom: 20px;">❌ Payment Failed</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          We were unable to process your payment. Please update your payment method to keep your listing active.
        </p>
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p><strong>⚠️ Action Required:</strong> Update your payment method within 7 days to avoid service interruption.</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/update-payment" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Update Payment Method
        </a>
      `;
      break;

    case "subscription_expiring":
      content = `
        <h2 style="color: #ffc107; margin-bottom: 20px;">⏰ Subscription Expiring Soon</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Your USA Home professional subscription will expire in ${notification.metadata?.daysLeft || 'few'} days.
        </p>
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Expiration Date:</strong> ${notification.metadata?.expirationDate || 'Soon'}</p>
          <p>Renew now to continue receiving client inquiries and maintain your professional listing.</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/renew-subscription" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Renew Subscription
        </a>
      `;
      break;

    case "subscription_expired":
      content = `
        <h2 style="color: #dc3545; margin-bottom: 20px;">🔒 Subscription Expired</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Your professional subscription has expired. Your listing is now hidden from potential clients.
        </p>
        <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <p><strong>What this means:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Your profile is no longer visible to clients</li>
            <li>You won't receive new client inquiries</li>
            <li>Your account data is safely preserved</li>
          </ul>
        </div>
        <a href="${process.env.FRONTEND_URL}/reactivate" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
          Reactivate Subscription
        </a>
      `;
      break;

    case "new_service_added":
      content = `
        <h2 style="color: #17a2b8; margin-bottom: 20px;">🎉 New Service Added</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          You've successfully added a new service to your professional profile!
        </p>
        <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>New Service:</strong> ${notification.metadata?.serviceName || 'Additional Service'}</p>
          <p><strong>Additional Fee:</strong> $5.00</p>
          <p><strong>Total Monthly:</strong> $${notification.metadata?.totalFee || 'N/A'}</p>
        </div>
        <p>Your expanded service offerings are now visible to potential clients in relevant searches.</p>
      `;
      break;

    case "payment_method_updated":
      content = `
        <h2 style="color: #28a745; margin-bottom: 20px;">💳 Payment Method Updated</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Your payment method has been successfully updated.
        </p>
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>New Payment Method:</strong> ${notification.metadata?.paymentMethod || 'Card ending in ****'}</p>
          <p><strong>Next Billing Date:</strong> ${notification.metadata?.nextBilling || 'Next month'}</p>
        </div>
        <p>Your subscription will continue without interruption.</p>
      `;
      break;

    default:
      content = `
        <h2 style="color: #333; margin-bottom: 20px;">${notification.title}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          ${notification.message}
        </p>
      `;
  }

  return baseStyle + content + baseEnd;
}

// Predefined notification templates
export const NotificationTemplates = {
  paymentSuccess: (amount: string, service: string): NotificationData => ({
    professionalId: 0, // Will be set when called
    type: "payment_success",
    title: "Payment Processed Successfully",
    message: `Your payment of $${amount} for ${service} has been processed successfully.`,
    metadata: { amount, service }
  }),

  paymentFailed: (amount: string, reason?: string): NotificationData => ({
    professionalId: 0,
    type: "payment_failed", 
    title: "Payment Failed",
    message: `We were unable to process your payment of $${amount}. ${reason || 'Please update your payment method.'}`,
    actionRequired: true,
    metadata: { amount, reason }
  }),

  subscriptionExpiring: (daysLeft: number, expirationDate: string): NotificationData => ({
    professionalId: 0,
    type: "subscription_expiring",
    title: "Subscription Expiring Soon",
    message: `Your subscription will expire in ${daysLeft} days on ${expirationDate}.`,
    actionRequired: true,
    metadata: { daysLeft, expirationDate }
  }),

  subscriptionExpired: (): NotificationData => ({
    professionalId: 0,
    type: "subscription_expired", 
    title: "Subscription Expired",
    message: "Your professional subscription has expired. Reactivate to continue receiving client inquiries.",
    actionRequired: true
  }),

  newServiceAdded: (serviceName: string, totalFee: string): NotificationData => ({
    professionalId: 0,
    type: "new_service_added",
    title: "New Service Added Successfully", 
    message: `You've added ${serviceName} to your profile. Your new monthly fee is $${totalFee}.`,
    metadata: { serviceName, totalFee }
  }),

  paymentMethodUpdated: (paymentMethod: string, nextBilling: string): NotificationData => ({
    professionalId: 0,
    type: "payment_method_updated",
    title: "Payment Method Updated",
    message: "Your payment method has been updated successfully.",
    metadata: { paymentMethod, nextBilling }
  })
};

// Helper function to send notifications to multiple professionals
export async function sendBulkNotifications(notifications: NotificationData[]) {
  const results = [];
  
  for (const notification of notifications) {
    try {
      const result = await createNotification(notification);
      results.push({ success: true, professionalId: notification.professionalId, result });
    } catch (error) {
      results.push({ success: false, professionalId: notification.professionalId, error });
    }
  }
  
  return results;
}