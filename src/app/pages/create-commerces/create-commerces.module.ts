import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule,  } from '@ionic/angular';

import { CreateCommercesPageRoutingModule } from './create-commerces-routing.module';

import { CreateCommercesPage } from './create-commerces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCommercesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateCommercesPage]
})
export class CreateCommercesPageModule {}
