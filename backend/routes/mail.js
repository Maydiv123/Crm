import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// POST /api/mail/send - Send an email
router.post('/send', async (req, res) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'To, subject, and message are required.' });
  }
  
  try {
    // Use Gmail SMTP configuration from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'maydivinfotech@gmail.com',
        pass: process.env.SMTP_PASS || 'djvd kzaf pzxb czwp',
      },
    });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'maydivinfotech@gmail.com',
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`
    });

    console.log('Email sent successfully:', info.messageId);
    res.json({ 
      message: 'Email sent successfully!', 
      messageId: info.messageId,
      success: true 
    });
  } catch (error) {
    console.error('Mail send error:', error);
    res.status(500).json({ 
      message: 'Failed to send email.', 
      error: error.message,
      success: false 
    });
  }
});

// POST /api/mail/send-notification - Send notification to admin
router.post('/send-notification', async (req, res) => {
  const { subject, message } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'ravindranathjha76@gmail.com';
  
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required.' });
  }
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'maydivinfotech@gmail.com',
        pass: process.env.SMTP_PASS || 'djvd kzaf pzxb czwp',
      },
    });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'maydivinfotech@gmail.com',
      to: adminEmail,
      subject: `CRM Notification: ${subject}`,
      text: message,
      html: `<p>${message}</p>`
    });

    console.log('Admin notification sent successfully:', info.messageId);
    res.json({ 
      message: 'Admin notification sent successfully!', 
      messageId: info.messageId,
      success: true 
    });
  } catch (error) {
    console.error('Admin notification error:', error);
    res.status(500).json({ 
      message: 'Failed to send admin notification.', 
      error: error.message,
      success: false 
    });
  }
});

export default router; 