import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser(); // signal تحتوي على معلومات المستخدم

  if (!user) {
    // إذا المستخدم غير مسجل دخول → تحويل للـ login
    router.navigate(['/login']);
    return false;
  }

  // التحقق من الصلاحيات إذا Route محدد فيها role
  const requiredRole = route.data?.['role'] as string | undefined;
  if (requiredRole && user.role !== requiredRole) {
    // ليس له الصلاحية → تحويل للصفحة الرئيسية
    router.navigate(['/']);
    return false;
  }

  return true; // مسموح بالدخول
};
