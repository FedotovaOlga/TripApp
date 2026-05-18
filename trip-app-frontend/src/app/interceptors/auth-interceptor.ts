import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if (authService.user() && !req.url.endsWith('/auth/refresh')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.user()!.accessToken}`
      }
    });
  }
  return next(req).pipe(catchError(err => {
    if (err instanceof HttpErrorResponse &&
      err.status === 401 &&
      !req.url.endsWith('/auth/refresh')) {
    return authService.refresh().pipe(
      switchMap(_ => {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authService.user()!.accessToken}`
          }
        });
        return next(req);
      }),
      catchError(_ => {
        authService.logout();
        throw err;
      })
    );
  } else
    throw err;
  }));
};
