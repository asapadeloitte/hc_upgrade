import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardsFromStaffingPlanQHPComponent } from './onboards-from-staffing-plan-qhp.component';

describe('OnboardsFromStaffingPlanQHPComponent', () => {
  let component: OnboardsFromStaffingPlanQHPComponent;
  let fixture: ComponentFixture<OnboardsFromStaffingPlanQHPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardsFromStaffingPlanQHPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardsFromStaffingPlanQHPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
