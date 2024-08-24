import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateBusinessOwnerPageRoutingModule } from './create-business-owner-routing.module';

import { CreateBusinessOwnerPage } from './create-business-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateBusinessOwnerPageRoutingModule
  ],
  declarations: [CreateBusinessOwnerPage]
})
export class CreateBusinessOwnerPageModule {}
