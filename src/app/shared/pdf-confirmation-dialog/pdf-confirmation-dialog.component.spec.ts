import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfConfirmationDialogComponent } from './pdf-confirmation-dialog.component';

describe('PdfConfirmationDialogComponent', () => {
  let component: PdfConfirmationDialogComponent;
  let fixture: ComponentFixture<PdfConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
