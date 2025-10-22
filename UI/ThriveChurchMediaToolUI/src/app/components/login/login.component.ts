import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast-service.service';
import { ThemeService } from '../../services/theme.service';
import { LoginRequest } from '../../DTO/LoginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginRequest: LoginRequest = {
    Username: '',
    Password: ''
  };

  isLoading = false;
  showPassword = false;
  loginError: string = '';
  resolvedTheme$: Observable<string>;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {
    this.resolvedTheme$ = this.themeService.resolvedTheme$;
  }

  ngOnInit(): void {
    // If user is already authenticated, redirect to home
    this.authService.authState$.subscribe(authState => {
      if (authState.isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    // Angular form validation now handles the validation
    this.isLoading = true;

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.showSuccess('Login successful!');
        
        // Redirect to the intended page or home
        const returnUrl = this.getReturnUrl();
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;

        let errorMessage = 'Login failed. Please try again.';

        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
            break;
          case 400:
            errorMessage = 'Invalid request. Please check your input and try again.';
            break;
          case 401:
            errorMessage = 'Invalid username or password.';
            break;
          case 403:
            errorMessage = 'Access forbidden. You do not have permission to access this resource.';
            break;
          case 404:
            errorMessage = 'Server error. Please try again later or contact your administrator.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later or contact your administrator.';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server is temporarily unavailable. Please try again later.';
            break;
          default:
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Login failed with error ${error.status}. Please try again or contact your administrator.`;
            }
        }

        this.toastService.showError(errorMessage);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }



  private getReturnUrl(): string {
    // Get the return URL from query parameters or default to home
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnUrl') || '/';
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
