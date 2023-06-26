import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterlyHiringPlanComponent } from './quarterly-hiring-plan.component';

describe('QuarterlyHiringPlanComponent', () => {
  let component: QuarterlyHiringPlanComponent;
  let fixture: ComponentFixture<QuarterlyHiringPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuarterlyHiringPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuarterlyHiringPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
