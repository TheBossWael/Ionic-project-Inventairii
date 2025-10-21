import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Read current user from auth service.
  const currentUser = auth.currentUser; // or: auth.user();

  // If user is logged in, allow
  if (currentUser) {
    return true;
  }

  // if Not logged in than redirect to login and keep attempted url for later
  return router.createUrlTree(['/welcome']);
};
