import { TestBed } from '@angular/core/testing';

import { VehicleImageService } from './vehicle-image-service';

describe('VehicleImageService', () => {
  let service: VehicleImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
