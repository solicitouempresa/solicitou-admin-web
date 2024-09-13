import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NeighborhoodModel } from 'src/app/models/neighborhoodsModel';

import { EstablishmentModel } from 'src/app/models/establishment';
import { MenuModel } from 'src/app/models/menuModel';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { OrderModel } from 'src/app/models/orderModel';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersCollection: CollectionReference<DocumentData>;

  
  constructor(private firestore: Firestore) {
   this.ordersCollection = collection(this.firestore, 'headquarters/1/orders'); //retornar ordens da matriz
  }

  //ORDERS (PEDIDOS)
  createOrder(order: OrderModel) {
    this.ordersCollection = collection(this.firestore, `headquarters/1/orders`);
    return addDoc(this.ordersCollection, order);
  }

  getllOrder() {
    this.ordersCollection = collection(this.firestore, `headquarters/1/orders`);
    return collectionData(this.ordersCollection, {
      idField: 'id',
    }) as Observable<OrderModel[]>;
  }


  getIdOrder(idOrder:string) {
    const establishmentDocumentReference = doc(this.firestore, `headquarters/1/orders/${idOrder}`);
    return docData(establishmentDocumentReference, { idField: 'id'});
  }

  getIdEstablishmentOrder(idEstablishment:string) {
    const establishmentDocumentReference = doc(this.firestore, `headquarters/1/orders/${idEstablishment}`);
    return docData(establishmentDocumentReference, { idField: 'idEstablishment'});
  }


  updateOrder(order: OrderModel) {
    const establishmentDocumentReference = doc(
      this.firestore,
      `headquarters/1/orders/${order.id}`
    );
    return updateDoc(establishmentDocumentReference, { ...order });
  }
  

}
