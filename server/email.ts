import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key if it exists
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Email service for sending notifications
 */
export const emailService = {
  /**
   * Send a support ticket confirmation email
   */
  async sendTicketConfirmation(ticketNumber: string, email: string, subject: string) {
    // Skip if SendGrid API key is not set
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not set, skipping email notification');
      return false;
    }

    try {
      const msg = {
        to: email,
        from: 'info@usahome.center', // Update with your verified sender
        subject: `Support Ticket #${ticketNumber} Received - USA Home`,
        text: `
Thank you for contacting USA Home support.

Your support ticket has been received and is being processed. Please keep this email for your records.

Ticket Details:
------------------
Ticket Number: ${ticketNumber}
Subject: ${subject}
Status: Open

We will respond to your inquiry as soon as possible. You can reply to this email if you have any additional information to add to your ticket.

Thank you for choosing USA Home for your home building, design, and financing needs.

Best regards,
USA Home Support Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .ticket-info { background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Your Support Ticket Has Been Received</h2>
    </div>
    
    <p>Thank you for contacting USA Home support.</p>
    
    <p>Your support ticket has been received and is being processed. Please keep this email for your records.</p>
    
    <div class="ticket-info">
      <h3>Ticket Details</h3>
      <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Status:</strong> Open</p>
    </div>
    
    <p>We will respond to your inquiry as soon as possible. You can reply to this email if you have any additional information to add to your ticket.</p>
    
    <p>Thank you for choosing USA Home for your home building, design, and financing needs.</p>
    
    <p>Best regards,<br>USA Home Support Team</p>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} USA Home. All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
        `,
      };

      await sgMail.send(msg);
      console.log(`Support ticket confirmation email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending ticket confirmation email:', error);
      return false;
    }
  },

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string) {
    // Skip if SendGrid API key is not set
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not set, skipping password reset email');
      return false;
    }

    try {
      // Create the reset link using the current domain
      const baseUrl = `https://53381bfd-bbf5-4c40-936c-fa55630d1e1c-00-1da59bq79jpoj.riker.replit.dev`;
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
      console.log(`🔗 SENDING EMAIL WITH URL: ${resetLink}`);
      
      const msg = {
        to: email,
        from: 'info@usahome.center',
        subject: 'Password Reset Request - USA Home',
        text: `
You have requested a password reset for your USA Home account.

Please click the following link to reset your password:
${resetLink}

This link will expire in 1 hour for security reasons.

If you did not request this password reset, please ignore this email and your password will remain unchanged.

Best regards,
USA Home Team
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .reset-button { 
      background-color: #007bff; 
      color: white; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 5px; 
      display: inline-block; 
      margin: 20px 0; 
    }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #777; }
    .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Password Reset Request</h2>
    </div>
    
    <p>You have requested a password reset for your USA Home account.</p>
    
    <p>Click the button below to reset your password:</p>
    
    <div style="text-align: center;">
      <a href="${resetLink}" class="reset-button">Reset Password</a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${resetLink}</p>
    
    <div class="warning">
      <strong>Important:</strong> This link will expire in 1 hour for security reasons.
    </div>
    
    <p>If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
    
    <p>Best regards,<br>USA Home Team</p>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} USA Home. All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
        `,
      };

      await sgMail.send(msg);
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }
};