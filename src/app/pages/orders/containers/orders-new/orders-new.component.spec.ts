import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersNewComponent } from './orders-new.component';

describe('OrdersNewComponent', () => {
  let component: OrdersNewComponent;
  let fixture: ComponentFixture<OrdersNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
