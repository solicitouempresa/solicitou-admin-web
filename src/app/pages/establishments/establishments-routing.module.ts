import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { EstablishmentsComponent } from './containers/establishments.component';
import { NewEstablishmentComponent } from './containers/new-establishment/new-establishment.component';
import { EstablishmentDetailComponent } from './containers/establishment-detail/establishment-detail.component';
import { NewProductComponent } from './containers/new-product/new-product.component';
import { ProductDetailComponent } from './containers/product-detail/product-detail.component';
import { NewCategoryProductComponent } from './containers/new-category-product/new-category-product.component';
import { CategoryProductDetailComponent } from './containers/category-product-detail/category-product-detail.component';
import { ProductItemDetailComponent } from './containers/product-item-detail/product-item-detail.component';
import { ProductItemNewComponent } from './containers/product-item-new/product-item-new.component';
import { ProductItemOptionDetailComponent } from './containers/product-item-option-detail/product-item-option-detail.component';
import { ProductItemOptionNewComponent } from './containers/product-item-option-new/product-item-option-new.component';

const routes: Routes = [
  {
    path: '',
    component: EstablishmentsComponent
  },
  {
    path: 'new',
    component: NewEstablishmentComponent
  },
  {
    path: 'detail/:id',
    component: EstablishmentDetailComponent
  },
  {
    path: 'detail/:id/new-product',
    component: NewProductComponent
  },
  {
    path: 'detail/:id/detail-product/:idProduct',
    component: ProductDetailComponent
  },
  {
    path: 'detail/:id/new-category-product',
    component: NewCategoryProductComponent
  },
  {
    path: 'detail/:id/detail-category-product/:idCategoryProduct',
    component: CategoryProductDetailComponent
  },
  {
    path: 'detail/:id/detail-product/:idProduct/new-item-product',
    component: ProductItemNewComponent
  },
  {
    path: 'detail/:id/detail-product/:idProduct/detail-item-product/:idItemProduct',
    component: ProductItemDetailComponent
  },
  {
    path: 'detail/:id/detail-product/:idProduct/detail-item-product/:idItemProduct/detail-option-item-product/:idOptionItemProduct',
    component: ProductItemOptionDetailComponent
  },
  {
    path: 'detail/:id/detail-product/:idProduct/detail-item-product/:idItemProduct/new-option-item-product',
    component: ProductItemOptionNewComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class EstablishmentsRoutingModule {
}
