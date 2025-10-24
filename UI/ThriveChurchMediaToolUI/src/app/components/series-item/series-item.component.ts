import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SermonSeriesSummary } from 'src/app/DTO/SermonSeriesSummary';
import { SeriesDataService } from 'src/app/services/series-data-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast-service.service';

@Component({
    selector: 'app-series-item',
    templateUrl: './series-item.component.html',
    styleUrls: ['./series-item.component.scss'],
    standalone: false
})
export class SeriesItemComponent implements OnInit {

  @Input() summary: SermonSeriesSummary;
  localizedLastUpdated: string;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private _router: Router,
    private _seriesDataService: SeriesDataService,
    private authService: AuthenticationService,
    private toastService: ToastService
    )
  {
    this.isAuthenticated$ = this.authService.authState$.pipe(
      map(authState => authState.isAuthenticated)
    );
  }

  ngOnInit(): void {

    if (this.summary) {
      this.localizedLastUpdated = moment(Date.parse(this.summary.LastUpdated)).tz('UTC').fromNow();
    }
  }

  setSeriesDataForNavigation() {
    this._seriesDataService.add(this.summary);
  }

  onAddClick(event: Event): void {
    event.preventDefault();

    if (!this.authService.isAuthenticated()) {
      this.toastService.showError('You must be logged in to add messages.');
      this._router.navigate(['/login'], { queryParams: { returnUrl: `/add/${this.summary.Id}` } });
      return;
    }

    this._router.navigate(['/add', this.summary.Id]);
  }

  onEditClick(event: Event): void {
    event.preventDefault();

    if (!this.authService.isAuthenticated()) {
      this.toastService.showError('You must be logged in to edit series.');
      this._router.navigate(['/login'], { queryParams: { returnUrl: `/edit/${this.summary.Id}` } });
      return;
    }

    this._router.navigate(['/edit', this.summary.Id]);
  }

}
