import { TestBed, async, inject } from '@angular/core/testing';

import { ScreenGuard } from './screen.guard';

describe('ScreenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenGuard]
    });
  });

  it('should ...', inject([ScreenGuard], (guard: ScreenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
