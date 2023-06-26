import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchJobsComponent } from './batch-jobs.component';

describe('BatchJobsComponent', () => {
  let component: BatchJobsComponent;
  let fixture: ComponentFixture<BatchJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
