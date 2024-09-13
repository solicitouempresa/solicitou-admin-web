import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeighborhoodDeliveryNewComponent } from './neighborhood-delivery-new.component';

describe('NeighborhoodDeliveryNewComponent', () => {
  let component: NeighborhoodDeliveryNewComponent;
  let fixture: ComponentFixture<NeighborhoodDeliveryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeighborhoodDeliveryNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeighborhoodDeliveryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
