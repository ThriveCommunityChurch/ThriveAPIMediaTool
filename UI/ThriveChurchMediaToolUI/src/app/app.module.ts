import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApiService } from './services/api-service.service';
import { SeriesListComponent } from './components/series-list/series-list.component';
import { CreateSeriesComponent } from './components/create-series/create-series.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EditSeriesComponent } from './components/edit-series/edit-series.component';
import { SeriesItemComponent } from './components/series-item/series-item.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SeriesListComponent,
    CreateSeriesComponent,
    PageNotFoundComponent,
    EditSeriesComponent,
    SeriesItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],  
  providers: [
    ApiService,
    SeriesListComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
