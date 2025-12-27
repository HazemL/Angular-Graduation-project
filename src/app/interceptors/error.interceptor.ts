import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'حدث خطأ غير متوقع';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `خطأ: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            errorMessage = 'غير مصرح لك بالوصول. يرجى تسجيل الدخول';
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'ليس لديك صلاحية للوصول لهذا المورد';
            break;
          case 404:
            errorMessage = 'المورد المطلوب غير موجود';
            break;
          case 500:
            errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً';
            break;
          default:
            errorMessage = error.error?.message || `خطأ في الخادم: ${error.status}`;
        }
      }
      
      console.error('HTTP Error:', error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
