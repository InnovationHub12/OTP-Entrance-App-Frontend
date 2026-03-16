import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateVehicleLog } from './state-vehicle-log';

describe('StateVehicleLog', () => {
  let component: StateVehicleLog;
  let fixture: ComponentFixture<StateVehicleLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateVehicleLog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateVehicleLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
