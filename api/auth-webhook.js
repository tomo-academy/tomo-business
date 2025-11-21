import { createClient } from '@supabase/supabase-js';

// Email service - using Resend (you can switch to SendGrid or Nodemailer)
async function sendWelcomeEmail(userEmail, userName, authProvider) {
  // You'll need to install one of these:
  // npm install resend
  // OR npm install @sendgrid/mail
  // OR npm install nodemailer
  
  const emailBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .badge { display: inline-block; background: #e0e7ff; color: #4f46e5; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to TOMO BUSINESS!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Welcome aboard! Your account has been successfully created.</p>
            
            <p><span class="badge">Signed up via ${authProvider}</span></p>
            
            <p>You can now create your digital business cards and share them with the world!</p>
            
            <a href="https://tomo-business.vercel.app/#/dashboard" class="button">
              Go to Dashboard →
            </a>
            
            <h3>🚀 Quick Start:</h3>
            <ul>
              <li>Create your first business card</li>
              <li>Customize your profile</li>
              <li>Share your unique link</li>
              <li>Track analytics</li>
            </ul>
            
            <p>Need help? Reply to this email or contact us at support@tomoacademy.com</p>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              Best regards,<br>
              <strong>TOMO BUSINESS Team</strong>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    // Option 1: Using Resend (Recommended)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: 'TOMO BUSINESS <onboarding@yourdomain.com>',
        to: userEmail,
        subject: `Welcome to TOMO BUSINESS! 🎉`,
        html: emailBody
      });
      return true;
    }
    
    // Option 2: Using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      await sgMail.send({
        to: userEmail,
        from: 'noreply@yourdomain.com',
        subject: 'Welcome to TOMO BUSINESS! 🎉',
        html: emailBody
      });
      return true;
    }
    
    // Option 3: Using Nodemailer (Gmail)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      await transporter.sendMail({
        from: '"TOMO BUSINESS" <' + process.env.EMAIL_USER + '>',
        to: userEmail,
        subject: 'Welcome to TOMO BUSINESS! 🎉',
        html: emailBody
      });
      return true;
    }
    
    console.log('No email service configured');
    return false;
    
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook signature (security)
    const signature = req.headers['x-supabase-signature'];
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      // Verify the signature matches
      const crypto = require('crypto');
      const body = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { type, record } = req.body;
    
    // Handle user.created event
    if (type === 'INSERT' && record) {
      const userEmail = record.email;
      const userName = record.raw_user_meta_data?.name || 
                      record.raw_user_meta_data?.full_name || 
                      userEmail?.split('@')[0] || 
                      'User';
      const authProvider = record.raw_app_meta_data?.provider || 'email';
      
      console.log(`New user signup via ${authProvider}: ${userEmail}`);
      
      // Send welcome email
      const emailSent = await sendWelcomeEmail(userEmail, userName, authProvider);
      
      if (emailSent) {
        console.log(`Welcome email sent to ${userEmail}`);
      } else {
        console.log(`Email service not configured - skipping email to ${userEmail}`);
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Webhook processed',
        emailSent 
      });
    }
    
    // Handle other events
    return res.status(200).json({ success: true, message: 'Event acknowledged' });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
