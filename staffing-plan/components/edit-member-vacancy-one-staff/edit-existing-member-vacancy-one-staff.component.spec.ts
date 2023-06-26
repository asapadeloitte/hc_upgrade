/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditExistingMemberVacancyOneStaffComponent } from './edit-existing-member-vacancy-one-staff.component';

describe('EditExistingMemberVacancyOneStaffComponent', () => {
  let component: EditExistingMemberVacancyOneStaffComponent;
  let fixture: ComponentFixture<EditExistingMemberVacancyOneStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExistingMemberVacancyOneStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExistingMemberVacancyOneStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
