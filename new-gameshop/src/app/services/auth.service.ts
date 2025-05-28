import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);

  private readonly baseUrl = 'http://localhost:8082/it.ecubit.gameshop/';

  isLoggedIn = signal<boolean>(false);
  role = signal<string | null>(null);

  login(username: string, password: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post(this.baseUrl + 'login', body, {
      headers,
      withCredentials: true,
      responseType: 'text',
    }).pipe(
      tap(() => {
        this.isLoggedIn.set(true);
        this.userService.loadProfileImage();
      }),
      catchError(error => {
        this.isLoggedIn.set(false);
        return of(error);
      })
    );
  }

  logout() {
    this.http.get(this.baseUrl + 'logout', { withCredentials: true }).subscribe(() => {
      this.isLoggedIn.set(false);
      // Resetta immagine profilo
      const oldUrl = this.userService.profileImageUrl();
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      this.userService.profileImageUrl.set(null);
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
    })
      .pipe(
        tap(user => {
          this.role.set(user.role);
        }
      ),
      catchError(() => {
        this.role.set(null);
        return of(null);
        }
      )
    );
  }

  checkAuth() {
    return this.http.get(this.baseUrl + 'auth/check', { withCredentials: true }).pipe(
      map(() => true),
      tap(() => {
        this.isLoggedIn.set(true);
        this.userService.loadProfileImage();
        this.getUserDetails().subscribe();
      }),
      catchError(() => {
        this.isLoggedIn.set(false);
        return of(false);
      })
    );
  }
}
