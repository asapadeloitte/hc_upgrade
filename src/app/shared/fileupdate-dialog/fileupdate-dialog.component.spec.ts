import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileupdateDialogComponent } from './fileupdate-dialog.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
describe('FileupdateDialogComponent', () => {
  let component: FileupdateDialogComponent;
  let fixture: ComponentFixture<FileupdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileupdateDialogComponent],
      imports: [FormsModule],
      providers: [BsModalRef]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileupdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onfileupdateChange function', () => {
    it('onfileupdateChange should be defined', () => {
      component.onfileupdateChange();
      expect(component.errorDisplay).toBe(false);
    });
  });

  describe('saveFileUpdate function', () => {
    it('saveFileUpdate should be defined', () => {
      component.saveFileUpdate();
      expect(component.errorDisplay).toBe(true);
      expect(component.emptymessage).toBe('please enter Valid File Name');
    });

    it('saveFileUpdate should be defined', () => {
      component.fileName = 'Export.xlsx';
      component.saveFileUpdate();
      expect(component.errorDisplay).toBe(false);
    });
  });

  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });
});
