import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessOwnerPageRoutingModule } from './business-owner-routing.module';

import { BusinessOwnerPage } from './business-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusinessOwnerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [BusinessOwnerPage]
})
export class BusinessOwnerPageModule {}
