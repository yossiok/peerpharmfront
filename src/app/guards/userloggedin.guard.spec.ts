import { TestBed, async, inject } from '@angular/core/testing';

import { UserloggedinGuard } from './userloggedin.guard';

describe('UserloggedinGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserloggedinGuard]
    });
  });

  it('should ...', inject([UserloggedinGuard], (guard: UserloggedinGuard) => {
    expect(guard).toBeTruthy();
  }));
});
