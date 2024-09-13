import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentModel } from 'src/app/models/establishment';
import { MenuModel } from 'src/app/models/menuModel';
import { ImageService } from 'src/app/shared/image/services/image.service';
import { EstablishmentsService } from '../../services/establishments.service';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';
import { NeighborhoodModel } from 'src/app/models/neighborhoodsModel';
import { CategoryProductModel } from 'src/app/models/categoryProduct';

@Component({
  selector: 'app-establishment-detail',
  templateUrl: './establishment-detail.component.html',
  styleUrls: ['./establishment-detail.component.css']
})
export class EstablishmentDetailComponent implements OnInit {

  public loading: boolean = false;
  public formEstablishment: FormGroup;
  public establishment:EstablishmentModel;
  public menu:MenuModel[];
  public categoryProducts:CategoryProductModel[];
  public date:any;
  public requestEstablishment: EstablishmentModel;
  public categoryRestaurant = [];
  public categoryEstablishment = [];
  public dataSource: MatTableDataSource<MenuModel>;
  public dataSourceCategoryProduct: MatTableDataSource<CategoryProductModel>;
  public idEstablishment;
  public imageUploaded;
  public timestamp;
  public urlImage;
  public typesPix = [];
  public urlImageDefault;

  public appearance = Appearance;
  public zoom: number;
  public latitude: number = null;
  public longitude: number = null;
  public selectedAddress: PlaceResult;

  public street:string;
  public uf: string;
  public state: string;
  public city: string;
  public country: string;
  public district: string;
  public address: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id', 'name', 'price', 'status', 'sequence','editar','desativar'];
  @Input() valor: string;

  @ViewChild(MatPaginator) paginatorCategoryProduct: MatPaginator;
  @ViewChild(MatSort) sortCategoryProduct: MatSort;
  displayedColumnsCategoryProduct: string[] = ['id', 'name', 'sequence','status','editar','desativar'];

  constructor(private uploadService: ImageService, private route: ActivatedRoute, private establishmentService:EstablishmentsService, private routeNavigate:Router) { }

  ngOnInit(): void {
    this.urlImageDefault = 'https://hamgus-establishments-assets.s3.us-east-2.amazonaws.com/default-logotipo-establishment.jpg';
    this.loadEstablishmentId();
    this.loadTypePix();  
    this.loadCategoryEstablishment();
    this.loadCategoryRestaurant();
    this.loadMenu();
    this.loadCategoryProducts();
    setTimeout(()=>{                           
      this.loadForm();
      this.loadTable(this.menu);
      this.loadTableCategoryProduct(this.categoryProducts);
  }, 2000);
  }

  onAutocompleteSelected(result: PlaceResult) {
    this.address = result.formatted_address;
    if(result.address_components.length > 0 ){
      result.address_components.forEach(element => {
      if(element.types[0] == 'route'){
        this.street = element.long_name;
      }
      if(element.types[0] == 'sublocality_level_1'){
        this.district = element.long_name;
      }
      if(element.types[0] == 'administrative_area_level_2'){
        this.city = element.long_name;
      }
      if(element.types[0] == 'administrative_area_level_1'){
        this.uf = element.short_name;
      }
      if(element.types[0] == 'administrative_area_level_1'){
        this.state = element.long_name;
      }
      if(element.types[0] == 'country'){
        this.country = element.long_name;
      }
    });
  }
  }

  onLocationSelected(location: Location) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
   
  }

  public loadEstablishmentId(){
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    this.establishmentService.getId(this.idEstablishment).subscribe((resp:EstablishmentModel)=>{
      this.establishment = resp;
      this.address = this.establishment.address ? this.establishment.address: null;
      this.latitude = this.establishment.latitude ? this.establishment.latitude: null;
      this.longitude = this.establishment.longitude ? this.establishment.longitude: null;
      this.country = this.establishment.country ? this.establishment.country: null;
      this.district = this.establishment.district ? this.establishment.district: null;
      this.uf = this.establishment.uf ? this.establishment.uf: null;
      this.city = this.establishment.city ? this.establishment.city: null;
      this.street = this.establishment.street ? this.establishment.street: null;
      this.state = this.establishment.state ? this.establishment.state: null;
      if(this.establishment && this.establishment.urlImage !== '' && this.establishment.urlImage !== null && this.establishment.urlImage !== undefined){
        this.urlImageDefault = this.establishment.urlImage;
      }
      
    })
  }

  loadTable(menu:MenuModel[]){
    this.dataSource = new MatTableDataSource(menu);
    setTimeout(()=>{                           
      this.loadPaginator(this.dataSource);
  }, 1000);
    this.loading = false;
  }

  loadTableCategoryProduct(categoryProducts:CategoryProductModel[]){
    this.dataSourceCategoryProduct = new MatTableDataSource(categoryProducts);
    setTimeout(()=>{                           
      this.loadPaginatorCategoryProducts(this.dataSourceCategoryProduct);
  }, 1000);
    this.loading = false;
  }

  public loadMenu(){
    this.loading = true;
    this.establishmentService.getMenu(this.idEstablishment).subscribe((resp:MenuModel[])=>{
      this.menu = resp.sort(this.compareProduct);
    })
  }

  public loadCategoryProducts(){
    this.loading = true;
    this.establishmentService.getAllCategoryProduct(this.idEstablishment).subscribe((resp:CategoryProductModel[])=>{
      this.categoryProducts = resp.sort(this.compareCategoryProduct);
    })
  }

  public loadCategoryEstablishment(){
    this.categoryEstablishment = [
      {'name':'Comida', 'id': 1},
      {'name':'Farmácia', 'id': 2},
      {'name':'Pet-Shop', 'id': 3},
      {'name':'Mercado', 'id': 4}
    ];
  }

  public loadCategoryRestaurant(){
    this.categoryRestaurant = [
      {'name':'Lanchonete', 'id': 1},
      {'name':'Japonesa', 'id': 2},
      {'name':'Restaurante', 'id': 3},
      {'name':'Doceria', 'id': 4}
    ];
    
    
  }

  public loadForm(){
    this.formEstablishment = new FormGroup({
      name: new FormControl(this.establishment?.name, [Validators.required]),
      urlName: new FormControl(this.establishment?.urlName, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9-]+$/)
      ]),
      cnpj: new FormControl(this.establishment?.cnpj, [Validators.required]),
      typeEstablishment: new FormControl(this.establishment?.idCategoryEstablishment, [Validators.required]),
      typeRestaurant: new FormControl(this.establishment?.idTypeRestaurant, [Validators.required]),
      zipcode: new FormControl(this.establishment?.zipcode, [Validators.required]),
      number: new FormControl(this.establishment?.number, [Validators.required]),
      complement: new FormControl(this.establishment?.complement),
      reference:new FormControl(this.establishment?.reference),
      urlImage:new FormControl(this.establishment?.urlImage, [Validators.required]),
      pixNumber:new FormControl(this.establishment?.pixNumber),
      pixName:new FormControl(this.establishment?.pixName),
      pixType:new FormControl(this.establishment?.pixType),
      ddd:new FormControl(this.establishment?.ddd, [Validators.required]),
      numberContact:new FormControl(this.establishment?.numberContact, [Validators.required]),
      numberWhatsapp:new FormControl(this.establishment?.numberWhatsapp),
      numberTelegram:new FormControl(this.establishment?.numberTelegram),
      // deliveryFee:new FormControl(this.establishment.deliveryFee, [Validators.required]),
      deliveryCostToKm:new FormControl(this.establishment?.deliveryCostToKm, [Validators.required]),
      login:new FormControl(this.establishment?.login,[Validators.required]),
      password: new FormControl(this.establishment?.password,[Validators.required]),
      email: new FormControl(this.establishment?.email,[Validators.email]),
      feeProduct:new FormControl(this.establishment?.feeProduct, [Validators.required]),
      initialDeliveryFee:new FormControl(this.establishment?.initialDeliveryFee, [Validators.required]),
      addFromKm:new FormControl(this.establishment?.addFromKm, [Validators.required]),
      agendamento:new FormControl(this.establishment?.agendamento, [Validators.required])
    });
    this.loading = false;
  }

  public submit(){
    if(this.latitude != null && this.longitude != null){
    let idCategoryEstablishment;
    let idTypeRestaurant;
    idCategoryEstablishment = this.categoryEstablishment.find(f =>
      f.id == +this.formEstablishment.get('typeEstablishment').value
    );
    idTypeRestaurant = this.categoryRestaurant.find(f=>
      f.id == +this.formEstablishment.get('typeRestaurant').value
    );

    if (this.formEstablishment.valid) {
      this.date = Date.now();
      this.requestEstablishment = {
        address: this.address,
        id: this.establishment.id,
        idCategoryEstablishment: this.formEstablishment.get('typeEstablishment').value,
        idTypeRestaurant: this.formEstablishment.get('typeRestaurant').value,
        name: this.formEstablishment.get('name').value,
        urlName: this.formEstablishment.get('urlName').value,
        cnpj: this.formEstablishment.get('cnpj').value,
        number:this.formEstablishment.get('number').value,
        typeEstablishment: idCategoryEstablishment.name,
        typeRestaurant: idTypeRestaurant.name,
        zipcode:this.formEstablishment.get('zipcode').value,
        dateUpdate:this.date,
        urlImage: this.formEstablishment.get('urlImage').value,
        pixNumber:this.formEstablishment.get('pixNumber').value,
        pixName:this.formEstablishment.get('pixName').value,
        pixType:this.formEstablishment.get('pixType').value,
        ddd:this.formEstablishment.get('ddd').value,
        numberContact:this.formEstablishment.get('numberContact').value,
        numberWhatsapp:this.formEstablishment.get('numberWhatsapp').value,
        numberTelegram:this.formEstablishment.get('numberTelegram').value,
        deliveryCostToKm:this.formEstablishment.get('deliveryCostToKm').value,
        login:this.formEstablishment.get('login').value,
        password:this.formEstablishment.get('password').value,
        email:this.formEstablishment.get('email').value,
        reference:this.formEstablishment.get('reference').value,
        complement:this.formEstablishment.get('complement').value,
        latitude: this.latitude,
        longitude: this.longitude,
        country:this.country,
        categoryEstablishment: idCategoryEstablishment.name,
        district:this.district,
        uf:this.uf,
        city:this.city,
        street: this.street,
        state:this.state,
        feeProduct:this.formEstablishment.get('feeProduct').value,
        initialDeliveryFee:this.formEstablishment.get('initialDeliveryFee').value,
        addFromKm:this.formEstablishment.get('addFromKm').value,
        agendamento:this.formEstablishment.get('agendamento').value
    }
      this.loading = true;
      setTimeout(()=>{                           
        this.sendEstablishment(this.requestEstablishment);
    }, 3000);
       
    }
    else {

      console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
    }
  }
  else {
    alert('Você precisa selecionar um endereço')
  }
  }

  sendEstablishment(establishment){
    this.establishmentService.update(establishment);
    if(this.imageUploaded != '' && this.imageUploaded != null && this.imageUploaded != undefined){
      this.uploadService.fileUploadEstablishment(this.imageUploaded, this.timestamp);
    };
    this.loading = false;
    this.routeNavigate.navigate(['establishments']);
  }

  submitMenu(){
    this.routeNavigate.navigate(['detail/'+ this.idEstablishment +'/new-product']);
  }

  submitCategoryProduct(){
    this.routeNavigate.navigate(['detail/'+ this.idEstablishment +'/new-category-product']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterNeighborhood(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCategoryProduct.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceCategoryProduct.paginator) {
      this.dataSourceCategoryProduct.paginator.firstPage();
    }
  }

  edit(id:number){
    this.routeNavigate.navigate(['detail/'+ this.idEstablishment +'/detail-product/'+ id]);
  }

  editCategoryProduct(id:number){
    this.routeNavigate.navigate(['detail/'+ this.idEstablishment +'/detail-category-product/'+ id]);
  }

  delete(id:number){

  }

  deactivate(product:MenuModel){
    if(product.statusActive){
      product.statusActive = false;
    }
    else{
      product.statusActive = true;
    }
    this.establishmentService.updateProduct(product, this.idEstablishment);
    // this.loadData();
  }

  deactivateCategoryProduct(categoryProduct:CategoryProductModel){
    if(categoryProduct.status){
      categoryProduct.status = false;
    }
    else{
      categoryProduct.status = true;
    }
    this.establishmentService.updateCategoryProduct(categoryProduct, this.idEstablishment, categoryProduct.id);
    // this.loadData();
  }

  loadPaginator(datasource){
    datasource.paginator = this.paginator;
    datasource.sort = this.sort;
  }

  loadPaginatorCategoryProducts(datasource){
    datasource.paginator = this.paginatorCategoryProduct;
    datasource.sort = this.sortCategoryProduct;
  }

  receiveImage(file){
    const urlAws = 'https://hamgus-establishments-assets.s3.us-east-2.amazonaws.com/';
    const current = new Date();
    const timestamp = current.getTime();
    this.imageUploaded = file;
    this.timestamp = timestamp;
    this.urlImage = urlAws + this.imageUploaded.name + timestamp;
    this.formEstablishment.controls['urlImage'].setValue(this.urlImage);
  }

  public loadTypePix(){
    this.typesPix = [
      {'name':'CPF', 'id': 1},
      {'name':'CNPJ', 'id': 2},
      {'name':'Número Telefone', 'id': 3},
      {'name':'E-mail', 'id': 4},
      {'name':'Chave Aleatória', 'id': 5}
    ];
    
    
  }

  back(){
    this.routeNavigate.navigate(['establishments']);
  }

  compareProduct(a: MenuModel, b: MenuModel) {
    if (a.sequence < b.sequence)
      return -1;
    if (a.sequence > b.sequence)
      return 1;
    return 0;
  }

  compareCategoryProduct(a: CategoryProductModel, b: CategoryProductModel) {
    if (a.sequence < b.sequence)
      return -1;
    if (a.sequence > b.sequence)
      return 1;
    return 0;
  }

}
