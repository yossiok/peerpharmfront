import { TestBed } from '@angular/core/testing';

import { InventoryRequestService } from './inventory-request.service';

describe('InventoryRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryRequestService = TestBed.get(InventoryRequestService);
    expect(service).toBeTruthy();
  });
});
