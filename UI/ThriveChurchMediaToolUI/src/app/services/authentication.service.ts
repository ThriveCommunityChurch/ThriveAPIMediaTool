import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { LoginRequest } from '../DTO/LoginRequest';
import { LoginResponse } from '../DTO/LoginResponse';
import { RefreshTokenRequest } from '../DTO/RefreshTokenRequest';
import { User } from '../Domain/User';
import { AuthenticationState } from '../Domain/AuthenticationState';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl: string = environment.apiURL;
  private readonly TOKEN_KEY = 'thrive_auth_token';
  private readonly REFRESH_TOKEN_KEY = 'thrive_refresh_token';
  private readonly USER_KEY = 'thrive_user';
  private readonly TOKEN_EXPIRES_KEY = 'thrive_token_expires';

  // Use sessionStorage for more secure token storage (cleared when tab closes)
  private readonly storage = sessionStorage;

  private authStateSubject = new BehaviorSubject<AuthenticationState>(this.getInitialAuthState());
  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check token expiration on service initialization
    this.checkTokenExpiration();
  }

  private getInitialAuthState(): AuthenticationState {
    const token = this.storage.getItem(this.TOKEN_KEY);
    const refreshToken = this.storage.getItem(this.REFRESH_TOKEN_KEY);
    const userJson = this.storage.getItem(this.USER_KEY);
    const expiresAtString = this.storage.getItem(this.TOKEN_EXPIRES_KEY);

    if (token && refreshToken && userJson && expiresAtString) {
      const user: User = JSON.parse(userJson);
      const tokenExpiresAt = new Date(expiresAtString);
      
      // Check if token is still valid
      if (tokenExpiresAt > new Date()) {
        return {
          isAuthenticated: true,
          user,
          token,
          refreshToken,
          tokenExpiresAt
        };
      }
    }

    // Clear invalid/expired data
    this.clearAuthData();
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: null
    };
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/api/authentication/login`,
      request,
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<LoginResponse>) => {
        if (response.body) {
          this.setAuthData(response.body);
          return response.body;
        }
        throw new Error('Invalid response from server');
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/authentication/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
        this.updateAuthState();
      }),
      catchError(error => {
        // Even if logout fails on server, clear local data
        this.clearAuthData();
        this.updateAuthState();
        return throwError(error);
      })
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.storage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.clearAuthData();
      this.updateAuthState();
      return throwError('No refresh token available');
    }

    const request: RefreshTokenRequest = { RefreshToken: refreshToken };
    
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/api/authentication/refresh`,
      request,
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<LoginResponse>) => {
        if (response.body) {
          this.setAuthData(response.body);
          return response.body;
        }
        throw new Error('Invalid response from server');
      }),
      catchError(error => {
        this.clearAuthData();
        this.updateAuthState();
        return throwError(error);
      })
    );
  }

  private setAuthData(loginResponse: LoginResponse): void {
    // Validate tokens before storing
    if (!this.isValidTokenFormat(loginResponse.Token) || !this.isValidTokenFormat(loginResponse.RefreshToken)) {
      throw new Error('Invalid token format received from server');
    }

    // Decode JWT to get user information
    const user = this.decodeJwtToken(loginResponse.Token);
    const expiresAt = new Date(loginResponse.ExpiresAt);

    // Store in sessionStorage for better security (cleared when tab closes)
    this.storage.setItem(this.TOKEN_KEY, loginResponse.Token);
    this.storage.setItem(this.REFRESH_TOKEN_KEY, loginResponse.RefreshToken);
    this.storage.setItem(this.USER_KEY, JSON.stringify(user));
    this.storage.setItem(this.TOKEN_EXPIRES_KEY, expiresAt.toISOString());

    this.updateAuthState();
  }

  private clearAuthData(): void {
    this.storage.removeItem(this.TOKEN_KEY);
    this.storage.removeItem(this.REFRESH_TOKEN_KEY);
    this.storage.removeItem(this.USER_KEY);
    this.storage.removeItem(this.TOKEN_EXPIRES_KEY);
  }

  private updateAuthState(): void {
    const newState = this.getInitialAuthState();
    this.authStateSubject.next(newState);
  }

  private decodeJwtToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        Id: payload.userId || payload.sub,
        Username: payload.username,
        Email: payload.email,
        Roles: payload.roles || []
      };
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  private isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Check that each part is base64-like (contains valid characters)
    const base64Regex = /^[A-Za-z0-9_-]+$/;
    return parts.every(part => part.length > 0 && base64Regex.test(part));
  }

  private checkTokenExpiration(): void {
    const expiresAtString = this.storage.getItem(this.TOKEN_EXPIRES_KEY);
    if (expiresAtString) {
      const expiresAt = new Date(expiresAtString);
      const now = new Date();
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();

      // If token expires in less than 5 minutes, try to refresh
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        this.refreshToken().subscribe({
          next: () => {},
          error: () => {
            // Silent failure for background refresh
            this.clearAuthData();
            this.updateAuthState();
          }
        });
      } else if (timeUntilExpiry <= 0) {
        // Token has expired
        this.clearAuthData();
        this.updateAuthState();
      }
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  getToken(): string | null {
    const token = this.authStateSubject.value.token;

    // Additional security check: validate token format before returning
    if (token && !this.isValidTokenFormat(token)) {
      // Token format is invalid, clear auth data
      this.clearAuthData();
      this.updateAuthState();
      return null;
    }

    return token;
  }

  isTokenExpiringSoon(): boolean {
    const expiresAt = this.authStateSubject.value.tokenExpiresAt;
    if (!expiresAt) return false;
    
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    return timeUntilExpiry < 10 * 60 * 1000; // Less than 10 minutes
  }
}
