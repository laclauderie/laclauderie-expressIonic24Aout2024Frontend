import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowProductDetailsPageRoutingModule } from './show-product-details-routing.module';

import { ShowProductDetailsPage } from './show-product-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowProductDetailsPageRoutingModule
  ],
  declarations: [ShowProductDetailsPage]
})
export class ShowProductDetailsPageModule {}
