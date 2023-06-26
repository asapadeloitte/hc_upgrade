import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyEHCMDataToStaffingPalnComponent } from './copy-ehcmdata-to-staffing-paln.component';

describe('CopyEHCMDataToStaffingPalnComponent', () => {
  let component: CopyEHCMDataToStaffingPalnComponent;
  let fixture: ComponentFixture<CopyEHCMDataToStaffingPalnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyEHCMDataToStaffingPalnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyEHCMDataToStaffingPalnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
