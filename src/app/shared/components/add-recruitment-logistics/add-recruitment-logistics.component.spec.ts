import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecruitmentLogisticsComponent } from './add-recruitment-logistics.component';

describe('AddRecruitmentLogisticsComponent', () => {
  let component: AddRecruitmentLogisticsComponent;
  let fixture: ComponentFixture<AddRecruitmentLogisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRecruitmentLogisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecruitmentLogisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
