import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../../shared/shared.module';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import {MatSortModule} from '@angular/material/sort';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersAllManagerComponent } from './containers/orders-all-manager/orders-all-manager.component';
import { OrdersDetailComponent } from './containers/orders-detail/orders-detail.component';
import { OrdersNewComponent } from './containers/orders-new/orders-new.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { PrinterOrderComponent } from './containers/printerOrder/printerOrder.component';

@NgModule({
  declarations: [OrdersAllManagerComponent,OrdersDetailComponent,OrdersNewComponent,PrinterOrderComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
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
    MatSortModule,
    MatGridListModule
  ],
  providers: [],

})
export class OrdersModule { }
