import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanCapitalFieldMappingsComponent } from './human-capital-field-mappings.component';

describe('HumanCapitalFieldMappingsComponent', () => {
  let component: HumanCapitalFieldMappingsComponent;
  let fixture: ComponentFixture<HumanCapitalFieldMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanCapitalFieldMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanCapitalFieldMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
