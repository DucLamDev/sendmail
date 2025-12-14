# 📧 Hướng dẫn Setup EmailJS

## Bước 1: Đăng ký EmailJS

1. Truy cập: https://www.emailjs.com
2. Click **"Sign Up"** hoặc **"Get Started"**
3. Đăng ký bằng email hoặc Google account
4. Xác nhận email (nếu cần)

**Free Plan:**
- 200 emails/tháng
- Đủ cho development và testing
- Có thể upgrade nếu cần

## Bước 2: Tạo Email Service

1. **Vào Dashboard:**
   - Sau khi đăng nhập, bạn sẽ thấy Dashboard
   - Click **"Email Services"** ở menu bên trái

2. **Add New Service:**
   - Click nút **"Add New Service"**
   - Chọn email provider:
     - **Gmail** (khuyến nghị - dễ setup)
     - **Outlook**
     - **Yahoo**
     - **Custom SMTP**

3. **Kết nối Gmail:**
   - Chọn **"Gmail"**
   - Click **"Connect Account"**
   - Đăng nhập với Gmail account bạn muốn dùng để gửi email
   - Cho phép EmailJS truy cập
   - Đặt tên cho service (ví dụ: "Payment Notifications")
   - Click **"Create Service"**

4. **Copy Service ID:**
   - Sau khi tạo xong, bạn sẽ thấy **Service ID** (dạng: `service_xxxxx`)
   - Copy Service ID này để dùng trong `.env`

## Bước 3: Tạo Email Template

1. **Vào Email Templates:**
   - Click **"Email Templates"** ở menu bên trái
   - Click **"Create New Template"**

2. **Thiết lập Template:**
   - **Template Name:** "Payment Confirmation"
   - **Subject:** `{{subject}}` hoặc `✅ Thanh toán thành công - Đơn hàng #{{order_id}}`
   - **Content:** Chọn **"HTML"** mode

3. **Template HTML:**
   
   Bạn có thể sử dụng template đơn giản:
   ```html
   <h2>✅ Thanh toán thành công!</h2>
   <p>Xin chào,</p>
   <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được thanh toán thành công.</p>
   
   <h3>📦 Thông tin đơn hàng:</h3>
   <p><strong>Mã đơn hàng:</strong> {{order_id}}</p>
   <p><strong>Tổng tiền:</strong> {{total_amount}} VNĐ</p>
   <p><strong>Mã giao dịch:</strong> {{transaction_id}}</p>
   <p><strong>Thời gian:</strong> {{payment_date}}</p>
   <p><strong>Trạng thái:</strong> Đang giao hàng</p>
   ```

   **HOẶC** sử dụng template HTML đầy đủ từ code (recommended):
   - Code sẽ tự động gửi HTML template đẹp mắt
   - Template trong code đã được tối ưu và responsive
   - Chỉ cần đảm bảo template có các biến: `{{message}}`, `{{to_email}}`, `{{subject}}`

4. **Template Variables:**
   
   Đảm bảo template có các biến sau (code sẽ tự động điền):
   - `{{to_email}}` - Email người nhận
   - `{{to_name}}` - Tên người nhận
   - `{{subject}}` - Tiêu đề email
   - `{{message}}` - Nội dung HTML (toàn bộ template)
   - `{{order_id}}` - Mã đơn hàng
   - `{{total_amount}}` - Tổng tiền (đã format)
   - `{{transaction_id}}` - Mã giao dịch
   - `{{payment_date}}` - Ngày thanh toán

5. **Save Template:**
   - Click **"Save"**
   - Copy **Template ID** (dạng: `template_xxxxx`)

## Bước 4: Lấy API Keys

1. **Vào Account Settings:**
   - Click vào avatar/profile ở góc trên bên phải
   - Chọn **"Account"** hoặc **"General"**

2. **Copy Public Key:**
   - Tìm **"Public Key"** hoặc **"User ID"**
   - Copy key này (dạng: `xxxxxxxxxxxxx`)

3. **Copy Private Key (Optional - Recommended):**
   - Tìm **"Private Key"** hoặc **"Access Token"**
   - Copy key này nếu có (dùng cho server-side, an toàn hơn)
   - Nếu không có, có thể dùng Public Key

## Bước 5: Cấu hình .env

Tạo file `.env` với các thông tin đã lấy:

```env
EMAILJS_SERVICE_ID=service_xxxxx
EMAILJS_TEMPLATE_ID=template_xxxxx
EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_PRIVATE_KEY=your_private_key_here
PORT=3000
```

## Bước 6: Test

1. **Start server:**
   ```bash
   npm start
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Test send email:**
   ```bash
   curl -X POST http://localhost:3000/api/send-payment-email \
     -H "Content-Type: application/json" \
     -d '{
       "to": "your-email@example.com",
       "orderId": "TEST123",
       "totalAmount": 100000,
       "transactionId": "TXN001",
       "paymentDate": "2024-12-15T10:30:00Z"
     }'
   ```

## 📝 Lưu ý

1. **Template với HTML:**
   - Nếu muốn dùng template HTML đẹp từ code, đặt template trên EmailJS là:
     ```html
     {{message}}
     ```
   - Code sẽ tự động gửi toàn bộ HTML template vào biến `{{message}}`

2. **Template Variables:**
   - Code tự động map các giá trị vào template
   - Bạn có thể customize template trên EmailJS Dashboard
   - Hoặc để code tự động gửi HTML template đầy đủ

3. **Email Limits:**
   - Free plan: 200 emails/tháng
   - Kiểm tra usage trên Dashboard
   - Upgrade nếu cần nhiều hơn

4. **Security:**
   - Sử dụng Private Key cho production (nếu có)
   - Không commit `.env` lên Git
   - Set environment variables trên Render/Vercel

## 🔗 Links hữu ích

- [EmailJS Dashboard](https://dashboard.emailjs.com)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Node.js SDK](https://www.emailjs.com/docs/nodejs/)

## ✅ Checklist

- [ ] Đã đăng ký EmailJS account
- [ ] Đã tạo Email Service và copy Service ID
- [ ] Đã tạo Email Template và copy Template ID
- [ ] Đã copy Public Key (và Private Key nếu có)
- [ ] Đã cấu hình `.env` file
- [ ] Đã test thành công trên localhost
- [ ] Đã set environment variables trên Render

