import { Component, OnInit, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { accessibilityFix, columnVisibleAccessbility, printSortStateToConsole, numberSort } from 'src/app/shared/utilities';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ToasterService, ToasterConfig } from 'angular2-toaster';
import * as _ from 'lodash';

import { GridOptions } from 'ag-grid-community';

import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { FieldMapping } from 'src/app/shared/models/user.model';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { FieldMappingService } from 'src/app/shared/services/fieldMapping.service';

@Component({
  selector: 'app-human-capital-field-mappings',
  templateUrl: './human-capital-field-mappings.component.html',
  styleUrls: ['./human-capital-field-mappings.component.scss']
})
export class HumanCapitalFieldMappingsComponent extends BasePageComponent implements OnInit, OnDestroy {
  public changeForm: FormGroup;
  public isDataPresent = false;
  public stateSave = false;
  public updatedRows: FieldMapping[] = [];
  public editedData = [];
  public modalUnsavedData = [];
  public colDefs = [];
  public statusBar;
  public frameworkComponents;
  public fieldMappingsData: FieldMapping[];
  public id;
  public errorDetails: any = [];
  bsModalRef: BsModalRef;

  @Output() formUpdated = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    authService: AuthService,
    toaster: ToasterService,
    humanCapitalService: HumanCapitalService,
    modalService: BsModalService,
    el: ElementRef,
    private _adminService: AdminService,
    private fieldMappingService: FieldMappingService
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
    {
      this.headerHeight = 45;
      this.rowHeight = 40;
      this.sideBar = {
        toolPanels: ['columns', 'filters']
      };
      this.statusBar = {
        statusPanels: [
          {
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          },
          {
            statusPanel: 'agTotalRowCountComponent',
            align: 'center',
          },
          { statusPanel: 'agFilteredRowCountComponent' },
          { statusPanel: 'agSelectedRowCountComponent' },
          { statusPanel: 'agAggregationComponent' },
        ],
      };
      this.frameworkComponents = {
        deleteUserRenderer: DeleteUserCellRendererComponent
      };
    }
  }

  ngOnInit() {
    this.loadFieldMappingsData();
    this.loadGridOptions();
    this.changeForm = this.fb.group({
      search: [null],
      filter: [null]
    });
    this.getColDef();
    this.fieldMappingService.getUploadStatus.subscribe(args => {
      this.loadFieldMappingsData();
    });
  }
  getColDef() {
    this.colDefs = [
      {
        headerName: 'Id',
        field: 'id',
        hide: true
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        width: 200,
        maxWidth: 600,
        editable: true
    },
      {
        headerName: 'Job Code',
        field: 'jobCode',
        width: 200,
        maxWidth: 600,
        editable: true,
        cellClass: 'textFormat'
       },
      {
        headerName: 'Series',
        field: 'occSeries',
        width: 200,
        maxWidth: 600,
        editable: true,
        cellClass: 'textFormat'
      },
      {
        headerName: 'Pay Plan',
        field: 'payPlan',
        width: 200,
        maxWidth: 600,
        editable: true,
      },
      {
        headerName: 'Grade',
        field: 'grade',
        comparator: numberSort,
        width: 200,
        maxWidth: 600,
        editable: true
      },
      {
        headerName: 'FPL',
        field: 'fpl',
        width: 200,
        maxWidth: 600,
        editable: true
      },
      {
        headerName: 'Action',
        cellRenderer: 'deleteUserRenderer',
        maxWidth: 150,
        cellRendererParams: {
          screenName: 'fieldMapping',
          onClick: this.deleteUser.bind(this),
        }
      }
    ];
  }
  // to get the  the data
  loadFieldMappingsData() {
   this.busyTableSave = this._adminService.getFieldMappings().subscribe(data => {
      if (data) {
        this.fieldMappingsData = data;
        accessibilityFix(this.el);
      }
    });
  }
  // updated rows

  transformFieldMapping(rowData: any) {
    const fieldMapping = new FieldMapping();
    fieldMapping.id = rowData.id;
    fieldMapping.jobCode = rowData.jobCode;
    fieldMapping.jobTitle = rowData.jobTitle;
    fieldMapping.occSeries = rowData.occSeries;
    fieldMapping.grade = rowData.grade;
    fieldMapping.payPlan = rowData.payPlan;
    fieldMapping.fpl = rowData.fpl;
    return fieldMapping;
  }


  // update field mappings
  updateFieldMappingsData() {
    this.errorDetails = [];
    if (this.updatedRows.length > 0) {
      this._adminService.updateFieldMappings(this.updatedRows).subscribe(data => {
        this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
        this.loadFieldMappingsData();
        this.updatedRows = [];
        this.formUpdated.emit(false);

      }, error => {
             error.error.errorDetails.forEach(element => {
            this.errorDetails.push(element.message);
          });
             this.toaster.pop('error', 'Failed', this.errorDetails);
      });
    }
  }
  reloadUsers(reload: boolean) {
    if (reload) {
      this.loadFieldMappingsData();
    }
  }

  userDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'User Deleted', 'User Deleted Successfully');
    }
  }
  deleteUser(params: number) {
    this.id = params;
  }
  public loadGridOptions() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      defaultColDef: {
        singleClickEdit: true,
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
      onCellValueChanged: (params) =>  {
        if (params.oldValue !== params.newValue) {
          this.formUpdated.emit(true);
          if (this.updatedRows.length > 0) {
            const tempIndex = this.updatedRows.findIndex(temp => temp.id === params.data.id);
            if (tempIndex >= 0) {
              this.updatedRows.splice(tempIndex, 1);
            }
          }
          this.updatedRows.push(this.transformFieldMapping(params.data));
        }
        if (this.updatedRows.length > 0) {
          this.formUpdated.emit(true);
        } else {
          this.formUpdated.emit(false);
        }
        const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
        this.gridApi.redrawRows({ rowNodes: [row] });
        this.bringFocusBack();

      },
      // call back for subsring the  values more than maxlength
      onCellEditingStopped: (params) => {
        let maxLength;
        if (params.colDef.field === 'jobTitle') {
          maxLength = 255;
        } else {
          maxLength = 10;
        }
        const value = params.value.substr(0, maxLength);
        params.node.setDataValue(params.column.getColId(), value);
         },
      stopEditingWhenGridLosesFocus: true
    } as GridOptions;
  }

  public onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.changeForm.controls.search.value);
    printSortStateToConsole(this.el);
  }

  resetFilterView() {
    this.resetFilterViewData(this.changeForm);
  }
  autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public onexportOptionsChangeEvent(e) {
    this.exportOption = e.target.value;
  }

  openExportModal() {
    this.ExportGridData();
  }

  openFileUploadDialog() {
    const initialState = {
      fileType: 'XLSX File Only',
      title: 'Upload Mapping',
      screenName: 'HC_FiledMapping',
      bodyFileType: 'Drag and drop .xlsx file(s) here'
    };
    this.bsModalRef = this.modalService.show(FileUploadComponent, { initialState });
   }
 }
