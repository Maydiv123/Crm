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
    // For demo: use ethereal test account (replace with real SMTP for production)
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    let info = await transporter.sendMail({
      from: 'CRM <no-reply@crm.com>',
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`
    });
    res.json({ message: 'Email sent!', info, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error('Mail send error:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

export default router; 