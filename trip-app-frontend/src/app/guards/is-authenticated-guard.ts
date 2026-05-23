import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).user() !== undefined ? true : inject(Router).createUrlTree(['/login']);
};
