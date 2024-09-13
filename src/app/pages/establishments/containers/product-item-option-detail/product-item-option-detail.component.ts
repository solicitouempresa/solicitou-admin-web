import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentsService } from '../../services/establishments.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OptionItemProduct } from 'src/app/models/optionItemProduct';
import { ItemProductModel } from 'src/app/models/itemProduct';

@Component({
  selector: 'app-product-item-option-detail',
  templateUrl: './product-item-option-detail.component.html',
  styleUrls: ['./product-item-option-detail.component.css']
})
export class ProductItemOptionDetailComponent implements OnInit {

  
  public idEstablishment:string;
  public idProduct:string;
  public idItemProduct:string;
  public idOptionItemProduct:string;

  public formOptionItemProduct: FormGroup;
  public responseOptionItemProductItem: OptionItemProduct;
  public requestOptionItemProductItem: OptionItemProduct;
  public loading: boolean;
  public itemProduct:ItemProductModel;
  public date:any;

  public responseAllOptionItemProduct: OptionItemProduct[];
  public sequencesExists = new Map();


  constructor(private establishmentService: EstablishmentsService, private router:Router, private route:ActivatedRoute) {
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.idProduct = this.route.snapshot.paramMap.get('idProduct');
    this.idItemProduct = this.route.snapshot.paramMap.get('idItemProduct');
    this.idOptionItemProduct = this.route.snapshot.paramMap.get('idOptionItemProduct');
     }

  ngOnInit(): void {
    this.loading = true;
    this.loadOptionItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct, this.idOptionItemProduct);
    this.loadItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct);
    setTimeout(() => {
        this.loadForm(this.responseOptionItemProductItem);
    }, 3000);
  }

  loadForm(responseOptionItemProductItem: OptionItemProduct){
    this.formOptionItemProduct = new FormGroup({
      name: new FormControl(responseOptionItemProductItem.name, [Validators.required, Validators.maxLength(32)]),
      description: new FormControl(responseOptionItemProductItem.description, [Validators.maxLength(60)]),
      priceOption: new FormControl(responseOptionItemProductItem.priceOption),
      sequence: new FormControl(responseOptionItemProductItem.sequence, [Validators.required])
    });

    this.loading = false;

  }

  loadItemProduct(idEstablishment:string, idProduct:string, idItemProduct:string){
    this.establishmentService.getIdItemProduct(idEstablishment, idProduct, idItemProduct).subscribe((response:ItemProductModel)=>{
      this.itemProduct = response;
    });
  }

  loadOptionItemProduct(idEstablishment:string, idProduct:string, idItemProduct, idOptionItemProduct){
    this.establishmentService.getIdOptionItemProduct(idEstablishment, idProduct, idItemProduct, idOptionItemProduct)
    .subscribe((response:OptionItemProduct) => {
      this.responseOptionItemProductItem = response;
    });
  }

  public submit(){
    const sequence:number = this.formOptionItemProduct.get('sequence').value;
    if(this.sequencesExists.has(sequence) && this.sequencesExists.get(sequence) !== this.responseOptionItemProductItem.name + '-' + this.responseOptionItemProductItem.id){
      alert('A opção de Item de Produto: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
     } else {
 
     if (this.formOptionItemProduct.valid) {
      this.date = Date.now();
      this.requestOptionItemProductItem = {
        dateUpdated: this.date,
        name: this.formOptionItemProduct.get('name').value,
        description: this.formOptionItemProduct.get('description').value,
        priceOption: this.formOptionItemProduct.get('priceOption').value,
        sequence: this.formOptionItemProduct.get('sequence').value,
        type: this.itemProduct.type,
        id: this.responseOptionItemProductItem.id
      }
      this.loading = true;
      setTimeout(()=>{                  
        // console.log(this.requestItemProduct)         
        this.sendOptionItemProduct(this.requestOptionItemProductItem);
    }, 3000);
      }
      else {

        console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
      }
    }
    }

    back(){
      this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/' + this.idProduct + '/detail-item-product/' + this.idItemProduct ]);
    }

    sendOptionItemProduct(optionItemProduct:OptionItemProduct){
      this.establishmentService.updateOptionItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct, optionItemProduct);
      this.loading = false;
      this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/' + this.idProduct + '/detail-item-product/' + this.idItemProduct ]);
    }

    findSequence(optionItemProduct:OptionItemProduct[]){
      optionItemProduct.forEach(element => {
       this.sequencesExists.set(element.sequence, element.name + '-' + element.id );
      });
    }

    loadAllOptionProductItemProduct(idEstablishment:string, idProduct:string, idItemProduct:string){
      this.establishmentService.getAllOptionItemProduct(idEstablishment, idProduct, idItemProduct).subscribe((response:OptionItemProduct[])=>{
        this.responseAllOptionItemProduct = response;
        if(response.length > 0){
          this.findSequence(this.responseAllOptionItemProduct);
        }
      });
    }


}
