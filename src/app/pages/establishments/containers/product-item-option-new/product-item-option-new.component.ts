import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentsService } from '../../services/establishments.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemProductModel } from 'src/app/models/itemProduct';
import { OptionItemProduct } from 'src/app/models/optionItemProduct';

@Component({
  selector: 'app-product-item-option-new',
  templateUrl: './product-item-option-new.component.html',
  styleUrls: ['./product-item-option-new.component.css']
})
export class ProductItemOptionNewComponent implements OnInit {

  public idEstablishment:string;
  public idProduct:string;
  public idItemProduct:string;
  public loading:boolean = false;
  public date:any;
  public formOptionItemProduct: FormGroup;
  public sequencesExists = new Map();
  public itemProduct:ItemProductModel;
  public requestOptionItemProduct:OptionItemProduct;
  public responseOptionItemProduct: OptionItemProduct[];

  constructor(private establishmentService: EstablishmentsService, private router:Router, private route:ActivatedRoute) { 
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.idProduct = this.route.snapshot.paramMap.get('idProduct');
    this.idItemProduct = this.route.snapshot.paramMap.get('idItemProduct');
  }

  ngOnInit(): void {
    this.formOptionItemProduct = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      description: new FormControl('', [Validators.maxLength(60)]),
      priceOption: new FormControl(0),
      sequence: new FormControl('', [Validators.required])
    });

    this.loadItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct);
    this.loadAllOptionProductItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct);

  }

  loadItemProduct(idEstablishment:string, idProduct:string, idItemProduct:string){
    this.establishmentService.getIdItemProduct(idEstablishment, idProduct, idItemProduct).subscribe((response:ItemProductModel)=>{
      this.itemProduct = response;
    });
  }

  loadAllOptionProductItemProduct(idEstablishment:string, idProduct:string, idItemProduct:string){
    this.establishmentService.getAllOptionItemProduct(idEstablishment, idProduct, idItemProduct).subscribe((response:OptionItemProduct[])=>{
      this.responseOptionItemProduct = response;
      if(response.length > 0){
        this.findSequence(this.responseOptionItemProduct);
      }
    });
  }

  findSequence(itemProduct:ItemProductModel[]){
    itemProduct.forEach(element => {
     this.sequencesExists.set(element.sequence, element.name + '-' + element.id );
    });
  }

  back(){
    this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/' + this.idProduct ]);
  }

  
  submit(){
    console.log(this.itemProduct);
    const sequence:number = this.formOptionItemProduct.get('sequence').value;
    if(this.sequencesExists.size > 0 && this.sequencesExists.has(sequence)){
      alert('O Item Produto: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
     } else {
      if (this.formOptionItemProduct.valid) {
        this.date = Date.now();
        this.requestOptionItemProduct = {
          dateCreated: this.date,
          name: this.formOptionItemProduct.get('name').value,
          description: this.formOptionItemProduct.get('description').value,
          priceOption: this.formOptionItemProduct.get('priceOption').value,
          sequence: this.formOptionItemProduct.get('sequence').value,
          type: this.itemProduct.type,
          status: true,
          quantity: 0
        }
        this.loading = true;
        setTimeout(()=>{                           
          this.sendOptionItemProduct(this.requestOptionItemProduct);
      }, 3000);
        } else {
          console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
        }
      }
  }

  
  sendOptionItemProduct(optionItemProduct:OptionItemProduct){
    this.establishmentService.createOptionItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct, optionItemProduct);
    this.loading = false;
    this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/'+ this.idProduct + '/detail-item-product/' + this.idItemProduct]);
  }


}
