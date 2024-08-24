import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenewPaymentsPage } from './renew-payments.page';

const routes: Routes = [
  {
    path: '',
    component: RenewPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenewPaymentsPageRoutingModule {}
