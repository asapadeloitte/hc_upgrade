import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';


import { AdminService } from 'src/app/shared/services/admin.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { FieldMappingService } from 'src/app/shared/services/fieldMapping.service';
import { columnVisibleAccessbility } from 'src/app/shared/utilities';
import { GridOptions } from 'ag-grid-community';
import { BatchCellRendererComponent } from './batch-cell-renderer.component';
import { SaveConfirmationDialogComponent } from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
// import * as saveAs from 'file-saver';

import * as saveAs from 'file-saver';


@Component({
  selector: 'app-batch-jobs',
  templateUrl: './batch-jobs.component.html',
  styleUrls: ['./batch-jobs.component.scss']
})
export class BatchJobsComponent extends BasePageComponent implements OnInit {
  public changeForm: FormGroup;
  public isDataPresent = false;
  public stateSave = false;
  public editedData = [];
  public rowData = [];
  public modalUnsavedData = [];
  public colDefs = [];
  public statusBar;
  public frameworkComponents;
  public batchPopupModal: BsModalRef;
  public allValues;
  public id;
  public errorDetails: any = [];
  constructor(
    private fb: FormBuilder,
    authService: AuthService,
    toaster: ToasterService,
    humanCapitalService: HumanCapitalService,
    modalService: BsModalService,
    el: ElementRef,
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
        // deleteUserRenderer: DeleteUserCellRendererComponent,
        btnCellRenderer: BatchCellRendererComponent
       };
    }
  }

  ngOnInit() {
    // this.loadFieldMappingsData();
    this.loadGridOptions();
    this.changeForm = this.fb.group({
      search: [null],
      filter: [null]
    });
    this.getColDef();
    this.rowDataValues();
  }
  rowDataValues() {
    this.rowData = [
      {
        module: 'Admin', processName: 'Send New Job Titles Member and SmartList Files to Essbase',
        schduledFrequency: 'Deactivated', schduledTime: 'Deactivated', executeMaually: '', id: 1
      },
      {
        module: 'Admin', processName: 'Send UI EOD Process Execution Status Email',
        schduledFrequency: 'Everyday', schduledTime: '6:01 AM', executeMaually: '', id: 2
      },
      {
        module: 'Admin', processName: 'Get Logs',
        schduledFrequency: 'N/A', schduledTime: 'N/A', executeMaually: '' , id: 3
      },
      {
        module: 'Hiring Plan', processName: 'Update Announcement "Complete?" Flag',
        schduledFrequency: 'Everyday', schduledTime: '12:01 AM', executeMaually: '',
        id: 4
      },
      {
        module: 'Hiring Plan', processName: 'Update Vacancy "Complete?" Flag',
        schduledFrequency: 'Everyday', schduledTime: '12:10 AM', executeMaually: '',
        id: 5
      },
      {
        module: 'Hiring Plan', processName: 'Process Declinations/Cancelled Offers',
        schduledFrequency: 'Everyday', schduledTime: '12:20 AM', executeMaually: '',
        id: 6
      },
      {
        module: 'Hiring Plan', processName: 'Update Classifications "Complete?" Flag',
        schduledFrequency: 'Everyday', schduledTime: '12:30 AM', executeMaually: '',
        id: 7
      },
      {
        module: 'Hiring Plan', processName: 'Update HREPS Association Complete Flag',
        schduledFrequency: 'Everyday', schduledTime: '12:40 AM', executeMaually: '',
        id: 8
      },
      {
        module: 'Hiring Plan', processName: 'Copy Selectee Names to Staffing Plan on Tentative Offer Date',
        schduledFrequency: 'Everyday', schduledTime: '12:50 AM', executeMaually: '', id : 9
      },
      {
        module: 'Hiring Plan', processName: 'Add System Generated CC Employee IDs on EOD',
        schduledFrequency: 'Everyday', schduledTime: '01:20 AM', executeMaually: '',
        id : 10
      },
      {
        module: 'Hiring Plan', processName: 'Sync Entity Hierarchy between UI and Essbase',
        schduledFrequency: 'Everyday', schduledTime: '11:01 PM', executeMaually: '',
        id : 11
      },
      {
        module: 'Reports', processName: 'Update Detail/Promotion Log "Status"',
        schduledFrequency: 'Everyday', schduledTime: '01:01 AM', executeMaually: '',
        id : 12
      },
      {
        module: 'Reports', processName: 'Update Departure Log "Departure Complete" Flag',
        schduledFrequency: 'Everyday', schduledTime: '01:10 AM', executeMaually: '',
        id : 13
      },
      {
        module: 'Reports', processName: 'Generate and Send Sharepoint Extract Email',
        schduledFrequency: 'Deactivated', schduledTime: 'Deactivated', executeMaually: '',
        id : 14
      },
      {
        module: 'Reports', processName: 'Generate and Send Detail Log Changes Notifications Email',
        schduledFrequency: 'Every Monday', schduledTime: '8:00 AM', executeMaually: '',
        id : 15
      },
    ];
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
      stopEditingWhenCellsLoseFocus: true
    } as GridOptions;
  }

  getColDef() {
    this.colDefs = [
      {
        headerName: 'Module',
        field: 'module',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Process Name',
        field: 'processName',
        width: 400,
        maxWidth: 400,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Schduled Frequency',
        field: 'schduledFrequency',
        width: 200,
        maxWidth: 600,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Schduled Time',
        field: 'schduledTime',
        width: 200,
        maxWidth: 600,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        },
      {
        headerName: 'Execute Manually',
        field: 'executeManually',
        cellRenderer: 'btnCellRenderer',
        maxWidth: 150,
       // maxWidth: 600,
       cellRendererParams: {
        onClick: this.batchExecute.bind(this),
        }
      },
    ];
  }
  batchExecute(params) {
    if (params === 3) {
      const initialState = {
        buttonTitle: 'Yes',
        message: `Are you sure you want to execute the batch?.`
      };
      this.batchPopupModal = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      this.batchPopupModal.content.event.subscribe((response: boolean) => {
        if (response === true) {
          this.busyTableSave = this.humanCapitalService.executeBatchJobs(params).subscribe(data => {
            saveAs(new Blob([data]),
                  'latest_log');
            this.toaster.pop('success', 'Saved', 'File Downloaded Successfully');
            });
          this.batchPopupModal.hide();
        }
      });
    } else {
      const initialState = {
        buttonTitle: 'Yes',
        message: `Are you sure you want to execute the batch?.`
      };
      this.batchPopupModal = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      this.batchPopupModal.content.event.subscribe((response: boolean) => {
        if (response === true) {
          this.busyTableSave = this.humanCapitalService.executeBatchJobs(params).subscribe(data => {
            if (data.success === true) {
              this.toaster.pop('success', 'Exceuted Successfully');
             }
          });
          this.batchPopupModal.hide();
        }
      });
    }
  }


  public onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.changeForm.controls.search.value);
  }
}
