import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessGranted } from './access-granted';

describe('AccessGranted', () => {
  let component: AccessGranted;
  let fixture: ComponentFixture<AccessGranted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessGranted]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessGranted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
