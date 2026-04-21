import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';

interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    departmentId: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'sis_access_token';
  private readonly userKey = 'sis_current_user';
  readonly currentUser = signal<LoginResponse['user'] | null>(null);

  constructor(private readonly http: HttpClient) {
    const rawUser = localStorage.getItem(this.userKey);
    if (rawUser) {
      this.currentUser.set(JSON.parse(rawUser));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/Auth/login', { username, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        this.currentUser.set(response.user);
      })
    );
  }

  me(): Observable<LoginResponse['user']> {
    return this.http.get<LoginResponse['user']>('/api/Auth/me');
  }

  restoreSession(): Observable<LoginResponse['user'] | null> {
    const token = this.getToken();
    if (!token) {
      this.currentUser.set(null);
      return of(null);
    }

    return this.me().pipe(
      tap((user) => {
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUser.set(user);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string {
    return this.currentUser()?.role?.trim().toLowerCase() ?? '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  canAccessAdmin(): boolean {
    const role = this.getRole();
    return role === 'admin' || role === 'staff';
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isStaff(): boolean {
    return this.getRole() === 'staff';
  }

  managementRoute(): string {
    return this.isAdmin() ? '/admin' : '/staff';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }
}
