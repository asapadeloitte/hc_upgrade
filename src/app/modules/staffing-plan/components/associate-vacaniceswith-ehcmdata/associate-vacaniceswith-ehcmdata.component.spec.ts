import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateVacaniceswithEHCMDataComponent } from './associate-vacaniceswith-ehcmdata.component';

describe('AssociateVacaniceswithEHCMDataComponent', () => {
  let component: AssociateVacaniceswithEHCMDataComponent;
  let fixture: ComponentFixture<AssociateVacaniceswithEHCMDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateVacaniceswithEHCMDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateVacaniceswithEHCMDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
