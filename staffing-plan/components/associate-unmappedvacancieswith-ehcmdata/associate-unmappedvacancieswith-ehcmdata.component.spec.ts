import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateUnmappedvacancieswithEhcmdataComponent } from './associate-unmappedvacancieswith-ehcmdata.component';

describe('AssociateUnmappedvacancieswithEhcmdataComponent', () => {
  let component: AssociateUnmappedvacancieswithEhcmdataComponent;
  let fixture: ComponentFixture<AssociateUnmappedvacancieswithEhcmdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateUnmappedvacancieswithEhcmdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateUnmappedvacancieswithEhcmdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
