import { TestBed, inject } from '@angular/core/testing';

import { BatchesService } from './batches.service';

describe('BatchesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BatchesService]
    });
  });

  it('should be created', inject([BatchesService], (service: BatchesService) => {
    expect(service).toBeTruthy();
  }));
});
