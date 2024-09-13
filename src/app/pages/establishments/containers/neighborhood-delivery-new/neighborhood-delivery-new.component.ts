import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { neighborhoodsDATA } from 'src/app/consts/neighborhood';
import { AddressNeighborhoodsModel } from 'src/app/models/addressNeighborhoodsModel';
import { NeighborhoodsDataModel } from 'src/app/models/neighborhoodsDataModel';
import { NeighborhoodModel } from 'src/app/models/neighborhoodsModel';
import { EstablishmentsService } from '../../services/establishments.service';

@Component({
  selector: 'app-neighborhood-delivery-new',
  templateUrl: './neighborhood-delivery-new.component.html',
  styleUrls: ['./neighborhood-delivery-new.component.css']
})
export class NeighborhoodDeliveryNewComponent implements OnInit {
  public idEstablishment;
  public loading: boolean = false;
  public formNeighborhoodDelivery: FormGroup;
  public date: any;
  public requestNeighborhoodDelivery: NeighborhoodModel;
  public neighborhoods: AddressNeighborhoodsModel = neighborhoodsDATA;
  public neighborhoodsDATA: NeighborhoodsDataModel[];
  public neighborhoodsDeliveryData: NeighborhoodModel[];
  constructor(private establishmentService: EstablishmentsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.neighborhoodsDATA = neighborhoodsDATA.city[0].neighborhood;
    this.idEstablishment = this.route.snapshot.paramMap.get('id');
    this.loadNeighborhoodDelivery(this.idEstablishment);
    this.formNeighborhoodDelivery = new FormGroup({
      name: new FormControl('', [Validators.required]),
      deliveryFee: new FormControl('', [Validators.required])
    });
  }

  loadNeighborhoodDelivery(id: string) {
    this.establishmentService.getNeighborhoodDelivery(id).subscribe(response => {
      this.neighborhoodsDeliveryData = response;

    });
  }

  submit() {
    if (this.formNeighborhoodDelivery.valid) {
      const neighborhood = this.formNeighborhoodDelivery.get('name').value;
      this.date = Date.now();
      this.requestNeighborhoodDelivery = {
        name: neighborhood.name,
        zone: neighborhood.zone,
        deliveryFee: this.formNeighborhoodDelivery.get('deliveryFee').value,
        isDeliver: true,
        dateCreated: this.date,
        idEstablishment: this.idEstablishment,
        idNeighborhood: neighborhood.id
      }
      const existNeighborhoodDelivery = this.neighborhoodsDeliveryData.some(find => find.idNeighborhood === this.requestNeighborhoodDelivery.idNeighborhood);
      if (existNeighborhoodDelivery) {
        alert('ESSE BAIRRO JÁ ESTÁ CADASTRADO, TENTE OUTRO');
      } else {
        this.loading = true;
        setTimeout(() => {
          this.sendNeighborhoodDelivery(this.requestNeighborhoodDelivery);
        }, 3000);
      }

    }
    else {
      console.error("ERRO DE VALIDAÇÃO DO FORMULARIO")
    }
  }

  sendNeighborhoodDelivery(product: NeighborhoodModel) {
    this.establishmentService.createNeighborhoodDelivery(product, this.idEstablishment);
    this.loading = false;
    this.router.navigate(['establishments/detail/' + this.idEstablishment]);
  }

}


