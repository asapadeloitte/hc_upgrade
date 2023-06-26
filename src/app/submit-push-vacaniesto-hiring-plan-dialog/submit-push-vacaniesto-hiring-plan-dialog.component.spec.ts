import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitPushVacaniestoHiringPlanDialogComponent } from './submit-push-vacaniesto-hiring-plan-dialog.component';

describe('SubmitPushVacaniestoHiringPlanDialogComponent', () => {
  let component: SubmitPushVacaniestoHiringPlanDialogComponent;
  let fixture: ComponentFixture<SubmitPushVacaniestoHiringPlanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitPushVacaniestoHiringPlanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitPushVacaniestoHiringPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
