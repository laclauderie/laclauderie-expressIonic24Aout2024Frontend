import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDeleteBusinessOwnerPage } from './edit-delete-business-owner.page';

const routes: Routes = [
  {
    path: '',
    component: EditDeleteBusinessOwnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDeleteBusinessOwnerPageRoutingModule {}
