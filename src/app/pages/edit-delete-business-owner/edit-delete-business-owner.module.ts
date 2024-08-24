import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDeleteBusinessOwnerPageRoutingModule } from './edit-delete-business-owner-routing.module';

import { EditDeleteBusinessOwnerPage } from './edit-delete-business-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDeleteBusinessOwnerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditDeleteBusinessOwnerPage]
})
export class EditDeleteBusinessOwnerPageModule {}
