import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushVacanciesComponent } from './push-vacancies.component';

describe('PushVacanciesComponent', () => {
  let component: PushVacanciesComponent;
  let fixture: ComponentFixture<PushVacanciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushVacanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
