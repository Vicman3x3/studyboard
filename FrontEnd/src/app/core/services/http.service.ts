import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean };
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  post<T>(
    endpoint: string,
    payload: unknown,
    options?: HttpOptions
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, payload, options);
  }

  put<T>(
    endpoint: string,
    payload: unknown,
    options?: HttpOptions
  ): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, payload, options);
  }

  patch<T>(
    endpoint: string,
    payload: unknown,
    options?: HttpOptions
  ): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, payload, options);
  }

  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, options);
  }
}
