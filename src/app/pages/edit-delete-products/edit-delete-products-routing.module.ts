import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDeleteProductsPage } from './edit-delete-products.page';

const routes: Routes = [
  {
    path: '',
    component: EditDeleteProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDeleteProductsPageRoutingModule {}
