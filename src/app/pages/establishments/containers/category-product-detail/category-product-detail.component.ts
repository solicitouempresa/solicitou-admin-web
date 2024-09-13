import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { EstablishmentsService } from '../../services/establishments.service';

@Component({
  selector: 'app-category-product-detail',
  templateUrl: './category-product-detail.component.html',
  styleUrls: ['./category-product-detail.component.css']
})
export class CategoryProductDetailComponent implements OnInit {
  public formCategoryProduct: FormGroup;
  public loading:boolean = false;
  public idCategoryProduct;
  public idEstablishment;
  public categoryProduct: CategoryProductModel;
  public date:any;
  public requestCategoryProduct: CategoryProductModel;

  public categoryProducts:CategoryProductModel[];
  public sequencesExists = new Map();
  constructor(private establishmentService: EstablishmentsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.idCategoryProduct = this.route.snapshot.paramMap.get('idCategoryProduct');
    this.loadCategoryProductId( this.idCategoryProduct, this.idEstablishment);
    setTimeout(() => {
      this.loadForm();
    }, 2000);

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
     this.sequencesExists.set(element.sequence, element.name );
    });
  }

  public loadForm() {
    this.formCategoryProduct = new FormGroup({
      name: new FormControl(this.categoryProduct.name, [Validators.required, Validators.maxLength(30)]),
      sequence: new FormControl(this.categoryProduct.sequence, [Validators.required])
    });
    this.loading = false;
  }

  public loadCategoryProductId(idCategoryProduct:string, idEstablishment:string) {
    this.loading = true;
    this.establishmentService.getIdCategoryProduct(idCategoryProduct, idEstablishment).subscribe((resp: CategoryProductModel) => {
      this.categoryProduct = resp;
    })
  }

  submit(){
    const sequence:number = this.formCategoryProduct.get('sequence').value;
    if(this.sequencesExists.has(sequence) && this.sequencesExists.get(sequence) !== this.categoryProduct.name){
     alert('A Categoria: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
    } else {

    if (this.formCategoryProduct.valid) {
      this.date = Date.now();
      this.requestCategoryProduct = {
        name: this.formCategoryProduct.get('name').value,
        sequence: this.formCategoryProduct.get('sequence').value,
        status:true,
        updatedDate:this.date,
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
  this.establishmentService.updateCategoryProduct(categoryProduct, this.idEstablishment, this.idCategoryProduct);
  this.loading = false;
  this.router.navigate(['establishments/detail/'+ this.idEstablishment]);
}

  back(){
    this.router.navigate(['establishments']);
  }

  

}
