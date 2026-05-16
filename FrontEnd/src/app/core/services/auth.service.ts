import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly accessTokenSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    this.loadTokensFromStorage();
  }

  register(data: RegisterRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, data)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          console.error('Error en registro:', error);
          throw error;
        })
      );
  }

  login(data: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, data)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          console.error('Error en login:', error);
          throw error;
        })
      );
  }

  logout() {
    this.clearAuth();
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.http
      .post<{ data: { accessToken: string; refreshToken: string } }>(
        `${environment.apiUrl}/api/auth/refresh`,
        {}
      )
      .pipe(
        tap((response) => {
          this.setAccessToken(response.data.accessToken);
          this.setRefreshToken(response.data.refreshToken);
        }),
        catchError(() => {
          this.logout();
          return of(null);
        })
      );
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal() || localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private handleAuthSuccess(response: AuthResponse) {
    this.currentUserSignal.set(response.data.user);
    this.setAccessToken(response.data.accessToken);
    this.setRefreshToken(response.data.refreshToken);
  }

  private setAccessToken(token: string) {
    this.accessTokenSignal.set(token);
    localStorage.setItem('access_token', token);
  }

  private setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
  }

  private clearAuth() {
    this.currentUserSignal.set(null);
    this.accessTokenSignal.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private loadTokensFromStorage() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.accessTokenSignal.set(token);
      // TODO: Validar token o cargar user actual desde el backend
    }
  }
}
