import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCommercesPage } from './create-commerces.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCommercesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCommercesPageRoutingModule {}
