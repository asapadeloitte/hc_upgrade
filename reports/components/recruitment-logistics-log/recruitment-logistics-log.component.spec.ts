import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentLogisticsLogComponent } from './recruitment-logistics-log.component';

describe('RecruitmentLogisticsLogComponent', () => {
  let component: RecruitmentLogisticsLogComponent;
  let fixture: ComponentFixture<RecruitmentLogisticsLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentLogisticsLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentLogisticsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
