import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateDetailsPageRoutingModule } from './create-details-routing.module';

import { CreateDetailsPage } from './create-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateDetailsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateDetailsPage]
})
export class CreateDetailsPageModule {}
