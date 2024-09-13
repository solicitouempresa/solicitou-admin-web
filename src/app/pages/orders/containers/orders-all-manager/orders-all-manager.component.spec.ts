import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersAllManagerComponent } from './orders-all-manager.component';

describe('OrdersAllManagerComponent', () => {
  let component: OrdersAllManagerComponent;
  let fixture: ComponentFixture<OrdersAllManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersAllManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersAllManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
