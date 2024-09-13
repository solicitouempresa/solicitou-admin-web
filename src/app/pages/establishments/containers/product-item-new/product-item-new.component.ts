import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentsService } from '../../services/establishments.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemProductModel } from 'src/app/models/itemProduct';

@Component({
  selector: 'app-product-item-new',
  templateUrl: './product-item-new.component.html',
  styleUrls: ['./product-item-new.component.css']
})
export class ProductItemNewComponent implements OnInit {
  public idEstablishment;
  public idProduct;
  public loading:boolean = false;
  public date:any;
  public formItemProduct: FormGroup;
  public typeItemProduct;
  public quantidadeValid;
  public optionValid;
  public sequencesExists = new Map();
  public itemProduct:ItemProductModel[];
  public requestItemProduct:ItemProductModel;
  constructor(private establishmentService: EstablishmentsService, private router:Router, private route:ActivatedRoute) {
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.idProduct = this.route.snapshot.paramMap.get('idProduct');
   }

  ngOnInit(): void {

    this.loadType();

    this.formItemProduct = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      description: new FormControl('', [Validators.maxLength(60)]),
      required: new FormControl(false, [Validators.required]),
      sequence: new FormControl('', [Validators.required]),
      type:new FormControl('', [Validators.required]),
      quantityMax:new FormControl({ value: 0, disabled: true }),
      quantityMin:new FormControl({ value: 0, disabled: true }),
      quantityOptionMax:new FormControl({ value: 0, disabled: true }),
      quantityOptionMin:new FormControl({ value: 0, disabled: true })
    });


  }

  public loadItemProduct(idEstablishment:string, idProduct:string){
    this.establishmentService.getAllItemProduct(idEstablishment, idProduct).subscribe((response:ItemProductModel[])=>{
      this.itemProduct = response;
      if(response.length > 0){
        this.findSequence(this.itemProduct);
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
    const type = this.returnObject(this.formItemProduct.get('type').value, this.typeItemProduct);
    const sequence:number = this.formItemProduct.get('sequence').value;
    if(this.sequencesExists.size > 0 && this.sequencesExists.has(sequence)){
      alert('O Item Produto: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
     } else {
      if (this.formItemProduct.valid) {
        this.date = Date.now();
        this.requestItemProduct = {
          dateCreated: this.date,
          name: this.formItemProduct.get('name').value,
          description: this.formItemProduct.get('description').value,
          required: this.formItemProduct.get('required').value,
          sequence: this.formItemProduct.get('sequence').value,
          type: type,
          quantityMax: this.formItemProduct.get('quantityMax').value,
          quantityMin: this.formItemProduct.get('quantityMin').value,
          quantityOptionMax: this.formItemProduct.get('quantityOptionMax').value,
          quantityOptionMin: this.formItemProduct.get('quantityOptionMin').value,
          status: true
        }
        this.loading = true;
        setTimeout(()=>{                           
          this.sendItemProduct(this.requestItemProduct);
      }, 3000);
        } else {
          console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
        }
      }
  }

  loadType(){
    this.typeItemProduct = [
      {id: 1, name: 'OPÇÃO'},
      {id: 2, name: 'QUANTIDADE'},
      {id: 3, name: 'CHECKBOX'}
    ]
  }

  onSelect(event){
     const type = this.formItemProduct.get('type').value;
     if(type == 1){
      this.formItemProduct.get('quantityOptionMax').disable();
      this.formItemProduct.get('quantityOptionMin').disable();
      this.formItemProduct.get('quantityMax').disable();
      this.formItemProduct.get('quantityMin').disable();
      this.formItemProduct.patchValue({
        quantityMax: 0,
        quantityMin: 0,
        quantityOptionMax:0,
        quantityOptionMin:0
      })
     }
     if(type == 2){
      this.formItemProduct.get('quantityOptionMax').disable();
      this.formItemProduct.get('quantityOptionMin').disable();
      this.formItemProduct.patchValue({
        quantityOptionMax: 0,
        quantityOptionMin: 0
      })
      this.formItemProduct.get('quantityMax').enable();
      this.formItemProduct.get('quantityMin').enable();
     }
     if(type == 3){
      this.formItemProduct.get('quantityOptionMax').enable();
      this.formItemProduct.get('quantityOptionMin').enable();
      this.formItemProduct.get('quantityMax').disable();
      this.formItemProduct.get('quantityMin').disable();
      this.formItemProduct.patchValue({
        quantityMax: 0,
        quantityMin: 0
      })
     }
  }

  sendItemProduct(itemProduct:ItemProductModel){
    this.establishmentService.createItemProduct(this.idEstablishment, this.idProduct, itemProduct);
    this.loading = false;
    this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/'+ this.idProduct]);
  }

  returnObject(id:number, object) {
    return object.find(find=> find.id === id);
  }
}
