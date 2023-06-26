import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  StartDtValCellRenderrComponent,
  AppDropdownSmartList,
  CellRendererComponent,
  DropdownText,
  DatePicker,
  GridTextAreaComponent,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import * as moment from 'moment';

import {
  accessibilityFix,
  columnVisibleAccessbility,
  printSortStateToConsole,
  numberSort,
} from '../../../../shared/utilities';
import { HiringMechanismService } from '../hiring-mechanisms/hiring-mechanism.services';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { CopyOverHrepsService } from './copy-over-hreps-data-to-hiring-plan.service';
import { dateValueFormatter } from 'src/app/shared/grid-utilities';

@Component({
  selector: 'app-copy-over-hreps-data-to-hiring-plan',
  templateUrl: './copy-over-hreps-data-to-hiring-plan.component.html',
  styleUrls: ['./copy-over-hreps-data-to-hiring-plan.component.scss']
})
export class CopyOverHrepsDataToHiringPlanComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public copyOverHrepsForm: FormGroup;

  public copyOverTopForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
  public showSearch = false;
  public staffingPlanList = [];
  public frameworkComponents;
  private defaultColDef: ColDef;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public acquisitionType: any;
  public version: any;
  public editedData: any = [];
  public copyOverHrepsData: any = [];
  public originalData: string;
  public jobTitleMapping: any;
  public id;
  public orgLevelsBasedonOffice = [];
  public getData;
  public bsModalRef1: BsModalRef;
  public errorDetails: any = [];
  private screenObject = {
    screenName: 'Copy over HREPS to Hiring Plan'
  };
  public reqNoList = [];
  public employees: any;
  public smartList: any;
  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private _adminService: AdminService,
    private hiringService: HiringMechanismService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public allStaffService: AllStaffService,
    public copyOverHrepsService: CopyOverHrepsService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.copyOverTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });
    this.hiringService.listen().subscribe((m: any) => {
      this.editedData = [];
      this.getCopyOverHrepData();
    });
  }

   ngOnInit() {
    this.loadGridOptions();
    this.loadSearchForm();
    this.loadBusyTable();
   }

  public loadSearchForm() {
   this.getCustomFilterNames(this.screenObject);
  }

  public loadGridOptions() {
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
    this.sideBar = {
      toolPanels: ['columns', 'filters']
    };
    this.frameworkComponents = {
      cellRendererComponent: CellRendererComponent,
      ddSmartList: AppDropdownSmartList,
      dropdownText: DropdownText,
      hyperlinkComponent: HyperlinkComponent,
      deleteUserRenderer: DeleteUserCellRendererComponent,
      gridTextAreaComponent: GridTextAreaComponent
    };
    this.gridOptions = {
      context: {
        componentParent: this,
      },

      defaultColDef: {
        singleClickEdit: true,
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
      // on cell values changed to get the rows based on unique id
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.colDef.field);
          if (dateField >= 0) {
            const updatedItemIndex =
            this.copyOverHrepsData.findIndex(f => f.announcementId === params.data.announcementId && f[params.colDef.field] === params.newValue);
            this.copyOverHrepsData[updatedItemIndex][params.colDef.field] =
              this.copyOverHrepsData[updatedItemIndex][params.colDef.field] !== null &&
                this.copyOverHrepsData[updatedItemIndex][params.colDef.field] !== '' &&
                this.copyOverHrepsData[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.copyOverHrepsData[updatedItemIndex][params.colDef.field]).toISOString() :
                this.copyOverHrepsData[updatedItemIndex][params.colDef.field];
          }
          this.copyOverHrepsForm.markAsDirty();
          const announcementId = params.data.announcementId;
          const baseAttributes = { announcementId };
          const originalRow = JSON.parse(this.originalData).find(f => f.announcementId === params.data.announcementId);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);

          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.announcementId === params.data.announcementId);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }
          if (this.editedData.length > 0) {
            this.copyOverHrepsForm.markAsDirty();
          } else {
            this.copyOverHrepsForm.markAsPristine();
          }

          // Bring back focus and redraw the updated row with new data
          const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApi.redrawRows({ rowNodes: [row] });
          this.bringFocusBack();
        }
        accessibilityFix(this.el);
      },
      //
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
      processCellForClipboard: params => {
        const dateList = this.smartListService.getDateFieldList();
        const dateField = dateList.findIndex(e => e === params.column.getColId());
        if (dateField >= 0) {
          return moment(params.value).format('MM/DD/YYYY');
        } else {
          return params.value;
        }
      }
    } as GridOptions;

  }

  getJSONdifference(sourceJSON: JSON, targetJSON: JSON) {

    const diffJSON = {};
    for (const i in targetJSON) {
      if (!sourceJSON.hasOwnProperty(i) || targetJSON[i] !== sourceJSON[i]) {
        if (targetJSON[i] !== undefined) {
          diffJSON[i] = targetJSON[i];
        }
      }
    }
    return diffJSON;
  }
  public loadBusyTable() {
    this.roleList = this.authService.jwt_getRole();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.officeList = args.officeOrgLevelMapping;
      this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      this.humanCapitalService.getSmartList().subscribe(args => {
        const temp = this.hiringService.getAdditionalSmartLists();
        this.smartList = args;
        temp.forEach(element => {
          this.smartList.push(element);
        });
        this.smartListService.setDDVals(this.smartList);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListService.setTitleMapping(this.jobTitleMapping);
          }
         });
      });
    });
    this.copyOverHrepsForm = this.fb.group({});
  }

  public onOfficeChangeEvent(event: any) {
  }

  public onYearChangeEvent(event: any) {
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.copyOverTopForm.controls.search.value);
    printSortStateToConsole(this.el);
  }

  public onGridSearch(filterString: string) {
    if (this.gridApi.isAnyFilterPresent()) {
      this.gridApi.onFilterChanged();
    }
    this.gridApi.setQuickFilter(filterString);
  }

  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }

  public resetFilterView() {
    this.resetFilterViewData(this.copyOverTopForm);
  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'Copy over HREPS to Hiring Plan',
    };
    this.openFilterDialogView(this.copyOverTopForm, screenObject);
  }

  public saveCopyOverHreps() {
    this.gridApi.clearFocusedCell();
    setTimeout(() => {
      if (this.editedData.length > 0) {
        const smartListGlobal = this.smartListService.getDDVals();
        const dateList = this.smartListService.getDateFieldList();
        this.editedData.forEach(obj => {
          Object.keys(obj).forEach(key => {
            const smartListObject = smartListGlobal.find(element => element.smartListName === key);
            const tempDateVal = dateList.find(f => f === key);
            if (smartListObject && smartListObject.smartListValues.length > 0) {
              smartListObject.smartListValues.forEach(element => {
                if (obj[key] === element.value) {
                  obj[key] = element.id;
                }
              });
            }
            if (tempDateVal) {
              if (key === tempDateVal) {
                obj[key] =
                  obj[key] !== null && obj[key] !== '' && obj[key] !== undefined ? moment(obj[key]).format('MM/DD/YYYY') : obj[key];
              }
            }
          });
        });
        const tempSearchDDVal = this.copyOverHrepsService.getSearchDDVals();
        this.copyOverTopForm.controls.office.setValue(tempSearchDDVal.office);
        this.copyOverTopForm.controls.year.setValue(tempSearchDDVal.year);
        this.busyTableSave = this.humanCapitalService.postAnnouncements(this.editedData).subscribe(data => {
          this.toaster.pop('success', 'Saved', 'Successfully saved the copy over hreps data');
          this.getCopyOverHrepData();
          this.editedData = [];
          this.copyOverHrepsForm.markAsPristine();
        }, error => {
          this.toaster.pop('error', 'Failed', this.errorDetails);
        });
      }
    }, 200);
  }

  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public openExportModal() {
    this.gridApi.clearFocusedCell();
    this.ExportGridData();
  }

  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }

  public openSubmitDialog() {
    // TO-DO
  }
  onGoClickCopyHreps() {
    if (this.gridApi) {
      this.gridApi.clearFocusedCell();
      setTimeout(() => {
        if (this.editedData.length > 0) {
          this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
          this.bsModalRef.content.okSave.subscribe((response) => {
            this.getCopyOverHrepData();
            this.copyOverHrepsForm.markAsPristine();
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.copyOverHrepsService.getSearchDDVals();
            this.copyOverTopForm.controls.office.setValue(tempSearchDDVal.office);
            this.copyOverTopForm.controls.year.setValue(tempSearchDDVal.year);
          });
        } else {
          this.getCopyOverHrepData();
        }
      }, 300);
    } else {
      this.getCopyOverHrepData();
    }
  }
  getCopyOverHrepData() {
    this.showSearch = true;
    this.colDefs = [];
    this.copyOverHrepsData = [];
    this.editedData = [];
    this.rowsSelected = false;
    this.copyOverTopForm.controls.filter.setValue(null);
    this.copyOverHrepsService.setSearchDDVals(this.copyOverTopForm.value);
    this.busyTableSave =
      this.humanCapitalService.getCopyOverHrepsData(
        this.copyOverTopForm.controls.office.value, this.copyOverTopForm.controls.year.value).subscribe(args => {
      if ((args != null) && (args.length > 0)) {
        this.getColDefs();
        let a = [];
        const smartListValues = this.smartListService.getDDVals();
        const dateList = this.smartListService.getDateFieldList();
        a = args;
        a.forEach(el => {
          Object.keys(el).forEach(key => {
            if (smartListValues) {
              const tempVal = smartListValues.find(f => f.smartListName === key);
              const tempDateVal = dateList.find(f => f === key);
              if (tempVal) {
                const tempVal1 = tempVal.smartListValues.find(f => f.id === el[key]);
                el[key] = tempVal1 !== undefined ? tempVal1.value : el[key];
              } else if (tempDateVal) {
                el[key] = el[key] !== null && el[key] !== '' && el[key] !== undefined ? new Date(el[key]).toISOString() : el[key];
              }
            }
          });

        });
        this.originalData = JSON.stringify(a);
        this.copyOverHrepsData = a;
      }
    });

  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  reloadClassfication(reload: boolean) {
    if (reload) {
      this.getCopyOverHrepData();
    }
  }

  //  column defination

  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        field: 'office',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Announcement ID',
        field: 'announcementDisplayId',
        editable: false,
        cellRenderer: 'hyperlinkComponent',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        cellEditor: 'gridTextAreaComponent',
        editable: true,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Recruit Job Req #',
        field: 'recruitJobReqNbr',
        editable: false,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' }
      },
      {
        headerName: 'HREPS_Position Title',
        field: 'hrepsPositionTitle',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        cellEditor: 'gridTextAreaComponent',
        editable: true,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Series',
        field: 'series',
        editable: false,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' }
      },
      {
        headerName: 'Grade',
        field: 'grade',
        cellClass: 'textFormat',
        comparator: numberSort,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' }
      },
      {
        headerName: 'HREPS_Hiring Mechanism',
        field: 'hrepsHiringMechanism',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' }
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Recruit Package Submitted to HR',
        field: 'hrepsRecruitPackageSbmtdToHr',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Recruit Package Submited to HR',
        field: 'recruitPackageSubmittedToHr',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'HREPS_Preconsult Conducted',
        field: 'hrepsPreconsultConductedDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Preconsult Conducted',
        field: 'preconsultConductedDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true
      },
      {
        headerName: 'HREPS_Job Req Release Date',
        field: 'hrepsJobReqReleaseDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Job Req Release Date',
        field: 'jobReqReleaseDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Vacancy Opened',
        field: 'hrepsVacancyOpenDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Vacancy Opened',
        field: 'vacancyOpenDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Vacancy Closed',
        field: 'hrepsVacancyClosedDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Vacancy Closed',
        field: 'vacancyCloseDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Certs Issued Date',
        field: 'hrepsCertsIssuedDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Certs Issued Date',
        field: 'certsIssuedDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Selection Date',
        field: 'hrepsSelectionDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Selection Date',
        field: 'selectionDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Tentative Offer Date',
        field: 'hrepsTentativeOfferDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Tentative Offer Date',
        field: 'tentativeOfferDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Final Offer Date (1st Selection)',
        field: 'hrepsFinalOfferDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Final Offer Date',
        field: 'finalOfferDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_EOD Date',
        field: 'hrepsEodDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EOD Date',
        field: 'eodDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: true,
        cellStyle: { 'text-align': 'left' }
      }
    ];
  }
}
