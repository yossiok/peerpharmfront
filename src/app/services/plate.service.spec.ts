import { TestBed, inject } from '@angular/core/testing';

import { PlateService } from './plate.service';

describe('PlateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlateService]
    });
  });

  it('should be created', inject([PlateService], (service: PlateService) => {
    expect(service).toBeTruthy();
  }));
});
