import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemOptionNewComponent } from './product-item-option-new.component';

describe('ProductItemOptionNewComponent', () => {
  let component: ProductItemOptionNewComponent;
  let fixture: ComponentFixture<ProductItemOptionNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductItemOptionNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductItemOptionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
