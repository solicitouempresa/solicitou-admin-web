import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EstablishmentModel } from 'src/app/models/establishment';
import { HeadquartersModel } from 'src/app/models/headquarters';
import { __await } from 'tslib';
import { User } from '../../auth/models';
import { EstablishmentsService } from '../services/establishments.service';

@Component({
  selector: 'app-establishments',
  templateUrl: './establishments.component.html',
  styleUrls: ['./establishments.component.css']
})
export class EstablishmentsComponent implements OnInit {
  headquarters:Observable<HeadquartersModel[]>;
  establishmentsObserver:Observable<EstablishmentModel[]>;
  establishments:EstablishmentModel[];
  displayedColumns: string[] = ['id', 'name', 'district', 'city', 'editar', 'excluir','desativar'];
  dataSource: MatTableDataSource<EstablishmentModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading:boolean = true;
  // dataLoaded:boolean = false;
  // data:any;
  constructor(private establishmentService:EstablishmentsService, private router:Router, private route:ActivatedRoute) {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
  }
  ngOnInit(): void {
    this.loadData();
  }

   loadData(){
    this.loading = true;
    this.establishmentsObserver = this.establishmentService.getAllEstablishments();
    this.establishmentsObserver.subscribe((resp) =>{
      this.establishments = resp;
    });

    setTimeout(()=>{                           
      this.loadTable(this.establishments);
  }, 3000);
  }
  
  loadTable(establishment:EstablishmentModel[]){
    this.dataSource = new MatTableDataSource(establishment);
    setTimeout(()=>{                           
      this.loadPaginator(this.dataSource);
  }, 1000);
    this.loading = false;
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

  newEstablishment(){
    this.router.navigate(['new'], {relativeTo:this.route});
  }

  edit(id:number){
    this.router.navigate(['detail/'+ id], {relativeTo:this.route});
  }

  delete(id:number){

  }

  deactivate(establishment:EstablishmentModel){
    if(establishment.statusActive){
      establishment.statusActive = false;
    }
    else{
      establishment.statusActive = true;
    }
    this.establishmentService.update(establishment);
    this.loadData();
  }
}



