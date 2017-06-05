/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard.component';
import { NotFound404Component } from './not-found404.component';
import { DemoFilteringComponent } from './demo-filtering/demo-filtering.component';

export const routes: Routes = [
  {path: '', component: DashboardComponent, pathMatch: 'full'},
  {path: 'filtering', component: DemoFilteringComponent},
  {path: 'geo', loadChildren: './demo-geo/index#DemoGeoModule'},
  {path: 'detailed-targeting', loadChildren: './demo-detailed-targeting/index#DemoDetailedTargetingModule'},
  {path: 'targeting', loadChildren: './demo-targeting/index#DemoTargetingModule'},
  {path: '**', component: NotFound404Component}
];
