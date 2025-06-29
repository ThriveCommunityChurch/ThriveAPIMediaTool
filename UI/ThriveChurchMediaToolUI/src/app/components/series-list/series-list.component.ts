import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SermonSeries } from 'src/app/DTO/SermonSeries';
import { SermonSeriesSummary } from 'src/app/DTO/SermonSeriesSummary';
import { ApiService } from 'src/app/services/api-service.service';


@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.scss']
})
export class SeriesListComponent implements OnInit {

  apiService: ApiService;
  summaries: SermonSeriesSummary[] = [];
  isContentLoaded: Boolean = false;

  constructor(
    apiService: ApiService,
    private _router: Router,
    ) 
  { 
    this.apiService = apiService;
  }

  ngOnInit(): void {

    this.apiService.getSummaries()
    // clone the data object, using its known Config shape
    .subscribe(resp => {
      // display its headers

      if (resp.body && resp.body.Summaries) 
      {
        resp.body.Summaries.forEach(summary => {
          this.summaries.push(summary);
        });
        this.isContentLoaded = true;
      }
    });
  }

}
