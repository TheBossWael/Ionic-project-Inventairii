import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Use the signal to check user (auto-updates when Firebase restores session)
  const user = auth.user(); // signal

  if (user) {
    return router.createUrlTree(['/tabs/home']); // redirect if already logged in
  }

  return true; // not logged in → allow access
};




//Guard ye5dmch lezm nsala7 zokomouu
