import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderModel } from 'src/app/models/orderModel';
import { OrdersService } from '../../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { PrinterOrderComponent } from '../printerOrder/printerOrder.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.css']
})
export class OrdersDetailComponent implements OnInit {

  // public formOrder: FormGroup;
  public idOrder:string;
  public orderData:OrderModel;
  public loading: boolean = false;

  constructor( public dialog: MatDialog, private routeNavigate:Router, private ordersService: OrdersService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.idOrder = this.route.snapshot.paramMap.get('id');
    this.loadData(this.idOrder);
  }

  loadData(idOrder:string){
    this.loading = true;
    this.ordersService.getIdOrder(idOrder).subscribe((response:OrderModel) => {
      this.orderData = response;
      console.log(this.orderData);
    });

    setTimeout(() => {
      this.loadDataHtml();
    }, 3000);

  }

  loadDataHtml(){
    this.loading = false;
  }

  back(){
    this.routeNavigate.navigate(['orders']);
  }
  // openDialog(){
  //   const dialogRef = this.dialog.open(PrinterOrderComponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  print(orderData:OrderModel){
    var date = new Date(orderData.dateCreated);
      let position = 1;
      let pdf = new jsPDF('p', 'cm', [10, 20 + orderData.productItem.length * 10]);
      pdf.setFont("Courier");
      //TITULO
      pdf.setFontSize(10);
      // let left = 1;
      // let top = 1;
      // const imgWidth = 8;
      // const imgHeight = 8;
      // const img = new Image();
      // img.src = orderData.establishment.urlImage;
      // img.onload = () => {
      //   pdf.addImage(img,'png',left, top, imgWidth, imgHeight);
      // };
      pdf.text("Nota do Pedido", 3, position);
      position = position + 1;
      pdf.text("ID - " + orderData.id, 1, position);
      position = position + 1;
      pdf.text("DATA/HORA - " + date.toLocaleString("pt-BR"), 1, position);
      position = position + 1;
      //DADOS DO PRODUTO
      pdf.setFontSize(8);
      pdf.text("Produtos:", 0.5, position);
      position = position + 1;
      orderData.productItem.forEach(element => {
        pdf.text("----------------------------------", 1, position);
        position = position + 1;
        pdf.text("Nome: " + element.product.name, 1, position);
        position = position + 1;
        pdf.text("Quantidade: " + element.quantity, 1, position);
        position = position + 1;
        pdf.text("Preço Unidade: R$ " + element.product.price, 1, position);
        position = position + 1;
        pdf.text("Itens do Produto (Adicionais):", 1, position);
        position = position + 1;
        element.product.itensProduct.forEach(itemElement => {
          pdf.text("----------------------------------", 1, position);
          position = position + 1;
          pdf.text("Nome: " + itemElement.name, 1, position);
          position = position + 1;
          pdf.text("Quantidade: " + itemElement.quantity, 1, position);
          position = position + 1;
          pdf.text("Preço por unidade: R$ " + itemElement.priceOption, 1, position);
          position = position + 1;
          pdf.text("----------------------------------", 1, position);
          position = position + 1;
        });
        pdf.text("----------------------------------", 1, position);
        position = position + 1;
      });
      pdf.text("Pagamento:", 0.5, position);
      position = position + 1;
      pdf.text("Tipo Pagamento: " + orderData.typePayment, 1, position);
      position = position + 1;
      pdf.text("Valor Frete: R$ " + orderData.rateDelivery, 1, position);
      position = position + 1;
      pdf.text("Valor Total: R$ " + orderData.amount, 1, position);
      position = position + 1;
      if(orderData.valueCash ){
        pdf.text("Valor Declarado para pagamento a vista: R$ " + orderData.valueCash, 1, position);
        position = position + 1;
      }
      if(orderData.changeMoney){
        pdf.text("Valor de Troco para o Cliente: R$ " + orderData.changeMoney , 1, position);
        position = position + 1;
      }

     
      pdf.output('dataurlnewwindow', {filename:orderData.id + '-pedido.pdf'});
      pdf.save(orderData.id + '-pedido.pdf');

  }
  

  submit(){  }

  // buildFormOrder() {
  //   this.formOrder = new FormGroup({
  //     name: new FormControl(this.o, [Validators.required]),
  //     email: new FormControl('', [Validators.email]),
  //     ddd: new FormControl('', [Validators.required, Validators.maxLength(2)]),
  //     contact: new FormControl('', [Validators.required]),
  //     number: new FormControl('', [Validators.required]),
  //     complement: new FormControl(''),
  //     reference: new FormControl(''),
  //     typePayment: new FormControl('', [Validators.required]),

  //   });
  // }


}
