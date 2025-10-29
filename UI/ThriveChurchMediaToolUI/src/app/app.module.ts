import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

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
import { SearchComponent } from './components/search/search.component';
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
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { SearchMessageCardComponent } from './components/search-message-card/search-message-card.component';
import { SearchSeriesCardComponent } from './components/search-series-card/search-series-card.component';
import { SearchSeriesCardSkeletonComponent } from './components/search-series-card-skeleton/search-series-card-skeleton.component';
import { SearchMessageCardSkeletonComponent } from './components/search-message-card-skeleton/search-message-card-skeleton.component';
import { AdminBackupComponent } from './components/admin-backup/admin-backup.component';
import { AdminConfigComponent } from './components/admin-config/admin-config.component';
import { ConfigService } from './services/config.service';


@NgModule({ declarations: [
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
        SearchComponent,
        DurationPipe,
        PluralityPipe,
        FileSizePipe,
        MessageSummaryComponent,
        ToastMessageComponent,
        SeriesItemSkeletonComponent,
        MessageSummarySkeletonComponent,
        ThemeToggleComponent,
        SearchMessageCardComponent,
        SearchSeriesCardComponent,
        SearchSeriesCardSkeletonComponent,
        SearchMessageCardSkeletonComponent,
        AdminBackupComponent,
        AdminConfigComponent
    ],
    bootstrap: [
        AppComponent
    ], 
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        FormsModule,
        NgxSkeletonLoaderModule,
        NgSelectModule
    ], 
    providers: [
        ApiService,
        ConfigService,
        SeriesListComponent,
        ToastService,
        SeriesDataService,
        ThemeService,
        SkeletonThemeService,
        provideHttpClient(withInterceptorsFromDi()),
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ] })
export class AppModule { }
