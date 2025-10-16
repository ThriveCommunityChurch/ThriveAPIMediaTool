import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ThriveChurchMediaToolUI';
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

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
}
