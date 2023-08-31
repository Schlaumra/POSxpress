import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Role } from '@px/interface';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const contextRoles: Role[] | undefined = route.data['roles'] || undefined;

  if (!authService.isLoggedIn()) {
    return inject(Router).createUrlTree(['login'], {
      queryParams: { redirectTo: state.url },
    });
  }
  const roles = authService.getRoles();
  if (roles.includes('admin')) {
    return true;
  }

  if (roles.some((role) => contextRoles?.includes(role) || false)) {
    return true;
  }
  return false;
};
