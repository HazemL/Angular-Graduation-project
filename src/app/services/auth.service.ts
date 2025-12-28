import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap, of, throwError } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../model/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    
    private http = inject(HttpClient);

    // Signal to track login state
    readonly currentUser = signal<LoginResponse['user'] | null>(this.getUserFromStorage());
    readonly isAuthenticated = signal<boolean>(!!this.getToken());



    private readonly API_URL = `${environment.apiUrl}/api`;


    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
            tap(response => this.handleAuthSuccess(response))
        );
    }

    logout(): void {
        // remove cookie token
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Strict';
        // keep user info removal in localStorage
        localStorage.removeItem('auth_user');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
    }

    private handleAuthSuccess(response: LoginResponse): void {
        this.setToken(response.token);
        this.setUser(response.user);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
    }

    private setToken(token: string): void {
        const maxAge = 60 * 60 * 24 * 30; // 30 days
        const secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Strict${secure}`;
    }

    private getToken(): string | null {
        const match = document.cookie.match('(^|;)\\s*auth_token\\s*=\\s*([^;]+)');
        return match ? decodeURIComponent(match[2]) : null;
    }

    private setUser(user: LoginResponse['user']): void {
        localStorage.setItem('auth_user', JSON.stringify(user));
    }

   private getUserFromStorage(): LoginResponse['user'] | null {
  const userStr = localStorage.getItem('auth_user');

  if (!userStr || userStr === 'undefined' || userStr === 'null') {
    localStorage.removeItem('auth_user');
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
}


}


