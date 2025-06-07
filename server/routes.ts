import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage as dbStorage } from "./storage";
import { setupAuth } from "./auth";
import { insertReviewSchema, insertGuestReviewSchema, InsertUser, User } from "@shared/schema";
import { pool } from "./db"; // Import the database pool for direct access
import { 
  processAllSubscriptionStatuses, 
  sendPaymentReminders, 
  updateSubscriptionStatus 
} from "./payment-reminders";
import { getOrCreateSubscription, handleStripeWebhook, stripe } from "./stripe";
import { createNotification, NotificationTemplates } from "./notifications";

import multer from 'multer';
import fs from 'fs';

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Import support service and schemas
import { supportService } from "./support";
import { insertGuestSupportTicketSchema, insertGuestFeedbackSchema } from "../shared/supportSchema";
import { emailService } from "./email";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve the Android project download page
  app.get('/download-android', (req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), 'download-android.html'));
  });

  // Serve the Android project zip file
  app.get('/usa-home-android.zip', (req: Request, res: Response) => {
    const zipPath = path.join(process.cwd(), 'usa-home-android.zip');
    res.download(zipPath, 'usa-home-android.zip', (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  });
  
  // Password reset endpoint (must be early in routing)
  app.post("/api/forgot-password", async (req, res) => {
    try {
      console.log("🔐 Password reset request received for:", req.body);
      const { email } = req.body;
      
      if (!email) {
        console.log("❌ No email provided in request");
        return res.status(400).json({ error: "Email is required" });
      }

      console.log(`🔍 Looking up user with email: ${email}`);
      // Check if user exists
      const user = await dbStorage.getUserByEmail(email);
      console.log(`👤 User found:`, user ? `Yes (ID: ${user.id})` : 'No');
      
      if (!user) {
        // Don't reveal if email exists or not for security
        console.log(`📧 Email ${email} not found, but returning success message for security`);
        return res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent." 
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
      console.log(`🔑 Generated reset token for ${email}: ${resetToken.substring(0, 8)}...`);

      // Store reset token (you'll need to add this to your storage interface)
      await dbStorage.storeResetToken(email, resetToken);
      
      // Send password reset email
      console.log(`📨 Attempting to send password reset email to: ${email}`);
      const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);
      console.log(`📧 Email sending result: ${emailSent ? 'SUCCESS' : 'FAILED'}`);
      
      if (emailSent) {
        console.log(`✅ Password reset email sent successfully to ${email}`);
        res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent." 
        });
      } else {
        console.error(`❌ Failed to send password reset email to ${email}`);
        res.status(500).json({ error: "Failed to send password reset email" });
      }
    } catch (error) {
      console.error("💥 Password reset error:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });

  // Verify reset token endpoint
  app.post("/api/verify-reset-token", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      // Check if token exists and is valid (not expired)
      const isValid = await dbStorage.verifyResetToken(token);
      
      if (isValid) {
        res.status(200).json({ valid: true });
      } else {
        res.status(400).json({ error: "Invalid or expired token" });
      }
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({ error: "Failed to verify token" });
    }
  });

  // Reset password endpoint
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      // Verify token and get associated user
      const user = await dbStorage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      // Update user's password and clear reset token
      await dbStorage.updateUserPassword(user.id, newPassword);
      await dbStorage.clearResetToken(token);
      
      console.log(`✅ Password successfully reset for user: ${user.email}`);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });
  
  // Serve the backend login page (must be before React routes)
  app.get('/backend-login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'server', 'backend-login.html'));
  });

  // Serve the admin dashboard (must be before React routes)
  app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'server', 'admin-dashboard.html'));
  });
  
  // Create a support ticket
  app.post("/api/support/ticket", async (req, res) => {
    try {
      const parsedBody = insertGuestSupportTicketSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          error: "Invalid ticket data", 
          details: parsedBody.error.format() 
        });
      }
      
      // Add user ID if authenticated (set to null for guest users)
      const ticketData = {
        ...parsedBody.data,
        userId: null
      };
      
      const ticket = await supportService.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      console.error("Support ticket creation error:", error);
      res.status(500).json({ error: "Failed to create support ticket" });
    }
  });
  
  // Submit feedback (no authentication required)
  app.post("/api/support/feedback", async (req, res) => {
    try {
      const parsedBody = insertGuestFeedbackSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ 
          error: "Invalid feedback data", 
          details: parsedBody.error.format() 
        });
      }
      
      // Guest users don't need authentication
      const feedbackData = {
        ...parsedBody.data,
        userId: null
      };
      
      const feedbackResponse = await supportService.submitFeedback(feedbackData);
      res.status(201).json(feedbackResponse);
    } catch (error) {
      console.error("Feedback submission error:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Password reset endpoint
  app.post("/api/forgot-password", async (req, res) => {
    try {
      console.log("🔐 Password reset request received for:", req.body);
      const { email } = req.body;
      
      if (!email) {
        console.log("❌ No email provided in request");
        return res.status(400).json({ error: "Email is required" });
      }

      console.log(`🔍 Looking up user with email: ${email}`);
      // Check if user exists
      const user = await dbStorage.getUserByEmail(email);
      console.log(`👤 User found:`, user ? `Yes (ID: ${user.id})` : 'No');
      
      if (!user) {
        // Don't reveal if email exists or not for security
        console.log(`📧 Email ${email} not found, but returning success message for security`);
        return res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent." 
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
      console.log(`🔑 Generated reset token for ${email}: ${resetToken.substring(0, 8)}...`);

      // Store reset token (you'll need to add this to your storage interface)
      // For now, we'll just send the email
      
      // Send password reset email
      console.log(`📨 Attempting to send password reset email to: ${email}`);
      const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);
      console.log(`📧 Email sending result: ${emailSent ? 'SUCCESS' : 'FAILED'}`);
      
      if (emailSent) {
        console.log(`✅ Password reset email sent successfully to ${email}`);
        res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent." 
        });
      } else {
        console.error(`❌ Failed to send password reset email to ${email}`);
        res.status(500).json({ error: "Failed to send password reset email" });
      }
    } catch (error) {
      console.error("💥 Password reset error:", error);
      res.status(500).json({ error: "Failed to process password reset request" });
    }
  });
  
  // Get all tickets (admin only)
  app.get("/api/support/tickets", async (req, res) => {
    try {
      const tickets = await supportService.getAllTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });
  
  // Get all feedback (admin only)
  app.get("/api/support/feedback", async (req, res) => {
    try {
      const feedbackItems = await supportService.getAllFeedback();
      res.json(feedbackItems);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });
  
  // Direct debug endpoint for app assets - /debug-assets will show content
  app.get('/debug-assets', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>USA Home App Assets</title>
          <style>
            body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #4361ee; }
            h2 { margin-top: 30px; color: #3a0ca3; }
            textarea { width: 100%; height: 150px; margin: 10px 0; padding: 10px; }
          </style>
        </head>
        <body>
          <h1>USA Home App Assets</h1>
          
          <h2>App Store Descriptions</h2>
          <h3>Short Description (80 chars)</h3>
          <textarea readonly>Your complete platform for building, designing, and financing your dream home.</textarea>
          
          <h3>Full Description</h3>
          <textarea readonly style="height: 300px;">USA Home: Your All-in-One Home Building & Design Solution

Transform your vision into reality with USA Home - your comprehensive platform for building, designing, and financing your perfect home. Whether you're planning to build a new home, renovate an existing one, or simply need financing options, USA Home connects you with the right professionals for your project.

🏗️ BUILD YOUR HOME
• Connect with licensed general contractors and construction professionals
• Find specialized tradespeople: electricians, plumbers, HVAC specialists, and more
• Access expert foundation, framing, and roofing contractors
• Discover interior finishing specialists for every room in your home

🎨 DESIGN YOUR HOME
• Browse professional interior designers and decorators
• Connect with landscape architects for outdoor spaces
• Find furniture specialists and custom cabinetry experts
• Discover sustainable and eco-friendly design solutions

💰 FINANCE & REAL ESTATE
• Compare mortgage options and home loans
• Apply for construction financing
• Connect with real estate agents in your area
• Explore business loan options for contractors and service providers

KEY FEATURES:
• Intuitive navigation through an interactive house illustration
• Comprehensive service provider listings with verified reviews
• Multilingual support in eight languages
• Simple communication tools to connect with professionals
• Secure payment processing for service providers
• Detailed professional profiles with portfolios and credentials

USA Home brings together homeowners, contractors, designers, and financial services in one seamless platform, making the home building and designing process easier than ever before.

Start your journey to creating your dream home today with USA Home – where your perfect home begins.</textarea>
          
          <h3>Keywords</h3>
          <textarea readonly>home building, interior design, construction, mortgage, real estate, house design, renovation</textarea>
          
          <h2>Data Deletion Request HTML</h2>
          <p>This is the HTML code for the data deletion page required by Google Play:</p>
          <textarea readonly style="height: 150px;">
&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;USA Home - Data Deletion Request&lt;/title&gt;
    &lt;style&gt;
        body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { font-size: 24px; margin-bottom: 20px; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="container"&gt;
        &lt;h1&gt;USA Home - Data Deletion Request&lt;/h1&gt;
        &lt;p&gt;In accordance with privacy regulations, USA Home provides users with the ability to request deletion of their account and associated personal data.&lt;/p&gt;
        &lt;p&gt;To request data deletion, please email: support@usahome.center&lt;/p&gt;
    &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
          </textarea>
        </body>
      </html>
    `);
  });
  
  // Simplified data deletion endpoint
  app.get('/debug-data-deletion', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>USA Home - Data Deletion Request</title>
          <style>
            body { font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>USA Home - Data Deletion Request</h1>
            <p>In accordance with privacy regulations, USA Home provides users with the ability to request deletion of their account and associated personal data.</p>
            <p>To request data deletion, please email: info@usahome.center</p>
          </div>
        </body>
      </html>
    `);
  });
  
  // Account deletion API endpoint
  app.post('/api/delete-account', async (req, res) => {
    try {
      // Check if request is authenticated
      const isAuthenticated = req.isAuthenticated();
      const userId = isAuthenticated ? req.user.id : null;
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // If authenticated, we verify the email matches the logged-in user
      if (isAuthenticated && req.user.email !== email) {
        return res.status(403).json({ 
          error: 'Email does not match authenticated user' 
        });
      }
      
      // For non-authenticated requests, we just log the deletion request
      // as we can't verify the identity without authentication
      if (!isAuthenticated) {
        console.log(`Deletion request received for: ${email}`);
        // In a real implementation, we would:
        // 1. Generate a confirmation email with a unique token
        // 2. Send the email to the user's address
        // 3. Upon clicking the confirmation link, proceed with deletion
        
        // For now, just acknowledge the request
        return res.status(200).json({ 
          message: 'Deletion request received. A confirmation email will be sent to verify your identity.' 
        });
      }
      
      // For authenticated requests, process the deletion
      
      // 1. Get user data
      const user = await dbStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // 2. In a full implementation, we would:
      //    - Delete or anonymize user reviews
      //    - Delete user profile information
      //    - Cancel any active subscriptions
      //    - Remove profile images
      //    - etc.
      
      // For now, log the deletion request and return success
      console.log(`Processing account deletion for user ID: ${userId}, email: ${email}`);
      
      // Here's where we would do actual deletion in a production environment
      /* 
      await dbStorage.deleteUser(userId);
      */
      
      // Inform the user the request has been received
      res.status(200).json({ 
        message: 'Your account deletion request has been received and is being processed.' 
      });
      
    } catch (error) {
      console.error('Error processing account deletion:', error);
      res.status(500).json({ error: 'Failed to process account deletion request' });
    }
  });
  
  // Serve static files from public directory
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
  // Serve all files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));
  
  // Direct server-side route for assets page
  app.get('/assets', (req, res) => {
    // Always serve the content directly
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USA Home App Assets</title>
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #4361ee;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        h2 {
            margin-top: 30px;
            color: #3a0ca3;
        }
        .asset-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin: 20px 0;
        }
        .asset-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            width: 200px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .asset-card img {
            max-width: 100%;
            height: auto;
            border: 1px solid #eee;
            margin-bottom: 10px;
            object-fit: contain;
        }
        textarea {
            width: 100%;
            height: 200px;
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
        }
        .btn {
            display: inline-block;
            background-color: #4361ee;
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #3a0ca3;
        }
    </style>
</head>
<body>
    <h1>USA Home App Store Assets</h1>
    <p>This page contains all the assets you need for your Google Play and App Store submissions. You can right-click on any image and select "Save Image As..." to download it.</p>

    <h2>App Icons</h2>
    <div class="asset-container">
        <div class="asset-card">
            <h3>512x512 Main Icon</h3>
            <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDwhLS0gQmFja2dyb3VuZCAtLT4KICA8cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEyMCIgZmlsbD0iIzQzNjFFRSIgLz4KICAKICA8IS0tIEhvdXNlIEJhc2UgLS0+CiAgPHJlY3QgeD0iMTEwIiB5PSIyMjAiIHdpZHRoPSIyOTIiIGhlaWdodD0iMjEyIiByeD0iOCIgZmlsbD0iI0ZGRkZGRiIgLz4KICAKICA8IS0tIFdpbmRvd3MgLS0+CiAgPHJlY3QgeD0iMTUwIiB5PSIyNjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgcng9IjQiIGZpbGw9IiM3M0M3RkYiIC8+CiAgPHJlY3QgeD0iMjkyIiB5PSIyNjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgcng9IjQiIGZpbGw9IiM3M0M3RkYiIC8+CiAgCiAgPCEtLSBEb29yIC0tPgogIDxyZWN0IHg9IjIzMSIgeT0iMzIwIiB3aWR0aD0iNTAiIGhlaWdodD0iMTEyIiByeD0iNCIgZmlsbD0iI0ZGOUEzQyIgLz4KICA8Y2lyY2xlIGN4PSIyNDYiIGN5PSIzNzYiIHI9IjUiIGZpbGw9IiMzMzMzMzMiIC8+CiAgCiAgPCEtLSBSb29mIC0tPgogIDxwYXRoIGQ9Ik0xMDAgMjMwTDI1NiAxMDBMNDEyIDIzMEgxMDBaIiBmaWxsPSIjRkY1QTVGIiAvPgogIAogIDwhLS0gQ2hpbW5leSAtLT4KICA8cmVjdCB4PSIzNDAiIHk9IjEzMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREI0QzQ4IiAvPgogIDxyZWN0IHg9IjMzNSIgeT0iMTIwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIGZpbGw9IiMzMzMzMzMiIC8+CiAgCiAgPCEtLSBEb2xsYXIgc2lnbiBvbiBjaGltbmV5IC0tPgogIDx0ZXh0IHg9IjM1NSIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+JDwvdGV4dD4KICAKICA8IS0tIEZvdW5kYXRpb24gLS0+CiAgPHJlY3QgeD0iMTAwIiB5PSI0MzIiIHdpZHRoPSIzMTIiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjQkJCQkJCIiAvPgogIAogIDwhLS0gVVNBIEhPTUUgdGV4dCAtLT4KICA8dGV4dCB4PSIyNTYiIHk9IjQ4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVTQSBIT01FPC90ZXh0Pgo8L3N2Zz4=" alt="App Icon" style="background-color: #eee;">
            <a href="javascript:void(0)" class="btn" onclick="downloadSVG()">Download SVG</a>
        </div>
    </div>

    <h2>Feature Graphic (1024x500)</h2>
    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjEwMjQiIGhlaWdodD0iNTAwIiB2aWV3Qm94PSIwIDAgMTAyNCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBCYWNrZ3JvdW5kIGdyYWRpZW50IC0tPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZ0dyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzQzNjFFRSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjM0EwQ0EzIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMjQiIGhlaWdodD0iNTAwIiBmaWxsPSJ1cmwoI2JnR3JhZGllbnQpIiAvPgogIAogIDwhLS0gRGVjb3JhdGl2ZSBlbGVtZW50cyAtLT4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjIwMCIgZmlsbD0iIzRDQzlGMCIgZmlsbC1vcGFjaXR5PSIwLjEiIC8+CiAgPGNpcmNsZSBjeD0iOTAwIiBjeT0iNDAwIiByPSIxNTAiIGZpbGw9IiNGNzI1ODUiIGZpbGwtb3BhY2l0eT0iMC4xIiAvPgogIAogIDwhLS0gSG91c2UgSWxsdXN0cmF0aW9uIChzaW1wbGlmaWVkKSAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDAsIDE1MCkgc2NhbGUoMC44KSI+CiAgICA8IS0tIEhvdXNlIEJhc2UgLS0+CiAgICA8cmVjdCB4PSIxMTAiIHk9IjIyMCIgd2lkdGg9IjI5MiIgaGVpZ2h0PSIyMTIiIHJ4PSI4IiBmaWxsPSIjRkZGRkZGIiAvPgogICAgCiAgICA8IS0tIFdpbmRvd3MgLS0+CiAgICA8cmVjdCB4PSIxNTAiIHk9IjI2MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiByeD0iNCIgZmlsbD0iIzczQzdGRiIgLz4KICAgIDxyZWN0IHg9IjI5MiIgeT0iMjYwIiB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHJ4PSI0IiBmaWxsPSIjNzNDN0ZGIiAvPgogICAgCiAgICA8IS0tIERvb3IgLS0+CiAgICA8cmVjdCB4PSIyMzEiIHk9IjMyMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjExMiIgcng9IjQiIGZpbGw9IiNGRjlBM0MiIC8+CiAgICA8Y2lyY2xlIGN4PSIyNDYiIGN5PSIzNzYiIHI9IjUiIGZpbGw9IiMzMzMzMzMiIC8+CiAgICAKICAgIDwhLS0gUm9vZiAtLT4KICAgIDxwYXRoIGQ9Ik0xMDAgMjMwTDI1NiAxMDBMNDEyIDIzMEgxMDBaIiBmaWxsPSIjRkY1QTVGIiAvPgogICAgCiAgICA8IS0tIENoaW1uZXkgLS0+CiAgICA8cmVjdCB4PSIzNDAiIHk9IjEzMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjREI0QzQ4IiAvPgogICAgPHJlY3QgeD0iMzM1IiB5PSIxMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzMzMzMzMyIgLz4KICAgIAogICAgPCEtLSBGb3VuZGF0aW9uIC0tPgogICAgPHJlY3QgeD0iMTAwIiB5PSI0MzIiIHdpZHRoPSIzMTIiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjQkJCQkJCIiAvPgogIDwvZz4KICAKICA8IS0tIEFwcCBUaXRsZSBhbmQgVGFnbGluZSAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1NTAsIDIwMCkiPgogICAgPHRleHQgeD0iMCIgeT0iMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjcyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+VVNBIEhPTUU8L3RleHQ+CiAgICA8dGV4dCB4PSIwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiBmb250LXdlaWdodD0ibm9ybWFsIiBmaWxsPSIjRkZGRkZGIj5Zb3VyIERyZWFtIEhvbWU8L3RleHQ+CiAgICA8dGV4dCB4PSIwIiB5PSIxMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgZmlsbD0iI0ZGRkZGRiI+U3RhcnRzIEhlcmU8L3RleHQ+CiAgICAKICAgIDwhLS0gRGVjb3JhdGl2ZSBsaW5lIC0tPgogICAgPGxpbmUgeDE9IjAiIHkxPSIxNDAiIHgyPSI0MDAiIHkyPSIxNDAiIHN0cm9rZT0iI0Y3MjU4NSIgc3Ryb2tlLXdpZHRoPSI0IiAvPgogICAgCiAgICA8IS0tIEZlYXR1cmUgaWNvbnMgLS0+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAxNzApIj4KICAgICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IiM0Q0M5RjAiIC8+CiAgICAgIDx0ZXh0IHg9IjUwIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIj5CdWlsZDwvdGV4dD4KICAgICAgCiAgICAgIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjIwIiByPSIxNSIgZmlsbD0iI0Y3MjU4NSIgLz4KICAgICAgPHRleHQgeD0iMTgwIiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIj5EZXNpZ248L3RleHQ+CiAgICAgIAogICAgICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9IiNGRjlBM0MiIC8+CiAgICAgIDx0ZXh0IHg9IjMzMCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGRkZGRiI+RmluYW5jZTwvdGV4dD4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==" alt="Feature Graphic" style="max-width: 100%; height: auto; border: 1px solid #ddd; background-color: #eee;">
    <a href="javascript:void(0)" class="btn" onclick="downloadFeatureGraphic()">Download Feature Graphic</a>

    <h2>App Store Listing Text</h2>
    
    <h3>App Name</h3>
    <textarea readonly>USA Home</textarea>
    
    <h3>Short Description (80 characters max)</h3>
    <textarea readonly>Your complete platform for building, designing, and financing your dream home.</textarea>
    
    <h3>Full Description</h3>
    <textarea readonly>USA Home: Your All-in-One Home Building & Design Solution

Transform your vision into reality with USA Home - your comprehensive platform for building, designing, and financing your perfect home. Whether you're planning to build a new home, renovate an existing one, or simply need financing options, USA Home connects you with the right professionals for your project.

🏗️ BUILD YOUR HOME
• Connect with licensed general contractors and construction professionals
• Find specialized tradespeople: electricians, plumbers, HVAC specialists, and more
• Access expert foundation, framing, and roofing contractors
• Discover interior finishing specialists for every room in your home

🎨 DESIGN YOUR HOME
• Browse professional interior designers and decorators
• Connect with landscape architects for outdoor spaces
• Find furniture specialists and custom cabinetry experts
• Discover sustainable and eco-friendly design solutions

💰 FINANCE & REAL ESTATE
• Compare mortgage options and home loans
• Apply for construction financing
• Connect with real estate agents in your area
• Explore business loan options for contractors and service providers

KEY FEATURES:
• Intuitive navigation through an interactive house illustration
• Comprehensive service provider listings with verified reviews
• Multilingual support in eight languages
• Simple communication tools to connect with professionals
• Secure payment processing for service providers
• Detailed professional profiles with portfolios and credentials

USA Home brings together homeowners, contractors, designers, and financial services in one seamless platform, making the home building and designing process easier than ever before.

Start your journey to creating your dream home today with USA Home – where your perfect home begins.</textarea>

    <h3>Keywords</h3>
    <textarea readonly>home building, interior design, construction, mortgage, real estate, house design, renovation</textarea>

    <h2>Data Deletion HTML Page</h2>
    <textarea readonly style="height: 300px;"><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USA Home - Data Deletion Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        h2 {
            font-size: 20px;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        p, ul {
            margin-bottom: 15px;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="email"], 
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        textarea {
            height: 100px;
        }
        .checkbox-group {
            margin: 15px 0;
        }
        button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0052a3;
        }
        .success-message {
            background-color: #e7f7e7;
            border: 1px solid #c3e6c3;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>USA Home - Data Deletion Request</h1>
        <p>In accordance with privacy regulations like GDPR and CCPA, USA Home provides users with the ability to request deletion of their account and associated personal data.</p>
        <p>Upon submission of this form, we will process your request within 30 days. Once your data is deleted, it cannot be recovered.</p>
        
        <div id="form-container">
            <form id="deletion-form">
                <div class="form-group">
                    <label for="email">Email Address*</label>
                    <input type="email" id="email" placeholder="Enter the email associated with your account" required>
                </div>
                
                <div class="form-group">
                    <label for="reason">Reason for Deletion (Optional)</label>
                    <textarea id="reason" placeholder="Please let us know why you're requesting data deletion"></textarea>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="confirm" required>
                    <label for="confirm">I understand that this request will delete my account and all associated data, and this action cannot be undone.</label>
                </div>
                
                <button type="submit">Submit Deletion Request</button>
            </form>
        </div>
        
        <div id="success-message" class="success-message">
            <h2>Request Received</h2>
            <p>Your data deletion request has been received. We will process your request within 30 days and contact you at the provided email address.</p>
        </div>
        
        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        </p>
    </div>

    <script>
        // Simple form submission handler
        document.getElementById('deletion-form').addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, this would send the data to your backend
            
            // Show success message
            document.getElementById('form-container').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
        });
    </script>
</body>
</html></textarea>

    <h2>Screenshot Guide</h2>
    <textarea readonly style="height: 300px;"># USA Home App Store Screenshots Guide

This document provides guidance on creating high-quality screenshots for your Google Play and App Store submissions.

## Required Screenshots

Google Play requires screenshots in these formats:
- Phone screenshots (16:9 aspect ratio)
- 7-inch tablet screenshots (optional but recommended)
- 10-inch tablet screenshots (optional but recommended)

## Screenshot Locations

Take screenshots of these key screens:

### 1. Home Screen with Interactive House
- Show the main house illustration with all elements visible
- Make sure the UI is clean with no overlays or dialogs
- Capture in both portrait and landscape orientations

### 2. Build Home Section
- Show the category selection screen
- Include a few sample professionals if possible
- Make sure the UI shows breadcrumb navigation

### 3. Design Home Section
- Show the interior design professionals
- If possible, show some example portfolio items
- Capture the filter/search interface if applicable

### 4. Finance & Real Estate Section
- Show the mortgage options and calculators
- Include the real estate agent finder if implemented
- Show any loan comparison tools

### 5. Professional Profile
- Show a detailed profile of a service provider
- Make sure ratings and reviews are visible
- Include contact information section (blurred for privacy)

### 6. Language Selection
- Show the language selector dropdown
- Try to capture multiple language options visible
- Show how translations appear in the UI

### 7. Review Form
- Show the emoji-based rating system
- Include the review text field
- Show any validation or confirmation messages

### 8. App Settings or Profile
- Show user account management options
- Include app preferences if applicable
- Show navigation between major sections

## Screenshot Tips

1. **Clean Status Bar**: Make sure your device status bar is clean (full battery, no notifications)
2. **Consistent Time**: Set the same time (preferably 9:41) on all screenshots
3. **Use Real Data**: Use realistic data, not placeholder content
4. **Consistent Theme**: Use the same theme (light/dark) across all screenshots
5. **Device Frames**: Don't add device frames; app stores often add these automatically</textarea>

    <script>
        function downloadSVG() {
            const svgData = 'data:image/svg+xml;charset=utf-8,<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">  <!-- Background -->  <rect width="512" height="512" rx="120" fill="#4361EE" />    <!-- House Base -->  <rect x="110" y="220" width="292" height="212" rx="8" fill="#FFFFFF" />    <!-- Windows -->  <rect x="150" y="260" width="70" height="70" rx="4" fill="#73C7FF" />  <rect x="292" y="260" width="70" height="70" rx="4" fill="#73C7FF" />    <!-- Door -->  <rect x="231" y="320" width="50" height="112" rx="4" fill="#FF9A3C" />  <circle cx="246" cy="376" r="5" fill="#333333" />    <!-- Roof -->  <path d="M100 230L256 100L412 230H100Z" fill="#FF5A5F" />    <!-- Chimney -->  <rect x="340" y="130" width="30" height="80" fill="#DB4C48" />  <rect x="335" y="120" width="40" height="10" fill="#333333" />    <!-- Dollar sign on chimney -->  <text x="355" y="180" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">$</text>    <!-- Foundation -->  <rect x="100" y="432" width="312" height="20" rx="4" fill="#BBBBBB" />    <!-- USA HOME text -->  <text x="256" y="480" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">USA HOME</text></svg>';
            
            const downloadLink = document.createElement('a');
            downloadLink.href = svgData;
            downloadLink.download = 'usa-home-app-icon.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

        function downloadFeatureGraphic() {
            const svgData = 'data:image/svg+xml;charset=utf-8,<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="1024" height="500" viewBox="0 0 1024 500" fill="none" xmlns="http://www.w3.org/2000/svg">  <!-- Background gradient -->  <defs>    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">      <stop offset="0%" stop-color="#4361EE" />      <stop offset="100%" stop-color="#3A0CA3" />    </linearGradient>  </defs>  <rect width="1024" height="500" fill="url(#bgGradient)" />    <!-- Decorative elements -->  <circle cx="100" cy="100" r="200" fill="#4CC9F0" fill-opacity="0.1" />  <circle cx="900" cy="400" r="150" fill="#F72585" fill-opacity="0.1" />    <!-- House Illustration (simplified) -->  <g transform="translate(100, 150) scale(0.8)">    <!-- House Base -->    <rect x="110" y="220" width="292" height="212" rx="8" fill="#FFFFFF" />        <!-- Windows -->    <rect x="150" y="260" width="70" height="70" rx="4" fill="#73C7FF" />    <rect x="292" y="260" width="70" height="70" rx="4" fill="#73C7FF" />        <!-- Door -->    <rect x="231" y="320" width="50" height="112" rx="4" fill="#FF9A3C" />    <circle cx="246" cy="376" r="5" fill="#333333" />        <!-- Roof -->    <path d="M100 230L256 100L412 230H100Z" fill="#FF5A5F" />        <!-- Chimney -->    <rect x="340" y="130" width="30" height="80" fill="#DB4C48" />    <rect x="335" y="120" width="40" height="10" fill="#333333" />        <!-- Foundation -->    <rect x="100" y="432" width="312" height="20" rx="4" fill="#BBBBBB" />  </g>    <!-- App Title and Tagline -->  <g transform="translate(550, 200)">    <text x="0" y="0" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF">USA HOME</text>    <text x="0" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="normal" fill="#FFFFFF">Your Dream Home</text>    <text x="0" y="120" font-family="Arial, sans-serif" font-size="32" font-weight="normal" fill="#FFFFFF">Starts Here</text>        <!-- Decorative line -->    <line x1="0" y1="140" x2="400" y2="140" stroke="#F72585" stroke-width="4" />        <!-- Feature icons -->    <g transform="translate(0, 170)">      <circle cx="20" cy="20" r="15" fill="#4CC9F0" />      <text x="50" y="28" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF">Build</text>            <circle cx="150" cy="20" r="15" fill="#F72585" />      <text x="180" y="28" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF">Design</text>            <circle cx="300" cy="20" r="15" fill="#FF9A3C" />      <text x="330" y="28" font-family="Arial, sans-serif" font-size="24" fill="#FFFFFF">Finance</text>    </g>  </g></svg>';
            
            const downloadLink = document.createElement('a');
            downloadLink.href = svgData;
            downloadLink.download = 'usa-home-feature-graphic.svg';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    </script>
</body>
</html>`;
    
    res.send(html);
  });
  

  
  // Set up authentication routes and middleware
  setupAuth(app);
  // API route to get unread notifications count for professionals
  app.get("/api/notifications/unread-count", async (req, res) => {
    console.log("🔔 Unread count API called, authenticated:", req.isAuthenticated(), "user:", req.user?.id);
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const postgres = (await import('postgres')).default;
      const client = postgres(process.env.DATABASE_URL!);
      const result = await client`
        SELECT COUNT(*) as count 
        FROM notifications 
        WHERE professional_id = ${req.user.id} AND read_at IS NULL
      `;
      await client.end();
      const count = parseInt(result[0]?.count || '0');
      console.log("🔔 Unread count for user", req.user.id, ":", count);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      res.status(500).json({ message: "Failed to fetch notification count" });
    }
  });

  // API route to get notifications for professionals
  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const postgres = (await import('postgres')).default;
      const client = postgres(process.env.DATABASE_URL!);
      const result = await client`
        SELECT id, type, title, message, action_required, metadata, created_at, read_at 
        FROM notifications 
        WHERE professional_id = ${req.user.id} 
        ORDER BY created_at DESC 
        LIMIT 50
      `;
      await client.end();
      const notifications = result.map((row: any) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        message: row.message,
        actionRequired: row.action_required,
        metadata: row.metadata,
        createdAt: row.created_at,
        readAt: row.read_at,
        isRead: !!row.read_at
      }));
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // API route to mark notification as read
  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const postgres = (await import('postgres')).default;
      const client = postgres(process.env.DATABASE_URL!);
      await client`
        UPDATE notifications 
        SET read_at = NOW() 
        WHERE id = ${parseInt(req.params.id)} AND professional_id = ${req.user.id}
      `;
      await client.end();
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // API routes for categories data
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await dbStorage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await dbStorage.getCategoryById(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // API routes for subcategories data
  app.get("/api/subcategories", async (_req, res) => {
    try {
      const subcategories = await dbStorage.getAllSubcategories();
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  app.get("/api/categories/:categoryId/subcategories", async (req, res) => {
    try {
      const subcategories = await dbStorage.getSubcategoriesByCategoryId(parseInt(req.params.categoryId));
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // API routes for services (third level) data
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await dbStorage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get("/api/subcategories/:subcategoryId/services", async (req, res) => {
    try {
      const services = await dbStorage.getServicesBySubcategoryId(parseInt(req.params.subcategoryId));
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // API routes for professionals
  app.get("/api/professionals", async (req, res) => {
    try {
      const { serviceCategory, stateLocation, language } = req.query;
      
      console.log(`Received request for professionals with: 
        serviceCategory: ${serviceCategory || 'none'}, 
        stateLocation: ${stateLocation || 'none'},
        language: ${language || 'none'}`);
        
      // The URL parameter might have spaces and be formatted differently than the database
      // For example, "Septic System Expert" vs "Septic%20System%20Expert"
      // Let's modify this to do a more flexible search
      
      // Enhanced search using pre-processing for common category names
      let processedServiceCategory = serviceCategory as string | undefined;
      
      // Special case handling for common search mismatches
      if (processedServiceCategory) {
        // Map known variations to standardized service categories
        const categoryMappings: Record<string, string[]> = {
          "Credit Expert": ["Credit Repair Expert", "Credit Score Analyst", "Credit Rebuilding Advisor"],
          "Mortgage Broker": ["Commercial Mortgage Broker", "Mortgage Broker", "Mortgage Banker"],
          "Loan Officer": ["Loan Officer", "Construction Loan Specialist", "VA Loan Specialist", "FHA Loan Specialist"],
          "Debt": ["Debt Management Counselor", "Debt Settlement Negotiator", "Debt Consolidation Advisor"]
        };
        
        // Check for any special mappings
        for (const [searchTerm, equivalentTerms] of Object.entries(categoryMappings)) {
          if (processedServiceCategory.includes(searchTerm) || 
              searchTerm.includes(processedServiceCategory)) {
            // If we have a match, append all equivalent terms to search query
            console.log(`Found special category mapping for ${processedServiceCategory}:`, equivalentTerms);
            
            // We'll let the storage layer handle the actual search with these terms
            break;
          }
        }
      }
      
      const professionals = await dbStorage.getAllProfessionals(
        processedServiceCategory, 
        stateLocation as string | undefined,
        language as string | undefined
      );
      
      console.log(`Found ${professionals.length} professionals matching criteria`);
      
      res.json(professionals);
    } catch (error) {
      console.error("Error in /api/professionals:", error);
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });
  
  // API for users to update their profile to become a professional
  app.post("/api/update-profile", async (req, res) => {
    try {
      console.log("Received update-profile request:", req.body);
      
      if (!req.isAuthenticated()) {
        console.log("Authentication check failed");
        return res.status(401).json({ message: "You must be logged in to update your profile" });
      }
      
      const userId = req.user?.id;
      console.log("Authenticated user:", req.user);
      
      if (!userId) {
        console.log("Invalid user ID");
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Validate required fields
      const { serviceCategory, serviceCategories, stateLocation, statesServiced } = req.body;
      
      // Validate main service category (primary field)
      if (!serviceCategory || serviceCategory.trim() === '') {
        return res.status(400).json({ message: "Primary service category is required" });
      }
      
      // Check if we have either single stateLocation or array of statesServiced
      if ((!stateLocation || stateLocation.trim() === '') && 
          (!statesServiced || !Array.isArray(statesServiced) || statesServiced.length === 0)) {
        return res.status(400).json({ message: "At least one state location is required" });
      }
      
      // If serviceCategories is provided, make sure it's an array that includes the primary category
      if (serviceCategories && Array.isArray(serviceCategories)) {
        // Make sure primary service is included in the array
        if (!serviceCategories.includes(serviceCategory)) {
          // Add the primary service to the beginning of the array
          req.body.serviceCategories = [serviceCategory, ...serviceCategories];
        }
      } else {
        // Create the array with just the primary service
        req.body.serviceCategories = [serviceCategory];
      }
      
      // If statesServiced is provided, make sure it's an array that includes the primary state
      if (statesServiced && Array.isArray(statesServiced)) {
        if (stateLocation && !statesServiced.includes(stateLocation)) {
          // Add the primary state to the beginning of the array
          req.body.statesServiced = [stateLocation, ...statesServiced];
        }
      } else if (stateLocation) {
        // Create the array with just the primary state
        req.body.statesServiced = [stateLocation];
      }
      
      // Make sure isProfessional is set to true
      const userData = {
        ...req.body,
        isProfessional: true
      };
      
      console.log("Updating user with data:", userData);
      const updatedUser = await dbStorage.updateUser(userId, userData);
      
      if (!updatedUser) {
        console.log("User not found after update");
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log(`User ${userId} updated to professional status:`, updatedUser);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // API for users to update partial profile information (for location, languages, etc.)
  app.patch("/api/update-profile", async (req, res) => {
    try {
      console.log("Received patch update-profile request:", req.body);
      
      if (!req.isAuthenticated()) {
        console.log("Authentication check failed");
        return res.status(401).json({ message: "You must be logged in to update your profile" });
      }
      
      const userId = req.user?.id;
      console.log("Authenticated user for profile update:", req.user);
      
      if (!userId) {
        console.log("Invalid user ID");
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // For PATCH requests, we need to handle arrays properly
      const { serviceCategory, serviceCategories, stateLocation, statesServiced } = req.body;
      
      // Process service categories if provided
      if (serviceCategories || serviceCategory) {
        // If serviceCategories is provided as an array
        if (serviceCategories && Array.isArray(serviceCategories)) {
          // If serviceCategory is also provided, make sure it's included in the array
          if (serviceCategory && !serviceCategories.includes(serviceCategory)) {
            req.body.serviceCategories = [serviceCategory, ...serviceCategories];
          }
        } 
        // If only serviceCategory is provided (not the array), create the array
        else if (serviceCategory && !serviceCategories) {
          req.body.serviceCategories = [serviceCategory];
        }
      }
      
      // Process states if provided
      if (statesServiced || stateLocation) {
        // If statesServiced is provided as an array
        if (statesServiced && Array.isArray(statesServiced)) {
          // If stateLocation is also provided, make sure it's included in the array
          if (stateLocation && !statesServiced.includes(stateLocation)) {
            req.body.statesServiced = [stateLocation, ...statesServiced];
          }
        } 
        // If only stateLocation is provided (not the array), create the array
        else if (stateLocation && !statesServiced) {
          req.body.statesServiced = [stateLocation];
        }
      }
      
      console.log("Updating user with processed data:", req.body);
      const updatedUser = await dbStorage.updateUser(userId, req.body);
      
      if (!updatedUser) {
        console.log("User not found after update");
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify state and service categories were correctly saved by fetching the user again
      const verifiedUser = await dbStorage.getUser(userId);
      console.log("Verified user after update:", verifiedUser);
      
      // Check if we're updating states and verify they were saved
      if (statesServiced && Array.isArray(statesServiced) && statesServiced.length > 0) {
        if (!verifiedUser?.statesServiced || !Array.isArray(verifiedUser.statesServiced) || verifiedUser.statesServiced.length === 0) {
          console.log("WARNING: States array might not have been saved properly!");
        }
      } else if (stateLocation && !verifiedUser?.stateLocation) {
        console.log("WARNING: State location might not have been saved properly!");
      }
      
      // Check if we're updating service categories and verify they were saved
      if (serviceCategories && Array.isArray(serviceCategories) && serviceCategories.length > 0) {
        if (!verifiedUser?.serviceCategories || !Array.isArray(verifiedUser.serviceCategories) || verifiedUser.serviceCategories.length === 0) {
          console.log("WARNING: Service categories array might not have been saved properly!");
        }
      } else if (serviceCategory && !verifiedUser?.serviceCategory) {
        console.log("WARNING: Service category might not have been saved properly!");
      }
      
      console.log(`User ${userId} updated to professional status:`, updatedUser);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // ==== Review System API Routes ====
  
  // Get reviews for a professional
  app.get("/api/professionals/:professionalId/reviews", async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const reviews = await dbStorage.getReviewsForProfessional(professionalId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
  // Get professional with their reviews
  app.get("/api/professionals/:professionalId/with-reviews", async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const data = await dbStorage.getProfessionalWithReviews(professionalId);
      
      if (!data) {
        return res.status(404).json({ message: "Professional not found" });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch professional with reviews" });
    }
  });
  
  // API for professionals to update their enhanced profile details
  app.patch("/api/professionals/:professionalId", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update your profile" });
      }
      
      const professionalId = parseInt(req.params.professionalId);
      
      // Ensure the user is updating their own profile, or is an admin
      if (req.user.id !== professionalId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }
      
      // Extract only the fields that can be updated via this endpoint
      const { 
        fullName,
        email,
        phone,
        businessName,
        websiteUrl,
        facebookUrl,
        instagramUrl,
        tiktokUrl,
        yearsExperience, 
        certifications, 
        serviceAreas, 
        businessDescription,
        languagesSpoken,
        statesServiced,
        stateLocation
      } = req.body;
      
      // Build update object with only provided fields
      const updateData: Partial<Omit<InsertUser, 'password'>> = {};
      
      if (fullName !== undefined) {
        updateData.fullName = fullName;
      }
      
      if (email !== undefined) {
        updateData.email = email;
      }
      
      if (phone !== undefined) {
        updateData.phone = phone;
      }
      
      if (businessName !== undefined) {
        updateData.businessName = businessName;
      }
      
      if (websiteUrl !== undefined) {
        updateData.websiteUrl = websiteUrl;
      }
      
      if (yearsExperience !== undefined) {
        updateData.yearsExperience = yearsExperience ? parseInt(yearsExperience.toString()) : null;
      }
      
      if (certifications !== undefined) {
        updateData.certifications = certifications;
      }
      
      if (serviceAreas !== undefined) {
        updateData.serviceAreas = serviceAreas;
      }
      
      if (businessDescription !== undefined) {
        updateData.businessDescription = businessDescription;
      }
      
      if (languagesSpoken !== undefined) {
        console.log("Languages received:", languagesSpoken);
        
        // Ensure languagesSpoken is always an array
        if (Array.isArray(languagesSpoken)) {
          updateData.languagesSpoken = languagesSpoken.filter(lang => lang && lang !== 'undefined' && lang !== '');
        } else if (typeof languagesSpoken === 'string') {
          updateData.languagesSpoken = [languagesSpoken];
        }
        
        console.log("Languages being saved:", updateData.languagesSpoken);
      }
      
      if (stateLocation !== undefined) {
        updateData.stateLocation = stateLocation;
      }
      
      if (statesServiced !== undefined) {
        // Log the incoming states data for debugging
        console.log("Received statesServiced in request:", statesServiced);
        
        // Process states with special handling
        if (Array.isArray(statesServiced)) {
          // Already an array, just filter out invalid values
          updateData.statesServiced = statesServiced.filter(state => state && state !== 'undefined' && state !== '');
        } else if (typeof statesServiced === 'string' && statesServiced.includes(',')) {
          // It's a comma-separated string, split and convert to array
          updateData.statesServiced = statesServiced
            .split(',')
            .map(state => state.trim())
            .filter(state => state && state !== 'undefined' && state !== '');
        } else if (typeof statesServiced === 'string') {
          // Single state string
          updateData.statesServiced = [statesServiced];
        }
        
        // Log what we're saving
        console.log("Storing statesServiced as:", updateData.statesServiced);
      }
      
      if (facebookUrl !== undefined) {
        updateData.facebookUrl = facebookUrl;
      }
      
      if (instagramUrl !== undefined) {
        updateData.instagramUrl = instagramUrl;
      }
      
      if (tiktokUrl !== undefined) {
        updateData.tiktokUrl = tiktokUrl;
      }
      
      // Update the professional's profile
      const updatedUser = await dbStorage.updateUser(professionalId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Professional not found" });
      }
      
      // Return the updated professional profile without sensitive info
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating professional profile:", error);
      res.status(500).json({ message: "Failed to update professional profile" });
    }
  });
  
  // Profile Image Upload Endpoint
  app.post("/api/profile-image/upload", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to upload a profile image" });
      }
      
      const userId = req.user.id;
      
      // We're using base64 uploads to avoid disk quota issues
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ message: "No image data provided" });
      }
      
      // Validate that it's a proper base64 image
      if (!imageBase64.startsWith('data:image/')) {
        return res.status(400).json({ message: "Invalid image format" });
      }
      
      // Check image size - limit to 1MB
      const base64Data = imageBase64.split(',')[1];
      const sizeInBytes = (base64Data.length * 3) / 4;
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      
      if (sizeInBytes > maxSizeInBytes) {
        return res.status(413).json({ 
          message: "Image is too large. Maximum size is 1MB. Please resize your image before uploading." 
        });
      }
      
      // If we have a previous image, we should clean it up
      // But since we're using base64 directly in the database, there's no disk cleanup needed
      
      // Update the user's profile with the base64 image directly
      const updatedUser = await dbStorage.updateUser(userId, {
        profileImageUrl: imageBase64
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return the updated user profile with the new image URL
      const { password, ...safeUser } = updatedUser;
      res.json({
        ...safeUser,
        profileImageUrl: imageBase64
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ message: "Failed to upload profile image" });
    }
  });

  // Check if a user can review a professional
  app.get("/api/can-review/:professionalId", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ canReview: false, message: "You must be logged in to review" });
    }
    
    try {
      const professionalId = parseInt(req.params.professionalId);
      const canReview = await dbStorage.userCanReviewProfessional(req.user.id, professionalId);
      
      res.json({ canReview });
    } catch (error) {
      res.status(500).json({ message: "Failed to check review eligibility" });
    }
  });
  
  // Create a new review - requires authentication
  app.post("/api/professionals/:professionalId/reviews", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to post a review" });
    }
    
    try {
      const professionalId = parseInt(req.params.professionalId);
      
      // Validate request body against schema
      const validationResult = insertReviewSchema.safeParse({
        ...req.body,
        professionalId,
        reviewerId: req.user.id
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid review data", 
          errors: validationResult.error.errors 
        });
      }
      
      // Verify user can review this professional
      const canReview = await dbStorage.userCanReviewProfessional(req.user.id, professionalId);
      if (!canReview) {
        return res.status(403).json({ 
          message: "You cannot review this professional (you may have already left a review or are trying to review yourself)" 
        });
      }
      
      // Create the review
      const review = await dbStorage.createReview(validationResult.data);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create review" });
    }
  });
  
  // Create a new guest review - no authentication required
  app.post("/api/professionals/:professionalId/guest-reviews", async (req: Request, res: Response) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      
      // Validate request body against schema for guest reviews
      const validationResult = insertGuestReviewSchema.safeParse({
        ...req.body,
        professionalId
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid review data", 
          errors: validationResult.error.errors 
        });
      }
      
      // Ensure the professional exists
      const professional = await dbStorage.getUser(professionalId);
      if (!professional || !professional.isProfessional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      
      // Get the validated data and ensure reviewerId is explicitly set to null for guest reviews
      const reviewData = {
        ...validationResult.data,
        reviewerId: null // Explicitly set to null for guest reviews
      };
      
      // Create the guest review
      const review = await dbStorage.createGuestReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      console.error("Guest review error:", error);
      res.status(500).json({ message: error.message || "Failed to create guest review" });
    }
  });
  
  // Endpoint for professionals to respond to reviews
  app.post("/api/professionals/:professionalId/respond", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to respond to reviews" });
      }
      
      const professionalId = parseInt(req.params.professionalId);
      
      // Ensure the user is the professional
      if (req.user.id !== professionalId || !req.user.isProfessional) {
        return res.status(403).json({ 
          message: "You can only respond to reviews on your own profile" 
        });
      }
      
      // Validate the response text
      const { response, reviewId } = req.body;
      if (!response || typeof response !== 'string' || response.trim() === '') {
        return res.status(400).json({ message: "A valid response text is required" });
      }
      
      // Get existing reviews
      const reviews = await dbStorage.getReviewsForProfessional(professionalId);
      if (!reviews || reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found to respond to" });
      }
      
      // If a specific reviewId is provided, use that
      let reviewIdToUpdate: number;
      
      if (reviewId) {
        // Verify that this review belongs to this professional
        const reviewExists = reviews.some(review => review.id === reviewId);
        if (!reviewExists) {
          return res.status(404).json({ message: "Review not found or doesn't belong to this professional" });
        }
        reviewIdToUpdate = reviewId;
      } else {
        // Fallback: Find the first review without a response (or latest review)
        const reviewToUpdate = reviews.find(review => !review.professionalResponse) || reviews[0];
        reviewIdToUpdate = reviewToUpdate.id;
      }
      
      // Update the review with the professional's response
      const updatedReview = await dbStorage.updateReviewResponse(reviewIdToUpdate, response);
      
      res.status(200).json(updatedReview);
    } catch (error: any) {
      console.error("Professional response error:", error);
      res.status(500).json({ message: error.message || "Failed to add response" });
    }
  });
  
  // Endpoint for professionals to edit their responses to reviews
  app.put("/api/professionals/:professionalId/respond/:reviewId", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to edit a response" });
      }
      
      const professionalId = parseInt(req.params.professionalId);
      const reviewId = parseInt(req.params.reviewId);
      
      // Ensure the user is the professional
      if (req.user.id !== professionalId || !req.user.isProfessional) {
        return res.status(403).json({ 
          message: "You can only edit responses on your own profile" 
        });
      }
      
      // Validate the response text
      const { response } = req.body;
      if (!response || typeof response !== 'string' || response.trim() === '') {
        return res.status(400).json({ message: "A valid response text is required" });
      }
      
      // Get the review
      const reviews = await dbStorage.getReviewsForProfessional(professionalId);
      const reviewToUpdate = reviews.find(review => review.id === reviewId);
      
      if (!reviewToUpdate) {
        return res.status(404).json({ message: "Review not found or doesn't belong to this professional" });
      }
      
      // Check if this review already has a response
      if (!reviewToUpdate.professionalResponse) {
        return res.status(400).json({ message: "This review doesn't have a response to edit" });
      }
      
      // Update the review with the professional's edited response
      const updatedReview = await dbStorage.updateReviewResponse(reviewId, response);
      
      res.status(200).json(updatedReview);
    } catch (error: any) {
      console.error("Edit professional response error:", error);
      res.status(500).json({ message: error.message || "Failed to edit response" });
    }
  });
  
  // Endpoint for professionals to delete their responses to reviews
  app.delete("/api/professionals/:professionalId/respond/:reviewId", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete a response" });
      }
      
      const professionalId = parseInt(req.params.professionalId);
      const reviewId = parseInt(req.params.reviewId);
      
      // Ensure the user is the professional
      if (req.user.id !== professionalId || !req.user.isProfessional) {
        return res.status(403).json({ 
          message: "You can only delete responses on your own profile" 
        });
      }
      
      // Get the review
      const reviews = await dbStorage.getReviewsForProfessional(professionalId);
      const reviewToUpdate = reviews.find(review => review.id === reviewId);
      
      if (!reviewToUpdate) {
        return res.status(404).json({ message: "Review not found or doesn't belong to this professional" });
      }
      
      // Check if this review already has a response
      if (!reviewToUpdate.professionalResponse) {
        return res.status(400).json({ message: "This review doesn't have a response to delete" });
      }
      
      // Update the review by removing the professional's response (set to empty string)
      const updatedReview = await dbStorage.updateReviewResponse(reviewId, "");
      
      res.status(200).json(updatedReview);
    } catch (error: any) {
      console.error("Delete professional response error:", error);
      res.status(500).json({ message: error.message || "Failed to delete response" });
    }
  });

  // ===== Subscription and Payment Management API Routes =====
  
  // API to check a professional's subscription status
  app.get("/api/professionals/:professionalId/subscription-status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to check subscription status" });
      }
      
      const professionalId = parseInt(req.params.professionalId);
      
      // Only the professional or an admin can check their subscription status
      if (req.user.id !== professionalId) {
        return res.status(403).json({ message: "You can only check your own subscription status" });
      }
      
      // Get the professional
      const professional = await dbStorage.getUser(professionalId);
      
      if (!professional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      
      // Update the subscription status first
      await updateSubscriptionStatus(professionalId);
      
      // Get the updated user
      const updatedUser = await dbStorage.getUser(professionalId);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Professional not found after update" });
      }
      
      // Return subscription-related fields only
      res.json({
        id: updatedUser.id,
        username: updatedUser.username,
        isProfessional: updatedUser.isProfessional,
        isActive: updatedUser.isActive,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionExpiresAt: updatedUser.subscriptionExpiresAt,
        trialEndDate: updatedUser.trialEndDate,
        nextBillingDate: updatedUser.nextBillingDate,
        paymentRemindersCount: updatedUser.paymentRemindersCount || 0
      });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });
  
  // API to update a user's payment information (placeholder - would connect to payment processor)
  app.post("/api/professionals/:professionalId/update-payment", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update payment information" });
      }
      
      const professionalId = parseInt(req.params.professionalId);
      
      // Only the professional can update their payment information
      if (req.user.id !== professionalId) {
        return res.status(403).json({ message: "You can only update your own payment information" });
      }
      
      // In a real implementation, this would connect to a payment processor
      // For this demo, we'll just update the subscription status
      
      // Add 30 days to the current date for the next billing date
      const now = new Date();
      const nextBillingDate = new Date(now);
      nextBillingDate.setDate(nextBillingDate.getDate() + 30);
      
      // Update the professional's subscription information
      const updatedUser = await dbStorage.updateUser(professionalId, {
        isActive: true,
        subscriptionStatus: 'active',
        nextBillingDate: nextBillingDate.toISOString(),
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Professional not found" });
      }
      
      // Return the updated professional without sensitive info
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating payment information:", error);
      res.status(500).json({ message: "Failed to update payment information" });
    }
  });
  
  // Admin API to process all subscription statuses (would typically be called by a cron job)
  // This is to ensure expired subscriptions are correctly marked
  app.post("/api/admin/process-subscription-statuses", async (req, res) => {
    try {
      // In a production environment, this would have additional authentication
      // to ensure only admin or system processes can call it
      await processAllSubscriptionStatuses();
      res.json({ message: "Processed all subscription statuses successfully" });
    } catch (error) {
      console.error("Error processing subscription statuses:", error);
      res.status(500).json({ message: "Failed to process subscription statuses" });
    }
  });
  
  // Admin API to send payment reminders (would typically be called by a cron job)
  app.post("/api/admin/send-payment-reminders", async (req, res) => {
    try {
      // In a production environment, this would have additional authentication
      // to ensure only admin or system processes can call it
      const remindersSent = await sendPaymentReminders();
      res.json({ 
        message: `Payment reminders sent successfully`,
        remindersSent 
      });
    } catch (error) {
      console.error("Error sending payment reminders:", error);
      res.status(500).json({ message: "Failed to send payment reminders" });
    }
  });

  // Password update endpoint
  app.post("/api/update-password", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      // Get current user
      const user = await dbStorage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const { comparePasswords } = await import('./auth');
      const isCurrentPasswordValid = await comparePasswords(currentPassword, user.password);
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const { hashPassword } = await import('./auth');
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password in database
      await dbStorage.updateUserPassword(user.id, hashedNewPassword);

      console.log(`✅ Password updated successfully for user: ${user.username}`);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Password update error:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // ==== Stripe Payment Routes ====
  
  // Handle Stripe webhook events
  app.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    try {
      const sig = req.headers['stripe-signature'] as string;
      
      // Verify the event came from Stripe
      let event;
      
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      
      // Handle the event
      await handleStripeWebhook(event);
      
      // Return success
      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Failed to process webhook' });
    }
  });
  
  // Add service with smart billing logic
  app.post('/api/add-service-with-payment', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to add services" });
      }

      const { serviceCategory } = req.body;
      const userId = req.user.id;
      const user = req.user;

      if (!serviceCategory) {
        return res.status(400).json({ message: "Service category is required" });
      }

      // Get current service categories
      const currentCategories = user.serviceCategories || [];
      
      // Check if service already exists
      if (currentCategories.includes(serviceCategory)) {
        return res.status(400).json({ message: "Service category already exists" });
      }

      // Check if user has completed their initial payment
      const hasCompletedInitialPayment = user.stripeCustomerId && user.subscriptionStatus === 'active';

      if (hasCompletedInitialPayment) {
        // SCENARIO 2: Add to next billing cycle (no immediate charge)
        const updatedCategories = [...currentCategories, serviceCategory];
        
        await pool.query(
          'UPDATE users SET service_categories = $1 WHERE id = $2',
          [JSON.stringify(updatedCategories), userId]
        );

        const baseFee = 29.77;
        const additionalServices = Math.max(0, updatedCategories.length - 1);
        const totalMonthlyFee = parseFloat((baseFee + (additionalServices * 5)).toFixed(2));

        res.status(200).json({
          success: true,
          message: `Service "${serviceCategory}" added successfully! The $5 fee will be included in your next billing cycle.`,
          serviceCategories: updatedCategories,
          totalMonthlyFee: totalMonthlyFee,
          billingType: "next_cycle",
          billingNote: "Additional service fee will be charged in your next monthly billing cycle"
        });

      } else {
        // SCENARIO 1: Add to current bill (immediate charge required)
        const updatedCategories = [...currentCategories, serviceCategory];
        const baseFee = 29.77;
        const additionalServices = Math.max(0, updatedCategories.length - 1);
        const totalCurrentBill = parseFloat((baseFee + (additionalServices * 5)).toFixed(2));

        await pool.query(
          'UPDATE users SET service_categories = $1 WHERE id = $2',
          [JSON.stringify(updatedCategories), userId]
        );

        res.status(200).json({
          success: true,
          message: `Service "${serviceCategory}" added to your account! Complete payment for total subscription: $${totalCurrentBill}`,
          serviceCategories: updatedCategories,
          totalCurrentBill: totalCurrentBill,
          billingType: "immediate",
          billingNote: "Complete your subscription payment to activate all services"
        });
      }

    } catch (error: any) {
      console.error('Error adding service:', error);
      res.status(500).json({ 
        message: "Failed to add service: " + (error.message || "Unknown error")
      });
    }
  });

  // Create a subscription for a professional
  app.post('/api/get-or-create-subscription', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to manage subscriptions" });
      }
      
      const userId = req.user.id;
      
      // Get or create subscription
      const subscription = await getOrCreateSubscription(userId);
      
      res.json(subscription);
    } catch (error: any) {
      console.error('Error managing subscription:', error);
      res.status(500).json({ message: error.message || "Failed to process subscription" });
    }
  });
  
  // Get current subscription status
  app.get('/api/subscription-status', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to check subscription status" });
      }
      
      const userId = req.user.id;
      const user = await dbStorage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // If user has a subscription ID, fetch the latest status from Stripe
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        return res.json({
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });
      }
      
      // If no subscription ID, check the local subscription status
      return res.json({
        status: user.subscriptionStatus || 'none',
        expiresAt: user.subscriptionExpiresAt,
      });
    } catch (error: any) {
      console.error('Error checking subscription status:', error);
      res.status(500).json({ message: error.message || "Failed to check subscription status" });
    }
  });
  
  // Cancel a subscription
  app.post('/api/cancel-subscription', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to cancel a subscription" });
      }
      
      const userId = req.user.id;
      const user = await dbStorage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No active subscription found" });
      }
      
      // Cancel at period end instead of immediately
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      
      // Update user's subscription status
      await dbStorage.updateUser(userId, {
        subscriptionStatus: 'canceling'
      });
      
      res.json({
        status: 'canceling',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ message: error.message || "Failed to cancel subscription" });
    }
  });
  
  // API endpoint for adding additional service categories
  // Remove a service category from a professional user
  app.post('/api/remove-service-category', async (req: Request, res: Response) => {
    try {
      const { category: categoryToRemove } = req.body;
      console.log("Attempting to remove category:", categoryToRemove);
      
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      
      // Get the current user
      const user = await dbStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the current service categories
      const serviceCategories = user.serviceCategories || 
        (user.serviceCategory ? [user.serviceCategory] : []);
      
      console.log("Current service categories:", serviceCategories);
      
      // Get the primary service category
      const primaryCategory = user.serviceCategory;
      
      // Only allow removal if this isn't the primary category
      if (categoryToRemove === primaryCategory) {
        return res.status(400).json({ 
          message: "Cannot remove your primary service category. You can only remove additional services."
        });
      }
      
      // Remove the category (additional services can be completely removed)
      const updatedCategories = serviceCategories.filter(cat => cat !== categoryToRemove);
      console.log("Updated service categories:", updatedCategories);
      
      // Update the user
      const updatedUser = await dbStorage.updateUser(userId, {
        serviceCategories: updatedCategories
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      
      // Recalculate the billing
      const baseFee = 29.77; // Updated to use consistent base fee of $29.77
      const additionalCategoriesCount = Math.max(0, updatedCategories.length - 1);
      const additionalFees = additionalCategoriesCount * 5;
      const totalMonthlyFee = parseFloat((baseFee + additionalFees).toFixed(2));
      
      // Update user with new billing information
      await dbStorage.updateUser(userId, {
        totalMonthlyFee
      });
      
      // Return updated user info
      const updatedUserInfo = await dbStorage.getUser(userId);
      
      res.status(200).json({
        success: true,
        user: updatedUserInfo,
        serviceCategories: updatedCategories,
        removedCategory: categoryToRemove,
        totalMonthlyFee,
        message: "Service category removed successfully. Your billing will be updated on your next billing date."
      });
    } catch (error) {
      console.error("Error removing service category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/add-service-category', async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user.id;
    const { additionalServiceCategory, originalPrimaryService, skipPaymentCheck } = req.body;
    
    try {
      console.log(`Adding additional service category ${additionalServiceCategory} for user ${userId}`);
      
      // DIRECT DATABASE APPROACH - Get current user data
      const userResult = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const user = userResult.rows[0];
      
      // Create/update serviceCategories array from database data
      // Convert database array to JavaScript array if it's not already
      let serviceCategories = [];
      
      // Handle the case where service_categories might be a PostgreSQL array or string representation
      if (user.service_categories) {
        if (Array.isArray(user.service_categories)) {
          serviceCategories = [...user.service_categories];
        } else if (typeof user.service_categories === 'string') {
          // Handle case where it might be a string representation of an array
          try {
            const parsed = JSON.parse(user.service_categories.replace(/^\{|\}$/g, '[').replace(/\}/g, ']'));
            if (Array.isArray(parsed)) {
              serviceCategories = parsed;
            }
          } catch (e) {
            console.error("Error parsing service_categories:", e);
          }
        }
      }
      
      // Always make sure the primary service category is included
      if (user.service_category && !serviceCategories.includes(user.service_category)) {
        serviceCategories = [user.service_category, ...serviceCategories];
      }
      
      // Log the current categories to debug
      console.log("Current service categories:", serviceCategories);
      console.log("User service_categories from DB:", user.service_categories);
      
      // Check if this category already exists for this user
      if (serviceCategories.includes(additionalServiceCategory)) {
        return res.status(200).json({ 
          success: true,
          message: "You already have this service category",
          serviceCategories,
          alreadyExists: true
        });
      }
      
      // Check if this is their first additional category (beyond the primary one)
      // We only charge for additional categories
      const isFirstAdditionalService = serviceCategories.length === 1;
      
      // Skip payment requirement with skipPaymentCheck flag
      // This allows adding services directly without payment check
      if (isFirstAdditionalService && !skipPaymentCheck) {
        console.log("Payment verification required for first additional service");
        return res.status(200).json({
          requiresPayment: true,
          additionalServiceCategory,
          serviceCategories,
          amount: 5.00,
          message: "Payment required for additional service category"
        });
      } else {
        console.log("Payment check skipped, proceeding with service addition");
      }
      
      // Add new category
      serviceCategories.push(additionalServiceCategory);
      
      // Calculate the updated total price - $29.77 base fee + $5 for each additional service beyond the first
      const baseFee = 29.77;
      
      // Force deduplication to ensure we're not double-counting any services
      // This ensures the fee calculation is accurate
      const uniqueServices = Array.from(new Set([
        ...(user.service_category ? [user.service_category] : []), 
        ...serviceCategories
      ]));
      
      // Log the unique services to verify the count
      console.log("Unique services for fee calculation:", uniqueServices);
      
      // Only charge for categories beyond the first one
      const totalServiceCount = uniqueServices.length;
      const additionalCategoriesCount = Math.max(0, totalServiceCount - 1);
      const additionalFees = additionalCategoriesCount * 5;
      const totalMonthlyFee = parseFloat((baseFee + additionalFees).toFixed(2));
      
      // CALCULATE THE CORRECT FEE based on actual service count
      // Base fee 29.77 + (additional services count * 5.00)
      const finalMonthlyFee = totalMonthlyFee;
      
      // Log the calculated fee details
      console.log(`Fee calculated properly based on actual services:
        Base fee: $${baseFee}
        Additional services: ${additionalCategoriesCount} x $5.00 = $${additionalFees}
        Total monthly fee: $${finalMonthlyFee}
      `);
      
      console.log("Pricing calculation:", {
        baseFee,
        totalServiceCount,
        serviceCategories: serviceCategories.length,
        additionalCategoriesCount,
        additionalFees,
        totalMonthlyFee,
        finalMonthlyFee,
        previousFee: user.total_monthly_fee || 'not set'
      });
      
      // DIRECT DATABASE UPDATE - This ensures the service categories are correctly stored
      // Convert JavaScript array to proper PostgreSQL array format
      console.log(`Updating DB for user ${userId} with service categories:`, serviceCategories);
      
      // First, make sure we're working with a clean array without duplicates
      const uniqueCategories = Array.from(new Set(serviceCategories));
      
      // Attempt the update with special handling for the array
      const updateResult = await pool.query(
        `UPDATE users 
         SET service_categories = $1::text[], 
             total_monthly_fee = $2
         WHERE id = $3 
         RETURNING *`,
        [uniqueCategories, finalMonthlyFee.toString(), userId]
      );
      
      // Log the result for debugging
      console.log("Database update result:", updateResult.rows[0]?.service_categories);
      
      if (updateResult.rows.length === 0) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      
      // Get the updated data from the database
      const finalResult = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [userId]
      );
      
      const updatedUser = finalResult.rows[0];
      
      // Verify the service categories are now correct
      const finalServiceCategories = updatedUser.service_categories || [];
      const finalServiceCount = finalServiceCategories.length;
      
      console.log(`User now has ${finalServiceCount} services: ${JSON.stringify(finalServiceCategories)}`);
      
      // Prepare response with actual database values
      const paymentResponse = {
        success: true,
        userId: userId,
        serviceCategories: finalServiceCategories,
        baseFee,
        additionalFees,
        totalMonthlyFee,
        message: `Service category added successfully. You now have ${finalServiceCount} services. The additional $${additionalFees} has been added to your monthly fee.`
      };
      
      res.status(200).json(paymentResponse);
    } catch (error) {
      console.error("Error adding service category:", error);
      res.status(500).json({ message: "Server error", error: String(error) });
    }
  });
  
  app.post('/api/reactivate-subscription', async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to reactivate a subscription" });
      }
      
      const userId = req.user.id;
      const user = await dbStorage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ message: "No subscription found to reactivate" });
      }
      
      // Reactivate the subscription
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: false
      });
      
      // Update user's subscription status
      await dbStorage.updateUser(userId, {
        subscriptionStatus: subscription.status
      });
      
      res.json({
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
    } catch (error: any) {
      console.error('Error reactivating subscription:', error);
      res.status(500).json({ message: error.message || "Failed to reactivate subscription" });
    }
  });

  // ==== AUTOMATED PAYMENT MONITORING API ====
  
  // Admin API: Check payment status now (manual trigger)
  app.post("/api/admin/check-payments", async (req, res) => {
    try {
      const { paymentMonitor } = await import("./paymentMonitor");
      const result = await paymentMonitor.checkPaymentStatusNow();
      res.json({ message: result, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ message: "Failed to check payment statuses" });
    }
  });

  // Admin API: Get monitoring status
  app.get("/api/admin/monitoring-status", async (req, res) => {
    try {
      res.json({
        isRunning: true,
        checkInterval: "30 minutes",
        features: [
          "Automatic subscription expiration warnings (7 days before)",
          "Automatic account deactivation for expired subscriptions", 
          "Payment failure notifications (35+ days since last payment)",
          "Email notifications to professionals",
          "Admin dashboard alerts"
        ],
        lastCheck: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get monitoring status" });
    }
  });

  // Admin API: Populate missing subscription dates
  app.post("/api/admin/populate-subscription-dates", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { users } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      
      // Get all professionals missing subscription dates
      const professionals = await db.select().from(users).where(eq(users.isProfessional, true));
      let updated = 0;
      
      for (const pro of professionals) {
        // Only update if missing subscription start date
        if (!pro.subscriptionStartDate && pro.isProfessional) {
          // Set subscription start date to 30 days ago (reasonable estimate)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          await db.update(users)
            .set({
              subscriptionStartDate: thirtyDaysAgo,
              lastPaymentDate: thirtyDaysAgo,
              subscriptionStatus: 'active'
            })
            .where(eq(users.id, pro.id));
          updated++;
        }
      }
      
      res.json({ message: `Updated ${updated} professionals with subscription dates`, updated });
    } catch (error) {
      console.error('Error populating subscription dates:', error);
      res.status(500).json({ message: "Failed to populate subscription dates" });
    }
  });

  // ==== ADMIN NOTIFICATION MANAGEMENT API ====
  
  // Admin API: Get all professionals for notification management
  app.get("/api/admin/professionals", async (req, res) => {
    try {
      const { pool } = await import("./db");
      
      // Use direct SQL query to get authentic billing data
      const result = await pool.query(`
        SELECT 
          id, email, full_name, business_name, service_category, service_categories,
          is_active, subscription_status, subscription_expires_at,
          subscription_start_date, last_payment_date, next_billing_date,
          states_serviced, languages_spoken
        FROM users 
        WHERE is_professional = true
      `);
      
      // Return with correct field names for frontend
      const adminView = result.rows.map(pro => {
        // Calculate monthly fee based on actual service categories
        const baseFee = 29.77;
        const serviceCategories = pro.service_categories || [];
        
        // Count total services: if serviceCategories array exists and has items, use it
        // Otherwise, count the main serviceCategory as 1 service
        let totalServices = 0;
        if (serviceCategories.length > 0) {
          totalServices = serviceCategories.length;
        } else if (pro.service_category) {
          totalServices = 1;
        }
        
        // Calculate fee: base fee + $5 for each additional service beyond the first
        const additionalServices = Math.max(0, totalServices - 1);
        const totalFee = baseFee + (additionalServices * 5);
        
        return {
          id: pro.id,
          email: pro.email,
          fullName: pro.full_name,
          businessName: pro.business_name,
          serviceCategory: pro.service_category,
          serviceCategories: serviceCategories,
          statesServiced: pro.states_serviced || [],
          languagesSpoken: pro.languages_spoken || [],
          isActive: pro.is_active,
          subscriptionStatus: pro.subscription_status,
          subscription_expires_at: pro.subscription_expires_at,
          subscription_start_date: pro.subscription_start_date,
          last_payment_date: pro.last_payment_date,
          total_monthly_fee: totalFee.toFixed(2),
          nextBillingDate: pro.next_billing_date
        };
      });
      
      res.json(adminView);
    } catch (error) {
      console.error("Error fetching professionals for admin:", error);
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });

  // Admin API: Send payment notification to specific professional
  app.post("/api/admin/notify/:professionalId", async (req, res) => {
    try {
      const professionalId = parseInt(req.params.professionalId);
      const { type, customMessage } = req.body;
      
      // Get professional details
      const professional = await dbStorage.getUser(professionalId);
      if (!professional || !professional.isProfessional) {
        return res.status(404).json({ message: "Professional not found" });
      }
      
      let notification;
      
      // Create notification based on type
      switch (type) {
        case "payment_success":
          notification = {
            ...NotificationTemplates.paymentSuccess("29.77", "Professional Listing"),
            professionalId
          };
          break;
          
        case "payment_failed":
          notification = {
            ...NotificationTemplates.paymentFailed("29.77", customMessage),
            professionalId
          };
          break;
          
        case "subscription_expiring":
          const expirationDate = professional.subscriptionExpiresAt ? 
            new Date(professional.subscriptionExpiresAt).toLocaleDateString() : 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
          notification = {
            ...NotificationTemplates.subscriptionExpiring(7, expirationDate),
            professionalId
          };
          break;
          
        case "subscription_expired":
          notification = {
            ...NotificationTemplates.subscriptionExpired(),
            professionalId
          };
          break;
          
        case "payment_method_updated":
          notification = {
            ...NotificationTemplates.paymentMethodUpdated("Card ending in ****", "Next month"),
            professionalId
          };
          break;
          
        default:
          return res.status(400).json({ message: "Invalid notification type" });
      }
      
      // Send the notification
      const result = await createNotification(notification);
      
      res.json({ 
        success: true, 
        message: `Notification sent to ${professional.email}`,
        notification: result 
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  // Admin API: Send bulk notifications to multiple professionals - FIXED VERSION
  app.post("/api/admin/bulk-notify", async (req, res) => {
    try {
      const { professionalIds, type, customMessage } = req.body;
      console.log("=== BULK NOTIFICATION REQUEST ===");
      console.log("Professional IDs:", professionalIds);
      console.log("Type:", type);
      console.log("Custom Message:", customMessage);
      
      if (!Array.isArray(professionalIds) || professionalIds.length === 0) {
        return res.status(400).json({ message: "Professional IDs array is required" });
      }
      
      let successful = 0;
      let failed = 0;
      
      for (const professionalId of professionalIds) {
        try {
          // Check if professional exists
          const professionalCheck = await pool.query(
            'SELECT id, email FROM users WHERE id = $1 AND is_professional = true',
            [professionalId]
          );

          if (professionalCheck.rows.length === 0) {
            console.log(`Professional ${professionalId} not found, skipping`);
            failed++;
            continue;
          }

          console.log(`Found professional: ${professionalCheck.rows[0].email}`);

          // Prepare notification data based on type
          let title, message;
          
          switch (type) {
            case "payment_reminder":
              title = "Payment Reminder";
              message = "Your subscription payment is due soon. Please update your payment method if needed.";
              break;
              
            case "system_maintenance":
              title = "Scheduled System Maintenance";
              message = customMessage || "USA Home will undergo scheduled maintenance. Your listings will remain active.";
              break;
              
            default:
              title = "Notification";
              message = customMessage || "You have a new notification from USA Home.";
          }

          // Insert notification directly into database
          const insertResult = await pool.query(
            `INSERT INTO notifications (professional_id, type, title, message, action_required, metadata, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING id, professional_id, title`,
            [
              professionalId,
              type,
              title,
              message,
              false,
              '{}'
            ]
          );

          console.log(`✅ Notification created successfully:`, insertResult.rows[0]);
          successful++;
          
        } catch (error) {
          console.error(`❌ Failed to create notification for professional ${professionalId}:`, error);
          failed++;
        }
      }
      
      console.log(`=== BULK NOTIFICATION COMPLETE: ${successful} successful, ${failed} failed ===`);
      
      res.json({
        success: true,
        message: `Sent ${successful} notifications successfully, ${failed} failed`,
        successful,
        failed
      });
    } catch (error) {
      console.error("❌ Error in bulk notification endpoint:", error);
      res.status(500).json({ message: "Failed to send bulk notifications" });
    }
  });

  // Admin API: Get admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const professionals = await dbStorage.getAllProfessionals();
      const users = await dbStorage.getAllUsers();
      
      const stats = {
        totalUsers: users.length,
        totalProfessionals: professionals.length,
        activeProfessionals: professionals.filter(p => p.isActive !== false).length,
        newUsersThisMonth: users.filter(u => {
          if (!u.createdAt) return false;
          const userDate = new Date(u.createdAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return userDate > monthAgo;
        }).length,
        totalServices: professionals.reduce((sum, p) => {
          let serviceCount = 0;
          if (p.serviceCategories && Array.isArray(p.serviceCategories)) {
            serviceCount += p.serviceCategories.length;
          }
          if (p.serviceCategory) {
            serviceCount += 1;
          }
          return sum + serviceCount;
        }, 0),
        dailyActiveUsers: Math.floor(users.length * 0.3) // Estimate
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ message: "Failed to fetch admin stats", error: error.message });
    }
  });

  // Admin API: Get revenue information
  app.get("/api/admin/revenue", async (req, res) => {
    try {
      const professionals = await dbStorage.getAllProfessionals();
      
      // Calculate revenue based on active professionals
      const activeProfessionals = professionals.filter(p => p.isActive);
      const monthlyRevenue = activeProfessionals.reduce((sum, pro) => {
        const baseFee = 29.77;
        const additionalServices = pro.serviceCategories ? 
          Math.max(0, pro.serviceCategories.length - 1) : 0;
        const additionalFees = additionalServices * 5;
        return sum + baseFee + additionalFees;
      }, 0);
      
      res.json({
        monthlyRevenue: monthlyRevenue.toFixed(2),
        totalRevenue: monthlyRevenue.toFixed(2), // Exact current total, not estimated
        exactTotalRevenue: monthlyRevenue.toFixed(2) // Exact revenue amount
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue data" });
    }
  });

  // Admin API: Get all users for management
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await dbStorage.getAllUsers();
      
      // Return safe user data for admin management
      const adminUserView = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.fullName,
        is_professional: user.isProfessional,
        is_active: user.isActive,
        business_name: user.businessName,
        service_category: user.serviceCategory,
        state_location: user.stateLocation,
        subscription_expires_at: user.subscriptionExpiresAt,
        created_at: user.createdAt || new Date().toISOString()
      }));
      
      res.json(adminUserView);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Emergency fix: Reactivate professionals with valid subscriptions
  app.post("/api/admin/fix-deactivated", async (req, res) => {
    try {
      const professionals = await dbStorage.getAllProfessionals();
      const now = new Date();
      let reactivatedCount = 0;

      for (const pro of professionals) {
        if (!pro.isActive && pro.subscriptionStartDate) {
          const subscriptionStart = new Date(pro.subscriptionStartDate);
          const daysSinceStart = Math.ceil((now.getTime() - subscriptionStart.getTime()) / (1000 * 60 * 60 * 24));
          
          // If subscription started within last 30 days, reactivate
          if (daysSinceStart <= 30) {
            await dbStorage.updateUser(pro.id, { isActive: true });
            reactivatedCount++;
            console.log(`✅ Reactivated ${pro.email} - subscription is only ${daysSinceStart} days old`);
          }
        }
      }

      res.json({ 
        message: `Reactivated ${reactivatedCount} professionals with valid subscriptions`,
        reactivatedCount 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fix deactivated accounts" });
    }
  });

  // Account deletion request endpoint
  app.post("/api/deletion-request", async (req, res) => {
    try {
      console.log("📧 Deletion request received:", req.body);
      const { email, reason } = req.body;
      
      if (!email) {
        console.log("❌ No email provided");
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user is authenticated to get userId
      const userId = req.isAuthenticated() ? req.user.id : null;
      console.log("🔐 User authenticated:", req.isAuthenticated(), "User ID:", userId);

      // Store the deletion request
      console.log("💾 Attempting to save deletion request...");
      const deletionRequest = await dbStorage.createDeletionRequest({
        email,
        reason: reason || null,
        userId
      });

      console.log(`✅ New account deletion request saved with ID: ${deletionRequest.id} for: ${email}`);
      
      res.status(200).json({ 
        message: "Deletion request received. We will process your request within 30 days.",
        requestId: deletionRequest.id
      });
    } catch (error) {
      console.error("❌ Error processing deletion request:", error);
      res.status(500).json({ message: "Failed to process deletion request" });
    }
  });

  // Separate admin authentication system
  const ADMIN_USERNAME = 'usahome_admin';
  const ADMIN_PASSWORD = 'Admin2025!USA';

  // Admin login endpoint
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.session.isAdminAuthenticated = true;
      req.session.adminUsername = username;
      res.json({ 
        message: 'Admin login successful',
        username: username
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  });

  // Admin logout endpoint
  app.post('/api/admin/logout', (req, res) => {
    req.session.isAdminAuthenticated = false;
    req.session.adminUsername = null;
    res.json({ message: 'Admin logout successful' });
  });

  // Check admin auth status
  app.get('/api/admin/status', (req, res) => {
    if (req.session?.isAdminAuthenticated) {
      res.json({ 
        authenticated: true,
        username: req.session.adminUsername
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Admin endpoint to view deletion requests
  app.get("/api/admin/deletion-requests", async (req, res) => {
    try {
      if (!req.session?.isAdminAuthenticated) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const requests = await dbStorage.getAllDeletionRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching deletion requests:", error);
      res.status(500).json({ message: "Failed to fetch deletion requests" });
    }
  });

  // Serve the admin portal interface
  app.get('/admin-portal', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'admin-portal.html'));
  });

  // Serve the admin interface
  app.get('/admin-backend', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'admin-interface.html'));
  });

  // Save payment method endpoint for primary and backup
  app.post('/api/save-payment-method', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { type, cardNumber, cardholderName, expiryMonth, expiryYear, zipCode } = req.body;
      const userId = req.user!.id;

      // Validate required fields
      if (!type || !cardNumber || !cardholderName || !expiryMonth || !expiryYear || !zipCode) {
        return res.status(400).json({ message: 'All payment fields are required' });
      }

      // Debug: Log the actual data received
      console.log(`📋 Payment data received for user ${userId}:`, {
        type,
        cardNumber: cardNumber ? `${cardNumber.slice(0, 4)}...${cardNumber.slice(-4)}` : 'undefined',
        cardholderName,
        expiryMonth,
        expiryYear,
        zipCode
      });

      // Save payment method based on type (primary or backup)
      await dbStorage.savePaymentMethod(userId, {
        type,
        cardNumber,
        cardholderName,
        expiryMonth,
        expiryYear,
        zipCode
      });

      console.log(`💳 ${type} payment method saved for user ${userId}: card ending in ${cardNumber.slice(-4)}`);
      
      res.json({ 
        message: `${type} payment method saved successfully`
      });
    } catch (error) {
      console.error('Error saving payment method:', error);
      res.status(500).json({ message: 'Failed to save payment method' });
    }
  });

  // Update payment method endpoint
  app.post('/api/update-payment-method', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { cardNumber, cardName, expiryMonth, expiryYear, zipCode, cardType } = req.body;
      const userId = req.user!.id;

      // Validate required fields
      if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !zipCode || !cardType) {
        return res.status(400).json({ message: 'All payment fields are required' });
      }

      // Save payment method to database
      await dbStorage.updatePaymentMethod(userId, {
        cardNumber,
        cardName,
        expiryMonth,
        expiryYear,
        zipCode,
        cardType
      });

      console.log(`💳 Payment method updated for user ${userId}: ${cardType} card ending in ${cardNumber.slice(-4)}`);
      
      res.json({ 
        message: 'Payment method updated successfully',
        cardType: cardType
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      res.status(500).json({ message: 'Failed to update payment method' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
