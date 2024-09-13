import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemNewComponent } from './product-item-new.component';

describe('ProductItemNewComponent', () => {
  let component: ProductItemNewComponent;
  let fixture: ComponentFixture<ProductItemNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductItemNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductItemNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
