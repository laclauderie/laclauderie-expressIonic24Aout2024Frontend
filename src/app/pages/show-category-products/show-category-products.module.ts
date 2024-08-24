import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowCategoryProductsPageRoutingModule } from './show-category-products-routing.module';

import { ShowCategoryProductsPage } from './show-category-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowCategoryProductsPageRoutingModule
  ],
  declarations: [ShowCategoryProductsPage]
})
export class ShowCategoryProductsPageModule {}
