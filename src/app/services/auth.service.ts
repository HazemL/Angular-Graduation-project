import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';


export interface User {
 userId: number;
  fullName: string;
  role: 'Admin' | 'Craftsman' | 'User';
  profileImageUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
    userId?: number;
    fullName: string;
    role: 'user' | 'craftsman' | 'admin';
    profileImageUrl?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  // Signal لمتابعة حالة تسجيل الدخول
  readonly currentUser = signal<User | null>(this.getUserFromStorage());
  readonly isAuthenticated = signal<boolean>(!!this.getToken());

  private readonly API_URL = `${environment.apiUrl}/api`;

  // تسجيل الدخول
  login(credentials: LoginRequest) {
    return this.http.post(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('auth_token', res.data.accessToken);
      })
    );
  }

  loadCurrentUser() {
    return this.http
      .get<{ success: boolean; data: User }>(`${this.API_URL}/auth/me`)
      .pipe(
        tap(res => {
          this.setUser(res.data);
          this.currentUser.set(res.data);
          this.isAuthenticated.set(true);
        }),
        map(res => res.data)
      );
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  private setUser(user: User) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const u = localStorage.getItem('auth_user');
    return u ? JSON.parse(u) : null;
  }

  private getToken() {
    return localStorage.getItem('auth_token');
  }
}
