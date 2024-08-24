import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth-response.model'; // Adjust the import path if necessary

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrlUsers;
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      email,
      password,
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            // Store token securely (e.g., local storage)
            localStorage.setItem(this.tokenKey, response.token);
          }
        })
      );
  }

  // UserService
  verifyEmail(token: string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/verify/${token}`).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('accessToken', response.token);
        }
      })
    );
  }

  requestPasswordReset(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/request-password-reset`,
      { email }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/reset-password/${token}`,
      { newPassword }
    );
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-password-reset`, { email });
  }
}
