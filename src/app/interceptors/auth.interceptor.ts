import { HttpInterceptorFn } from '@angular/common/http';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token'); // استخدم localStorage

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

