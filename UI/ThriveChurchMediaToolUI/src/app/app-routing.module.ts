import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSeriesComponent } from './components/create-series/create-series.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddMessageComponent } from './components/add-message/add-message.component';
import { EditSeriesComponent } from './components/edit-series/edit-series.component';
import { ViewSeriesComponent } from './components/view-series/view-series.component';
import { EditMessageComponent } from './components/edit-message/edit-message.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { AdminBackupComponent } from './components/admin-backup/admin-backup.component';
import { AdminConfigComponent } from './components/admin-config/admin-config.component';
import { AdminRssFeedComponent } from './components/admin-rss-feed/admin-rss-feed.component';
import { AuthGuard } from './guards/auth.guard';
import { EventsListComponent } from './components/events-list/events-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'create', component: CreateSeriesComponent, canActivate: [AuthGuard] },
  { path: 'admin/backup', component: AdminBackupComponent, canActivate: [AuthGuard] },
  { path: 'admin/config', component: AdminConfigComponent, canActivate: [AuthGuard] },
  { path: 'admin/rss-feed', component: AdminRssFeedComponent, canActivate: [AuthGuard] },
  // Events routes
  { path: 'events', component: EventsListComponent, canActivate: [AuthGuard] },
  { path: 'events/new', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'events/:id/edit', component: EventFormComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsComponent }, // Stats remain public
  { path: 'search', component: SearchComponent }, // Search remains public
  { path: 'add/:id', component: AddMessageComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EditSeriesComponent, canActivate: [AuthGuard] },
  { path: 'view/:seriesId/edit/:messageId', component: EditMessageComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: ViewSeriesComponent }, // View remains public
  { path: '', component: DashboardComponent }, // Home remains public
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

