import { TestBed } from '@angular/core/testing';

import { MakeupService } from './makeup.service';

describe('MakeupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MakeupService = TestBed.get(MakeupService);
    expect(service).toBeTruthy();
  });
});
