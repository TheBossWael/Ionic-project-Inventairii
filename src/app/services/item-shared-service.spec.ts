import { TestBed } from '@angular/core/testing';

import { ItemSharedService } from './item-shared-service';

describe('ItemSharedService', () => {
  let service: ItemSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
