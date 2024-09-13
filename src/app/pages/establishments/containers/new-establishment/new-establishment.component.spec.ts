import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEstablishmentComponent } from './new-establishment.component';

describe('NewEstablishmentComponent', () => {
  let component: NewEstablishmentComponent;
  let fixture: ComponentFixture<NewEstablishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEstablishmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEstablishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
