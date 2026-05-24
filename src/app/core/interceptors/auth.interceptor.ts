import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let clonedReq = req;

  // Tự động chèn URL Backend Heroku khi chạy ở môi trường production (GitHub Pages, Vercel...)
  if (req.url.startsWith('/api') && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    const apiBaseUrl = 'https://qnu-student-ai-670d3158d184.herokuapp.com';
    clonedReq = req.clone({
      url: `${apiBaseUrl}${req.url}`
    });
  }

  if (!token) {
    return next(clonedReq);
  }

  return next(clonedReq.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
