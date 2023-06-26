import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VcaddtoselectionComponent } from './vcaddtoselection.component';

describe('VcaddtoselectionComponent', () => {
  let component: VcaddtoselectionComponent;
  let fixture: ComponentFixture<VcaddtoselectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VcaddtoselectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcaddtoselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
