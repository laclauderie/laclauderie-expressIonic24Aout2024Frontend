import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCategoriesPageRoutingModule } from './create-categories-routing.module';

import { CreateCategoriesPage } from './create-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCategoriesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateCategoriesPage]
})
export class CreateCategoriesPageModule {}
