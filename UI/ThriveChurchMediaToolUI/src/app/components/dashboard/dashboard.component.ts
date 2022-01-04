import { Component, OnInit } from '@angular/core';
import { CreateSermonSeriesRequest } from 'src/app/DTO/CreateSermonSeriesRequest';
import { SermonSeriesSummary } from 'src/app/DTO/SermonSeriesSummary';
import { ApiService } from 'src/app/services/api-service.service';
import { SeriesListComponent } from '../series-list/series-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  seriesList: SeriesListComponent;
  copyrightText: string = "";
  isCreatingSeries: boolean = false;
  newSeries$: CreateSermonSeriesRequest | null = null;

  constructor(seriesList: SeriesListComponent) 
  { 
    this.seriesList = seriesList;
  }

  ngOnInit(): void {
    var year = new Date().getUTCFullYear();
    this.copyrightText = `©${year} Thrive Community Church. All Rights Reserved.`;
  }

  closeEditModal(): void {
    this.isCreatingSeries = false;
  }

  createdSeriesEventHandler(): void {
    this.closeEditModal();
  }

}
