import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';

import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';

export const roleGuard:  CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$. pipe(
    take(1),
    map(user => {
      const requiredRole = route.data['role'];
      if (!user) {
        console.log('Role Guard: No user found');
        router.navigate(['/login']);
        return false;
      }

      if (!requiredRole) {
        return true;
      }

      const hasRole = user.role === requiredRole;

      if (!hasRole) {
        console.log(`Role Guard: User role '${user.role}' does not match required role '${requiredRole}'`);
                switch (user.role) {
          case 'ADMIN':
            router.navigate(['/admin/dashboard']);
            break;
          case 'RM':
            router.navigate(['/rm/dashboard']);
            break;
          case 'ANALYST': 
            router.navigate(['/analyst/dashboard']);
            break;
          default:
            router.navigate(['/login']);
        }
        return false;
      }

      console.log(`Role Guard: Access granted for role '${user.role}'`);
      return true;
    })
  );
};