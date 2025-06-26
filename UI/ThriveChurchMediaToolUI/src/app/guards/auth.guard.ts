import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { ToastService } from '../services/toast-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (authState.isAuthenticated) {
          // Check if token is expiring soon and warn user
          if (this.authService.isTokenExpiringSoon()) {
            this.toastService.showWarning('Your session will expire soon. Please save your work.');
          }
          return true;
        } else {
          // User is not authenticated, redirect to home page
          this.toastService.showError('You must be logged in to access this page.');
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
