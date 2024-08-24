import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitiesVillesPage } from './activities-villes.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesVillesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesVillesPageRoutingModule {}
