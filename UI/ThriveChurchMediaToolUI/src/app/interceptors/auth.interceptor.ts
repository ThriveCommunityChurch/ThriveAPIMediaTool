import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add auth header for requests to our API
    if (this.isApiRequest(request)) {
      request = this.addAuthHeader(request);
    }

    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private isApiRequest(request: HttpRequest<any>): boolean {
    return request.url.startsWith(environment.apiURL);
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    
    if (token && this.shouldAddAuthHeader(request)) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return request;
  }

  private shouldAddAuthHeader(request: HttpRequest<any>): boolean {
    // Don't add auth header to login, refresh, or public endpoints
    const publicEndpoints = [
      '/api/authentication/login',
      '/api/authentication/refresh',
      '/api/sermons',
      '/api/sermons/paged',
      '/api/sermons/series/',
      '/api/sermons/live',
      '/api/sermons/stats',
      '/api/config',
      '/api/passages'
    ];

    // Check if this is a GET request to a public endpoint
    if (request.method === 'GET') {
      return !publicEndpoints.some(endpoint => 
        request.url.includes(endpoint) && 
        (endpoint === '/api/sermons' || 
         endpoint === '/api/sermons/paged' || 
         endpoint === '/api/sermons/live' || 
         endpoint === '/api/sermons/stats' || 
         endpoint === '/api/config' || 
         endpoint === '/api/passages' ||
         (endpoint === '/api/sermons/series/' && this.isGetSeriesRequest(request.url)))
      );
    }

    // For non-GET requests, add auth header unless it's a login/refresh request
    return !publicEndpoints.some(endpoint => 
      request.url.includes(endpoint) && 
      (endpoint === '/api/authentication/login' || endpoint === '/api/authentication/refresh')
    );
  }

  private isGetSeriesRequest(url: string): boolean {
    // Check if this is a GET request for a specific series (e.g., /api/sermons/series/{id})
    const seriesPattern = /\/api\/sermons\/series\/[^\/]+$/;
    return seriesPattern.test(url);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokenResponse: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokenResponse.Token);
          
          // Retry the original request with new token
          return next.handle(this.addAuthHeader(request));
        }),
        catchError((error) => {
          this.isRefreshing = false;
                    
          // Clear auth data and redirect
          this.authService.logout().subscribe();
          
          return throwError(error);
        })
      );
    } else {
      // If we're already refreshing, wait for the new token
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(() => next.handle(this.addAuthHeader(request)))
      );
    }
  }
}
