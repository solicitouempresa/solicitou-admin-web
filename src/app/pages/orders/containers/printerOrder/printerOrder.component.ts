import { Component } from "@angular/core";

@Component({
    selector: 'printer-order',
    templateUrl: 'printerOrder.component.html',
  })
  export class PrinterOrderComponent {

    printer(){
        window.print();
    }
  }