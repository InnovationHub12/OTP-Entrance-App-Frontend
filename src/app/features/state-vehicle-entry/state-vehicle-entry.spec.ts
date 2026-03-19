import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateVehicleEntry } from './state-vehicle-entry';

describe('StateVehicleEntry', () => {
  let component: StateVehicleEntry;
  let fixture: ComponentFixture<StateVehicleEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateVehicleEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateVehicleEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
