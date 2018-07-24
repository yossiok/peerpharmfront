import { TestBed, inject } from '@angular/core/testing';

import { FormulesService } from './formules.service';

describe('FormulesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormulesService]
    });
  });

  it('should be created', inject([FormulesService], (service: FormulesService) => {
    expect(service).toBeTruthy();
  }));
});
