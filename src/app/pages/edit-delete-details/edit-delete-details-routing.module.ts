import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDeleteDetailsPage } from './edit-delete-details.page';

const routes: Routes = [
  {
    path: '',
    component: EditDeleteDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDeleteDetailsPageRoutingModule {}
