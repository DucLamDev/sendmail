import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendPaymentConfirmationEmail } from './services/emailService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Email Service API is running',
    version: '1.0.0',
    endpoints: {
      'POST /api/send-payment-email': 'Send payment confirmation email'
    }
  });
});

// API endpoint to send payment confirmation email
app.post('/api/send-payment-email', async (req, res) => {
  try {
    const { to, orderId, totalAmount, transactionId, paymentDate } = req.body;

    // Validate required fields
    if (!to || !orderId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: to and orderId are required' 
      });
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Send email
    await sendPaymentConfirmationEmail({
      to,
      orderId,
      totalAmount,
      transactionId,
      paymentDate
    });

    console.log(`✅ Email sent successfully to: ${to} for order #${orderId}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      orderId 
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found' 
  });
});

// Health check with SMTP status
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    smtp: {
      configured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
      port: process.env.SMTP_PORT || '465',
      secure: (process.env.SMTP_PORT || '465') === '465'
    }
  };
  res.json(health);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📧 Email service ready to send payment confirmations`);
  console.log(`📌 SMTP Port: ${process.env.SMTP_PORT || '465'} (secure: ${(process.env.SMTP_PORT || '465') === '465'})`);
  console.log(`💡 Note: SMTP connection will be verified on first email send`);
});

