import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffingsummaryComponent } from './staffingsummary.component';

describe('StaffingsummaryComponent', () => {
  let component: StaffingsummaryComponent;
  let fixture: ComponentFixture<StaffingsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffingsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffingsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
