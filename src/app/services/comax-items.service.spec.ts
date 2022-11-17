import { TestBed } from '@angular/core/testing';

import { ComaxItemsService } from './comax-items.service';

describe('ComaxItemsService', () => {
  let service: ComaxItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComaxItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
