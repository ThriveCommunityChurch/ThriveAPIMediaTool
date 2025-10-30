import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SkeletonThemeService } from '../../services/skeleton-theme.service';

@Component({
  selector: 'app-search-series-card-skeleton',
  templateUrl: './search-series-card-skeleton.component.html',
  styleUrls: ['./search-series-card-skeleton.component.scss'],
  standalone: false
})
export class SearchSeriesCardSkeletonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  imageTheme$: Observable<any>;
  titleTheme$: Observable<any>;
  lineTheme$: Observable<any>;
  smallLineTheme$: Observable<any>;

  constructor(private skeletonThemeService: SkeletonThemeService) {}

  ngOnInit(): void {
    this.imageTheme$ = this.skeletonThemeService.getBaseTheme({
      'height': '255px',
      'width': '100%'
    });

    this.titleTheme$ = this.skeletonThemeService.getTitleTheme({
      'margin': '0'
    });

    this.lineTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '100%',
      'margin': '0'
    });

    this.smallLineTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '60%',
      'margin': '0'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

