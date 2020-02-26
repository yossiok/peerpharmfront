import { TestBed } from '@angular/core/testing';

import { ArrayServiceService } from './array-service.service';

describe('ArrayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArrayServiceService = TestBed.get(ArrayServiceService);
    expect(service).toBeTruthy();
  });
});
