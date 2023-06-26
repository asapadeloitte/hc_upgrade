import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogComponent } from './error-dialog.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorDialogComponent],
      providers: [BsModalRef]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  describe('should create component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
  describe('should create component', () => {
    it('it should not partical tranasaction and multiple transaction', () => {
      // const partialTransaction = false;
      // const multipleTransaction = false;
      const title = 'Invalid Change Amount';
      component.ngOnInit();
      expect(component.title).toBe(title);
    });
    it('should have unsaved data', () => {
      component.unSavedData = true;
      component.ngOnInit();
      expect(component.title).toBe('Unsaved Spend Plan Change Data');
    });

    it('should have screen type as StaffingTargetChanges', () => {
      component.ngOnInit();
      expect(component.errorMessage).toBe('Please enter a valid change amount. Change amount can’t be $0.');
    });

  });
  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });
});

