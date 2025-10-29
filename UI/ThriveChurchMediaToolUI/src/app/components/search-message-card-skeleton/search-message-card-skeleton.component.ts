import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SkeletonThemeService } from '../../services/skeleton-theme.service';

@Component({
  selector: 'app-search-message-card-skeleton',
  templateUrl: './search-message-card-skeleton.component.html',
  styleUrls: ['./search-message-card-skeleton.component.scss'],
  standalone: false
})
export class SearchMessageCardSkeletonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  titleTheme$: Observable<any>;
  lineTheme$: Observable<any>;
  smallLineTheme$: Observable<any>;

  constructor(private skeletonThemeService: SkeletonThemeService) {}

  ngOnInit(): void {
    this.titleTheme$ = this.skeletonThemeService.getTitleTheme({
      'margin': '0'
    });

    this.lineTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '80%',
      'margin': '0'
    });

    this.smallLineTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '40%',
      'margin': '0'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

