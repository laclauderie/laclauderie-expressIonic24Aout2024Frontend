import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDeleteCommercesPage } from './edit-delete-commerces.page';

const routes: Routes = [
  {
    path: '',
    component: EditDeleteCommercesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDeleteCommercesPageRoutingModule {}
