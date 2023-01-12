import { TestBed } from '@angular/core/testing';

import { ShellsService } from './shells.service';

describe('ShellsService', () => {
  let service: ShellsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
