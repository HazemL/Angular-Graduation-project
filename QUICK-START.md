# ✅ المشروع جاهز للربط بالـ API

## ما تم إنجازه

### 1. ✅ إنشاء ملفات Environment
- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

### 2. ✅ إضافة HTTP Interceptors
- `auth.interceptor.ts` - يضيف Bearer Token تلقائياً لكل request
- `error.interceptor.ts` - يترجم الأخطاء للعربية ويتعامل مع 401/403/404/500

### 3. ✅ تحديث جميع الخدمات
تم توحيد **14 خدمة** لاستخدام `environment.apiUrl`:
- auth.service.ts
- plumber.service.ts
- electrician.service.ts
- carpenter.service.ts
- painter.service.ts
- ac-technician.service.ts
- aluminum-technician.service.ts
- gas-technician.service.ts
- device-repair.service.ts
- craftsman-registration.service.ts
- users.ts
- crafts-service.ts
- subscriptions.service.ts
- reviews.service.ts
- reports.service.ts

### 4. ✅ تنظيف الكود
- إزالة imports غير مستخدمة من app.ts
- إزالة جميع التحذيرات
- البناء نجح بدون أخطاء

### 5. ✅ إنشاء ملفات التوثيق
- `API-INTEGRATION-GUIDE.md` - دليل شامل للـ API
- `USAGE-EXAMPLES.md` - أمثلة على استخدام الخدمات

## 🚀 كيف تبدأ؟

### الخطوة 1: غيّر عنوان API
افتح `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // ← غيّر هنا
};
```

### الخطوة 2: تأكد من تشغيل Backend
```bash
# مثال إذا كان Backend هو Node.js
cd path/to/your-backend
npm start
```

### الخطوة 3: شغّل المشروع
```bash
npm start
# أو
ng serve
```

### الخطوة 4: افتح المتصفح
```
http://localhost:4200
```

## 🔍 كيف تتأكد أنه يعمل؟

### 1. افتح Developer Tools (F12)
- اذهب لـ **Console** - شوف لو في أخطاء
- اذهب لـ **Network** - شوف الـ requests

### 2. جرب تسجيل الدخول
- الـ request يروح لـ `/api/auth/login`
- الـ Token يتخزن تلقائياً
- الـ requests التانية هيكون فيها `Authorization: Bearer <token>`

### 3. جرب أي خدمة تانية
مثلاً: قائمة السباكين
- الـ request يروح لـ `/api/plumbers`
- لو في error 401 → تتوجه لصفحة Login تلقائياً
- لو في error 500 → تظهر رسالة بالعربي

## 📋 API Endpoints المطلوبة

Backend الخاص بك يجب يوفر هذه endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`

### Craftsmen
- `GET /api/plumbers` (و electricians, carpenters, إلخ)
- `POST /api/plumbers`
- `PUT /api/plumbers/:id`
- `DELETE /api/plumbers/:id`

### Registration
- `POST /api/craftsman/registration/basic-info`
- `POST /api/craftsman/registration/upload-photo`
- وباقي الـ endpoints (شوف API-INTEGRATION-GUIDE.md)

### Subscriptions
- `GET /api/subscriptions/plans`
- `POST /api/subscriptions/subscribe`

### Reviews
- `GET /api/craftsman/reviews`
- `POST /api/craftsman/reviews/:id/reply`

### Reports
- `POST /api/reports`
- `POST /api/reports/upload`

## ⚙️ الإعدادات المتقدمة

### تغيير Port
في `angular.json`:
```json
"serve": {
  "options": {
    "port": 4200  // غيّر هنا
  }
}
```

### تعطيل Proxy (إذا Backend على domain مختلف)
احذف أو عطّل `proxy.conf.json` من `angular.json`:
```json
"serve": {
  "options": {
    // "proxyConfig": "proxy.conf.json"  // علّق أو احذف
  }
}
```

وغيّر Environment:
```typescript
export const environment = {
  apiUrl: 'https://api.yourdomain.com/api'  // Domain كامل
};
```

### CORS Settings
إذا Backend على domain مختلف، تأكد من CORS enabled:
```javascript
// في Node.js/Express مثلاً
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## 🐛 حل المشاكل

### مشكلة: CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**الحل:** فعّل CORS في Backend

### مشكلة: 401 Unauthorized
```
غير مصرح لك بالوصول
```
**الحل:** 
1. تأكد من تسجيل الدخول
2. تأكد من Token موجود في localStorage
3. تأكد من Backend يقبل الـ Token

### مشكلة: API لا يستجيب
```
HttpErrorResponse: 0 Unknown Error
```
**الحل:**
1. تأكد من Backend شغال
2. تأكد من URL صحيح في environment.ts
3. تأكد من Proxy config صحيح

### مشكلة: Environment لا يتغير
**الحل:** امسح cache واعمل rebuild:
```bash
rm -rf dist node_modules/.cache
ng build --configuration development
```

## 📱 Build للإنتاج

```bash
# 1. غيّر API URL في environment.prod.ts
# 2. اعمل build
ng build --configuration production

# 3. الملفات هتكون في dist/test-Project
# 4. ارفعها على server
```

## 📚 ملفات مفيدة

- `API-INTEGRATION-GUIDE.md` - دليل كامل للـ API
- `USAGE-EXAMPLES.md` - أمثلة برمجية
- `proxy.conf.json` - إعدادات Proxy
- `src/environments/` - إعدادات Environment
- `src/app/interceptors/` - HTTP Interceptors

## 🎉 النتيجة النهائية

✅ لا توجد أخطاء في الكود
✅ البناء ناجح (Build successful)
✅ جميع الخدمات موحدة
✅ HTTP Interceptors تعمل تلقائياً
✅ معالجة الأخطاء بالعربي
✅ Authentication جاهز
✅ المشروع جاهز للربط بأي Backend!

---

**ملحوظة:** إذا احتجت مساعدة في أي خطوة، ارجع للملفات التوثيقية المذكورة أعلاه.
