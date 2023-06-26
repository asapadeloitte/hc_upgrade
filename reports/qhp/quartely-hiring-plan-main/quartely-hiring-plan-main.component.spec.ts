import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartelyHiringPlanMainComponent } from './quartely-hiring-plan-main.component';

describe('QuartelyHiringPlanMainComponent', () => {
  let component: QuartelyHiringPlanMainComponent;
  let fixture: ComponentFixture<QuartelyHiringPlanMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuartelyHiringPlanMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuartelyHiringPlanMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
