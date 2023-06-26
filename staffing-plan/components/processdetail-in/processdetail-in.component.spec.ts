import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessdetailInComponent } from './processdetail-in.component';

describe('ProcessdetailInComponent', () => {
  let component: ProcessdetailInComponent;
  let fixture: ComponentFixture<ProcessdetailInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessdetailInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessdetailInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
