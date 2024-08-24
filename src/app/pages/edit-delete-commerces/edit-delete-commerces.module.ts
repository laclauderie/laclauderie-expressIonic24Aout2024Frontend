import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDeleteCommercesPageRoutingModule } from './edit-delete-commerces-routing.module';

import { EditDeleteCommercesPage } from './edit-delete-commerces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDeleteCommercesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDeleteCommercesPage]
})
export class EditDeleteCommercesPageModule {}
