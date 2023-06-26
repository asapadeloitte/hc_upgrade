import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringMechanismsComponent } from './hiring-mechanisms.component';

describe('HiringMechanismsComponent', () => {
  let component: HiringMechanismsComponent;
  let fixture: ComponentFixture<HiringMechanismsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiringMechanismsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringMechanismsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
