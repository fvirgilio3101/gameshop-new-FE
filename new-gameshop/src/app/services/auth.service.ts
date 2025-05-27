import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:8082/it.ecubit.gameshop/';

  isLoggedIn = signal<boolean>(false);

  login(username: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    return this.http.post(this.baseUrl +'login', body, {
      headers,
      withCredentials: true,
      responseType: 'text',
    });
  }

  logout() {
    this.http.get(this.baseUrl + '/logout', { withCredentials: true }).subscribe(() => {
      this._isLoggedIn.set(false);
    });
  }

  register(user: any) {
    return this.http.post(
      this.baseUrl + 'api/user/register',
      user,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
      }
    );
  }

  getUserDetails() {
    return this.http.get<User>(this.baseUrl + 'api/user/me', {
      withCredentials: true
    });
  }

  checkAuth() {
    return this.http.get(this.baseUrl + 'auth/check', { withCredentials: true })
  }
}
