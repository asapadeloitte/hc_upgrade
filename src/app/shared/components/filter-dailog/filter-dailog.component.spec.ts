import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDailogComponent } from './filter-dailog.component';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('FilterDailogComponent', () => {
  let component: FilterDailogComponent;
  let fixture: ComponentFixture<FilterDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDailogComponent],
      providers: [BsModalRef],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDelete function', () => {
    it('onDelete should be defined', () => {
      const deleteState = true;
      component.onDelete();
      expect(component.deleteState).toBe(true);
    });
  });

  describe('onConfirmDelete function', () => {
    it('onConfirmDelete should be defined', () => {
      let deletedata = true;
      component.delete.subscribe(deleteValue => deletedata = deleteValue);
      component.onConfirmDelete();
      expect(component.onConfirmDelete).toBeTruthy(true);
    });
  });
  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });

  describe('on FilterName Change function', () => {
    it('for duplicateView', () => {
      const duplicateView: string = null;
      component.onfilternameChange();
      expect(component.duplicateView).toBeDefined();
    });
  });

  describe('onfilternameChange function', () => {
    it('onfilternameChange should be defined', () => {
      component.onfilternameChange();
      expect(component.duplicateView).toBe(null);
    });
  });

  describe('saveState function', () => {
    it('saveState should be defined', () => {
      component.gridView = 'Save export view';
      component.filterList = [{
        filterName: 'save',
        screenName: 'Analysis View',
        userFilterId: 760,
        userId: 102
      }];
      component.saveState();
      expect(component.saveState).toBeDefined();
      expect(component.duplicateView).toBeNull();
    });
  });
});
