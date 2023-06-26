import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationMsg } from './validation-msg.component';

describe('ValidationMsgComponent', () => {
  let component: ValidationMsg;
  let fixture: ComponentFixture<ValidationMsg>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationMsg ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationMsg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Validation Message Component', () => {
    expect(component).toBeTruthy();
  });
});
