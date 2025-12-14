# 🔧 Giải pháp cho lỗi Timeout trên Render

## Vấn đề

Render có thể chặn outbound SMTP connections, đặc biệt là trên free tier. Điều này gây ra lỗi "Connection timeout" khi cố gắng kết nối đến Gmail SMTP.

## ✅ Giải pháp đã áp dụng

### 1. Tăng Timeout Settings
- Connection timeout: 100 giây (tăng từ 60)
- Greeting timeout: 60 giây (tăng từ 30)
- Socket timeout: 100 giây (tăng từ 60)

### 2. Request Timeout Protection
- HTTP request timeout: 30 giây
- Email sending timeout: 25 giây
- Tránh request bị pending mãi

### 3. Retry Logic Cải thiện
- Tự động retry 3 lần khi gặp timeout
- Recreate transporter sau lần retry đầu tiên
- Exponential backoff giữa các lần retry

### 4. Disable Connection Pooling
- Pooling có thể gây vấn đề trên cloud platforms
- Mỗi request tạo connection mới

## 🚀 Cách Deploy lại

1. **Commit và push code mới:**
   ```bash
   git add .
   git commit -m "Fix SMTP timeout for Render"
   git push
   ```

2. **Kiểm tra Environment Variables trên Render:**
   - `SMTP_USER`: Email Gmail của bạn
   - `SMTP_PASS`: App Password (16 ký tự)
   - `SMTP_PORT`: **465** (QUAN TRỌNG!)
   - `PORT`: Render tự động set

3. **Redeploy trên Render:**
   - Render sẽ tự động deploy khi có code mới
   - Hoặc manual trigger từ Dashboard

## 🔄 Nếu vẫn bị Timeout

Nếu sau khi deploy lại vẫn bị timeout, có thể Render đang chặn SMTP hoàn toàn. Có 2 lựa chọn:

### Option 1: Sử dụng Resend (Khuyến nghị - Dễ nhất)

Resend là email service miễn phí, được thiết kế cho developers và hoạt động tốt trên cloud platforms.

**Cài đặt:**
```bash
npm install resend
```

**Cấu hình:**
1. Đăng ký tại https://resend.com (free tier: 3000 emails/tháng)
2. Lấy API key
3. Thêm vào Render Environment Variables:
   ```
   RESEND_API_KEY=re_xxxxx
   ```

**Code mẫu sẽ được cung cấp nếu cần.**

### Option 2: Sử dụng SendGrid

SendGrid cũng là lựa chọn tốt với free tier 100 emails/ngày.

### Option 3: Upgrade Render Plan

Render free tier có thể có restrictions. Upgrade lên paid plan có thể giải quyết vấn đề.

## 📊 Kiểm tra Logs

Sau khi deploy, kiểm tra logs trên Render Dashboard để xem:
- Connection attempts
- Error messages chi tiết
- Retry attempts

## 🧪 Test sau khi Deploy

```bash
# Health check
curl https://your-service.onrender.com/health

# Test send email
curl -X POST https://your-service.onrender.com/api/send-payment-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "orderId": "TEST123",
    "totalAmount": 100000
  }'
```

## 💡 Tips

1. **Kiểm tra Render Logs:** Xem chi tiết lỗi trong logs
2. **Test với curl:** Đảm bảo không phải do client
3. **Kiểm tra Gmail App Password:** Đảm bảo đúng và chưa hết hạn
4. **Thử port khác:** Nếu 465 không work, thử 587 (nhưng ít khả năng thành công hơn)

## 📞 Nếu cần hỗ trợ

Nếu vẫn gặp vấn đề, có thể:
1. Chuyển sang Resend/SendGrid (khuyến nghị)
2. Sử dụng Gmail API với OAuth2 (phức tạp hơn)
3. Deploy lên platform khác (Vercel, Railway, etc.)

