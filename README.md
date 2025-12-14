# Email Service API - Payment Confirmation

API service để gửi email thông báo thanh toán thành công sử dụng EmailJS, Node.js, và Express.js. EmailJS hoạt động qua HTTP API, không cần SMTP, phù hợp cho cloud platforms như Render.

## 🚀 Tính năng

- ✅ Gửi email thông báo thanh toán thành công
- ✅ Template email HTML đẹp mắt, responsive
- ✅ Hỗ trợ CORS cho mobile app
- ✅ Validation đầu vào
- ✅ Error handling đầy đủ
- ✅ ES6 syntax (import/export)
- ✅ Environment variables cho cấu hình
- ✅ Không cần SMTP - hoạt động qua HTTP API
- ✅ Tối ưu cho cloud platforms (Render, Vercel, etc.)
- ✅ Không bị chặn bởi firewall/network restrictions

## 📋 Yêu cầu

- Node.js >= 18.0.0
- EmailJS account (miễn phí tại https://www.emailjs.com)

## 🔧 Cài đặt

### 1. Clone hoặc tải project

```bash
cd sendmails
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình EmailJS

1. **Đăng ký tài khoản EmailJS:**
   - Truy cập: https://www.emailjs.com
   - Đăng ký tài khoản miễn phí (200 emails/tháng)

2. **Tạo Email Service:**
   - Vào Dashboard → Email Services
   - Click "Add New Service"
   - Chọn email provider (Gmail, Outlook, etc.)
   - Kết nối tài khoản email của bạn
   - Copy **Service ID**

3. **Tạo Email Template:**
   - Vào Dashboard → Email Templates
   - Click "Create New Template"
   - Thiết lập template với các biến: `{{to_email}}`, `{{subject}}`, `{{message}}`
   - Hoặc sử dụng HTML template có sẵn
   - Copy **Template ID**

4. **Lấy Public Key:**
   - Vào Dashboard → Account → General
   - Copy **Public Key**

5. **Lấy Private Key (Optional - cho server-side):**
   - Vào Dashboard → Account → General
   - Copy **Private Key** (nếu có)

### 4. Tạo file .env

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sửa file `.env` với thông tin EmailJS của bạn:

```env
EMAILJS_SERVICE_ID=service_xxxxx
EMAILJS_TEMPLATE_ID=template_xxxxx
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
PORT=3000
```

## 🏃 Chạy ứng dụng

### Development mode (với auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### GET `/health`

Kiểm tra trạng thái server và cấu hình SMTP.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-15T10:30:00.000Z",
  "smtp": {
    "configured": true,
    "port": "465",
    "secure": true
  }
}
```

### POST `/api/send-payment-email`

Gửi email thông báo thanh toán thành công.

**Request Body:**

```json
{
  "to": "customer@example.com",
  "orderId": "ORD123456",
  "totalAmount": 500000,
  "transactionId": "TXN789012",
  "paymentDate": "2024-12-15T10:30:00Z"
}
```

**Request Fields:**
- `to` (required): Email người nhận
- `orderId` (required): Mã đơn hàng
- `totalAmount` (optional): Tổng tiền (VNĐ)
- `transactionId` (optional): Mã giao dịch
- `paymentDate` (optional): Ngày thanh toán (ISO format)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "orderId": "ORD123456"
}
```

**Error Response (400/500):**

```json
{
  "success": false,
  "error": "Error message"
}
```

## 📝 Ví dụ sử dụng

### cURL

```bash
curl -X POST http://localhost:3000/api/send-payment-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "customer@example.com",
    "orderId": "ORD123456",
    "totalAmount": 500000,
    "transactionId": "TXN789012",
    "paymentDate": "2024-12-15T10:30:00Z"
  }'
```

### JavaScript (Fetch API)

```javascript
const response = await fetch('http://localhost:3000/api/send-payment-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: 'customer@example.com',
    orderId: 'ORD123456',
    totalAmount: 500000,
    transactionId: 'TXN789012',
    paymentDate: new Date().toISOString()
  })
});

const result = await response.json();
console.log(result);
```

### Axios

```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:3000/api/send-payment-email', {
  to: 'customer@example.com',
  orderId: 'ORD123456',
  totalAmount: 500000,
  transactionId: 'TXN789012',
  paymentDate: new Date().toISOString()
});

console.log(response.data);
```

## 🔒 Bảo mật

- ⚠️ **KHÔNG** commit file `.env` lên Git
- Sử dụng Private Key cho server-side (khuyến nghị)
- Cân nhắc sử dụng environment variables trên production server
- Có thể thêm authentication token cho API endpoint

## 🐛 Troubleshooting

### Lỗi "EmailJS credentials are not configured"

- Kiểm tra lại các biến môi trường trong file `.env`:
  - `EMAILJS_SERVICE_ID`
  - `EMAILJS_TEMPLATE_ID`
  - `EMAILJS_PUBLIC_KEY`
- Đảm bảo đã copy đúng các ID từ EmailJS Dashboard

### Lỗi "Invalid EmailJS configuration" (400)

- Kiểm tra Service ID và Template ID có đúng không
- Đảm bảo Template đã được publish trên EmailJS
- Kiểm tra các biến trong template có khớp với code không

### Lỗi "EmailJS authentication failed" (401)

- Kiểm tra Public Key có đúng không
- Thử sử dụng Private Key thay vì Public Key (nếu có)
- Đảm bảo key chưa bị revoke trên EmailJS Dashboard

### Lỗi "Service or template not found" (404)

- Kiểm tra Service ID và Template ID
- Đảm bảo Service và Template đã được tạo và active
- Kiểm tra bạn đang dùng đúng account EmailJS

### Email không được gửi

- Kiểm tra console logs để xem lỗi chi tiết
- Kiểm tra spam folder
- Kiểm tra health endpoint: `GET /health`
- Kiểm tra EmailJS Dashboard → Logs để xem chi tiết
- Đảm bảo email service đã được kết nối đúng trên EmailJS

## 📦 Dependencies

- **express**: Web framework
- **@emailjs/nodejs**: EmailJS SDK for Node.js
- **dotenv**: Environment variables management
- **cors**: CORS middleware

## 📄 License

ISC

## 👨‍💻 Author

Created for payment confirmation email service

