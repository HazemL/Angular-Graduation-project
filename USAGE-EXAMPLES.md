# مثال على استخدام الخدمات مع API

## مثال 1: تسجيل الدخول
```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({...})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  login(email: string, password: string) {
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('تم تسجيل الدخول بنجاح');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // الرسالة مترجمة تلقائياً من errorInterceptor
        alert(error.message);
      }
    });
  }
}
```

## مثال 2: جلب قائمة السباكين
```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { PlumberService } from './services/plumber.service';

@Component({...})
export class PlumberListComponent implements OnInit {
  private plumberService = inject(PlumberService);
  
  plumbers = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadPlumbers();
  }

  loadPlumbers() {
    this.loading.set(true);
    this.error.set(null);
    
    this.plumberService.getPlumbers().subscribe({
      next: (data) => {
        this.plumbers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  searchPlumbers(query: string) {
    this.plumberService.searchPlumbers(query).subscribe({
      next: (data) => this.plumbers.set(data),
      error: (err) => console.error(err.message)
    });
  }
}
```

## مثال 3: تسجيل حرفي جديد
```typescript
import { Component, inject } from '@angular/core';
import { CraftsmanRegistrationService } from './services/craftsman-registration.service';

@Component({...})
export class RegistrationComponent {
  private registrationService = inject(CraftsmanRegistrationService);

  submitBasicInfo(formData: any) {
    this.registrationService.submitBasicInfo(formData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('تم التسجيل بنجاح');
          // الانتقال للخطوة التالية
        }
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  uploadPhoto(file: File) {
    this.registrationService.uploadProfilePhoto(file).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('تم رفع الصورة:', response.data.photoUrl);
        }
      },
      error: (err) => console.error(err.message)
    });
  }
}
```

## مثال 4: التعامل مع Subscriptions
```typescript
import { Component, inject } from '@angular/core';
import { SubscriptionsService } from './services/subscriptions.service';

@Component({...})
export class PricingComponent {
  private subscriptionService = inject(SubscriptionsService);

  plans = signal<any[]>([]);
  currentSubscription = signal<any>(null);

  ngOnInit() {
    // جلب الباقات المتاحة
    this.subscriptionService.getPlans().subscribe({
      next: (response) => {
        if (response.success) {
          this.plans.set(response.data);
        }
      }
    });

    // جلب الباقة الحالية
    this.subscriptionService.getCurrentSubscription().subscribe({
      next: (response) => {
        if (response.success) {
          this.currentSubscription.set(response.data);
        }
      }
    });
  }

  subscribeToPlan(planId: string) {
    this.subscriptionService.subscribe(planId).subscribe({
      next: (response) => {
        if (response.success && response.data.checkoutUrl) {
          // توجيه المستخدم لصفحة الدفع
          window.location.href = response.data.checkoutUrl;
        }
      },
      error: (err) => alert(err.message)
    });
  }
}
```

## مثال 5: إرسال بلاغ
```typescript
import { Component, inject } from '@angular/core';
import { ReportsService } from './services/reports.service';

@Component({...})
export class ReportFormComponent {
  private reportsService = inject(ReportsService);

  submitReport(reportData: any) {
    this.reportsService.submitReport(reportData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('تم إرسال البلاغ:', response.data.reportId);
          alert('تم إرسال البلاغ بنجاح');
        }
      },
      error: (err) => alert(err.message)
    });
  }

  uploadFile(file: File) {
    this.reportsService.uploadEvidence(file).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('تم رفع الملف:', response.data.fileUrl);
        }
      },
      error: (err) => console.error(err.message)
    });
  }
}
```

## مثال 6: إدارة المراجعات (للحرفي)
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ReviewsService } from './services/reviews.service';

@Component({...})
export class ReviewsPageComponent implements OnInit {
  private reviewsService = inject(ReviewsService);

  reviews = signal<any[]>([]);
  summary = signal<any>(null);

  ngOnInit() {
    this.loadReviews();
    this.loadSummary();
  }

  loadReviews(page = 1) {
    this.reviewsService.getReviews(page).subscribe({
      next: (response) => {
        if (response.success) {
          this.reviews.set(response.data.reviews);
        }
      }
    });
  }

  loadSummary() {
    this.reviewsService.getRatingSummary().subscribe({
      next: (response) => {
        if (response.success) {
          this.summary.set(response.data);
        }
      }
    });
  }

  replyToReview(reviewId: string, content: string) {
    this.reviewsService.replyToReview(reviewId, content).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('تم الرد على المراجعة');
          this.loadReviews(); // إعادة تحميل
        }
      },
      error: (err) => alert(err.message)
    });
  }
}
```

## ملاحظات مهمة

### 1. الـ Token يُضاف تلقائياً
لا تحتاج لإضافة Authorization header يدوياً، الـ `authInterceptor` يقوم بذلك:
```typescript
// ❌ لا تفعل هذا
this.http.get(url, { 
  headers: { 'Authorization': `Bearer ${token}` } 
});

// ✅ افعل هذا فقط
this.http.get(url);
```

### 2. الأخطاء تُترجم تلقائياً
الـ `errorInterceptor` يحول أكواد الأخطاء لرسائل عربية:
```typescript
// في component
this.service.getData().subscribe({
  error: (err) => {
    // err.message سيكون بالعربي
    console.log(err.message); // "غير مصرح لك بالوصول"
  }
});
```

### 3. استخدم Signals للـ State Management
```typescript
// ✅ أفضل
loading = signal(false);
data = signal<any[]>([]);

loadData() {
  this.loading.set(true);
  this.service.getData().subscribe({
    next: (result) => {
      this.data.set(result);
      this.loading.set(false);
    }
  });
}

// في الـ template
@if (loading()) {
  <div>جاري التحميل...</div>
} @else {
  @for (item of data(); track item.id) {
    <div>{{ item.name }}</div>
  }
}
```

### 4. تغيير API URL
عدّل فقط في ملف واحد:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://your-new-api-url/api'  // ← هنا فقط
};
```

### 5. Testing
للاختبار بدون Backend حقيقي، يمكنك استخدام Mock Data:
```typescript
// في الخدمة
import { of, delay } from 'rxjs';

getData(): Observable<any[]> {
  // للاختبار فقط
  const mockData = [/* ... */];
  return of(mockData).pipe(delay(500));
  
  // للـ API الحقيقي
  // return this.http.get<any[]>(this.apiUrl);
}
```
