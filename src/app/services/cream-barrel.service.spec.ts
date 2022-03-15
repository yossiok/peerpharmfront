import { TestBed } from '@angular/core/testing';

import { CreamBarrelService } from './cream-barrel.service';

describe('CreamBarrelService', () => {
  let service: CreamBarrelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreamBarrelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
