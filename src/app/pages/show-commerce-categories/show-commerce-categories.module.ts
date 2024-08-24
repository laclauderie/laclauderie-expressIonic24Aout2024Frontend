import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowCommerceCategoriesPageRoutingModule } from './show-commerce-categories-routing.module';

import { ShowCommerceCategoriesPage } from './show-commerce-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowCommerceCategoriesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ShowCommerceCategoriesPage]
})
export class ShowCommerceCategoriesPageModule {}
