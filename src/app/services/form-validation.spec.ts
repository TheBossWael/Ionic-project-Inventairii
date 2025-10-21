import { TestBed } from '@angular/core/testing';

import { FormValidation } from './form-validation';

describe('FormValidation', () => {
  let service: FormValidation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
