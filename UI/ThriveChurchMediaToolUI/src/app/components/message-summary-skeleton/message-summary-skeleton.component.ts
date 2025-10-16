import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SkeletonThemeService } from '../../services/skeleton-theme.service';

@Component({
    selector: 'app-message-summary-skeleton',
    templateUrl: './message-summary-skeleton.component.html',
    styleUrls: ['./message-summary-skeleton.component.scss'],
    standalone: false
})
export class MessageSummarySkeletonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  titleTheme$: Observable<any>;
  smallTheme$: Observable<any>;
  fullWidthTheme$: Observable<any>;
  mediumTheme$: Observable<any>;
  largeTheme$: Observable<any>;

  constructor(private skeletonThemeService: SkeletonThemeService) {}

  ngOnInit(): void {
    this.titleTheme$ = this.skeletonThemeService.getTitleTheme({
      'width': '95%',
      'margin': '0'
    });

    this.smallTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '30%'
    });

    this.fullWidthTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '100%'
    });

    this.mediumTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '50%'
    });

    this.largeTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '60%'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
