import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateProductsPageRoutingModule } from './create-products-routing.module';

import { CreateProductsPage } from './create-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateProductsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateProductsPage]
})
export class CreateProductsPageModule {}
