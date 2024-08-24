import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitiesVillesPageRoutingModule } from './activities-villes-routing.module';

import { ActivitiesVillesPage } from './activities-villes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesVillesPageRoutingModule
  ],
  declarations: [ActivitiesVillesPage]
})
export class ActivitiesVillesPageModule {}
