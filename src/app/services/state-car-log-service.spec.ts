import { TestBed } from '@angular/core/testing';

import { StateCarLogService } from './state-car-log-service';

describe('StateCarLogService', () => {
  let service: StateCarLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateCarLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
