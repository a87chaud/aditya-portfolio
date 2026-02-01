import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginDto {
  email: string;
  password: string;
}
export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}
  private BASE_URL = 'http://localhost:3000/auth';

  login(creds: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/login`, creds).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.access_token);
      }),
    );
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // SSR: no token
    }
    return localStorage.getItem('access_token');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
    }
  }
}
