import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast-service.service';
import { ThemeService } from '../../services/theme.service';
import { LoginRequest } from '../../DTO/LoginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
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
      next: () => {
        this.isLoading = false;
        // Redirect to the intended page or home
        const returnUrl = this.getReturnUrl();
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;

        let errorMessage = 'Login failed. Please try again.';

        // Check if error is a string (from service validation)
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.status !== undefined) {
          // HTTP error response
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
                errorMessage = 'Login failed. Please try again or contact your administrator.';
              }
          }
        } else if (error.message) {
          // Error object with message property
          errorMessage = error.message;
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
}
