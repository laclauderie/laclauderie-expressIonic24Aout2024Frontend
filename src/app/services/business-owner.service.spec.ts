import { TestBed } from '@angular/core/testing';

import { BusinessOwnerService } from './business-owner.service';

describe('BusinessOwnerService', () => {
  let service: BusinessOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessOwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
