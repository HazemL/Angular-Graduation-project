# دليل API - مشروع التخرج Angular

## 🎯 نظرة عامة
تم إعداد المشروع بالكامل للربط بالـ API الخاص بك.

## 📁 الملفات المضافة

### 1. Environment Files
- `src/environments/environment.ts` - للتطوير (Development)
- `src/environments/environment.prod.ts` - للإنتاج (Production)

### 2. HTTP Interceptors
- `src/app/interceptors/auth.interceptor.ts` - لإضافة Bearer Token تلقائياً
- `src/app/interceptors/error.interceptor.ts` - للتعامل مع الأخطاء مركزياً

## 🔧 الإعدادات

### عنوان API الحالي
```typescript
// Development
apiUrl: 'http://localhost:3000/api'

// Production (يحتاج تعديل)
apiUrl: 'https://your-production-api.com/api'
```

### Proxy Configuration
الملف `proxy.conf.json` مُعد لتحويل جميع طلبات `/api` إلى `http://localhost:3000`

## 📋 الخدمات المُحدّثة

جميع الخدمات التالية تستخدم الآن `environment.apiUrl`:

### خدمات الحرفيين
- ✅ `plumber.service.ts` → `/api/plumbers`
- ✅ `electrician.service.ts` → `/api/electricians`
- ✅ `carpenter.service.ts` → `/api/carpenters`
- ✅ `painter.service.ts` → `/api/painters`
- ✅ `ac-technician.service.ts` → `/api/ac-technicians`
- ✅ `aluminum-technician.service.ts` → `/api/aluminum-technicians`
- ✅ `gas-technician.service.ts` → `/api/gas-technicians`
- ✅ `device-repair.service.ts` → `/api/device-repair`

### خدمات أخرى
- ✅ `auth.service.ts` → `/api/auth`
- ✅ `craftsman-registration.service.ts` → `/api/craftsman/registration`
- ✅ `users.ts` → `/api/users`
- ✅ `crafts-service.ts` → `/api/crafts`
- ✅ `subscriptions.service.ts` → `/api/subscriptions`
- ✅ `reviews.service.ts` → `/api/craftsman/reviews`
- ✅ `reports.service.ts` → `/api/reports`

## 🚀 كيفية الاستخدام

### 1. تشغيل المشروع
```bash
npm start
# أو
ng serve
```

### 2. تغيير عنوان API
قم بتعديل الملف المناسب:

**للتطوير:**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://your-backend-url/api'
};
```

**للإنتاج:**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

### 3. البناء للإنتاج
```bash
ng build --configuration production
```

## 🔐 Authentication

### كيف يعمل؟
1. عند تسجيل الدخول، يتم حفظ الـ Token في `localStorage`
2. الـ `authInterceptor` يضيف الـ Token تلقائياً لكل request:
   ```
   Authorization: Bearer <token>
   ```
3. إذا كان الـ Token غير صالح (401)، يتم توجيه المستخدم لصفحة تسجيل الدخول

### مثال على تسجيل الدخول
```typescript
this.authService.login(credentials).subscribe({
  next: (response) => {
    // تم حفظ Token تلقائياً
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    console.error('خطأ في تسجيل الدخول:', error.message);
  }
});
```

## ⚠️ معالجة الأخطاء

الـ `errorInterceptor` يتعامل تلقائياً مع:
- **401** - غير مصرح (يتم تسجيل الخروج تلقائياً)
- **403** - ممنوع
- **404** - غير موجود
- **500** - خطأ في الخادم

### مثال
```typescript
this.plumberService.getPlumbers().subscribe({
  next: (plumbers) => console.log(plumbers),
  error: (error) => {
    // الرسالة مترجمة بالعربي من errorInterceptor
    console.error(error.message);
  }
});
```

## 📊 بنية API المتوقعة

### Response Format
معظم الخدمات تتوقع responses بهذا الشكل:

```typescript
// نجاح
{
  "success": true,
  "data": { /* ... */ },
  "message": "تمت العملية بنجاح"
}

// خطأ
{
  "success": false,
  "error": "رسالة الخطأ",
  "message": "حدث خطأ"
}
```

### Authentication Response
```typescript
{
  "token": "jwt-token-here",
  "user": {
    "id": "1",
    "fullName": "اسم المستخدم",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## 🛠️ API Endpoints المطلوبة

يجب أن يوفر الـ Backend الخاص بك هذه Endpoints:

### Authentication
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/logout` - تسجيل الخروج

### Plumbers (مثال)
- `GET /api/plumbers` - قائمة جميع السباكين
- `GET /api/plumbers/:id` - سباك واحد
- `POST /api/plumbers` - تسجيل سباك جديد
- `PUT /api/plumbers/:id` - تحديث سباك
- `DELETE /api/plumbers/:id` - حذف سباك
- `GET /api/plumbers/search?q=term` - البحث

*(نفس الشيء لباقي أنواع الحرفيين)*

### Craftsman Registration
- `POST /api/craftsman/registration/basic-info`
- `POST /api/craftsman/registration/upload-photo`
- `POST /api/craftsman/registration/profession-skills`
- `POST /api/craftsman/registration/service-areas`
- `POST /api/craftsman/registration/documents`
- `GET /api/craftsman/registration/check-email?email=...`
- `GET /api/craftsman/registration/check-phone?phone=...`

### Reports
- `POST /api/reports` - إرسال بلاغ
- `POST /api/reports/upload` - رفع ملف
- `GET /api/reports/types` - أنواع البلاغات
- `GET /api/reports/:id/status` - حالة البلاغ

### Subscriptions
- `GET /api/subscriptions/plans` - الباقات المتاحة
- `GET /api/subscriptions/current` - الباقة الحالية
- `POST /api/subscriptions/subscribe` - الاشتراك
- `POST /api/subscriptions/cancel` - إلغاء الاشتراك
- `POST /api/subscriptions/upgrade` - ترقية الباقة

### Reviews
- `GET /api/craftsman/reviews` - مراجعات الحرفي
- `GET /api/craftsman/reviews/summary` - ملخص التقييمات
- `GET /api/craftsman/reviews/performance` - الأداء
- `POST /api/craftsman/reviews/:id/reply` - الرد على مراجعة
- `DELETE /api/craftsman/reviews/:id/reply` - حذف الرد

## 🧪 الاختبار

### تشغيل الاختبارات
```bash
npm test
```

### اختبار API محلي
1. تأكد من تشغيل الـ Backend على `http://localhost:3000`
2. قم بتشغيل المشروع: `npm start`
3. افتح المتصفح على `http://localhost:4200`

## 📝 ملاحظات مهمة

1. **CORS**: تأكد من تفعيل CORS في الـ Backend الخاص بك
2. **JWT**: الـ Token يجب أن يكون JWT صالح
3. **Response Format**: التزم بالصيغة المتوقعة للـ responses
4. **Error Codes**: استخدم HTTP status codes بشكل صحيح (401, 403, 404, 500)

## 🔄 التحديثات المستقبلية

إذا أردت إضافة خدمة جديدة:

1. أنشئ Service جديد:
```typescript
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewService {
  private readonly apiUrl = `${environment.apiUrl}/new-endpoint`;
  
  constructor(private http: HttpClient) {}
  
  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
```

2. الـ Interceptors سيعملون تلقائياً!

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من Console في المتصفح
2. تحقق من Network Tab في Developer Tools
3. راجع أخطاء الـ Backend في logs

---

✅ **المشروع جاهز للربط بالـ API!**
