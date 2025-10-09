import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { SermonMessage } from 'src/app/DTO/SermonMessage';
import { SermonSeries } from 'src/app/DTO/SermonSeries';
import { ApiService } from 'src/app/services/api-service.service';
import { SeriesDataService } from 'src/app/services/series-data-service';
import { SkeletonThemeService } from '../../services/skeleton-theme.service';

@Component({
    selector: 'app-view-series',
    templateUrl: './view-series.component.html',
    styleUrls: ['./view-series.component.scss'],
    standalone: false
})
export class ViewSeriesComponent implements OnInit, OnDestroy {

  seriesId: string | null = null;
  seriesName: string = "N/A";
  sermonSeries: SermonSeries | undefined;

  messages: SermonMessage[] = [];
  private summariesSubscription: Subscription | undefined;

  totalDuration: number = 0;
  totalFileSize: number = 0;
  messageCount: number = 5;
  errorsOccurred: Boolean = false;
  isContentLoaded: Boolean = false;

  // Skeleton themes
  imageTheme$: Observable<any>;
  titleTheme$: Observable<any>;
  subtitleTheme$: Observable<any>;
  detailTheme$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private apiService: ApiService,
    private _seriesDataService: SeriesDataService,
    private skeletonThemeService: SkeletonThemeService
  ) { }

  ngOnInit(): void {
    // Initialize skeleton themes
    this.imageTheme$ = this.skeletonThemeService.getBaseTheme({
      'height': '190px',
      'width': 'auto',
      'border-radius': '10px',
      'aspect-ratio': '16/9',
      'margin': '0',
      'display': 'flex'
    });

    this.titleTheme$ = this.skeletonThemeService.getTitleTheme({
      'width': '100%'
    });

    this.subtitleTheme$ = this.skeletonThemeService.getLineTheme({
      'width': '75%'
    });

    this.detailTheme$ = this.skeletonThemeService.getLineTheme();

    this.seriesId = this.route.snapshot.paramMap.get('id');
      
    if (this.seriesId) {
      this.summariesSubscription = this.apiService.getSeries(this.seriesId)
      // clone the data object, using its known Config shape
      .subscribe(resp => {
        // display its headers

        if (resp.status > 200) {
          this.errorsOccurred = true;
          this.isContentLoaded = true;
        }
        else if (resp.body) {
          this.sermonSeries = resp.body;

          this.messages = this.sermonSeries.Messages.reverse();

          this.totalDuration = this.sermonSeries.Messages.reduce((sum, current) => {
            if (!current.AudioDuration) {
              return sum 
            }
            return sum + current.AudioDuration;
          }, 0);

          this.totalFileSize = this.sermonSeries.Messages.reduce((sum, current) => {
            if (!current.AudioFileSize) {
              return sum 
            }
            return sum + current.AudioFileSize;
          }, 0);

          this.isContentLoaded = true;
        }
      },
      error => {
        this.errorsOccurred = true;
        this.isContentLoaded = true;
      });
    }
  }

  ngOnDestroy() {
    if (this.summariesSubscription) {
      this.summariesSubscription.unsubscribe();
    }
  }

}
