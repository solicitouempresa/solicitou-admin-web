import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemProductModel } from 'src/app/models/itemProduct';
import { EstablishmentsService } from '../../services/establishments.service';
import { OptionItemProduct } from 'src/app/models/optionItemProduct';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css']
})
export class ProductItemDetailComponent implements OnInit {
  public idEstablishment: string;
  public idProduct: string;
  public idItemProduct: string;
  public loading:boolean = true;
  public date:any;
  public formItemProduct: FormGroup;
  public type = [];
  public quantidadeValid;
  public optionValid;
  public sequencesExists = new Map();
  public itemProduct:ItemProductModel[];
  public requestItemProduct:ItemProductModel;
  public responseItemProduct:ItemProductModel;

  public optionItemProduct:OptionItemProduct[];
  public loadingOptionItemProduct:boolean;

  displayedColumns: string[] = ['id', 'name', 'sequence', 'priceOption', 'editar','desativar'];
  dataSource: MatTableDataSource<OptionItemProduct>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private establishmentService: EstablishmentsService, private router:Router, private route:ActivatedRoute) { 
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.idProduct = this.route.snapshot.paramMap.get('idProduct');
    this.idItemProduct = this.route.snapshot.paramMap.get('idItemProduct');
  }

  ngOnInit(): void {
    this.loadType();
    this.loadItemProductData();
    this.loadAllItemProductData();
    this.loadOptionItemProduct();
    setTimeout(() => {
      this.loadForm();
      // this.loadTableItemProduct();
    }, 3000);
  }

  loadType(){
    this.type = [
      {id: 1, name: 'OPÇÃO'},
      {id: 2, name: 'QUANTIDADE'},
      {id: 3, name: 'CHECKBOX'}
    ]
  }

  loadOptionItemProduct(){
      this.establishmentService.getAllOptionItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct).
      subscribe((response:OptionItemProduct[]) => {
        this.optionItemProduct = response;
        this.loadTableOptionItemProduct(this.optionItemProduct);
      })
  }

  loadItemProductData(){
    this.establishmentService.getIdItemProduct(this.idEstablishment, this.idProduct, this.idItemProduct).
    subscribe((response:ItemProductModel) =>{
      this.responseItemProduct = response;
    });
  }

  loadAllItemProductData(){
    this.establishmentService.getAllItemProduct(this.idEstablishment, this.idProduct).subscribe((response:ItemProductModel[])=>{
      this.itemProduct = response;
      if(response.length > 0){
        this.findSequence(this.itemProduct);
      }
    });
  }

  loadForm(){
    this.formItemProduct = new FormGroup({
      name: new FormControl(this.responseItemProduct.name, [Validators.required, Validators.maxLength(32)]),
      description: new FormControl(this.responseItemProduct.description, [Validators.required, Validators.maxLength(60)]),
      required: new FormControl(this.responseItemProduct.required, [Validators.required]),
      sequence: new FormControl(this.responseItemProduct.sequence, [Validators.required]),
      type:new FormControl(this.responseItemProduct.type.id, [Validators.required]),
      quantityMax:new FormControl({ value: this.responseItemProduct.quantityMax, disabled: true }),
      quantityMin:new FormControl({ value: this.responseItemProduct.quantityMin, disabled: true }),
      quantityOptionMax:new FormControl({ value: this.responseItemProduct.quantityOptionMax, disabled: true }),
      quantityOptionMin:new FormControl({ value: this.responseItemProduct.quantityOptionMin, disabled: true })
    });
    this.loading = false;
  }

  back(){
    this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/' + this.idProduct]);
  }

  findSequence(ItemProductModel:ItemProductModel[]){
    ItemProductModel.forEach(element => {
     this.sequencesExists.set(element.sequence, element.name + '-' + element.id );
    });
  }

  public submit(){
    const type = this.returnObject(this.formItemProduct.get('type').value, this.type);
    const sequence:number = this.formItemProduct.get('sequence').value;
    if(this.sequencesExists.has(sequence) && this.sequencesExists.get(sequence) !== this.responseItemProduct.name + '-' + this.responseItemProduct.id){
      alert('A Categoria: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
     } else {
 
     if (this.formItemProduct.valid) {
      this.date = Date.now();
      this.requestItemProduct = {
        dateUpdated: this.date,
        name: this.formItemProduct.get('name').value,
        description: this.formItemProduct.get('description').value,
        required: this.formItemProduct.get('required').value,
        sequence: this.formItemProduct.get('sequence').value,
        type: type,
        quantityMax: this.formItemProduct.get('quantityMax').value,
        quantityMin: this.formItemProduct.get('quantityMin').value,
        quantityOptionMax: this.formItemProduct.get('quantityOptionMax').value,
        quantityOptionMin: this.formItemProduct.get('quantityOptionMin').value,
        id: this.responseItemProduct.id
      }
      this.loading = true;
      setTimeout(()=>{                  
        // console.log(this.requestItemProduct)         
        this.sendItemProduct(this.requestItemProduct);
    }, 3000);
      }
      else {

        console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
      }
    }
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
     this.establishmentService.updateItemProduct(this.idEstablishment, this.idProduct, itemProduct);
     this.loading = false;
     this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/'+ this.idProduct]);
   }

   returnObject(id:number, object) {
    return object.find(find=> find.id === id);
  }

  loadPaginator(datasource){
    datasource.paginator = this.paginator;
    datasource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(id:number){
    this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/'+ this.idProduct + '/detail-item-product/' + this.idItemProduct + '/detail-option-item-product/'  + id]);
  }

  delete(id:number){

  }

  deactivate(itemProductModel:ItemProductModel){
    if(itemProductModel.status){
      itemProductModel.status = false;
    }
    else{
      itemProductModel.status = true;
    }
    this.establishmentService.updateItemProduct(this.idEstablishment, this.idProduct, itemProductModel);
    this.loadOptionItemProduct();
   
  }

  loadTableOptionItemProduct(optionItemProduct:OptionItemProduct[]){
    
    this.dataSource = new MatTableDataSource(optionItemProduct);
    setTimeout(()=>{                           
      this.loadPaginator(this.dataSource);
  }, 1000);
    this.loadingOptionItemProduct = false;
  }

  newOptionItemProduct(){
    this.router.navigate(['detail/'+ this.idEstablishment +'/detail-product/' + this.idProduct +  '/detail-item-product/' + this.idItemProduct + '/new-option-item-product']);
  }

}
