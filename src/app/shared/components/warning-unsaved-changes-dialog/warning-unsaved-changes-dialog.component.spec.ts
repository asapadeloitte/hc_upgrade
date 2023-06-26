/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WarningUnsavedChangesDialogComponent } from './warning-unsaved-changes-dialog.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('WarningUnsavedChangesDialogComponent', () => {
  let component: WarningUnsavedChangesDialogComponent;
  let fixture: ComponentFixture<WarningUnsavedChangesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarningUnsavedChangesDialogComponent],
      providers: [BsModalRef]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningUnsavedChangesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onOknSavePendingChanges function', () => {
    it('onOknSavePendingChanges should be defined', () => {
      component.onOknSavePendingChanges();
    });
  });

  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });
});
