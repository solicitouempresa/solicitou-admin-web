import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrdersAllManagerComponent } from './containers/orders-all-manager/orders-all-manager.component';
import { OrdersNewComponent } from './containers/orders-new/orders-new.component';
import { OrdersDetailComponent } from './containers/orders-detail/orders-detail.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersAllManagerComponent
  },
  {
    path: 'new',
    component: OrdersNewComponent
  },
  {
    path: 'detail/:id',
    component: OrdersDetailComponent
  },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class OrdersRoutingModule {
}
