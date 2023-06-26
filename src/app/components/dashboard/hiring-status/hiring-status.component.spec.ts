import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringStatusComponent } from './hiring-status.component';

describe('HiringStatusComponent', () => {
  let component: HiringStatusComponent;
  let fixture: ComponentFixture<HiringStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiringStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
