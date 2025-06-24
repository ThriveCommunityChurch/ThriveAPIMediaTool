import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'thrive-theme-preference';
  private readonly themeSubject = new BehaviorSubject<Theme>('system');
  private readonly resolvedThemeSubject = new BehaviorSubject<ResolvedTheme>('light');

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  /**
   * Get the current theme preference (light, dark, or system)
   */
  get theme$(): Observable<Theme> {
    return this.themeSubject.asObservable();
  }

  /**
   * Get the resolved theme (light or dark - never system)
   */
  get resolvedTheme$(): Observable<ResolvedTheme> {
    return this.resolvedThemeSubject.asObservable();
  }

  /**
   * Get the current theme preference
   */
  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Get the current resolved theme
   */
  get currentResolvedTheme(): ResolvedTheme {
    return this.resolvedThemeSubject.value;
  }

  /**
   * Set the theme preference
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.saveThemePreference(theme);
    this.applyTheme(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentResolved = this.currentResolvedTheme;
    const newTheme: Theme = currentResolved === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = this.getSavedThemePreference();
    const initialTheme = savedTheme || 'system';
    this.themeSubject.next(initialTheme);
    this.applyTheme(initialTheme);
  }

  /**
   * Apply the theme to the document
   */
  private applyTheme(theme: Theme): void {
    const resolvedTheme = this.resolveTheme(theme);
    this.resolvedThemeSubject.next(resolvedTheme);
    
    // Remove existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add the resolved theme class
    document.documentElement.classList.add(`${resolvedTheme}-theme`);
    
    // Set data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }

  /**
   * Resolve system theme to light or dark
   */
  private resolveTheme(theme: Theme): ResolvedTheme {
    if (theme === 'system') {
      return this.getSystemTheme();
    }
    return theme;
  }

  /**
   * Get system theme preference
   */
  private getSystemTheme(): ResolvedTheme {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default fallback
  }

  /**
   * Setup listener for system theme changes
   */
  private setupSystemThemeListener(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only update if current theme is set to system
        if (this.currentTheme === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  /**
   * Save theme preference to localStorage
   */
  private saveThemePreference(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  /**
   * Get saved theme preference from localStorage
   */
  private getSavedThemePreference(): Theme | null {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.THEME_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    }
    return null;
  }

  /**
   * Check if dark theme is currently active
   */
  isDarkTheme(): boolean {
    return this.currentResolvedTheme === 'dark';
  }

  /**
   * Check if light theme is currently active
   */
  isLightTheme(): boolean {
    return this.currentResolvedTheme === 'light';
  }
}
