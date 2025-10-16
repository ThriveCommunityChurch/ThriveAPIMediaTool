import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ThemeService, ResolvedTheme } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class SkeletonThemeService {

  constructor(private themeService: ThemeService) {}

  /**
   * Get the base skeleton theme object that responds to theme changes
   */
  getBaseTheme(customProperties: any = {}): Observable<any> {
    return this.themeService.resolvedTheme$.pipe(
      map(theme => this.createThemeObject(theme, customProperties))
    );
  }

  /**
   * Create a theme object based on the current theme
   */
  private createThemeObject(theme: ResolvedTheme, customProperties: any): any {
    const baseTheme = {
      'background-color': theme === 'dark' ? '#2d2d2d' : '#f2f2f2',
      'border-radius': '0.375rem',
      'cursor': 'default',
      ...customProperties
    };

    return baseTheme;
  }

  /**
   * Get a line skeleton theme
   */
  getLineTheme(customProperties: any = {}): Observable<any> {
    return this.getBaseTheme({
      'height': '1rem',
      ...customProperties
    });
  }

  /**
   * Get a card image skeleton theme
   */
  getCardImageTheme(customProperties: any = {}): Observable<any> {
    return this.getBaseTheme({
      'height': '190px',
      'width': '100%',
      'border-bottom-left-radius': '0px',
      'border-bottom-right-radius': '0px',
      ...customProperties
    });
  }

  /**
   * Get a form input skeleton theme
   */
  getFormInputTheme(customProperties: any = {}): Observable<any> {
    return this.getBaseTheme({
      'height': '58px',
      'width': '100%',
      ...customProperties
    });
  }

  /**
   * Get a button skeleton theme
   */
  getButtonTheme(customProperties: any = {}): Observable<any> {
    return this.getBaseTheme({
      'height': '38px',
      'width': '100%',
      ...customProperties
    });
  }

  /**
   * Get a title skeleton theme
   */
  getTitleTheme(customProperties: any = {}): Observable<any> {
    return this.getBaseTheme({
      'height': '24px',
      'width': '100%',
      ...customProperties
    });
  }
}
