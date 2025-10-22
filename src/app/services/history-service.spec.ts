import { TestBed } from '@angular/core/testing';

import { HistoryFirebaseService } from './history-service';

describe('HistoryService', () => {
  let service: HistoryFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
