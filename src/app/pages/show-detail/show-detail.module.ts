import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowDetailPageRoutingModule } from './show-detail-routing.module';

import { ShowDetailPage } from './show-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowDetailPageRoutingModule
  ],
  declarations: [ShowDetailPage]
})
export class ShowDetailPageModule {}
