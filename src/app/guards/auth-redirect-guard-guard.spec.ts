import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authRedirectGuard } from './auth-redirect-guard-guard';

describe('authRedirectGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
