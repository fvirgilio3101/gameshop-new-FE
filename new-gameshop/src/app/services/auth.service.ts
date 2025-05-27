import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private _isLoggedIn$ = new BehaviorSubject<boolean>(
    sessionStorage.getItem('isLoggedIn') === 'true'
  );

  isLoggedIn$ = this._isLoggedIn$.asObservable();

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return this.http.post('http://localhost:8082/it.ecubit.gameshop/login', body, {
      headers,
      withCredentials: true,
      responseType: 'text',
    }).pipe(
      tap(() => {
        sessionStorage.setItem('isLoggedIn', 'true');
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userID');
    this._isLoggedIn$.next(false);
  }

  register(user: any) {
    return this.http.post(
      'http://localhost:8082/it.ecubit.gameshop/api/user/register',
      user,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
      }
    );
  }

  getUserDetails() {
    return this.http.get<User>('http://localhost:8082/it.ecubit.gameshop/api/user/me', {
      withCredentials: true
    });
  }

  checkAuth() {
    return this.http.get('/api/auth/check', { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
