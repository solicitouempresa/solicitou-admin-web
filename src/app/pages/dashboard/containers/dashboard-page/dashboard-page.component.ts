import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardService } from '../../services';
import {
  DailyLineChartData,
  PerformanceChartData,
  ProjectStatData,
  RevenueChartData,
  ServerChartData,
  SupportRequestData,
  VisitsChartData
} from '../../models';
import { OrdersService } from 'src/app/pages/orders/services/orders.service';
import { OrderModel } from 'src/app/models/orderModel';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  public dailyLineChartData$: Observable<DailyLineChartData>;
  public performanceChartData$: Observable<PerformanceChartData>;
  public revenueChartData$: Observable<RevenueChartData>;
  public serverChartData$: Observable<ServerChartData>;
  public supportRequestData$: Observable<SupportRequestData[]>;
  public visitsChartData$: Observable<VisitsChartData>;
  public projectsStatsData$: Observable<ProjectStatData>;
  data:any;
  loading:boolean;
  valuesWin: number = 0;
  countSale:number = 0;
  sysdate:Date;
  establishmentActive:number;

  constructor(private service: DashboardService, private orderService:OrdersService) {
    // this.dailyLineChartData$ = this.service.loadDailyLineChartData();
    // this.performanceChartData$ = this.service.loadPerformanceChartData();
    // this.revenueChartData$ = this.service.loadRevenueChartData();
    // this.serverChartData$ = this.service.loadServerChartData();
    // this.supportRequestData$ = this.service.loadSupportRequestData();
    // this.visitsChartData$ = this.service.loadVisitsChartData();
    // this.projectsStatsData$ = this.service.loadProjectsStatsData();
    this.data = [{'name':'a','age':20},{'name':'b','age':30} ]
    this.sysdate = new Date();
  }

  ngOnInit(): void {
    this.loading = true;
      this.orderService.getllOrder().subscribe((response:OrderModel[]) => {
        console.log(response);
        this.countSale = response.length;
  
        this.valuesWin = this.someAllAmount(response);
      });
      setTimeout(() => {
        this.setLoading();
      }, 3000);
  }

  someAllAmount(orders:OrderModel[]){
    let valueTotal = 0;
    let values:Array<number> = [];
    orders.forEach(element => {
      if(element.statusPayment === 'PAGO' && element.statusOrder === 'FINALIZADO'){
        values.push(element.rateService);
      }
        
    });
    valueTotal =  values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      valueTotal
    );
    this.loading = false;
    return valueTotal;
  }

  setLoading(){
    this.loading = false;
  }
}
