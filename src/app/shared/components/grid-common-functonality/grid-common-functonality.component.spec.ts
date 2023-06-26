import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCommonFunctonalityComponent } from './grid-common-functonality.component';

describe('GridCommonFunctonalityComponent', () => {
  let component: GridCommonFunctonalityComponent;
  let fixture: ComponentFixture<GridCommonFunctonalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCommonFunctonalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCommonFunctonalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
