import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSeriesComponent } from './components/create-series/create-series.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditSeriesComponent } from './components/edit-series/edit-series.component';
import { ViewSeriesComponent } from './components/view-series/view-series.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { StatsComponent } from './components/stats/stats.component';

const routes: Routes = [
  { path: 'create', component: CreateSeriesComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'edit/:id', component: EditSeriesComponent },
  { path: 'view/:id', component: ViewSeriesComponent },
  { path: '', component: DashboardComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

