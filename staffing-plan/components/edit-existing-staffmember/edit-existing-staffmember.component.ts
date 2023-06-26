import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ColDef, GridOptions
} from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import {
  DetailTemPromotionLogService
} from 'src/app/modules/reports/components/detail-temporary-promotion-log/detail-tem-promotion-log.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  StartDtValCellRenderrComponent,
  AppDropdownSmartList,
  CellRendererComponent,
  CurrencyEditorComponent,
  DropdownText,
  DatePicker,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { sortAlphaNum, dateValueFormatter } from 'src/app/shared/grid-utilities';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import {
  accessibilityFix,
  columnVisibleAccessbility,
  numberSort,
  onJobTitleChange,
  printSortStateToConsole
} from '../../../../shared/utilities';
import { OneStaffService } from '../edit-member-vacancy-one-staff/one-staff.service';
import { AllStaffService } from './all-staff.service';


declare var $: any;
@Component({
  selector: 'app-edit-existing-staffmember',
  templateUrl: './edit-existing-staffmember.component.html',
  styleUrls: ['./edit-existing-staffmember.component.scss']
})
export class EditExistingStaffmemberComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public allStaffForm: FormGroup;
  public allStaffData = [];
  public frameworkComponents;
  public headerHeight;
  public rowHeight;
  private defaultColDef: ColDef;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public originalData: string;
  public tempEditedRows: any = [];
  public editedData: any = [];
  public employees: any;
  public busyTableSave: Subscription;
  public errorDetails: any = [];
  public officeList = [];
  public yearsList = [];
  public listensubscription: Subscription;
  public changeForm: FormGroup;

  private screenObject = {
    screenName: 'All Staff'
  };

  public jobTitleMapping: any;
  public currentYear: string;

  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    private oneStaffService: OneStaffService,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,
    public allStaffService: AllStaffService,
    public _adminService: AdminService,
    private detailTemPromotionLogService: DetailTemPromotionLogService,
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.changeForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });
    this.listensubscription = this.oneStaffService.listen().subscribe((m: any) => {
      const tempSearchDDVal = this.allStaffService.getSearchDDVals();
      this.changeForm.controls.office.setValue(tempSearchDDVal.office);
      this.changeForm.controls.year.setValue(tempSearchDDVal.year);
      this.editedData = [];
      this.onGoClickAllStaff();
    });
  }
  loadGridOptions() {
    this.headerHeight = 45;
    this.rowHeight = 35;
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
      currencyEditor: CurrencyEditorComponent,
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
      // redarw rows

      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.colDef.field);
          if (dateField >= 0) {
            const updatedItemIndex =
              this.allStaffData.findIndex(f => f.employee === params.data.employee && f[params.colDef.field] === params.newValue);
            this.allStaffData[updatedItemIndex][params.colDef.field] =
              this.allStaffData[updatedItemIndex][params.colDef.field] !== null &&
                this.allStaffData[updatedItemIndex][params.colDef.field] !== '' &&
                this.allStaffData[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.allStaffData[updatedItemIndex][params.colDef.field]).toISOString() :
                this.allStaffData[updatedItemIndex][params.colDef.field];
          }
          this.allStaffForm.markAsDirty();
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const employee = params.data.employee;
          const employeeId = params.data.employeeId;
          const year = params.data.year;
          if (params.colDef.field === 'jobTitle' || params.colDef.field === 'grade' || params.colDef.field === 'jobCode'
            || params.colDef.field === 'series' || params.colDef.field === 'payPlan' || params.colDef.field === 'fpl') {
            onJobTitleChange(params);
          }
          const baseAttributes = { office, orgLevel, employee, employeeId, year };
          const originalRow = JSON.parse(this.originalData).find(f => f.employee === params.data.employee);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);

          // Collect all the changed rows within the grid
          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.employee === params.data.employee);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }

          if (this.editedData.length > 0) {
            this.allStaffForm.markAsDirty();
          } else {
            this.allStaffForm.markAsPristine();
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

  ngOnInit() {
    this.getCustomFilterNames(this.screenObject);
    this.loadBusyTable();
    this.loadGridOptions();
  }
  loadBusyTable() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.yearsList.unshift('All Years');
      this.officeList = args.officeOrgLevelMapping;
      this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      this.currentYear = args.currentYear;
      this.humanCapitalService.getSmartList().subscribe(smOptions => {
        this.smartListService.setDDVals(smOptions);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListService.setTitleMapping(this.jobTitleMapping);
            let smartListData = [];
            this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeList, this.jobTitleMapping);
            smartListData = this.smartListService.getDDVals();
            const tempFplSmartList = this.detailTemPromotionLogService.getFplSmartLists();
            const tempOrgLevels = this.detailTemPromotionLogService.getOrgLevelSmartLists();
            smartListData.push(tempFplSmartList);
            smartListData.push(tempOrgLevels);
            this.smartListService.setDDVals(smartListData);
            this.showSearch = false;

            this.allStaffForm = this.fb.group({});
          }
        });
      });
    });
  }
  onFilterTextBoxChanged() {
    this.onGridSearch(this.changeForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  onSortChange(e) {
    printSortStateToConsole(this.el);
  }
  autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }
  resetFilterView() {
    this.resetFilterViewData(this.changeForm);
  }
  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
    this.listensubscription.unsubscribe();
  }

  openFilterDialog() {
    const filterValue = this.changeForm.get('filter').value;
    const filterGridValue = this.changeForm.controls.filter.value;
    const screenObject = {
      screenName: 'All Staff',
    };
    this.openFilterDialogView(this.changeForm, screenObject);
  }
  onexportOptionsChangeEvent(e) {
    this.exportOption = e.target.value;
  }
  openExportModal() {
    this.gridApi.clearFocusedCell();
    this.ExportGridData();
  }

  onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }

  onGoClickAllStaff() {
    if (this.gridApi) {
      this.gridApi.clearFocusedCell();
      setTimeout(() => {
        if (this.editedData.length > 0) {
          this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
          this.bsModalRef.content.okSave.subscribe((response) => {
            this.getAllStaffData();
            this.allStaffForm.markAsPristine();
            this.changeForm.controls.filter.setValue(null);
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.allStaffService.getSearchDDVals();
            this.changeForm.controls.office.setValue(tempSearchDDVal.office);
            this.changeForm.controls.year.setValue(tempSearchDDVal.year);
          });
        } else {
          this.getAllStaffData();
        }
      }, 300);
    } else {
      this.getAllStaffData();
    }
  }

  getAllStaffData() {
    this.allStaffService.setSearchDDVals(this.changeForm.value);
    this.showSearch = true;
    this.colDefs = [];
    this.allStaffData = [];
    this.editedData = [];
    this.changeForm.controls.filter.setValue(null);
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      this.changeForm.controls.office.value,
      'Employee',
      this.currentYear).subscribe(emps => {
        this.employees = emps;
        this.allStaffService.setEmployees(this.employees);
        this.busyTableSave = this.humanCapitalService
          .getAllStaff(this.changeForm.controls.office.value, this.changeForm.controls.year.value)
          .subscribe(args => {
            if ((args != null) && (args.length > 0)) {
              this.getColDefs();
              // added year column to grid  based on year condition
              if (this.changeForm.controls.year.value !== 'All Years') {
                this.colDefs.forEach(col => {
                  if (col.field === 'year') {
                    this.colDefs = this.colDefs.filter(el => el.field !== 'year');
                    this.gridOptions.api.setColumnDefs(this.colDefs);
                  }
                });
              }
              let a: any;
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
              this.allStaffData = a;
            }
          });
      });

  }
  submitAllStaff() {
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
        const tempSearchDDVal = this.allStaffService.getSearchDDVals();
        this.changeForm.controls.office.setValue(tempSearchDDVal.office);
        this.changeForm.controls.year.setValue(tempSearchDDVal.year);
        this.busyTableSave = this.humanCapitalService.saveAllStaff(this.changeForm.controls.year.value, this.editedData).subscribe(data => {
          this.toaster.pop('success', 'Saved', 'Successfully saved the data');
          this.getAllStaffData();
          this.editedData = [];
          this.allStaffForm.markAsPristine();
        }, error => {
          error.error.errorDetails.forEach(element => {
            this.errorDetails.push(element.message);
          });
          this.toaster.pop('error', 'Failed', this.errorDetails);
        });
      }
    }, 200);
  }
  getColDefs() {
    this.colDefs = [{
      headerName: 'Year',
      field: 'year',
      editable: false,
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
    },
    {
      headerName: 'Office',
      field: 'office',
      editable: false,
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
    },
    {
      headerName: 'Organizational Level',
      field: 'orgLevelAlias',
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
    },
    {
      headerName: 'Vacancy Status',
      field: 'vacancyStatus',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Employee ID',
      field: 'employeeId',
      cellClass: 'textFormat',
      comparator: sortAlphaNum,
      editable: false,
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
    },
    {
      headerName: 'Announcement ID',
      field: 'announcementId',
      cellClass: 'textFormat',
      comparator: sortAlphaNum,
      editable: false,
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
    },
    {
      headerName: 'Full Name',
      field: 'fullName',
      cellRenderer: 'hyperlinkComponent',
      editable: false,
      cellRendererParams: {
        year: this.changeForm.controls.year.value,
        office: this.changeForm.controls.office.value,
        employees: this.employees
      },
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
      editable: true,
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'First Name',
      field: 'firstName',
      editable: true,
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Middle Initial',
      field: 'middleInitial',
      editable: true,
      cellStyle: { 'text-align': 'left' }
    },

    {
      headerName: 'CTP EOD',
      field: 'ctpEod',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Departure Date',
      field: 'departureDate',
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      editable: false,
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
    },
    {
      headerName: 'Job Title',
      field: 'jobTitle',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Series',
      field: 'series',
      cellClass: 'textFormat',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Pay Plan',
      field: 'payPlan',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Grade',
      field: 'grade',
      cellClass: 'textFormat',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Job Code',
      field: 'jobCode',
      cellClass: 'textFormat',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Step',
      field: 'step',
      editable: true,
      comparator: numberSort,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Admin Code',
      field: 'adminCode',
      comparator: numberSort,
      editable: false,
      cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
    },
    {
      headerName: 'FPL',
      field: 'fpl',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'CLP Eligibility Date',
      field: 'clpEligibilityDate',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Staff Member Type',
      field: 'staffMemberType',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Manager Level',
      field: 'managerLevel',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Bargaining Unit',
      field: 'bargainingUnit',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Ethics Filer',
      field: 'ethicsFilter',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Current Supervisor',
      field: 'currentSupervisor',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'FLSA',
      field: 'flsa',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Previous Employer',
      field: 'previousEmployer',
      editable: true,
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Acting',
      field: 'acting',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Acting CTP Staff Name',
      field: 'actingCtpStaffName',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Active Effective Date',
      field: 'actingEffectiveDate',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Hiring Mechanism',
      field: 'hiringMechanism',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' },
    },
    {
      headerName: 'Veteran',
      field: 'veteran',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Remote Employee',
      field: 'remoteEmployee',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Remote Employee Location(City,State)',
      field: 'remoteEmployeeLocation',
      editable: true,
      cellStyle: { 'text-align': 'left' },
      width: 300,
    },
    {
      headerName: 'Location ID',
      field: 'locationId',
      editable: true,
      cellClass: 'textFormat',
      cellStyle: { 'text-align': 'left' }

    },
    {
      headerName: 'ATM - Effective Date',
      field: 'atmEffectiveDate',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'CSAL-Effective-Date',
      field: 'csalEffectiveDate',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Categorical Retention',
      field: 'categoricalRetention',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Categorical Retention - Percentage',
      field: 'crPercentage',
      cellEditor: 'currencyEditor',
      comparator: numberSort,
      editable: true,
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Categorical Retention - Effective Date',
      field: 'crEffectiveDate',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Possible Eligibility Date',
      field: 'possibleEligibilityDate',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Individual Retention',
      field: 'individualRetention',
      editable: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Individual Retention - Percentage',
      field: 'irPercentage',
      editable: true,
      cellEditor: 'currencyEditor',
      comparator: numberSort,
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Individual Retention - Effective Date',
      field: 'irEffectiveDate',
      editable: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' },
    },
    {
      headerName: 'Effective Date',
      field: 'rlEffectiveDate',
      editable: true,
      hide: true,
      cellEditor: DatePicker,
      cellClass: 'dateUS',
      valueFormatter: dateValueFormatter,
      filterParams: {
        valueFormatter: dateValueFormatter
      },
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'HC Liaison',
      field: 'hcLiaison',
      editable: true,
      hide: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Laptop Request Ticket #',
      field: 'laptopRequestTicketNo',
      editable: true,
      hide: true,
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Action',
      field: 'action',
      editable: true,
      hide: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'New Hire to FDA/set up eARRIVE Completed',
      field: 'newHireToFda',
      editable: true,
      hide: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Laptop Setup -Property Code',
      field: 'laptopSetupPropertyCodeNo',
      cellClass: 'textFormat',
      editable: true,
      hide: true,
      cellEditor: 'currencyEditor',
      comparator: numberSort,
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Previous FDA Center',
      field: 'previousFdaCenter',
      editable: true,
      hide: true,
      cellEditor: 'ddSmartList',
      cellRenderer: 'dropdownText',
      cellStyle: { 'text-align': 'left' }
    },
    {
      headerName: 'Comments',
      field: 'comments',
      comparator: sortAlphaNum,
      editable: true,
      cellStyle: { 'text-align': 'left' },
      cellEditor: 'agLargeTextCellEditor',
      cellEditorParams: {
        maxLength: '4000'
      },
    },
    {
      headerName: 'Sort',
      field: 'sort',
      comparator: numberSort,
      cellEditor: 'currencyEditor',
      editable: true,
      cellStyle: { 'text-align': 'left' }
    },
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
    };
  }

  onOfficeChangeEvent(event: any) {
  }


  onYearChangeEvent(event: any) {
  }
  selectionChanges() {
  }

}
