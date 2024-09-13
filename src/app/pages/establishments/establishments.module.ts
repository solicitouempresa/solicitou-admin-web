import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SharedModule } from '../../shared/shared.module';
import { EstablishmentsComponent } from './containers/establishments.component';
import { EstablishmentsRoutingModule } from './establishments-routing.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { NewEstablishmentComponent } from './containers/new-establishment/new-establishment.component';
import { EstablishmentDetailComponent } from './containers/establishment-detail/establishment-detail.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { NewProductComponent } from './containers/new-product/new-product.component';
import { ProductDetailComponent } from './containers/product-detail/product-detail.component';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { NeighborhoodDeliveryDetailComponent } from './containers/neighborhood-delivery-detail/neighborhood-delivery-detail.component';
import { NeighborhoodDeliveryNewComponent } from './containers/neighborhood-delivery-new/neighborhood-delivery-new.component';  // <<<< import it here
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { NewCategoryProductComponent } from './containers/new-category-product/new-category-product.component';
import { CategoryProductDetailComponent } from './containers/category-product-detail/category-product-detail.component';
import {MatSortModule} from '@angular/material/sort';
import { ProductItemNewComponent } from './containers/product-item-new/product-item-new.component';
import { ProductItemDetailComponent } from './containers/product-item-detail/product-item-detail.component';
import { ProductItemOptionDetailComponent } from './containers/product-item-option-detail/product-item-option-detail.component';
import { ProductItemOptionNewComponent } from './containers/product-item-option-new/product-item-option-new.component';

@NgModule({
  declarations: [EstablishmentsComponent, NewEstablishmentComponent, EstablishmentDetailComponent, NewProductComponent, ProductDetailComponent, NeighborhoodDeliveryDetailComponent, NeighborhoodDeliveryNewComponent, NewCategoryProductComponent, CategoryProductDetailComponent, ProductItemNewComponent, ProductItemDetailComponent, ProductItemOptionDetailComponent, ProductItemOptionNewComponent],
  imports: [
    CommonModule,
    EstablishmentsRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    TextFieldModule,
    SharedModule,
    MatSlideToggleModule,
    FormsModule,
    MatGoogleMapsAutocompleteModule,
    MatSortModule
  ],
  providers: [],

})
export class EstablishmentsModule { }
