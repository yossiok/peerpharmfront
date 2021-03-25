import { TestBed } from '@angular/core/testing';

import { OutServiceService } from './out-service.service';

describe('OutServiceService', () => {
  let service: OutServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
