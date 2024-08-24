import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCategoriesPage } from './create-categories.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCategoriesPageRoutingModule {}
