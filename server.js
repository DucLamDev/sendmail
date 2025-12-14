import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendPaymentConfirmationEmail, verifyEmailJSConnection } from './services/emailService.js';

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
  // Set timeout for the request (30 seconds)
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(504).json({ 
        success: false, 
        error: 'Request timeout - Email service may be unavailable. Please try again or contact support.' 
      });
    }
  }, 30000); // 30 seconds timeout

  try {
    const { to, orderId, totalAmount, transactionId, paymentDate } = req.body;

    // Validate required fields
    if (!to || !orderId) {
      clearTimeout(timeout);
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: to and orderId are required' 
      });
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      clearTimeout(timeout);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // Send email with Promise.race to handle timeout
    const emailPromise = sendPaymentConfirmationEmail({
      to,
      orderId,
      totalAmount,
      transactionId,
      paymentDate
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout after 25 seconds')), 25000);
    });

    await Promise.race([emailPromise, timeoutPromise]);

    clearTimeout(timeout);
    console.log(`✅ Email sent successfully to: ${to} for order #${orderId}`);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      orderId 
    });

  } catch (error) {
    clearTimeout(timeout);
    console.error('❌ Error sending email:', error);
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Internal server error';
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage,
      code: error.code || 'UNKNOWN_ERROR'
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

// Health check with EmailJS status
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    emailjs: {
      configured: !!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PRIVATE_KEY),
      serviceId: process.env.EMAILJS_SERVICE_ID || 'not set',
      templateId: process.env.EMAILJS_TEMPLATE_ID || 'not set',
      hasPrivateKey: !!process.env.EMAILJS_PRIVATE_KEY,
      note: 'Private Key (Access Token) is required for server-side API calls'
    }
  };
  res.json(health);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📧 Email service ready to send payment confirmations via EmailJS`);
  
  // Verify EmailJS configuration on startup
  try {
    await verifyEmailJSConnection();
  } catch (error) {
    console.warn('⚠️  EmailJS configuration issue:', error.message);
    console.log('💡 Please check your EmailJS credentials in .env file');
  }
});

