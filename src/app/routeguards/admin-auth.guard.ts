import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';



export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return authService.userData$.pipe(
    map(userData => {
      if (userData && userData.roles.includes('ROLE_ADMIN')) {
        console.log('Admin auth guard: User is admin, access granted.');
        return true; // User is admin, allow access
      }
      else {
        alert('Access denied.');
        return false;
      }
    }),
  );

};
