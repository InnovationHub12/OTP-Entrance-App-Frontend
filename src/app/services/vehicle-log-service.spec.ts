import { TestBed } from '@angular/core/testing';

import { VehicleLogService } from './vehicle-log-service';

describe('VehicleLogService', () => {
  let service: VehicleLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
