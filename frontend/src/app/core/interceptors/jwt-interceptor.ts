import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('auth_token');
  

  if (req.url. includes('/auth/login')) {
    return next(req);
  }

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Request with token:', clonedRequest.url); // Debug log
    
    return next(clonedRequest);
  }

  return next(req);
};