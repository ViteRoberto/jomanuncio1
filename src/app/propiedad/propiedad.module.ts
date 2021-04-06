import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropiedadPageRoutingModule } from './propiedad-routing.module';

import { PropiedadPage } from './propiedad.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PropiedadPageRoutingModule
  ],
  declarations: [PropiedadPage]
})
export class PropiedadPageModule {}
