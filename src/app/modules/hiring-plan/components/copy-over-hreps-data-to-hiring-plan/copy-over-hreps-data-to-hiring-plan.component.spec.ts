import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyOverHrepsDataToHiringPlanComponent } from './copy-over-hreps-data-to-hiring-plan.component';

describe('CopyOverHrepsDataToHiringPlanComponent', () => {
  let component: CopyOverHrepsDataToHiringPlanComponent;
  let fixture: ComponentFixture<CopyOverHrepsDataToHiringPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyOverHrepsDataToHiringPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOverHrepsDataToHiringPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
