import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemOptionDetailComponent } from './product-item-option-detail.component';

describe('ProductItemOptionDetailComponent', () => {
  let component: ProductItemOptionDetailComponent;
  let fixture: ComponentFixture<ProductItemOptionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductItemOptionDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductItemOptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
