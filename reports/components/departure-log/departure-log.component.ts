import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { HiringMechanismService } from 'src/app/modules/hiring-plan/components/hiring-mechanisms/hiring-mechanism.services';
import { SelectionsService } from 'src/app/modules/hiring-plan/components/selections/selections.service';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  AppDropdownSmartList,
  CellRendererComponent,
  DropdownText,
  StartDtValCellRenderrComponent,
  DatePicker,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import {
  accessibilityFix,
  columnVisibleAccessbility,
  printSortStateToConsole,
  numberSort,
  onJobTitleChange,
} from 'src/app/shared/utilities';
import { sortAlphaNum, dateValueFormatter, changeYearDropDownVales } from 'src/app/shared/grid-utilities';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-departure-log',
  templateUrl: './departure-log.component.html',
  styleUrls: ['./departure-log.component.scss']
})
export class DepartureLogComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  public departureLogForm: FormGroup;
  public changeForm: FormGroup;
  public busyTableSave: Subscription;
  public showSearch = false;
  public departureLogList = [];
  public frameworkComponents;
  public yearsList = [];
  public officeList = [];
  private defaultColDef: ColDef;
  public colDefs = [];
  public gridOptions: GridOptions;
  public jobTitleMapping: any;
  public smartList: any;
  public employees: any;
  public statusBar;
  public id;
  public officeName: any;
  public editedData: any = [];
  public originalData: string;
  public errorDetails: any = [];
  public showHistroicalmessage = true;
  private screenObject = {
    screenName: 'departureLog'
  };
  public currentYear: string;
  public histroicalMessage;
  public histriocalYear: string;

  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private selectionsService: SelectionsService,
    private hmService: HiringMechanismService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    private _adminService: AdminService,
    toaster: ToasterService,
    modalService: BsModalService,
    public allStaffService: AllStaffService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.hmService.listen().subscribe((m: any) => {
      this.editedData = [];
      this.getDepartureLogData();
    });
  }

  ngOnInit() {
    this.histriocalYear = 'FY22';
    this.loadGridOptions();
    this.loadSearchForm();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
       // 17.1 year dropdown value changes CBAS-6807
      this.yearsList = changeYearDropDownVales(this.yearsList);
      this.officeList = args.officeOrgLevelMapping;
      this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      this.currentYear = args.currentYear;
      this.histroicalMessage = 'All historical data is listed under   ' +   this.histriocalYear;
      this.humanCapitalService.getSmartList().subscribe(smList => {
        const temp = this.selectionsService.getAdditionalSmartLists();
        this.smartList = smList;
        temp.forEach(element => {
          this.smartList.push(element);
        });
        this.smartListService.setDDVals(smList);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListService.setTitleMapping(this.jobTitleMapping);
          }
        });
      });
    });
    this.departureLogForm = this.fb.group({});
  }

  public loadSearchForm() {
    this.changeForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });

    this.getCustomFilterNames(this.screenObject);
  }


  public onOfficeChangeEvent(event: any) {
    this.officeName = this.changeForm.controls.office.value;
  }

  public onYearChangeEvent(event: any) {
    this.year = this.changeForm.controls.year.value;
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
      dropdownText: DropdownText,
      hyperlinkComponent: HyperlinkComponent,
      ddSmartList: AppDropdownSmartList,
      deleteUserRenderer: DeleteUserCellRendererComponent
    };
    this.gridOptions = {
      context: {
        componentParent: this,
      },
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.colDef.field);
          if (dateField >= 0) {
            const updatedItemIndex =
              this.departureLogList.findIndex(f => f.id === params.data.id && f[params.colDef.field] === params.newValue);
            this.departureLogList[updatedItemIndex][params.colDef.field] =
              this.departureLogList[updatedItemIndex][params.colDef.field] !== null &&
                this.departureLogList[updatedItemIndex][params.colDef.field] !== '' &&
                this.departureLogList[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.departureLogList[updatedItemIndex][params.colDef.field]).toISOString() :
                this.departureLogList[updatedItemIndex][params.colDef.field];
          }
          this.departureLogForm.markAsDirty();
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const id = params.data.id;
          if (params.colDef.field === 'jobTitle' || params.colDef.field === 'grade' || params.colDef.field === 'jobCode'
            || params.colDef.field === 'series' || params.colDef.field === 'payPlan' || params.colDef.field === 'fpl') {
            onJobTitleChange(params);
          }
          const baseAttributes = { office, orgLevel, id };
          const originalRow = JSON.parse(this.originalData).find(f => f.id === params.data.id);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);

          // Collect all the changed rows within the grid
          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.id === params.data.id);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }

          if (this.editedData.length > 0) {
            this.departureLogForm.markAsDirty();
          } else {
            this.departureLogForm.markAsPristine();
          }

          // Bring back focus and redraw the updated row with new data
          const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApi.redrawRows({ rowNodes: [row] });
          this.bringFocusBack();
        }
        accessibilityFix(this.el);
      },
      defaultColDef: {
        singleClickEdit: true,
        resizable: true,
        // flex: 1,
        // minWidth: 200,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
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
      // stopEditingWhenGridLosesFocus: true
    } as GridOptions;

  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'departureLog',
    };
    this.openFilterDialogView(this.changeForm, screenObject);
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

  public getDepartureLogData() {
    this.colDefs = [];
    this.departureLogList = [];
    this.showSearch = true;
    this.editedData = [];
    this.changeForm.controls.filter.setValue(null);
    this.selectionsService.setSearchDDVals(this.changeForm.value);
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      this.changeForm.controls.office.value, 'Employee',
      this.currentYear).subscribe(args => {
        this.employees = args;
        this.allStaffService.setEmployees(this.employees);
      });
    this.busyTableSave = this.humanCapitalService.getdepartureLogData(
      this.changeForm.controls.office.value,
      this.changeForm.controls.year.value).subscribe(args => {
        if ((args != null) && (args.length > 0)) {
          this.getColDefs();
          this.roleList = this.authService.jwt_getRole();
          if (this.roleList === 'CTPHC_DepLog_User' ||
            this.roleList === 'CTPHC_DepLog_DetLog_User' ||
            this.roleList === 'CTPHC_DepLog_DetLog_RLLog_User' ||
            this.roleList === 'CTPHC_DepLog_RLLog_User' ||
            this.roleList === 'CTPHC_DetLog_User' ||
            this.roleList === 'CTPHC_DetLog_RLLog_User' ||
            this.roleList === 'CTPHC_RLLog_User') {
            this.colDefs.forEach(col => {
              col.editable = false;
              col.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'left' };
            });
          }
          if (this.roleList !== 'admin') {
            this.colDefs.forEach(col => {
              if (col.field === 'delete') {
                this.colDefs = this.colDefs.filter(el => el.field !== 'delete');
                this.gridOptions.api.setColumnDefs(this.colDefs);
              }
            });
          }
          this.convertValues(args);
        }
      });
  }
  convertValues(args) {
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
    this.departureLogList = a;
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.changeForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }

  public resetFilterView() {
    this.resetFilterViewData(this.changeForm);
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
  public isColumnEditable(params) {
    // this.roleList = this.authService.jwt_getRole();
    if (this.roleList === 'CTPHC_SRT_Analyst_User'
      || this.roleList === 'admin') {
      return false;
    }
    return true;
  }
  public isColumnEditableBsedonDepartureDate(params) {
    if (params.data.departureComplete === true) {
      return true;
    } else {
      return false;
    }
  }
  public getCellStylebasedonDepatureDate(params) {
    if (params.data.departureComplete === true) {
      return { 'text-align': 'right' };
    } else {
      return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
    }
  }

  getCellStyle(params) {
    if (this.roleList === 'CTPHC_SRT_Analyst_User'
      || this.roleList === 'admin') {
      return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
    } else {
      return { 'text-align': 'right' };
    }
  }

  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        field: 'office',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        comparator: sortAlphaNum,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Departure Date',
        field: 'departureDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: this.getCellStylebasedonDepatureDate.bind(this),
        editable: this.isColumnEditableBsedonDepartureDate.bind(this)
      },
      {
        headerName: 'Full Name',
        field: 'fullName',
        comparator: sortAlphaNum,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        comparator: sortAlphaNum,
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        // cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        comparator: sortAlphaNum,
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Middle Initial',
        field: 'middleInitial',
        // comparator: sortAlphaNum,
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        comparator: sortAlphaNum,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Series',
        field: 'series',
        cellEditor: 'ddSmartList',
        comparator: numberSort,
        cellClass: 'textFormat',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Pay Plan',
        field: 'payPlan',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Grade',
        field: 'grade',
        cellClass: 'textFormat',
        comparator: numberSort,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Job Code',
        field: 'jobCode',
        cellClass: 'textFormat',
        comparator: sortAlphaNum,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Step',
        field: 'step',
        comparator: numberSort,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Current Supervisor',
        field: 'currentSupervisor',
        comparator: sortAlphaNum,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Bargaining Unit',
        field: 'bargainingUnit',
        comparator: numberSort,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'CTP EOD',
        field: 'ctpEod',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
      },
      {
        headerName: 'Reason for Departing',
        field: 'reasonForDeparting',
        cellEditor: 'ddSmartList',
        sortable: sortAlphaNum,
        cellRenderer: 'dropdownText',
        cellStyle: this.getCellStylebasedonDepatureDate.bind(this),
        editable: this.isColumnEditableBsedonDepartureDate.bind(this),
      },
      // comparator: numberSort
      {
        headerName: 'Departure Comments',
        field: 'departureComments',
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000'
        },
        cellStyle: this.getCellStylebasedonDepatureDate.bind(this),
        editable: this.isColumnEditableBsedonDepartureDate.bind(this)
      },
      {
        headerName: 'Future Employer',
        field: 'futureEmployer',
        sortable: sortAlphaNum,
        // cellStyle: { 'text-align': 'right' },
        cellStyle: this.getCellStylebasedonDepatureDate.bind(this),
        editable: this.isColumnEditableBsedonDepartureDate.bind(this)
      },
      {
        headerName: 'Action',
        field: 'delete',
        cellRenderer: 'deleteUserRenderer',
        maxWidth: 150,
        cellRendererParams: {
          screenName: 'departureLog',
          onClick: this.deleteDepartureLog.bind(this),
        }
      }
    ];
  }


  reloadDepartureLog(reload: boolean) {
    if (reload) {
      this.getDepartureLogData();
    }
  }

  departureLogDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'Departure Log Deleted', 'Departure Log Deleted Successfully');
    }
  }
  deleteDepartureLog(params: number) {
    if (this.editedData) {
      this.onGoClickDepartureLog();
    }
    this.id = params;
  }

  onGoClickDepartureLog() {
    if (this.year === this.histriocalYear) {
      this.showHistroicalmessage = true;
    } else {
      this.showHistroicalmessage = false;
    }
    if (this.gridApi) {
      this.gridApi.clearFocusedCell();
      setTimeout(() => {
        if (this.editedData.length > 0) {
          this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
          this.bsModalRef.content.okSave.subscribe((response) => {
            this.getDepartureLogData();
            this.departureLogForm.markAsPristine();
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.selectionsService.getSearchDDVals();
            this.changeForm.controls.office.setValue(tempSearchDDVal.office);
            this.changeForm.controls.year.setValue(tempSearchDDVal.year);
          });
        } else {
          this.getDepartureLogData();
        }
      }, 300);
    } else {
      this.getDepartureLogData();
    }
  }


  saveDepartureLog() {
    this.gridApi.clearFocusedCell();
    let count = 0;
    setTimeout(() => {
      if (this.editedData.length > 0) {
        this.editedData.forEach(ele => {
          if (ele.departureDate === '') {
            count++;
          }
        });
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
        if (count > 0) {
          const initialState = {
            departureLogDate: true,
            // header: 'Departure Log entries must include a departure date.',
            // details: duplicateJobRequestIds
          };
          this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
          this.bsModalRef.content.closeBtnName = 'Close';
          this.bsModalRef.content.submitBtnName = 'Submit';
        } else {
          this.busyTableSave = this.humanCapitalService.savedepartureLogData(this.editedData).subscribe(data => {
            this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
            const tempSearchDDVal = this.selectionsService.getSearchDDVals();
            this.changeForm.controls.office.setValue(tempSearchDDVal.office);
            this.changeForm.controls.year.setValue(tempSearchDDVal.year);
            this.getDepartureLogData();
            this.editedData = [];
            this.departureLogForm.markAsPristine();
          }, error => {
            error.error.errorDetails.forEach(element => {
              this.errorDetails.push(element.message);
            });
            this.toaster.pop('error', 'Failed', this.errorDetails);
          });
        }
      }
    }, 200);
  }
}
