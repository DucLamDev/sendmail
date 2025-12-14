import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Get SMTP port from env or default to 465 (more reliable on cloud platforms)
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const USE_SECURE = SMTP_PORT === 465;

// Create transporter with Gmail SMTP configuration
// Using port 465 with secure connection for better compatibility on cloud platforms like Render
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: SMTP_PORT,
  secure: USE_SECURE, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your Gmail address
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
  // Connection timeout settings for cloud platforms
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
  // Retry configuration
  pool: true, // Use connection pooling
  maxConnections: 1,
  maxMessages: 3,
  // TLS options for secure connection
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates if needed (for some cloud environments)
  }
});

/**
 * Generate HTML email template for payment confirmation
 * @param {Object} orderData - Order information
 * @returns {string} HTML email content
 */
const generateEmailTemplate = ({ orderId, totalAmount, transactionId, paymentDate }) => {
  const formattedDate = paymentDate 
    ? new Date(paymentDate).toLocaleString('vi-VN', { 
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleString('vi-VN');

  const formattedAmount = totalAmount 
    ? new Intl.NumberFormat('vi-VN').format(totalAmount) 
    : 'N/A';

  return `
<!DOCTYPE html>
<html lang='vi'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content { 
      padding: 30px 20px; 
      background-color: #ffffff;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
      color: #555;
    }
    .order-info { 
      background-color: #f9f9f9; 
      padding: 20px; 
      margin: 20px 0; 
      border-radius: 8px; 
      border-left: 4px solid #4CAF50;
    }
    .order-info h3 {
      margin-top: 0;
      color: #333;
      font-size: 18px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #666;
    }
    .info-value {
      color: #333;
      text-align: right;
    }
    .success-badge {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    .amount {
      font-size: 20px;
      font-weight: bold;
      color: #4CAF50;
    }
    .footer { 
      text-align: center; 
      padding: 20px;
      background-color: #f9f9f9;
      color: #777; 
      font-size: 12px; 
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .note {
      margin-top: 20px;
      padding: 15px;
      background-color: #e8f5e9;
      border-radius: 5px;
      color: #2e7d32;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>✅ Thanh toán thành công!</h1>
    </div>
    <div class='content'>
      <p class='greeting'>Xin chào,</p>
      <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được <strong>thanh toán thành công</strong>.</p>
      
      <div class='order-info'>
        <h3>📦 Thông tin đơn hàng</h3>
        <div class='info-row'>
          <span class='info-label'>Mã đơn hàng:</span>
          <span class='info-value'><strong>#${orderId}</strong></span>
        </div>
        <div class='info-row'>
          <span class='info-label'>Tổng tiền:</span>
          <span class='info-value'><span class='amount'>${formattedAmount} VNĐ</span></span>
        </div>
        <div class='info-row'>
          <span class='info-label'>Mã giao dịch:</span>
          <span class='info-value'>${transactionId || 'N/A'}</span>
        </div>
        <div class='info-row'>
          <span class='info-label'>Thời gian thanh toán:</span>
          <span class='info-value'>${formattedDate}</span>
        </div>
        <div class='info-row'>
          <span class='info-label'>Phương thức:</span>
          <span class='info-value'>VNPay</span>
        </div>
        <div class='info-row'>
          <span class='info-label'>Trạng thái:</span>
          <span class='info-value'><span class='success-badge'>Đang giao hàng</span></span>
        </div>
      </div>

      <div class='note'>
        <strong>📝 Lưu ý:</strong> Chúng tôi sẽ xử lý và giao hàng cho bạn trong thời gian sớm nhất. Bạn sẽ nhận được thông báo khi đơn hàng được vận chuyển.
      </div>
    </div>
    <div class='footer'>
      <p><strong>© 2024 Shopping App. All rights reserved.</strong></p>
      <p>Email này được gửi tự động, vui lòng không trả lời.</p>
      <p>Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ khách hàng.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send payment confirmation email with retry logic
 * @param {Object} orderData - Order information
 * @param {string} orderData.to - Recipient email address
 * @param {string} orderData.orderId - Order ID
 * @param {number} orderData.totalAmount - Total amount
 * @param {string} orderData.transactionId - Transaction ID (optional)
 * @param {string} orderData.paymentDate - Payment date (optional)
 * @param {number} retries - Number of retry attempts (default: 2)
 * @returns {Promise} Promise that resolves when email is sent
 */
export const sendPaymentConfirmationEmail = async ({
  to,
  orderId,
  totalAmount,
  transactionId,
  paymentDate
}, retries = 2) => {
  // Validate SMTP configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials are not configured. Please set SMTP_USER and SMTP_PASS in .env file');
  }

  const emailContent = generateEmailTemplate({
    orderId,
    totalAmount,
    transactionId,
    paymentDate
  });

  const mailOptions = {
    from: `"Shopping App" <${process.env.SMTP_USER}>`,
    to: to,
    subject: `✅ Thanh toán thành công - Đơn hàng #${orderId}`,
    html: emailContent,
  };

  // Retry logic for handling connection timeouts
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`🔄 Retrying email send (attempt ${attempt + 1}/${retries + 1})...`);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      lastError = error;
      console.error(`❌ Email sending failed (attempt ${attempt + 1}/${retries + 1}):`, error.message);
      
      // If it's a timeout error and we have retries left, continue
      if (attempt < retries && (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.code === 'ESOCKET')) {
        continue;
      }
      
      // If it's not a timeout or we're out of retries, throw immediately
      if (error.code !== 'ETIMEDOUT' && error.code !== 'ECONNRESET' && error.code !== 'ESOCKET') {
        throw error;
      }
    }
  }

  // If we exhausted all retries, throw the last error
  throw lastError;
};

// Verify transporter configuration (only when explicitly called, not on module load)
// This prevents timeout errors during server startup on cloud platforms
export const verifySMTPConnection = () => {
  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP connection error:', error.message);
        console.log('⚠️  Please check your SMTP credentials in .env file');
        console.log(`📌 Using port ${SMTP_PORT} with secure=${USE_SECURE}`);
        reject(error);
      } else {
        console.log('✅ SMTP server is ready to send emails');
        console.log(`📌 Connected via port ${SMTP_PORT} (secure=${USE_SECURE})`);
        resolve(success);
      }
    });
  });
};

