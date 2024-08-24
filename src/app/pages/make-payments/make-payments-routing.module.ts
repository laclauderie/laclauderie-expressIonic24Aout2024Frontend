import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakePaymentsPage } from './make-payments.page';

const routes: Routes = [
  {
    path: '',
    component: MakePaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakePaymentsPageRoutingModule {}
