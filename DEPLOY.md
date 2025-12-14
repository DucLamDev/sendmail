# Hướng dẫn Deploy lên Render

## 🚀 Deploy trên Render.com

### Bước 1: Tạo Service mới trên Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Kết nối repository GitHub/GitLab của bạn
4. Chọn repository `sendmails`

### Bước 2: Cấu hình Build & Start Commands

Render sẽ tự động detect Node.js project, nhưng bạn có thể kiểm tra:

- **Build Command:** `npm install` (hoặc để trống)
- **Start Command:** `node server.js`

### Bước 3: Cấu hình Environment Variables

**QUAN TRỌNG:** Đây là bước quan trọng nhất để tránh lỗi timeout!

Vào **Environment** tab và thêm các biến sau:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_PORT=465
PORT=10000
```

**Lưu ý:**
- `SMTP_PORT=465` là **BẮT BUỘC** để tránh timeout trên Render
- `PORT` sẽ được Render tự động set, nhưng bạn có thể set `PORT=10000` để đảm bảo
- **KHÔNG** commit file `.env` lên Git

### Bước 4: Deploy

1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy
3. Đợi quá trình deploy hoàn tất (thường 2-5 phút)

### Bước 5: Kiểm tra

1. Truy cập URL được cung cấp: `https://your-service.onrender.com`
2. Test health endpoint: `GET https://your-service.onrender.com/health`
3. Test send email endpoint với Postman hoặc curl

## 🔧 Cấu hình Gmail App Password

Nếu chưa có App Password:

1. Truy cập: https://myaccount.google.com/apppasswords
2. Đăng nhập với Gmail account
3. Chọn **"Mail"** và **"Other (Custom name)"**
4. Nhập tên: "Render Email Service"
5. Click **"Generate"**
6. Copy 16 ký tự password (không có dấu cách)
7. Paste vào `SMTP_PASS` trên Render

## ✅ Kiểm tra sau khi Deploy

### 1. Health Check

```bash
curl https://your-service.onrender.com/health
```

Kết quả mong đợi:
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

### 2. Test Send Email

```bash
curl -X POST https://your-service.onrender.com/api/send-payment-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "orderId": "TEST123",
    "totalAmount": 100000,
    "transactionId": "TXN001",
    "paymentDate": "2024-12-15T10:30:00Z"
  }'
```

## 🐛 Xử lý lỗi

### Lỗi "Connection timeout"

**Nguyên nhân:** Render có thể chặn outbound connections hoặc port 587 không hoạt động tốt.

**Giải pháp:**
1. ✅ Đảm bảo `SMTP_PORT=465` trong Environment Variables
2. ✅ Kiểm tra `SMTP_USER` và `SMTP_PASS` đã được set đúng
3. ✅ Code đã có retry logic tự động (3 lần)
4. ✅ Connection timeout đã được set 60 giây

### Lỗi "Invalid login"

**Nguyên nhân:** App Password không đúng hoặc chưa được tạo.

**Giải pháp:**
1. Tạo lại App Password tại https://myaccount.google.com/apppasswords
2. Copy chính xác 16 ký tự (không có dấu cách)
3. Update `SMTP_PASS` trên Render
4. Redeploy service

### Service không start

**Kiểm tra:**
1. Logs trên Render Dashboard
2. Đảm bảo `package.json` có đúng dependencies
3. Kiểm tra Node.js version (Render tự động detect)

## 📝 Notes

- Render free tier có thể sleep sau 15 phút không có traffic
- Request đầu tiên sau khi sleep có thể mất 30-60 giây để wake up
- Nên upgrade lên paid plan nếu cần 24/7 uptime
- Code đã được tối ưu với connection pooling và retry logic

## 🔗 Links hữu ích

- [Render Documentation](https://render.com/docs)
- [Render Web Services](https://render.com/docs/web-services)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)

