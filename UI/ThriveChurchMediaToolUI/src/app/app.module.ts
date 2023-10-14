import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApiService } from './services/api-service.service';
import { SeriesListComponent } from './components/series-list/series-list.component';
import { CreateSeriesComponent } from './components/create-series/create-series.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EditSeriesComponent } from './components/edit-series/edit-series.component';
import { ViewSeriesComponent } from './components/view-series/view-series.component';
import { SeriesItemComponent } from './components/series-item/series-item.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { StatsComponent } from './components/stats/stats.component';
import { DurationPipe } from './pipes/DurationPipe';
import { PluralityPipe } from './pipes/PluralityPipe';
import { FileSizePipe } from './pipes/FileSizePipe';
import { MessageSummaryComponent } from './components/message-summary/message-summary.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { ToastService } from './services/toast-service.service';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SeriesListComponent,
    CreateSeriesComponent,
    PageNotFoundComponent,
    EditSeriesComponent,
    ViewSeriesComponent,
    SeriesItemComponent,
    ItemFormComponent,
    StatsComponent,
    DurationPipe,
    PluralityPipe,
    FileSizePipe,
    MessageSummaryComponent,
    ToastMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],  
  providers: [
    ApiService,
    SeriesListComponent,
    ToastService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
