import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService, Theme, ResolvedTheme } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentTheme: Theme = 'system';
  resolvedTheme: ResolvedTheme = 'light';
  
  constructor(
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

    this.themeService.resolvedTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(resolvedTheme => {
        this.resolvedTheme = resolvedTheme;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }



  /**
   * Get the tooltip text for the current theme
   */
  getTooltipText(): string {
    if (this.currentTheme === 'system') {
      return `System (${this.resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
    }
    return this.currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }

  /**
   * Get the next theme that will be applied on toggle
   */
  getNextThemeText(): string {
    return this.resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}
