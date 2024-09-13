import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { EstablishmentModel } from 'src/app/models/establishment';
import { MenuModel } from 'src/app/models/menuModel';
import { ImageService } from 'src/app/shared/image/services/image.service';
import { EstablishmentsService } from '../../services/establishments.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  public idEstablishment;
  public formProduct: FormGroup;
  public requestProduct: MenuModel;
  public loading:boolean = false;
  public date:any;
  public categoryMenuProduct:CategoryProductModel[];
  public typeProduct = [];
  public imageUploaded;
  public timestamp;
  public urlImage;
  public imagePreview;
  public establishmentData: EstablishmentModel;
  public productPercentage: number = 0;
  public priceFinal:number = 0;
  public sequencesExists = new Map();
  public menuModels:MenuModel[];

  constructor(private uploadService: ImageService, private establishmentService: EstablishmentsService, private router:Router, private route:ActivatedRoute) { }


  ngOnInit(): void {
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    
    this.formProduct = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      categoryMenu: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      sideDish: new FormControl('', [Validators.required]),
      urlImage:new FormControl('', [Validators.required]),
      sequence:new FormControl('', [Validators.required])
    });

    this.loadEstablishment(this.idEstablishment);
    this.loadCategoryMenu(this.idEstablishment);
    this.loadMenuModel(this.idEstablishment);

  }

  public loadEstablishment(id:string){
    this.establishmentService.getId(id).subscribe((response:EstablishmentModel) =>{
      this.establishmentData = response;     
    });
  }

  public loadCategoryMenu(idEstablishment:string ){
   this.establishmentService.getAllCategoryProduct(idEstablishment).subscribe((response:CategoryProductModel[]) =>{
      this.categoryMenuProduct = response;
   });
  }
  public loadMenuModel(idEstablishment:string){
    this.establishmentService.getMenu(idEstablishment).subscribe((response:MenuModel[])=>{
      this.menuModels = response;
      this.findSequence(this.menuModels);
    });
  }
  
  findSequence(menuModel:MenuModel[]){
    menuModel.forEach(element => {
     this.sequencesExists.set(element.sequence, element.name + '-' + element.id );
    });
  }



  submit(){

    const categoryProduct:CategoryProductModel = this.formProduct.get('categoryMenu').value;
    
    const sequence:number = this.formProduct.get('sequence').value;
    if(this.sequencesExists.has(sequence)){
     alert('A Categoria: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
    } else {

    if (this.formProduct.valid) {
      this.date = Date.now();
      this.requestProduct = {
        price: this.formProduct.get('price').value,
        sideDish:this.formProduct.get('sideDish').value,
        name: this.formProduct.get('name').value,
        description: this.formProduct.get('description').value,
        statusActive:true,
        categoryMenu:categoryProduct.name,
        idCategoryMenu: categoryProduct.id,
        urlImage:this.urlImage,
        dateCreated:this.date,
        idEstablishment:this.idEstablishment,
        priceWithoutFee:this.formProduct.get('price').value,
        sequence:this.formProduct.get('sequence').value
    }
    this.loading = true;
    setTimeout(()=>{                           
      this.sendProduct(this.requestProduct);
  }, 3000);
  }
  else {
    console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
  }

}

}

sendProduct(product:MenuModel){
  this.establishmentService.createProduct(product, this.idEstablishment);
  this.uploadService.fileUploadProducts(this.imageUploaded, this.timestamp);
  this.loading = false;
  this.router.navigate(['establishments/detail/'+ this.idEstablishment]);
}

back(){
  this.router.navigate(['establishments/detail/'+ this.idEstablishment]);
}

receiveImage(file){
  const urlAws = 'https://hamgus-products-assets.s3.us-east-2.amazonaws.com/';
  const current = new Date();
  const timestamp = current.getTime();
  this.imageUploaded = file;
  this.timestamp = timestamp;
  this.urlImage = urlAws + this.imageUploaded.name + timestamp;
  this.formProduct.controls['urlImage'].setValue(this.urlImage);
  // console.log(file);
}

}