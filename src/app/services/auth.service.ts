import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
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

    private readonly API_URL = environment.apiUrl;

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
            tap(response => this.handleAuthSuccess(response))
        );
    }

    logout(): void {
        localStorage.removeItem('auth_token');
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
        localStorage.setItem('auth_token', token);
    }

    private getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    private setUser(user: LoginResponse['user']): void {
        localStorage.setItem('auth_user', JSON.stringify(user));
    }

    private getUserFromStorage(): LoginResponse['user'] | null {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    }
}
