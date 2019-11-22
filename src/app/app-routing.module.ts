import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'list', loadChildren: './list/list.module#ListPageModule' },
  { path: 'sensor-data', loadChildren: './sensor-data/sensor-data.module#SensorDataPageModule' },
  { path: 'device-data', loadChildren: './device-data/device-data.module#DeviceDataPageModule' },
  { path: 'historic-data', loadChildren: './historic-data/historic-data.module#HistoricDataPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
