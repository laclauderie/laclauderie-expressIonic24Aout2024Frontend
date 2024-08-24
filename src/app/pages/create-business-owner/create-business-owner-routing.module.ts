import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateBusinessOwnerPage } from './create-business-owner.page';

const routes: Routes = [
  {
    path: '',
    component: CreateBusinessOwnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateBusinessOwnerPageRoutingModule {}
