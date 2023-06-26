import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpvacHyperlinkComponent } from './empvac-hyperlink.component';

describe('EmpvacHyperlinkComponent', () => {
  let component: EmpvacHyperlinkComponent;
  let fixture: ComponentFixture<EmpvacHyperlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpvacHyperlinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpvacHyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
