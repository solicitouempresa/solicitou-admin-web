import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoryProductComponent } from './new-category-product.component';

describe('NewCategoryProductComponent', () => {
  let component: NewCategoryProductComponent;
  let fixture: ComponentFixture<NewCategoryProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCategoryProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCategoryProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
