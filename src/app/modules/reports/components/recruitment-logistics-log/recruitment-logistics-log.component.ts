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
  CurrencyEditorComponent,
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
  numberSort,
  printSortStateToConsole,
  onJobTitleChange,
} from 'src/app/shared/utilities';
import { dateValueFormatter, changeYearDropDownVales } from 'src/app/shared/grid-utilities';
import { AdminService } from 'src/app/shared/services/admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-recruitment-logistics-log',
  templateUrl: './recruitment-logistics-log.component.html',
  styleUrls: ['./recruitment-logistics-log.component.scss']
})
export class RecruitmentLogisticsLogComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  public recruitmentLogisticsForm: FormGroup;
  public recruitmentLogisticsTopForm: FormGroup;
  public busyTableSave: Subscription;
  public showSearch = false;
  public recruitmentLogisticsList = [];
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
    screenName: 'recruitmentLogisticsLog'
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
    toaster: ToasterService,
    modalService: BsModalService,
    el: ElementRef,
    public allStaffService: AllStaffService,
    private _adminService: AdminService,
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.recruitmentLogisticsTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });
    this.hmService.listen().subscribe((m: any) => {
      this.editedData = [];
      this.getRecruitmentLogisticsLog();
    });
  }
  onGridReady(params) {
    this.gridOptions.onBodyScroll = (event) => {
      printSortStateToConsole(this.el);
    };
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const defaultSortModel = [
      {
        colId: 'rlEffectiveDate',
        sort: 'desc',
        sortIndex: 0,
      },
      {
        colId: 'fullName',
        sort: 'asc',
        sortIndex: 1,
      },
    ];
    params.columnApi.applyColumnState({ state: defaultSortModel });
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
      this.histroicalMessage = 'All historical data is listed under   ' + this.histriocalYear;
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
    this.recruitmentLogisticsForm = this.fb.group({});
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
      deleteUserRenderer: DeleteUserCellRendererComponent,
      currencyEditor: CurrencyEditorComponent,
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
              this.recruitmentLogisticsList.findIndex(f => f.id === params.data.id && f[params.colDef.field] === params.newValue);
            this.recruitmentLogisticsList[updatedItemIndex][params.colDef.field] =
              this.recruitmentLogisticsList[updatedItemIndex][params.colDef.field] !== null &&
                this.recruitmentLogisticsList[updatedItemIndex][params.colDef.field] !== '' &&
                this.recruitmentLogisticsList[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.recruitmentLogisticsList[updatedItemIndex][params.colDef.field]).toISOString() :
                this.recruitmentLogisticsList[updatedItemIndex][params.colDef.field];
          }
          this.recruitmentLogisticsForm.markAsDirty();
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const id = params.data.id;
          const year = params.data.year;
          if (params.colDef.field === 'jobTitle' || params.colDef.field === 'grade' || params.colDef.field === 'jobCode'
            || params.colDef.field === 'series' || params.colDef.field === 'payPlan' || params.colDef.field === 'fpl') {
            onJobTitleChange(params);
          }
          // const employeeId = params.data.employeeId;
          const baseAttributes = { office, orgLevel, id, year };
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
          // this.editedData.push(params.data);

          if (this.editedData.length > 0) {
            this.recruitmentLogisticsForm.markAsDirty();
          } else {
            this.recruitmentLogisticsForm.markAsPristine();
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
    } as GridOptions;
  }
  public loadSearchForm() {
    this.getCustomFilterNames(this.screenObject);
  }
  public onOfficeChangeEvent(event: any) {
    this.officeName = this.recruitmentLogisticsTopForm.controls.office.value;
  }

  public onYearChangeEvent(event: any) {
    this.year = this.recruitmentLogisticsTopForm.controls.year.value;
  }
  public openFilterDialog() {
    const screenObject = {
      screenName: 'recruitmentLogisticsLog',
    };
    this.openFilterDialogView(this.recruitmentLogisticsTopForm, screenObject);
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
  public getRecruitmentLogisticsLog() {
    this.colDefs = [];
    this.recruitmentLogisticsList = [];
    this.showSearch = true;
    this.editedData = [];
    this.recruitmentLogisticsTopForm.controls.filter.setValue(null);
    this.getColDefs();
    this.selectionsService.setSearchDDVals(this.recruitmentLogisticsTopForm.value);
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      this.recruitmentLogisticsTopForm.controls.office.value, 'Employee',
      this.currentYear).subscribe(args => {
        this.employees = args;
        this.allStaffService.setEmployees(this.employees);
      });
    this.busyTableSave = this.humanCapitalService.getRecruitmentLogisticLogData(
      this.recruitmentLogisticsTopForm.controls.office.value,
      this.recruitmentLogisticsTopForm.controls.year.value).subscribe(args => {
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
              if (col.field !== 'recruitmentComments' &&
                col.field !== 'laptopPropertyCodeNbr' &&
                col.field !== 'laptopRequestTicketNbr' &&
                col.field !== 'roomNbr') {
                col.editable = false;
                col.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'left' };
              }
              if (col.field === 'delete') {
                this.colDefs = this.colDefs.filter(el => el.field !== 'delete');
                this.gridOptions.api.setColumnDefs(this.colDefs);
              }
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
          this.recruitmentLogisticsList = a;
        }
      });
  }

  reloadRecruitmentLogisticsLog(reload: boolean) {
    if (reload) {
      this.getRecruitmentLogisticsLog();
    }
  }

  recruitmentLogisticsLogDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'Recruitment and Logistics Log Deleted Successfully');
    }
  }
  deleteRecruitmentLogisticsLog(params: number) {
    if (this.editedData) {
      this.onGoClickRecruitmentLogisticsLog();
    }
    this.id = params;
  }
  onGoClickRecruitmentLogisticsLog() {
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
            this.getRecruitmentLogisticsLog();
            this.recruitmentLogisticsForm.markAsPristine();
            this.resetFilterView();
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.selectionsService.getSearchDDVals();
            this.recruitmentLogisticsTopForm.controls.office.setValue(tempSearchDDVal.office);
            this.recruitmentLogisticsTopForm.controls.year.setValue(tempSearchDDVal.year);
          });
        } else {
          this.resetFilterView();
          this.getRecruitmentLogisticsLog();
        }
      }, 300);
    } else {
      this.getRecruitmentLogisticsLog();
    }
  }
  saveRecruitmentLogisticsLog() {
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
        this.busyTableSave = this.humanCapitalService.saveRecruitmentLogisticsLogData(this.editedData).subscribe(data => {
          this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
          const tempSearchDDVal = this.selectionsService.getSearchDDVals();
          this.recruitmentLogisticsTopForm.controls.office.setValue(tempSearchDDVal.office);
          this.recruitmentLogisticsTopForm.controls.year.setValue(tempSearchDDVal.year);
          this.getRecruitmentLogisticsLog();
          this.editedData = [];
          this.recruitmentLogisticsForm.markAsPristine();
        }, error => {
          this.toaster.pop('error', 'Failed', this.errorDetails);
        });
      }
    }, 200);
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.recruitmentLogisticsTopForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
    this.onGridReady(this.gridOptions);
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }

  public resetFilterView() {
    this.resetFilterViewData(this.recruitmentLogisticsTopForm);
  }
  public resetFilterViewData(form: FormGroup) {
    this.viewsId = null;
    form.controls.filter.setValue(null);
    this.gridColumnApi.resetColumnState();
    this.gridColumnApi.resetColumnGroupState();
    this.gridApi.setSortModel(null);
    this.gridApi.setFilterModel(null);
    this.onGridReady(this.gridOptions);
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
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Full Name',
        field: 'fullName',
        editable: false,
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
        headerName: 'Job Title',
        field: 'jobTitle',
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
        headerName: 'Series',
        field: 'series',
        cellClass: 'textFormat',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        editable: true
      },
      {
        headerName: 'Grade',
        field: 'grade',
        cellClass: 'textFormat',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        editable: true
      },
      {
        headerName: 'Job Code',
        field: 'jobCode',
        cellClass: 'textFormat',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        editable: true
      },
      {
        headerName: 'Action',
        field: 'action',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
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
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Effective Date',
        field: 'rlEffectiveDate',
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
        headerName: 'Previously From FDA',
        field: 'previouslyFromFda',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      // New to FDA?
      {
        headerName: 'New to FDA?',
        field: 'newHireToFda',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      // Previous FDA Center

      {
        headerName: 'Previous FDA Center',
        field: 'previousFdaCenter',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Bargaining Unit',
        field: 'bargainingUnit',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Current Supervisor Name',
        field: 'currentSupervisor',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Room #',
        field: 'roomNbr',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },

      {
        headerName: 'Laptop Request Ticket #',
        field: 'laptopRequestTicketNbr',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Laptop Property Code #',
        field: 'laptopPropertyCodeNbr',
        editable: true,
        cellClass: 'textFormat',
        cellEditor: 'currencyEditor',
        comparator: numberSort,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Recruitment Comments',
        field: 'recruitmentComments',
        cellStyle: { 'text-align': 'right' },
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000'
        },
      },
      {
        headerName: 'Previous Employer',
        field: 'previousEmployer',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HC Liaison',
        field: 'hcLiaison',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Action',
        field: 'delete',
        cellRenderer: 'deleteUserRenderer',
        maxWidth: 150,
        cellRendererParams: {
          screenName: 'recruitmentLogisticsLog',
          onClick: this.deleteRecruitmentLogisticsLog.bind(this),
        }
      }
    ];
  }

}
