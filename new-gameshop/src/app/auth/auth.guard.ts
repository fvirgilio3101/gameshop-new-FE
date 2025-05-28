import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return auth.checkAuth().pipe(
    map(loggedIn => {
      if (!loggedIn) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUserDetails().pipe(
    map(user => {
      if (user?.role === 'ROLE_ADMIN') {
        return true;
      } else {
        router.navigate(['/home']);
        return false;
      }
    })
  );
};
