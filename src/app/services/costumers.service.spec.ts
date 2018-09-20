import { TestBed, inject } from '@angular/core/testing';

import { CostumersService } from './costumers.service';

describe('CostumersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CostumersService]
    });
  });

  it('should be created', inject([CostumersService], (service: CostumersService) => {
    expect(service).toBeTruthy();
  }));
});
