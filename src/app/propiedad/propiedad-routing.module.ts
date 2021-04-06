import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropiedadPage } from './propiedad.page';

const routes: Routes = [
  {
    path: '',
    component: PropiedadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropiedadPageRoutingModule {}
