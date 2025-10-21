import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of, switchMap, tap, throwError, merge } from 'rxjs';

interface LoginResponse {
  access_token: string;
}

interface RegisterDto {
  email: string;
  password: string;
  username?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:3000/auth';
  private userSubject = new BehaviorSubject<any>(null);

  user$ = this.userSubject.asObservable();

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => localStorage.setItem('token', res.access_token)),
      switchMap(() => this.getProfile()),
      tap((user) => {
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      tap(() => this.router.navigate(['/dashboard'])),
      catchError((err) => {
        console.error('Login failed', err);
        return throwError(() => err);
      })
    );
  }

  getProfile() {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      tap((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }
      }),
      catchError(() => of(null))
    );
  }

  register(dto: RegisterDto) {
    return this.http.post(`${this.apiUrl}/register`, dto).pipe(
      switchMap(() => this.login(dto.email, dto.password))
    );
  }
  
  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  updateProfile(dto: { username: string; email: string }) {
    return this.http.patch('http://localhost:3000/auth/profile', dto);
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }
}
