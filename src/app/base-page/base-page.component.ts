import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GridApi, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { FilterDailogComponent } from 'src/app/shared/components/filter-dailog/filter-dailog.component';
import { GridFilterModel } from 'src/app/shared/models/acquisition.model';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';

import { ExportModalComponent } from '../components/export-modal/export-modal.component';
import { gridExport, gridExportToFile, changeHistoryExport } from '../grid-utilities';
import { AuthService } from '../services/auth.service';
import { printSortStateToConsole } from '../utilities';


@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
})
export class BasePageComponent implements OnInit, OnDestroy {
  protected userId: string;
  public roleList: any;
  protected headerHeight: number;
  public rowHeight: number;
  public sideBar: { toolPanels: string[]; };
  public sideBarMini;
  public bsModalRef: BsModalRef;
  public gridApi: GridApi;
  public gridOptions: GridOptions;
  public gridColumnApi: any;
  public busyTableSave: Subscription;
  public customFilterNames: any;
  protected selectedFilterName: string;
  protected viewsId: any;
  protected stateSave: boolean; //  TODO rename to proper variable
  public year: string;
  protected fiscalYear: string;
  protected pinnedBottomData: any;
  public showSearch = false; //  TODO rename to showGridControls
  public exportOption: string;
  public selectedRows: any[];
  public isDataPresent = false;
  public rowsSelected = false;
  public excelStyles;
   // protected authService: AuthService;

  constructor(
    protected authService: AuthService,
    public toaster: ToasterService,
    protected humanCapitalService: HumanCapitalService,
    protected modalService: BsModalService,
    public el: ElementRef
  ) {
    this.modalService = modalService;
    this.humanCapitalService = humanCapitalService;
    this.toaster = toaster;
    this.headerHeight = 45;
    this.rowHeight = 40;
    this.excelStyles = [
      {
        id: 'header',
        font: { bold: true },
      },
      {
        id: 'cell',
      },
      {
      id: 'detaillogColor',
        interior: {
          color: '#ADD8E6',
         // #ADD8E6
          pattern: 'Solid',
        },
      },
      {
        id: 'EHCMDiscripencyColor',
        interior: {
          color: '#FDE0E0',
          pattern: 'Solid',
        },
      },
      {
        id: 'textFormat',
        dataType: 'string',
      },
      {
        id: 'dateISO',
        dataType: 'DateTime',
        numberFormat: { format: 'yyy-mm-ddThh:mm:ss' },
      },
      {
        id: 'dateUK',
        dataType: 'DateTime',
        numberFormat: { format: 'dd/mm/yy' },
      },
      {
        id: 'dateUS',
        dataType: 'DateTime',
        numberFormat: { format: 'mm/dd/yyyy' },
      },
      {
        id: 'dateLong',
        dataType: 'DateTime',
        numberFormat: { format: 'dd/mm/yyy h:mm:ss AM/PM' },
      },
    ];
    this.sideBar = {
      toolPanels: ['columns', 'filters']
    };
    this.sideBarMini = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivotMode: true,
          }
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivotMode: true,
          }
        },
      ],
      // defaultToolPanel: 'columns',
    };
  }
  ngOnInit() {
    this.userId = localStorage.getItem('UserID');
    this.roleList = this.authService.jwt_getRole();
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  getContextMenuItems(params) {
    const keyValue = Object.keys(params.node.data);
    const cellHistoryFieldsArr = keyValue;
    const result = changeHistoryExport(params, cellHistoryFieldsArr);
    return result;
  }

  onGridReady(params) {
    this.gridOptions.onBodyScroll = (event) => {
      printSortStateToConsole(this.el);
    };
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
   // params.api.sizeColumnsToFit();
  }

  public isUserAdmin() {
    return this.roleList === 'admin' ? true : false;
  }
  public bringFocusBack() {
    const cell = this.gridOptions.api.getFocusedCell();
    if (cell) {
      this.gridOptions.api.setFocusedCell(cell.rowIndex, cell.column);
    }
  }

  public getUserId() {
    return this.userId;
  }

  public ExportGridData() {
    this.bsModalRef = this.modalService.show(ExportModalComponent);
    this.bsModalRef.content.exportSubmit.subscribe((response) => {
      gridExport(response, this.gridOptions);
      this.bsModalRef.hide();
      this.toaster.pop('success', 'File Download', 'Downloaded File Successfully');
    });
  }

  public exportGridColumns(columns: string[]) {

    this.bsModalRef = this.modalService.show(ExportModalComponent);
    this.bsModalRef.content.exportSubmit.subscribe((response) => {
      gridExportToFile('vacancies', response, this.gridOptions, columns);
      this.bsModalRef.hide();
      this.toaster.pop('success', 'File Download', 'Downloaded File Successfully');
    });
  }


  public onRowSelected(event: any) {
  }

  public rowsSelectionChanged(params: any) {
    this.selectedRows = this.gridApi.getSelectedRows();
    if (this.selectedRows.length > 0) {
      this.rowsSelected = true;
    } else {
      this.rowsSelected = false;
    }
  }

  public openFilterDialogView(form: FormGroup, screenObject: any) {

    const filterValue = form.get('filter').value;
    const filterGridValue = form.controls.filter.value;

    if (filterValue !== null) {
      const newfilterJson = {
        colState: this.gridColumnApi.getColumnState(),
        groupState: this.gridColumnApi.getColumnGroupState(),
        sortState: this.gridApi.getSortModel(),
        filterState: this.gridApi.getFilterModel()
      };

      const initialState = {
        title: 'Rename/Delete View',
        id: this.viewsId,
        gridView: filterGridValue,
        filterList: this.customFilterNames,
        updatedfilterList: newfilterJson
      };
      this.bsModalRef = this.modalService.show(FilterDailogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
      this.bsModalRef.content.delete.subscribe((response: string) => {
        // TODO read response
        this.deleteFilterView();
        this.resetFilterViewData(form);
        this.getCustomFilterNames(screenObject);
      });
      this.bsModalRef.content.save.subscribe((updatedResponse: string) => {
        this.updateFilterView(updatedResponse, screenObject);
        this.selectedFilterName = updatedResponse;
        setTimeout(() => {
          form.controls.filter.setValue(updatedResponse);
        }, 500);
      });

    } else {
      const initialState = {
        title: 'Save View',
        id: null,
        gridView: form.controls.filter.value,
        filterList: this.customFilterNames
      };
      this.bsModalRef = this.modalService.show(FilterDailogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
      this.bsModalRef.content.save.subscribe((receivedEntry) => {
        this.saveFilterView(form, receivedEntry, screenObject);
      });
    }
    this.autoSizeColumns(false);
  }

  /**
   *
   */
  public deleteFilterView() {

    const userId = localStorage.getItem('UserID');
    const model = new GridFilterModel();
    model.userId = Number(userId);
    model.userFilterId = this.viewsId;
    this.busyTableSave = this.humanCapitalService.deleteViews(model).subscribe(args => {
      if (args.code === 'DELETED') {
        this.bsModalRef.hide();
        this.toaster.pop('success', 'Deleted', 'Deleted view successfully');
        this.selectedFilterName = '';
      }
    });
  }
  /**
   *
   * @param update the filter view
   */
  public updateFilterView(updatedResponse: string, screenObject: any) {
    const userId = localStorage.getItem('UserID');
    const model = new GridFilterModel();
    model.userId = Number(userId);
    model.userFilterId = this.viewsId;
    model.screenName = screenObject.screenName;
    model.filterName = updatedResponse;
    const newfilterJson = JSON.stringify({
      colState: this.gridColumnApi.getColumnState(),
      groupState: this.gridColumnApi.getColumnGroupState(),
      sortState: this.gridApi.getSortModel(),
      filterState: this.gridApi.getFilterModel()
    });
    model.filterJson = newfilterJson;
    this.busyTableSave = this.humanCapitalService.updateAcquisitionGridFilter(model).subscribe(args => {
      this.getCustomFilterNames(screenObject);
      this.bsModalRef.hide();
      this.toaster.pop('success', 'Updated', 'Updated view successfully');
    });
  }
  /**
   *
   */
  public resetFilterViewData(form: FormGroup) {
    this.viewsId = null;
    form.controls.filter.setValue(null);
    this.gridColumnApi.resetColumnState();
    this.gridColumnApi.resetColumnGroupState();
    this.gridApi.setSortModel(null);
    this.gridApi.setFilterModel(null);
    //
  }
  /**
   *
   * @param filtername save the FilterName
   */
  private saveFilterView(form: FormGroup, filtername: string, screenObject: any) {
    const initialGridState = {
      filterName: filtername,
      filterJson: JSON.stringify({
        colState: this.gridColumnApi.getColumnState(),
        groupState: this.gridColumnApi.getColumnGroupState(),
        sortState: this.gridApi.getSortModel(),
        filterState: this.gridApi.getFilterModel()
      }),
      filterCategory: '',
      userId: localStorage.getItem('UserID'),
      screenName: screenObject.screenName
    };
    this.busyTableSave = this.humanCapitalService
      .postAcquisitionGridFilter(JSON.stringify(initialGridState))
      .subscribe(
        args => {
          console.log('args', args);
        },
        e => {
          this.stateSave = true;
          this.getCustomFilterNames(screenObject);
          this.bsModalRef.hide();
          this.selectedFilterName = filtername;
          form.controls.filter.setValue(filtername);
          this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
        }
      );
  }
  /**
   *
   */
  public getCustomFilterNames(screenObject: any) {
    const userId = localStorage.getItem('UserID');
    this.busyTableSave = this.humanCapitalService.getAcquisitionGridFilter(userId).subscribe(args => {
      if (args) {
        args.forEach(el => {
          if (el.screenName === screenObject.screenName) {
            el.filterJson = JSON.parse(el.filterJson);
            this.viewsId = el.userFilterId;

          }
        });
        this.customFilterNames = _.filter(args, p => p.screenName === screenObject.screenName);
      }
    });
  }
  /**
   *
   * Flter view change event method
   */
  public filterChangeEvent(event: any) {

    let sortModel = null;
    let colModel = null;
    let filterModel = null;
    let groupModel = null;
    this.customFilterNames.forEach(element => {
      if (event === element.filterName) {
        this.viewsId = element.userFilterId;
        sortModel = element.filterJson.sortState;
        colModel = element.filterJson.colState;
        filterModel = element.filterJson.filterState;
        groupModel = element.filterJson.groupState;

        this.gridApi.setSortModel(sortModel);
        this.gridColumnApi.setColumnState(colModel);
        this.gridApi.setFilterModel(filterModel);
        this.gridColumnApi.setColumnGroupState(groupModel);

      } else if (event === null) {
        this.gridApi.setSortModel(sortModel);
        this.gridApi.setFilterModel(filterModel);
        this.gridColumnApi.resetColumnState(colModel);
        this.gridColumnApi.resetColumnGroupState(groupModel);

      }
    });
    printSortStateToConsole(this.el);
    this.autoSizeColumns(false);
  }
  public autoSizeColumns(skipHeader: boolean) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  public onGridSearch(filterString: string) {
    if (this.gridApi.isAnyFilterPresent()) {
      this.gridApi.onFilterChanged();
    }
    this.gridApi.setQuickFilter(filterString);
  }
  // newly added code for multisort functionality

  public resetFilterViewDataMultisort(form: FormGroup) {
    this.viewsId = null;
    form.controls.filter.setValue(null);
    this.gridColumnApi.resetColumnState();
    this.gridColumnApi.resetColumnGroupState();
    this.gridApi.setSortModel(null);
    this.gridApi.setFilterModel(null);
    this.onGridReady(this.gridOptions);
    //
  }
  public openFilterDialogViewMultisort(form: FormGroup, screenObject: any) {

    const filterValue = form.get('filter').value;
    const filterGridValue = form.controls.filter.value;

    if (filterValue !== null) {
      const newfilterJson = {
        colState: this.gridColumnApi.getColumnState(),
        groupState: this.gridColumnApi.getColumnGroupState(),
        sortState: this.gridApi.getSortModel(),
        filterState: this.gridApi.getFilterModel()
      };

      const initialState = {
        title: 'Rename/Delete View',
        id: this.viewsId,
        gridView: filterGridValue,
        filterList: this.customFilterNames,
        updatedfilterList: newfilterJson
      };
      this.bsModalRef = this.modalService.show(FilterDailogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
      this.bsModalRef.content.delete.subscribe((response: string) => {
        // TODO read response
        this.deleteFilterView();
        this.resetFilterViewDataMultisort(form);
        this.getCustomFilterNames(screenObject);
      });
      this.bsModalRef.content.save.subscribe((updatedResponse: string) => {
        this.updateFilterView(updatedResponse, screenObject);
        this.selectedFilterName = updatedResponse;
        setTimeout(() => {
          form.controls.filter.setValue(updatedResponse);
        }, 500);
      });

    } else {
      const initialState = {
        title: 'Save View',
        id: null,
        gridView: form.controls.filter.value,
        filterList: this.customFilterNames
      };
      this.bsModalRef = this.modalService.show(FilterDailogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
      this.bsModalRef.content.save.subscribe((receivedEntry) => {
        this.saveFilterView(form, receivedEntry, screenObject);
      });
    }
    this.autoSizeColumns(false);
  }



}
