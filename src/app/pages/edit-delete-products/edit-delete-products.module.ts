import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDeleteProductsPageRoutingModule } from './edit-delete-products-routing.module';

import { EditDeleteProductsPage } from './edit-delete-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDeleteProductsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDeleteProductsPage]
})
export class EditDeleteProductsPageModule {}
