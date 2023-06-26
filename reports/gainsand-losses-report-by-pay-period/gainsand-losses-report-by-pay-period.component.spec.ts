import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GainsandLossesReportByPayPeriodComponent } from './gainsand-losses-report-by-pay-period.component';

describe('GainsandLossesReportByPayPeriodComponent', () => {
  let component: GainsandLossesReportByPayPeriodComponent;
  let fixture: ComponentFixture<GainsandLossesReportByPayPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GainsandLossesReportByPayPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GainsandLossesReportByPayPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
