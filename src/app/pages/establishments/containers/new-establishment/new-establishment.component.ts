import { Appearance, GermanAddress, Location } from '@angular-material-extensions/google-maps-autocomplete';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentModel } from 'src/app/models/establishment';
import { ImageService } from 'src/app/shared/image/services/image.service';
import { EstablishmentsService } from '../../services/establishments.service';
import PlaceResult = google.maps.places.PlaceResult;
import { setDoc } from 'firebase/firestore';
import { EstablishmentHoursModel } from 'src/app/models/establishmentHours';
@Component({
  selector: 'app-new-establishment',
  templateUrl: './new-establishment.component.html',
  styleUrls: ['./new-establishment.component.css']
})
export class NewEstablishmentComponent implements OnInit {

  public formEstablishment: FormGroup;
  public requestEstablishment: EstablishmentModel;
  public hoursEstablishment: EstablishmentHoursModel;
  public loading:boolean = false;
  public date:any;
  public categoryRestaurant = [];
  public categoryEstablishment = [];
  public typesPix = [];
  public imageUploaded;
  public timestamp;
  public urlImage;
  public imagePreview;

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

  weekDays = [
    { label: 'Segunda-feira', controlName: 'mon' },
    { label: 'Terça-feira', controlName: 'tue' },
    { label: 'Quarta-feira', controlName: 'wed' },
    { label: 'Quinta-feira', controlName: 'thu' },
    { label: 'Sexta-feira', controlName: 'fri' },
    { label: 'Sábado', controlName: 'sat' },
    { label: 'Domingo', controlName: 'su' }
  ];

  // addressValue: GermanAddress = {
  //   streetNumber: '100',
  //   streetName: 'Your StreetName',
  //   vicinity: 'Your vicinity',
  //   postalCode: 37084,
  //   locality: {
  //     long: 'your locality'
  //   }
  // };
  
  constructor(private uploadService: ImageService, private establishmentService: EstablishmentsService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {

    this.loadCategoryEstablishment();
    this.loadCategoryRestaurant();
    this.loadTypePix();

    this.formEstablishment = new FormGroup({
      name: new FormControl('', [Validators.required]),
      urlName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9-]+$/)
      ]),
      cnpj: new FormControl('', [Validators.required]),
      typeEstablishment: new FormControl('', [Validators.required]),
      typeRestaurant: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      complement: new FormControl(''),
      reference:new FormControl(''),
      urlImage:new FormControl('', [Validators.required]),
      pixNumber:new FormControl(''),
      pixName:new FormControl(''),
      pixType:new FormControl(''),
      ddd:new FormControl('', [Validators.required]),
      numberContact:new FormControl('', [Validators.required]),
      numberWhatsapp:new FormControl(''),
      numberTelegram:new FormControl(''),
      deliveryCostToKm:new FormControl(''),
      login:new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.email]),
      feeProduct:new FormControl('', [Validators.required]),
      initialDeliveryFee:new FormControl('', [Validators.required]),
      addFromKm:new FormControl('', [Validators.required]),
      agendamento:new FormControl('', [Validators.required]),
      mon: new FormControl('',[Validators.required]),
      tue: new FormControl('',[Validators.required]),
      wed: new FormControl('',[Validators.required]),
      thu: new FormControl('',[Validators.required]),
      fri: new FormControl('',[Validators.required]),
      sat: new FormControl('',[Validators.required]),
      su: new FormControl('',[Validators.required]),
    });

  }

  // private setCurrentPosition() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 12;
  //     });
  //   }
  // }

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

  // onGermanAddressMapped($event: GermanAddress) {
  //   console.log('onGermanAddressMapped', $event);
  // }


  public loadCategoryEstablishment(){
    this.categoryEstablishment = [
      {'name':'Comida', 'id': 1},
      {'name':'Farmácia', 'id': 2},
      {'name':'Pet-Shop', 'id': 3},
      {'name':'Mercado', 'id': 4},
      {'name':'Roupas, Bolsas e Acessórios', 'id': 5},
      {'name':'Beleza, Estética e Barberia', 'id': 6},
      {'name':'Escritórios', 'id': 7},
      {'name':'Saúde', 'id': 8},
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

  public loadTypePix(){
    this.typesPix = [
      {'name':'CPF', 'id': 1},
      {'name':'CNPJ', 'id': 2},
      {'name':'Número Telefone', 'id': 3},
      {'name':'E-mail', 'id': 4},
      {'name':'Chave Aleatória', 'id': 5}
    ];
    
    
  }

  submit() {
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
        idCategoryEstablishment: this.formEstablishment.get('typeEstablishment').value,
        idTypeRestaurant: this.formEstablishment.get('typeRestaurant').value,
        name: this.formEstablishment.get('name').value,
        urlName: this.formEstablishment.get('urlName').value, 
        cnpj: this.formEstablishment.get('cnpj').value,
        number:this.formEstablishment.get('number').value,
        statusActive:true,
        typeEstablishment:idCategoryEstablishment.name,
        typeRestaurant:idTypeRestaurant.name,
        urlImage:this.urlImage,
        zipcode:this.formEstablishment.get('zipcode').value,
        dateCreated:this.date,
        dateUpdate:this.date,
        pixNumber:this.formEstablishment.get('pixNumber').value,
        pixName:this.formEstablishment.get('pixName').value,
        pixType:this.formEstablishment.get('pixType').value,
        ddd:this.formEstablishment.get('ddd').value,
        numberContact:this.formEstablishment.get('numberContact').value,
        numberWhatsapp:this.formEstablishment.get('numberWhatsapp').value,
        numberTelegram:this.formEstablishment.get('numberTelegram').value,
        // deliveryFee:this.formEstablishment.get('deliveryFee').value,
        deliveryCostToKm:this.formEstablishment.get('deliveryCostToKm').value,
        login:this.formEstablishment.get('login').value,
        password:this.formEstablishment.get('password').value,
        email:this.formEstablishment.get('email').value,
        reference:this.formEstablishment.get('reference').value,
        complement:this.formEstablishment.get('complement').value,
        address:this.address,
        latitude: this.latitude,
        longitude: this.longitude,
        country:this.country,
        categoryEstablishment: idCategoryEstablishment.name,
        deliveryOpen: true,
        district:this.district,
        open:true,
        uf:this.uf,
        city:this.city,
        street: this.street,
        state:this.state,
        feeProduct:this.formEstablishment.get('feeProduct').value,
        initialDeliveryFee:this.formEstablishment.get('initialDeliveryFee').value,
        addFromKm:this.formEstablishment.get('addFromKm').value,
        agendamento:this.formEstablishment.get('agendamento').value,
        hours: {
          mon: this.formEstablishment.get('mon').value,
          tue: this.formEstablishment.get('tue').value,
          wed: this.formEstablishment.get('wed').value,
          thu: this.formEstablishment.get('thu').value,
          fri: this.formEstablishment.get('fri').value,
          sat: this.formEstablishment.get('sat').value,
          su: this.formEstablishment.get('su').value,
        }
        
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

  sendEstablishment(establishment: EstablishmentModel) {
    this.establishmentService.create(establishment).then(docRef => {
      establishment.id = docRef.id; 
      return setDoc(docRef, establishment);
    }).then(() => {
      this.uploadService.fileUploadEstablishment(this.imageUploaded, this.timestamp);
      this.loading = false;
      this.router.navigate(['establishments']);
    }).catch(error => {
      console.error("Erro ao criar o estabelecimento: ", error);
      this.loading = false;
    });
  }
  

  receiveImage(file){
    const urlAws = 'https://hamgus-establishments-assets.s3.us-east-2.amazonaws.com/';
    const current = new Date();
    const timestamp = current.getTime();
    this.imageUploaded = file;
    this.timestamp = timestamp;
    this.urlImage = urlAws + this.imageUploaded.name + timestamp;
    this.formEstablishment.controls['urlImage'].setValue(this.urlImage);
    // console.log(file);
  }

  formatHours(event: any): void {
    let input = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (input.length <= 4) {
      input = input.replace(/(\d{2})(\d{0,2})/, '$1:$2'); // Formato HH:mm para abertura
    } else if (input.length <= 8) {
      input = input.replace(/(\d{2})(\d{2})(\d{2})(\d{0,2})/, '$1:$2-$3:$4'); // Formato HH:mm-HH:mm sem espaços
    }
    event.target.value = input;
  }
  
  


}
