import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodDeliveryDetailComponent } from './neighborhood-delivery-detail.component';

describe('NeighborhoodDeliveryDetailComponent', () => {
  let component: NeighborhoodDeliveryDetailComponent;
  let fixture: ComponentFixture<NeighborhoodDeliveryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeighborhoodDeliveryDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeighborhoodDeliveryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
