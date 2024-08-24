import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDeleteCategoriesPageRoutingModule } from './edit-delete-categories-routing.module';

import { EditDeleteCategoriesPage } from './edit-delete-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDeleteCategoriesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDeleteCategoriesPage]
})
export class EditDeleteCategoriesPageModule {}
