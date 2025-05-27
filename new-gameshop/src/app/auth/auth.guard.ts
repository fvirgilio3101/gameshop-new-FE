import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

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
