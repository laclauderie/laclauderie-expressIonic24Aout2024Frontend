import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateProductsPage } from './create-products.page';

const routes: Routes = [
  {
    path: '',
    component: CreateProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateProductsPageRoutingModule {}
