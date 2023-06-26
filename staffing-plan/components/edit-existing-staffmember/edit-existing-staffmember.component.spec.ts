import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExistingStaffmemberComponent } from './edit-existing-staffmember.component';

describe('EditExistingStaffmemberComponent', () => {
  let component: EditExistingStaffmemberComponent;
  let fixture: ComponentFixture<EditExistingStaffmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExistingStaffmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExistingStaffmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
