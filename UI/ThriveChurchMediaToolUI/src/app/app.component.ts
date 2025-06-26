import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { AuthenticationService } from './services/authentication.service';
import { ToastService } from './services/toast-service.service';
import { AuthenticationState } from './Domain/AuthenticationState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ThriveChurchMediaToolUI';
  private destroy$ = new Subject<void>();

  authState$: Observable<AuthenticationState>;
  isLoggingOut = false;

  constructor(
    private themeService: ThemeService,
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.authState$ = this.authService.authState$;
  }

  ngOnInit(): void {
    // Subscribe to theme changes and apply them to the document
    this.themeService.resolvedTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        // Remove existing theme classes
        document.documentElement.classList.remove('light-theme', 'dark-theme');

        // Add the current theme class
        document.documentElement.classList.add(`${theme}-theme`);

        // Set data attribute for CSS targeting
        document.documentElement.setAttribute('data-theme', theme);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    if (this.isLoggingOut) return;

    this.isLoggingOut = true;

    this.authService.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
        this.toastService.showSuccess('Logged out successfully');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoggingOut = false;
        console.error('Logout error:', error);
        // Even if logout fails on server, we've cleared local data
        this.toastService.showSuccess('Logged out successfully');
        this.router.navigate(['/']);
      }
    });
  }

  getUserDisplayName(authState: AuthenticationState): string {
    if (!authState.user) return '';
    return authState.user.Username || authState.user.Email || 'User';
  }
}
