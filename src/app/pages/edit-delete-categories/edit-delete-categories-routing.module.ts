import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDeleteCategoriesPage } from './edit-delete-categories.page';

const routes: Routes = [
  {
    path: '',
    component: EditDeleteCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDeleteCategoriesPageRoutingModule {}
