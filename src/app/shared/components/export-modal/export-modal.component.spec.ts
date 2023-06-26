/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExportModalComponent } from './export-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ExportModalComponent', () => {
  let component: ExportModalComponent;
  let fixture: ComponentFixture<ExportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportModalComponent],
      imports: [HttpClientTestingModule],
      providers: [BsModalRef]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onexportOptionsChangeEvent function', () => {
    it('onexportOptionsChangeEvent should be defined', () => {
      const event = { target: { value: 'Excel' }};
      component.onexportOptionsChangeEvent(event);
      expect(component.exportOption).toBeDefined();
      expect(component.disableExportButton).toBe(false);
    });

    it('onexportOptionsChangeEvent, export option should not be empty', () => {
      const event = { target: { value: '' } };
      component.onexportOptionsChangeEvent(event);
      expect(component.exportOption).toBeDefined();
    });
  });

  describe('onExport function', () => {
    it('onExport should be defined', () => {
      component.onExport();
    });
  });

  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });
});
