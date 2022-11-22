import { TestBed } from '@angular/core/testing';

import { LoginVerifyService } from './login-verify.service';

describe('LoginVerifyService', () => {
  let service: LoginVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
