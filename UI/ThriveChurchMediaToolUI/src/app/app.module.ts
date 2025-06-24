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
import { AddMessageComponent } from './components/add-message/add-message.component';
import { ViewSeriesComponent } from './components/view-series/view-series.component';
import { EditMessageComponent } from './components/edit-message/edit-message.component';
import { SeriesItemComponent } from './components/series-item/series-item.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { StatsComponent } from './components/stats/stats.component';
import { DurationPipe } from './pipes/DurationPipe';
import { PluralityPipe } from './pipes/PluralityPipe';
import { FileSizePipe } from './pipes/FileSizePipe';
import { MessageSummaryComponent } from './components/message-summary/message-summary.component';
import { ToastMessageComponent } from './components/toast-message/toast-message.component';
import { ToastService } from './services/toast-service.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SeriesItemSkeletonComponent } from './components/series-item-skeleton/series-item-skeleton.component';
import { SeriesDataService } from './services/series-data-service';
import { MessageSummarySkeletonComponent } from './components/message-summary-skeleton/message-summary-skeleton.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ThemeService } from './services/theme.service';
import { SkeletonThemeService } from './services/skeleton-theme.service';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SeriesListComponent,
    CreateSeriesComponent,
    PageNotFoundComponent,
    EditSeriesComponent,
    AddMessageComponent,
    ViewSeriesComponent,
    EditMessageComponent,
    SeriesItemComponent,
    ItemFormComponent,
    StatsComponent,
    DurationPipe,
    PluralityPipe,
    FileSizePipe,
    MessageSummaryComponent,
    ToastMessageComponent,
    SeriesItemSkeletonComponent,
    MessageSummarySkeletonComponent,
    ThemeToggleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSkeletonLoaderModule
  ],
  providers: [
    ApiService,
    SeriesListComponent,
    ToastService,
    SeriesDataService,
    ThemeService,
    SkeletonThemeService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
