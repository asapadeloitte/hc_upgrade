import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
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
  EndDateCellRendererComponent,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';

import {
  accessibilityFix,
  checkPayPeriodEffectiveDates,
  checkPayPeriodNteDates,
  columnVisibleAccessbility,
  customStringSorting,
  printSortStateToConsole,
} from '../../../../shared/utilities';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { DetailTemPromotionLogService } from './detail-tem-promotion-log.service';
import { sortAlphaNum, dateValueFormatter, changeYearDropDownVales } from 'src/app/shared/grid-utilities';
import * as moment from 'moment';
import { SaveConfirmationDialogComponent } from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';


@Component({
  selector: 'app-detail-temporary-promotion-log',
  templateUrl: './detail-temporary-promotion-log.component.html',
  styleUrls: ['./detail-temporary-promotion-log.component.scss']
})
export class DetailTemporaryPromotionLogComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  public detailTemPromotionLogForm: FormGroup;

  public detailTemPromotionLogTopForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
  public tempEditedRows: any = [];
  public editedData: any = [];
  public officeName: any;
  public year: any;
  public showSearch = false;
  public detailLogList = [];
  public frameworkComponents;
  public originalData: string;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public hiringMechList: any;
  public deleteObj;
  public deleteClicked = false;
  public id;
  public showHistroicalmessage = true;
  public histroicalMessage;
  private screenObject = {
    screenName: 'promotionLog'
  };
  public errorDetails: any = [];
  public smartList: any;
  public employees: any;
  public tempNonCTPGrade: any;
  public jobTitleMapping: any;
  public currentYear: string;
  public histriocalYear: string;
  public validPayPeriodDates: any = [];
  private multiSortKey;
  public disableSave = false;
  public payPeriodOptionsEndingSoon = ['All Records', 'Upcoming Ending Details'];
  public endingSoonPayPeriod;
  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public activatedRoute: ActivatedRoute,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,
    private detailTemPromotionLogService: DetailTemPromotionLogService,
    public _adminService: AdminService,
    public allStaffService: AllStaffService,
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
  }

  onGoClickDetailTemporaryPromotion() {

    this.humanCapitalService.getPayPeriodDatesList().subscribe(args => {
      this.validPayPeriodDates = args;
    });
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
            this.getDetailTemplogData();
            this.detailTemPromotionLogForm.markAsPristine();
            this.resetFilterView();
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.detailTemPromotionLogService.getSearchDDVals();
            this.detailTemPromotionLogTopForm.controls.year.setValue(tempSearchDDVal.year);
          });
        } else {
          this.resetFilterView();
          this.getDetailTemplogData();
        }
      }, 300);
    } else {
      this.getDetailTemplogData();
    }

  }
  public getDetailTemplogData() {

    this.showSearch = true;
    this.colDefs = [];
    this.detailLogList = [];
    this.editedData = [];
    this.endingSoonPayPeriod = [];
    this.rowsSelected = false;
    this.detailTemPromotionLogTopForm.controls.filter.setValue(null);
    this.detailTemPromotionLogTopForm.controls.disperency.setValue(null);
    this.getColDefs();
    this.detailTemPromotionLogService.setSearchDDVals(this.detailTemPromotionLogTopForm.value);
    this.showSearch = true;
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      'All Offices',
      'Employee',
      this.currentYear).subscribe(args => {
        this.employees = args;
        this.allStaffService.setEmployees(this.employees);
      });
    this.busyTableSave =
      this.humanCapitalService.getPromotionLogData(this.detailTemPromotionLogTopForm.controls.year.value).subscribe(args => {
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
            if (col.field === 'deletePromotion') {
              this.colDefs = this.colDefs.filter(el => el.field !== 'deletePromotion');
              this.gridOptions.api.setColumnDefs(this.colDefs);
            }
          });
        }
        let a = [];
        const smartListValues = this.smartListService.getDDVals();
        const dateList = this.smartListService.getDateFieldList();
        a = args;
        a.forEach(el => {
          el['rowDataInvalid'] = this.dataValidationForSave(el);
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
        setTimeout(() => {
          this.disableSave = a.filter(e => e.rowDataInvalid).length > 0 ? true : false;
        }, 1500);
        this.originalData = JSON.stringify(a);
        this.detailLogList = a;


        // this.copyOverEHCMData = a;
        this.endingSoonPayPeriod = this.detailLogList;
      }
    });
  }

  selectPayPeriodEndingOptions(selectedValue: string) {
    if (selectedValue === 'Upcoming Ending Details') {
      this.detailLogList = this.endingSoonPayPeriod.filter(ele => ele.endingSoon === true);
    } else {
      this.detailLogList = this.endingSoonPayPeriod;
    }
  }
  ngOnInit() {
    this.histriocalYear = 'FY22';
    this.roleList = this.authService.jwt_getRole();
    this.loadBusyTable();
    this.showSearch = false;
    // this.getCustomFilterNames(this.screenObject);
  }

  onGridReady(params) {
    this.gridOptions.onBodyScroll = (event) => {
      printSortStateToConsole(this.el);
    };
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const defaultSortModel = [
      {
        colId: 'status',
        sort: 'asc',
        sortIndex: 0,
      },
      {
        colId: 'detailEffectiveDate',
        sort: 'desc',
        sortIndex: 1,
      },
      {
        colId: 'fullName',
        sort: 'asc',
        sortIndex: 2,
      },

    ];
    params.columnApi.applyColumnState({ state: defaultSortModel });
  }
  public loadSearchForm() {
    this.detailTemPromotionLogForm = this.fb.group({});
    this.detailTemPromotionLogTopForm = this.fb.group({
      year: [null, [Validators.required]],
      search: [null],
      filter: [null],
      disperency: ['All Records'],
    });
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
      ddSmartList: AppDropdownSmartList,
      cellRendererComponent: CellRendererComponent,
      dropdownText: DropdownText,
      startdateValidatior: StartDtValCellRenderrComponent,
      endDateValidator: EndDateCellRendererComponent,
      deleteUserRenderer: DeleteUserCellRendererComponent
    };
    this.multiSortKey = 'ctrl';
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
        filter: true,
        // minWidth: 230,
      },

      // redarw rows

      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.colDef.field);
          if (dateField >= 0) {
            const updatedItemIndex =
              this.detailLogList.findIndex(f => f.id === params.data.id && f[params.colDef.field] === params.newValue);
            this.detailLogList[updatedItemIndex][params.colDef.field] =
              this.detailLogList[updatedItemIndex][params.colDef.field] !== null &&
                this.detailLogList[updatedItemIndex][params.colDef.field] !== '' &&
                this.detailLogList[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.detailLogList[updatedItemIndex][params.colDef.field]).toISOString() :
                this.detailLogList[updatedItemIndex][params.colDef.field];
          }
          this.detailTemPromotionLogForm.markAsDirty();
          const id = params.data.id;
          const fullName = params.data.fullName;
          const baseAttributes = { id, fullName };
          if (params.colDef.field === 'ctpDetailJobTitle' || params.colDef.field === 'ctpDetailGrade'
            || params.colDef.field === 'ctpDetailSeries') {
            if (params.colDef.field === 'ctpDetailJobTitle') {
              params.data.ctpDetailSeries = '';
              params.data.ctpDetailGrade = '';
            }
          }
          if ((params.colDef.field === 'detailNteDate') ||
            (params.colDef.field === 'detailEffectiveDate')) {
            this.detailLogList.forEach(element => {
              if (element.id === params.data.id) {
                element['rowDataInvalid'] = this.dataValidationForSave(element);
              }
            });
          }
          const values = this.detailLogList.filter(e => e.rowDataInvalid);
          if (values.length > 0) {
            this.disableSave = true;
          } else {
            this.disableSave = false;
          }
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
            this.detailTemPromotionLogForm.markAsDirty();
          } else {
            this.detailTemPromotionLogForm.markAsPristine();
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


  public loadBusyTable() {
    this.loadGridOptions();
    this.loadSearchForm();
    this.busyTableSave = this._adminService.getFieldMappings().subscribe(data => {
      if (data) {
        this.jobTitleMapping = data;
        this.smartListService.setTitleMapping(this.jobTitleMapping);

        this.humanCapitalService.getDropdownValues().subscribe(args => {
          this.yearsList = args.years;
          // 17.1 year dropdown value changes CBAS-6807
          this.yearsList = changeYearDropDownVales(this.yearsList);
          this.officeList = args.officeOrgLevelMapping;
          this.currentYear = args.currentYear;
          this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeList, '');
          this.histroicalMessage = 'All historical data is listed under   ' + this.histriocalYear;
          // get DD values from Service and set to service
          this.humanCapitalService.getSmartList().subscribe(smartListValues => {
            this.smartList = smartListValues;
            const temp = this.detailTemPromotionLogService.getAdditionalSmartLists();
            const tempOrgLevels = this.detailTemPromotionLogService.getOrgLevelSmartLists();
            const tempJobTitle = smartListValues.find(e => e.smartListName === 'jobTitle');
            tempJobTitle.smartListValues.sort((a, b) => (a.value < b.value ? -1 : 1));
            const tempSeries = smartListValues.find(e => e.smartListName === 'series');
            const tempGrade = smartListValues.find(e => e.smartListName === 'grade');
            tempJobTitle.smartListName = 'ctpDetailJobTitle';
            tempSeries.smartListName = 'ctpDetailSeries';
            // to find the dynamic id from smartlistvalues
            const findId = smartListValues.find(e => e.smartListName === 'ctpDetailSeries').smartListValues;
            findId.forEach(element1 => {
              if (element1.value === '0000') {
                tempSeries.smartListValues.unshift({
                  id: element1.id,
                  smartListName: 'Series',
                  value: element1.value
                });
              }
            });
            // tempSeries.smartListValues.unshift({
            //   id: getZerothId,
            //   smartListName: 'Series',
            //   value: '0000'
            // });
            tempGrade.smartListName = 'ctpDetailGrade';
            this.detailTemPromotionLogService.addMappingSmartLists(tempGrade);
            const nonCTPDetailSmartLists = this.detailTemPromotionLogService.getMappingSmartLists();
            this.smartList.push(temp);
            this.smartList.push(tempOrgLevels);
            this.smartList.push(nonCTPDetailSmartLists);
            this.smartListService.setDDVals(this.smartList);
            this.activatedRoute.queryParams.subscribe(params => {
              if (Object.keys(params.length !== 0)) {
                if (params.year === 'currentYear') {
                  this.detailTemPromotionLogTopForm.controls.year.setValue(this.currentYear);
                  this.year = this.detailTemPromotionLogTopForm.controls.year.value;
                  this.getDetailTemplogData();
                }
              }
            });
          });
        });
      }
    });
  }
  public onOfficeChangeEvent(event: any) {
    this.officeName = event;
  }
  public onYearChangeEvent(event: any) {
    this.year = this.detailTemPromotionLogTopForm.controls.year.value;
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
  public openFilterDialog() {
    const screenObject = {
      screenName: 'promotionLog'
    };
    this.openFilterDialogView(this.detailTemPromotionLogTopForm, screenObject);
  }

  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }
  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
    this.onGridReady(this.gridOptions);
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.detailTemPromotionLogTopForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public openExportModal() {
    this.gridApi.clearFocusedCell();
    this.ExportGridData();
  }

  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }
  onRowSelected(event) {
    accessibilityFix(this.el); // 508 fix
  }
  onSelectionChanged(params: any) {
    this.rowsSelectionChanged(params);
  }
  public resetFilterView() {
    this.resetFilterViewData(this.detailTemPromotionLogTopForm);
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
  deleteDetailTemporaryPromotionLog(params: number) {
    if (this.editedData) {
      this.onGoClickDetailTemporaryPromotion();
    }
    this.id = params;
  }

  reloadPromotionLog(reload: boolean) {
    if (reload) {
      this.getDetailTemplogData();
    }
  }

  promotionLogDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'Detail/Temporary Promotion Log Deleted Successfully');
    }
  }
  customStringComparator(valueA: string, valueB: string) {
    const customStatusOrder = ['Current', 'Pending Effective Date', 'Complete', 'Canceled'];
    const firstValue = valueA;
    const secondValue = valueB;
    return customStringSorting(firstValue, secondValue, customStatusOrder);
  }
  getCellStyle(params) {
    if (params.data.endingSoon === true) {
      return { backgroundColor: '#ADD8E6', 'text-align': 'left' };
    } else {
      return { 'text-align': 'left' };
    }
  }
  getCellStyleNonEditable(params) {
    if (params.data.endingSoon === true) {
      return { backgroundColor: '#ADD8E6', 'text-align': 'left' };
    } else {
      return { backgroundColor: '#E6E6E6', 'text-align': 'left' };
    }
  }
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Status',
        field: 'status',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        comparator: this.customStringComparator
      },
      {
        headerName: 'Full Name',
        field: 'fullName',
        editable: false,
        // cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        cellStyle: this.getCellStyleNonEditable.bind(this),
        cellClassRules: {
          detaillogColor: (params) => {
            return params.data.endingSoon === true;
          },
        },
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Middle Initial',
        field: 'middleInitial',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Detail Type',
        field: 'detailType',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Detail Bargaining Unit',
        field: 'bargainingUnit',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Detail - Effective Date',
        field: 'detailEffectiveDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellRenderer: 'startdateValidatior',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Detail - NTE Date',
        field: 'detailNteDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellRenderer: 'endDateValidator',
        editable: true,
        // cellStyle: { 'text-align': 'left' }
        cellStyle: this.getCellStyle.bind(this),
        cellClassRules: {
          detaillogColor: (params) => {
            return params.data.endingSoon === true;
          },
        },
      },

      // Total Detail Time

      {
        headerName: 'Total Detail Time',
        field: 'totalDetailTime',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      // CTP Home Office
      {
        headerName: 'CTP Home Office',
        field: 'ctpHomeOffice',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      // CTP Home Organizational Level
      {
        headerName: 'CTP Home Organizational Level',
        field: 'ctpHomeOrgLevel',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Non-CTP Home Office/Center',
        field: 'nonCtpHomeOfficeCenter',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Non-CTP Home Organizational Level',
        field: 'nonCtpHomeOrgLevel',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'CTP Detail Office',
        field: 'ctpDetailOffice',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'CTP Detail Organizational Level',
        field: 'ctpDetailOrgLevel',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Non-CTP Detail Office/Center',
        field: 'nonCtpDetailOfficeCenter',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Non-CTP Detail Organizational Level',
        field: 'nonCtpDetailOrgLevel',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      // CTP Home Office Supervisor Full Name
      {
        headerName: 'CTP Home Office Supervisor Full Name',
        field: 'ctpHomeOfficeSupFullName',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Non-CTP Home Office/Center Supervisor Full Name',
        field: 'nonCtpHomeOfficeSupFullName',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'CTP Detail Supervisor Full Name',
        field: 'ctpDetailSupFullName',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      // Non-CTP Detail Supervisor Full Name
      {
        headerName: 'Non-CTP Detail Supervisor Full Name',
        field: 'nonCtpDetailSupFullName',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'CTP Detail Job Title',
        field: 'ctpDetailJobTitle',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Non-CTP Detail Job Title',
        field: 'nonCtpDetailJobTitle',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'CTP Detail Series or Equivalent',
        field: 'ctpDetailSeries',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Non-CTP Detail Series or Equivalent',
        field: 'nonCtpDetailSeries',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'CTP Detail Grade',
        field: 'ctpDetailGrade',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Non-CTP Detail Grade',
        field: 'nonCtpDetailGrade',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      // WE MAY NEED TO CHNAGE TO TOP
      {
        headerName: 'Renew Date',
        field: 'renewDate',
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
        headerName: 'Renew Date 2',
        field: 'renewDate2',
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
        headerName: 'Renew Date 3',
        field: 'renewDate3',
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
        headerName: 'Renew Date 4',
        field: 'renewDate4',
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
        headerName: 'Renew Date 5',
        field: 'renewDate5',
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
        headerName: 'Reason for Extension ',
        field: 'reasonforExtension',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Detail Log Comments ',
        field: 'detailLogComments',
        cellStyle: { 'text-align': 'right' },
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000'
        },
      },
      {
        headerName: 'Action',
        field: 'deletePromotion',
        cellRenderer: 'deleteUserRenderer',
        maxWidth: 150,
        cellRendererParams: {
          screenName: 'promotionLog',
          onClick: this.deleteDetailTemporaryPromotionLog.bind(this),
        }
      }
    ];
  }

  savePromotionLog() {
    let inValidPayPeriodNamesList = [];
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
          // Added Warning message for PayPeriodDates(NTE Date and Effective Date)
          inValidPayPeriodNamesList = this.payperiodDatesCheck(obj, inValidPayPeriodNamesList);
        });
        let message = 'Warning: The Detail - Effective Date or Detail - NTE Date for the following records do not align with a pay period:';
        if (inValidPayPeriodNamesList.length > 0) {
          for (let i = 0; i < inValidPayPeriodNamesList.length; i++) {
            message = message + '<br> ' + inValidPayPeriodNamesList[i];
          }
          message = message + '<br>' + '<br>' + 'Do you want to continue?';
          const initialState = {
            screenName: 'detailTemplate',
            buttonTitle: 'Yes',
            message: message
          };
          this.bsModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
          this.bsModalRef.content.event.subscribe((response: boolean) => {
            if (response === true) {
              this.saveDetailPromotionLog();
            }
          });
        } else {
          this.saveDetailPromotionLog();
        }
      }
    }, 200);

  }
  saveDetailPromotionLog() {
    const tempSearchDDVal = this.detailTemPromotionLogService.getSearchDDVals();
    this.detailTemPromotionLogTopForm.controls.year.setValue(tempSearchDDVal.year);
    this.busyTableSave = this.humanCapitalService.savePromotionLogData(this.editedData).subscribe(data => {
      this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
      this.getDetailTemplogData();
      this.editedData = [];
      this.detailTemPromotionLogForm.markAsPristine();
    }, error => {
      error.error.errorDetails.forEach(element => {
        this.errorDetails.push(element.message);
      });
      this.toaster.pop('error', 'Failed', this.errorDetails);
    });
  }
  payperiodDatesCheck(obj, inValidPayPeriodNames) {

    if (obj.detailEffectiveDate && obj.detailNteDate) {
      const detailEffectiveDateValid = checkPayPeriodEffectiveDates(obj.detailEffectiveDate, this.validPayPeriodDates);
      const detailNteDateValid = checkPayPeriodNteDates(obj.detailNteDate, this.validPayPeriodDates);
      if (detailEffectiveDateValid === false || detailNteDateValid === false) {
        inValidPayPeriodNames.push(obj.fullName);

      }
    } else if (obj.detailEffectiveDate) {
      const detailEffectiveDateValid = checkPayPeriodEffectiveDates(obj.detailEffectiveDate, this.validPayPeriodDates);
      if (detailEffectiveDateValid === false) {
        inValidPayPeriodNames.push(obj.fullName);

      }
    } else if (obj.detailNteDate) {
      console.log('print nte date', obj.detailNteDate);
      const detailNteDateValid = checkPayPeriodNteDates(obj.detailNteDate, this.validPayPeriodDates);
      if (detailNteDateValid === false) {
        inValidPayPeriodNames.push(obj.fullName);
      }
    }
    return inValidPayPeriodNames;
  }

  dataValidationForSave(element) {
    if (element.detailNteDate && element.detailEffectiveDate) {
      const effectiveDt = moment(element.detailEffectiveDate).startOf('day').toDate();
      const nteDt = moment(element.detailNteDate).startOf('day').toDate();
      if (effectiveDt > nteDt) {
        return true;
      } else {
        return false;
      }
    } else if (element.detailEffectiveDate && !element.detailNteDate) {
      return true;
    } else if (element.detailNteDate && !element.detailEffectiveDate) {
      return true;
    } else if (element.detailNteDate === '' || element.detailEffectiveDate === '') {
      return true;
    } else {
      return false;
    }
  }

}
