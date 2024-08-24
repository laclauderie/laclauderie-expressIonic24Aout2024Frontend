import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDeleteDetailsPageRoutingModule } from './edit-delete-details-routing.module';

import { EditDeleteDetailsPage } from './edit-delete-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDeleteDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDeleteDetailsPage]
})
export class EditDeleteDetailsPageModule {}
