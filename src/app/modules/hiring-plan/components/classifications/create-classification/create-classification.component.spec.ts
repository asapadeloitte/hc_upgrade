import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClassificationComponent } from './create-classification.component';

describe('CreateClassificationComponent', () => {
  let component: CreateClassificationComponent;
  let fixture: ComponentFixture<CreateClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
