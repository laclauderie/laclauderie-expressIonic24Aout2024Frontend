import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowCategoryProductsPage } from './show-category-products.page';

const routes: Routes = [
  {
    path: '',
    component: ShowCategoryProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowCategoryProductsPageRoutingModule {}
