import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowDetailPage } from './show-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ShowDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowDetailPageRoutingModule {}
