import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    access_token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    constructor(private http: HttpClient){}
    private BASE_URL = 'http://localhost:3000/auth'; 

    login(creds: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.BASE_URL}/login`, creds).pipe(tap(res => {
            console.log('token: ', res.access_token);
            localStorage.setItem('auth_token', res.access_token);
        }))
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    logout(): void {
        localStorage.removeItem('auth_token');
    }
}