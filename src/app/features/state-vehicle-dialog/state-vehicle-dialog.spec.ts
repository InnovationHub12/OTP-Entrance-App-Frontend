import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateVehicleDialog } from './state-vehicle-dialog';

describe('StateVehicleDialog', () => {
  let component: StateVehicleDialog;
  let fixture: ComponentFixture<StateVehicleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateVehicleDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateVehicleDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
