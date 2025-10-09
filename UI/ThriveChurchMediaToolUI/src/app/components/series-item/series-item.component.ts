import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment-timezone';
import { SermonSeriesSummary } from 'src/app/DTO/SermonSeriesSummary';
import { SeriesDataService } from 'src/app/services/series-data-service';

@Component({
    selector: 'app-series-item',
    templateUrl: './series-item.component.html',
    styleUrls: ['./series-item.component.scss'],
    standalone: false
})
export class SeriesItemComponent implements OnInit {

  @Input() summary: SermonSeriesSummary;
  localizedLastUpdated: string;

  

  constructor(
    private _router: Router,
    private _seriesDataService: SeriesDataService
    ) 
  { 

  }

  ngOnInit(): void {

    if (this.summary) {
      this.localizedLastUpdated = moment(Date.parse(this.summary.LastUpdated)).tz('UTC').fromNow();
    }
  }

  setSeriesDataForNavigation() {
    this._seriesDataService.add(this.summary);
  }

}
