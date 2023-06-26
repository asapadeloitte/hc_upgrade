import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedvacanciesComponent } from './selectedvacancies.component';

describe('SelectedvacanciesComponent', () => {
  let component: SelectedvacanciesComponent;
  let fixture: ComponentFixture<SelectedvacanciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedvacanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedvacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
