import { Component, OnInit } from '@angular/core';
import { CreateSermonSeriesRequest } from 'src/app/DTO/CreateSermonSeriesRequest';
import { SeriesListComponent } from '../series-list/series-list.component';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})
export class DashboardComponent implements OnInit {

  seriesList: SeriesListComponent;
  copyrightText: string = "";
  isCreatingSeries: boolean = false;
  newSeries$: CreateSermonSeriesRequest | null = null;
  mode: string = "";
  production: boolean = false;

  constructor(seriesList: SeriesListComponent) 
  { 
    this.seriesList = seriesList;
    this.production = environment.production;
    this.mode = !this.production ? "Developer" : "Prod";
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
