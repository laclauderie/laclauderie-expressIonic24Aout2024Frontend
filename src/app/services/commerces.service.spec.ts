import { TestBed } from '@angular/core/testing';

import { CommercesService } from './commerces.service';

describe('CommercesService', () => {
  let service: CommercesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommercesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
