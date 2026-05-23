import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isAnonymousGuard } from './is-anonymous-guard';

describe('isAnonymousGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isAnonymousGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
