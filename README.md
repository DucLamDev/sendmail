# Email Service API - Payment Confirmation

API service để gửi email thông báo thanh toán thành công qua Gmail SMTP sử dụng Node.js, Express.js, và Nodemailer.

## 🚀 Tính năng

- ✅ Gửi email thông báo thanh toán thành công
- ✅ Template email HTML đẹp mắt, responsive
- ✅ Hỗ trợ CORS cho mobile app
- ✅ Validation đầu vào
- ✅ Error handling đầy đủ
- ✅ ES6 syntax (import/export)
- ✅ Environment variables cho cấu hình

## 📋 Yêu cầu

- Node.js >= 18.0.0
- Gmail account với App Password

## 🔧 Cài đặt

### 1. Clone hoặc tải project

```bash
cd sendmails
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Gmail App Password

1. Truy cập: https://myaccount.google.com/apppasswords
2. Đăng nhập với tài khoản Gmail của bạn
3. Tạo App Password mới cho "Mail"
4. Copy App Password (16 ký tự)

### 4. Tạo file .env

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sửa file `.env` với thông tin của bạn:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
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
- Sử dụng App Password thay vì mật khẩu Gmail thông thường
- Cân nhắc sử dụng environment variables trên production server
- Có thể thêm authentication token cho API endpoint

## 🐛 Troubleshooting

### Lỗi "Invalid login"

- Kiểm tra lại `SMTP_USER` và `SMTP_PASS` trong file `.env`
- Đảm bảo đang sử dụng App Password, không phải mật khẩu Gmail
- Kiểm tra 2-Step Verification đã được bật

### Lỗi "Connection timeout"

- Kiểm tra kết nối internet
- Kiểm tra firewall không chặn port 587
- Thử đổi port sang 465 và `secure: true`

### Email không được gửi

- Kiểm tra console logs để xem lỗi chi tiết
- Kiểm tra spam folder
- Verify SMTP connection bằng cách check console khi start server

## 📦 Dependencies

- **express**: Web framework
- **nodemailer**: Email sending library
- **dotenv**: Environment variables management
- **cors**: CORS middleware

## 📄 License

ISC

## 👨‍💻 Author

Created for payment confirmation email service

