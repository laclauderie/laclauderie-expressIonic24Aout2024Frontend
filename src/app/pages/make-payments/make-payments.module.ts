import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MakePaymentsPageRoutingModule } from './make-payments-routing.module';

import { MakePaymentsPage } from './make-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MakePaymentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MakePaymentsPage]
})
export class MakePaymentsPageModule {}
