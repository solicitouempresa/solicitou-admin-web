import { TestBed } from '@angular/core/testing';

import { EstablishmentsServiceService } from './establishments.service';

describe('EstablishmentsServiceService', () => {
  let service: EstablishmentsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstablishmentsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
