import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { IconsPageComponent } from './components';

const routes: Routes = [
  {
    path: 'icons',
    component: IconsPageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class UiElementsRoutingModule {
}
