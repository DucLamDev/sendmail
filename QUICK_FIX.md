# ⚡ Quick Fix - EmailJS Server-Side API

## Vấn đề
Lỗi: "API calls are disabled for non-browser applications"

## Giải pháp (3 bước)

### Bước 1: Bật API cho Server-Side

1. Vào EmailJS Dashboard: https://dashboard.emailjs.com
2. Click **Account** → **Security** tab
3. Tìm phần **"API Settings"**
4. ✅ **BẬT** checkbox: **"Allow EmailJS API for non-browser applications"**
5. Click nút **"Save Changes"** (màu xanh, có icon checkmark)

### Bước 2: Copy Private Key

1. Vẫn trong Dashboard, click **Account** → **General** tab
2. Tìm phần **"API keys"**
3. Copy **Private Key** (ví dụ: `U3BQn0VJ3br7rLfGokP4n`)

### Bước 3: Cập nhật Render Environment Variables

1. Vào Render Dashboard → Service của bạn
2. Click **Environment** tab
3. Thêm hoặc cập nhật:
   ```
   EMAILJS_PRIVATE_KEY=U3BQn0VJ3br7rLfGokP4n
   ```
   (Thay bằng Private Key thực tế của bạn)

4. Click **"Save Changes"**
5. Render sẽ tự động redeploy

## ✅ Kiểm tra

Sau khi redeploy, test lại API:

```bash
curl -X POST https://your-service.onrender.com/api/send-payment-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "orderId": "TEST123",
    "totalAmount": 100000
  }'
```

## ⚠️ Lưu ý

- **QUAN TRỌNG:** Phải bật checkbox "Allow EmailJS API for non-browser applications" và **Save Changes**
- Private Key chỉ hiển thị một lần, hãy copy ngay
- Đảm bảo đã set `EMAILJS_PRIVATE_KEY` trên Render (không phải Public Key)

