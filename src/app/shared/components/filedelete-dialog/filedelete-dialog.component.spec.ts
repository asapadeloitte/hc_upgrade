import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiledeleteDialogComponent } from './filedelete-dialog.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
describe('FiledeleteDialogComponent', () => {
  let component: FiledeleteDialogComponent;
  let fixture: ComponentFixture<FiledeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiledeleteDialogComponent],
      providers: [BsModalRef]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiledeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onConfirmDelete function', () => {
    it('onConfirmDelete should be defined', () => {
      component.onConfirmDelete();
    });
  });

  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });
});
