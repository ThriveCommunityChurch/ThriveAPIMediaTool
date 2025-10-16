import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SkeletonThemeService } from '../../services/skeleton-theme.service';

@Component({
    selector: 'app-series-item-skeleton',
    templateUrl: './series-item-skeleton.component.html',
    styleUrls: ['./series-item-skeleton.component.scss'],
    standalone: false
})
export class SeriesItemSkeletonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cardImageTheme$: Observable<any>;
  titleTheme$: Observable<any>;
  subtitleTheme$: Observable<any>;
  dateTheme$: Observable<any>;
  footerTheme$: Observable<any>;

  constructor(private skeletonThemeService: SkeletonThemeService) {}

  ngOnInit(): void {
    this.cardImageTheme$ = this.skeletonThemeService.getCardImageTheme();

    this.titleTheme$ = this.skeletonThemeService.getTitleTheme({
      'margin': '0'
    });

    this.subtitleTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '80%',
      'margin': '0'
    });

    this.dateTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '33%'
    });

    this.footerTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '40%',
      'margin': '0',
      'vertical-align': 'middle'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
