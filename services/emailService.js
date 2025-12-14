import dotenv from 'dotenv';

dotenv.config();

// EmailJS API endpoint
const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

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
 * Send payment confirmation email using EmailJS
 * @param {Object} orderData - Order information
 * @param {string} orderData.to - Recipient email address
 * @param {string} orderData.orderId - Order ID
 * @param {number} orderData.totalAmount - Total amount
 * @param {string} orderData.transactionId - Transaction ID (optional)
 * @param {string} orderData.paymentDate - Payment date (optional)
 * @returns {Promise} Promise that resolves when email is sent
 */
export const sendPaymentConfirmationEmail = async ({
  to,
  orderId,
  totalAmount,
  transactionId,
  paymentDate
}) => {
  // Validate EmailJS configuration
  if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY) {
    throw new Error(
      'EmailJS credentials are not configured. ' +
      'Please set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in .env file'
    );
  }

  const emailContent = generateEmailTemplate({
    orderId,
    totalAmount,
    transactionId,
    paymentDate
  });

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

  // Prepare template parameters for EmailJS
  const templateParams = {
    to_email: to,
    to_name: to.split('@')[0], // Extract name from email
    subject: `✅ Thanh toán thành công - Đơn hàng #${orderId}`,
    message: emailContent,
    // Additional fields for template variables
    order_id: orderId,
    total_amount: formattedAmount,
    transaction_id: transactionId || 'N/A',
    payment_date: formattedDate,
    // Raw values for template customization
    raw_amount: totalAmount || 0,
    payment_method: 'VNPay',
    order_status: 'Đang giao hàng'
  };

  try {
    // Prepare request payload for EmailJS API
    const requestPayload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
      accessToken: process.env.EMAILJS_PRIVATE_KEY || undefined // Optional: for server-side
    };

    // Send email using EmailJS REST API
    const response = await fetch(EMAILJS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    const responseData = await response.text();

    if (!response.ok) {
      let errorMessage = 'Email sending failed';
      if (response.status === 400) {
        errorMessage = 'Invalid EmailJS configuration. Please check your Service ID, Template ID, and Public Key.';
      } else if (response.status === 401) {
        errorMessage = 'EmailJS authentication failed. Please check your Public Key.';
      } else if (response.status === 404) {
        errorMessage = 'EmailJS service or template not found. Please check your Service ID and Template ID.';
      } else {
        errorMessage = `EmailJS API error: ${responseData || response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    console.log('📧 Email sent successfully via EmailJS:', responseData);
    return {
      success: true,
      messageId: responseData,
      status: response.status
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

/**
 * Verify EmailJS configuration
 * @returns {Promise} Promise that resolves if configuration is valid
 */
export const verifyEmailJSConnection = async () => {
  if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY) {
    throw new Error('EmailJS credentials are not configured');
  }

  try {
    // Test connection by sending a test email (optional)
    // Or just verify credentials are set
    console.log('✅ EmailJS configuration verified');
    console.log(`📌 Service ID: ${process.env.EMAILJS_SERVICE_ID}`);
    console.log(`📌 Template ID: ${process.env.EMAILJS_TEMPLATE_ID}`);
    return true;
  } catch (error) {
    console.error('❌ EmailJS configuration error:', error.message);
    throw error;
  }
};
