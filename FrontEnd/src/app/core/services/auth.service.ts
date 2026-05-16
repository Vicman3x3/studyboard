import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { HttpService } from './http.service';
import { API_ENDPOINTS } from '../config/api.endpoints';
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
  private readonly httpService = inject(HttpService);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<User | null>(null);
  private readonly accessTokenSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    this.loadTokensFromStorage();
  }

  register(data: RegisterRequest) {
    return this.httpService
      .post<AuthResponse>(API_ENDPOINTS.auth.register, data)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          console.error('Error en registro:', error);
          throw error;
        })
      );
  }

  login(data: LoginRequest) {
    return this.httpService
      .post<AuthResponse>(API_ENDPOINTS.auth.login, data)
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

    return this.httpService
      .post<{ data: { accessToken: string; refreshToken: string } }>(
        API_ENDPOINTS.auth.refresh,
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
