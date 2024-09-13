import { Element } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { EstablishmentModel } from 'src/app/models/establishment';
import { EstablishmentsService } from '../../services/establishments.service';

@Component({
  selector: 'app-new-category-product',
  templateUrl: './new-category-product.component.html',
  styleUrls: ['./new-category-product.component.css']
})
export class NewCategoryProductComponent implements OnInit {
  public establishmentData: EstablishmentModel;
  public idEstablishment;
  public formCategoryProduct: FormGroup;
  public requestCategoryProduct: CategoryProductModel;
  public loading:boolean = false;
  public date:any;

  public categoryProducts:CategoryProductModel[];
  public sequencesExists = new Map();
  constructor(private establishmentService: EstablishmentsService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.idEstablishment = this.route.snapshot.paramMap.get('id');

    this.formCategoryProduct = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      sequence: new FormControl('', [Validators.required])
    });

    this.loadCategoryProducts(this.idEstablishment);
  }

  loadCategoryProducts(id:string){
    this.establishmentService.getAllCategoryProduct(id).subscribe((response:CategoryProductModel[]) => {
      this.categoryProducts = response;
      this.findSequence(this.categoryProducts);
    });
  }

  findSequence(categoryProducts:CategoryProductModel[]){
    categoryProducts.forEach(element => {
     this.sequencesExists.set(element.sequence, element.name + '-' + element.id );
    });
  }

  submit(){

    const sequence:number = this.formCategoryProduct.get('sequence').value;
    if(this.sequencesExists.has(sequence)){
     alert('A Categoria: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
    } else {

    if (this.formCategoryProduct.valid) {
      this.date = Date.now();
      this.requestCategoryProduct = {
        name: this.formCategoryProduct.get('name').value,
        sequence: this.formCategoryProduct.get('sequence').value,
        status:true,
        createdDate:this.date,
        idEstablishment:this.idEstablishment
    }
    this.loading = true;
    setTimeout(()=>{                           
      this.sendCategoryProduct(this.requestCategoryProduct);
  }, 3000);
  }
  else {
    console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
  }
}

}

sendCategoryProduct(categoryProduct:CategoryProductModel){
  this.establishmentService.createCategoryProduct(categoryProduct, this.idEstablishment);
  this.loading = false;
  this.router.navigate(['establishments/detail/'+ this.idEstablishment]);
}

back(){
  this.router.navigate(['establishments/detail/'+ this.idEstablishment]);

}




}
