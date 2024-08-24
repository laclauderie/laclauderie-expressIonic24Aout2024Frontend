import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowProductDetailsPage } from './show-product-details.page';

const routes: Routes = [
  {
    path: '',
    component: ShowProductDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowProductDetailsPageRoutingModule {}
