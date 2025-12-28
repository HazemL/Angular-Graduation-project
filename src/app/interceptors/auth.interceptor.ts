import { HttpInterceptorFn } from '@angular/common/http';

function getTokenFromCookie(): string | null {
  const match = document.cookie.match('(^|;)\\s*auth_token\\s*=\\s*([^;]+)');
  return match ? decodeURIComponent(match[2]) : null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getTokenFromCookie();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
