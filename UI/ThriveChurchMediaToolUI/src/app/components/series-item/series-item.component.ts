import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { SermonSeriesSummary } from 'src/app/DTO/SermonSeriesSummary';
import { SeriesListComponent } from '../series-list/series-list.component';

@Component({
  selector: 'app-series-item',
  templateUrl: './series-item.component.html',
  styleUrls: ['./series-item.component.scss']
})
export class SeriesItemComponent implements OnInit {

  @Input() summary: SermonSeriesSummary | null = null;
  hyperlink: string = "";
  localizedStartDate: string;
  localizedEndDate: string;
  localizedLastUpdated: string;

  constructor(
    private _router: Router
    ) 
  { 
  }

  ngOnInit(): void {

    if (this.summary) {
      this.hyperlink = `/edit/${this.summary.Id}`;

      this.localizedStartDate = moment(Date.parse(this.summary.StartDate)).tz('UTC').format("LL");
      this.localizedLastUpdated = moment(Date.parse(this.summary.LastUpdated)).tz('UTC').fromNow();

      if (this.summary.EndDate) {
        this.localizedEndDate = moment(Date.parse(this.summary.EndDate)).tz('UTC').format("LL");
      }
    }
  }

}
