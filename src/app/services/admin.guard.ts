import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data?.['roles'] as string[] | undefined;

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!authService.canAccessAdmin()) {
    return router.createUrlTree(['/home']);
  }

  const currentRole = authService.getRole();
  if (expectedRoles?.length && !expectedRoles.includes(currentRole)) {
    return router.createUrlTree([authService.managementRoute()]);
  }

  return true;
};
