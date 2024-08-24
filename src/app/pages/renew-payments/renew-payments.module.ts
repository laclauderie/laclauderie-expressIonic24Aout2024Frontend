import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenewPaymentsPageRoutingModule } from './renew-payments-routing.module';

import { RenewPaymentsPage } from './renew-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenewPaymentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RenewPaymentsPage]
})
export class RenewPaymentsPageModule {}
