import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { EstablishmentModel } from 'src/app/models/establishment';
import { MenuModel } from 'src/app/models/menuModel';
import { ImageService } from 'src/app/shared/image/services/image.service';
import { EstablishmentsService } from '../../services/establishments.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemProductModel } from 'src/app/models/itemProduct';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public idProduct;
  public idEstablishment;
  public formProduct: FormGroup;
  public requestProduct: MenuModel;
  public loading: boolean = false;
  public loadingItemProduct: boolean = false;
  public date: any;
  public categoryMenuProduct = [];
  public product: MenuModel;
  public imageUploaded;
  public timestamp;
  public urlImage;
  public urlImageDefault;
  public establishmentData: EstablishmentModel;
  public productPercentage: number = 0;
  public sequencesExists = new Map();
  public menuModels:MenuModel[];
  public itemProduct:ItemProductModel[];

  displayedColumns: string[] = ['id', 'name', 'sequence', 'required', 'editar','desativar'];
  dataSource: MatTableDataSource<ItemProductModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private uploadService: ImageService, private establishmentService: EstablishmentsService, private router: Router, private route: ActivatedRoute) { 

    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.idProduct = this.route.snapshot.paramMap.get('idProduct');

  }

  ngOnInit(): void {
    this.loadingItemProduct = true;
    this.urlImageDefault = 'https://hamgus-establishments-assets.s3.us-east-2.amazonaws.com/default-logotipo-establishment.jpg';
    this.loadEstablishment(this.idEstablishment);
    this.loadCategoryMenu(this.idEstablishment);
    this.loadMenuModel(this.idEstablishment);
    this.loadProductId();
    this.loadDataItemProduct(this.idEstablishment, this.idProduct);
    setTimeout(() => {
      this.loadForm();
      this.loadTableItemProduct();
    }, 3000);
    
  }

  public loadEstablishment(id:string){
    this.establishmentService.getId(id).subscribe((response:EstablishmentModel) =>{
      this.establishmentData = response;
      this.productPercentage = this.establishmentData.feeProduct ? this.establishmentData.feeProduct: 0;
    });
  }

  public loadProductId() {
    this.loading = true;
    this.establishmentService.getIdMenu(this.idProduct, this.idEstablishment).subscribe((resp: MenuModel) => {
      this.product = resp;
      this.product.priceWithoutFee = Math.ceil(this.product.price - (this.product.price / 100 * this.productPercentage));
      if(this.product && this.product.urlImage !== '' && this.product.urlImage !== null && this.product.urlImage !== undefined){
        this.urlImageDefault = this.product.urlImage;
      }
    })
  }

  public loadCategoryMenu(idEstablishment:string ){
    this.establishmentService.getAllCategoryProduct(idEstablishment).subscribe((response:CategoryProductModel[]) =>{
       this.categoryMenuProduct = response;
    });
   }

  public loadForm() {
    this.formProduct = new FormGroup({
      name: new FormControl(this.product.name, [Validators.required, Validators.maxLength(32)]),
      price: new FormControl(this.product.priceWithoutFee, [Validators.required]),
      categoryMenu: new FormControl(this.product.idCategoryMenu, [Validators.required]),
      sideDish: new FormControl(this.product.sideDish, [Validators.required]),
      description: new FormControl(this.product.description, [Validators.required]),
      urlImage:new FormControl(this.product.urlImage, [Validators.required]),
      sequence:new FormControl(this.product.sequence, [Validators.required])
    });
    this.loading = false;
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

  public submit(){
    let categoryProduct:CategoryProductModel;
    categoryProduct = this.categoryMenuProduct.find(f =>
      f.id == this.formProduct.get('categoryMenu').value
    );
      
    const sequence:number = this.formProduct.get('sequence').value;
   
    if(this.sequencesExists.has(sequence) && this.sequencesExists.get(sequence) !== this.product.name + '-' + this.product.id){
     alert('A Categoria: ' + this.sequencesExists.get(sequence) + ' já está cadastrada com a sequencia: ' + sequence + ', escolha outra.') 
    } else {

    if (this.formProduct.valid) {
      this.date = Date.now();
      this.requestProduct = {
        id: this.product.id,
        price: this.formProduct.get('price').value,
        sideDish:this.formProduct.get('sideDish').value,
        name: this.formProduct.get('name').value,
        description: this.formProduct.get('description').value,
        categoryMenu:categoryProduct.name,
        idCategoryMenu:categoryProduct.id,
        urlImage:this.formProduct.get('urlImage').value,
        dateUpdate:this.date,
        idEstablishment:this.idEstablishment,
        priceWithoutFee:this.formProduct.get('price').value,
        sequence:this.formProduct.get('sequence').value
    }
      console.log(this.requestProduct)
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
    this.establishmentService.updateProduct(product, this.idEstablishment);
    if(this.imageUploaded != '' && this.imageUploaded != null && this.imageUploaded != undefined){
      this.uploadService.fileUploadProducts(this.imageUploaded, this.timestamp);
    };
    this.loading = false;
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

  back(){
    this.router.navigate(['establishments/detail/'+ this.idEstablishment]);
  }
  
  loadTableItemProduct(){
    
    this.dataSource = new MatTableDataSource(this.itemProduct);
    setTimeout(()=>{                           
      this.loadPaginator(this.dataSource);
  }, 1000);
    this.loadingItemProduct = false;
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
    this.router.navigate(['establishments/detail/'+ this.idEstablishment + '/detail-product/'+ this.idProduct + '/detail-item-product/' + id]);
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
    this.loadTableItemProduct();
  }

  loadDataItemProduct(idEstablishment:string, idProduct:string ){
    this.establishmentService.getAllItemProduct(idEstablishment, idProduct).subscribe((response:ItemProductModel[]) => {
        this.itemProduct = response;
    })
  }

  newItemProduct(){
    this.router.navigate(['detail/'+ this.idEstablishment +'/detail-product/' + this.idProduct +  '/new-item-product']);
  }
}
