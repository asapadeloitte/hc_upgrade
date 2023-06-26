import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToasterService } from 'angular2-toaster';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { columnVisibleAccessbility, printSortStateToConsole, accessibilityFix, numberSort } from 'src/app/shared/utilities';
import { GridOptions } from 'ag-grid-community';
import {
  AppDropdownSmartList, CellRendererComponent, DropdownText, DatePicker, AppGradeDdValcellRendererComponent
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { SaveConfirmationDialogComponent } from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { SelectionsService } from '../selections.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { dateValueFormatter } from 'src/app/shared/grid-utilities';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
@Component({
  selector: 'app-selectedvacancies',
  templateUrl: './selectedvacancies.component.html',
  styleUrls: ['./selectedvacancies.component.scss']
})
export class SelectedvacanciesComponent extends BasePageComponent implements OnInit, OnDestroy {

  public statusBar;
  public showSearch = false;
  public frameworkComponents;
  public selectedVacancyList: FormGroup;
  public saveConfirmationDialog123: BsModalRef;
  public multiSortKey;
  public validationVacancyIds = [];
  public colDefs = [];
  public validGrade = true;
  public originalData: string;
  @Input() selctedRowsData;
  public busyTableSave: Subscription;
  @Input() year;
  private screenObject = {
    screenName: 'PendingSelections'
  };
  public searchForm: FormGroup;
  constructor(
    authService: AuthService,
    private fb: FormBuilder,
    private selectionService: SelectionsService,
    toaster: ToasterService,
    private smartListService: SmartListConversionService,
    humanCapitalService: HumanCapitalService,
    public allStaffService: AllStaffService,
    modalService: BsModalService, public testbsModalRef: BsModalRef,
    el: ElementRef, public vsModalRef: BsModalRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
  }

  ngOnInit() {
    let ids = [];
    const mappings = this.smartListService.getTitleMapping();
    this.selctedRowsData.forEach(element => {
      ids = mappings.filter(e => e.jobTitle === element.jobTitle && e.payPlan === element.payPlan);
      ids = Array.from(new Set(ids.map((item: any) => item.grade)));
      element['rowDataValid'] = ids.indexOf(element.hiringPlanGrade) !== -1 ? true : false;
      const values = this.selctedRowsData.filter(e => e.rowDataValid === false);
      this.validGrade = values.length > 0 ? false : true;
    });
    this.originalData = JSON.stringify(this.selctedRowsData);
    this.loadSearchForm();
    this.loadGridOptions();
    this.showSearch = false;
    this.getCustomFilterNames(this.screenObject);
  }
  onGridReady(params) {
    this.gridOptions.onBodyScroll = (event) => {
      printSortStateToConsole(this.el);
    };
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    const defaultSortModel = [
      {
        colId: 'office',
        sort: 'asc',
        sortIndex: 0,
      },
      {
        colId: 'jobTitle',
        sort: 'asc',
        sortIndex: 1,
      },
      {
        colId: 'hiringMechanism',
        sort: 'asc',
        sortIndex: 2,
      },
    ];
    params.columnApi.applyColumnState({ state: defaultSortModel });
    // applyOrder: true,
    // });
    //  params.api.sizeColumnsToFit();
  }


  public loadGridOptions() {
    this.selectedVacancyList = this.fb.group({});
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
    this.multiSortKey = 'ctrl',
      this.frameworkComponents = {
        ddSmartList: AppDropdownSmartList,
        cellRendererComponent: CellRendererComponent,
        dropdownText: DropdownText,
        gradeDdVal: AppGradeDdValcellRendererComponent
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
        filter: true,
        editable: false
      },
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.colDef.field);
          if (dateField >= 0) {
            const updatedItemIndex =
              this.selctedRowsData.findIndex(f => f.vacancyId === params.data.vacancyId);
            this.selctedRowsData[updatedItemIndex][params.colDef.field] =
              this.selctedRowsData[updatedItemIndex][params.colDef.field] !== null &&
                this.selctedRowsData[updatedItemIndex][params.colDef.field] !== '' &&
                this.selctedRowsData[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.selctedRowsData[updatedItemIndex][params.colDef.field]).toISOString() :
                this.selctedRowsData[updatedItemIndex][params.colDef.field];
          }
          if (params.colDef.field === 'selectionType') {
            if (params.oldValue) {
              params.data.selecteeFirstName = '';
              params.data.selecteeLastName = '';
              params.data.selecteeMiddleInitial = '';
              params.data.fullName = '';
              params.data.associateExistingEmployee = '';
            } else if (params.oldValue === undefined || params.oldValue === '') {
              if (params.newValue === 'External to CTP') {

              } else if (params.newValue === 'Internal to CTP') {
                params.data.selecteeFirstName = '';
                params.data.selecteeLastName = '';
                params.data.selecteeMiddleInitial = '';
                params.data.fullName = '';
                params.data.associateExistingEmployee = '';
              }
            }
          }
          if (params.colDef.field === 'associateExistingEmployee') {
            const tempSpEmpList = this.allStaffService.getAllSpEmployees();
            const selectedTempSpEmpList = tempSpEmpList.find(e => e.displaySummary === params.newValue);
            if (selectedTempSpEmpList !== undefined) {
              params.data.fullName = selectedTempSpEmpList.fullName;
              params.data.selecteeFirstName = selectedTempSpEmpList.firstName;
              params.data.selecteeLastName = selectedTempSpEmpList.lastName;
              params.data.selecteeMiddleInitial = selectedTempSpEmpList.middleInitial;

              params.data.internalSelecteeEmployeeId = selectedTempSpEmpList.employeeId;

              params.data.internalSelecteeOffice = selectedTempSpEmpList.office;
              params.data.internalSelecteeOrgLevel = selectedTempSpEmpList.orgLevel;
              params.data.employeeId = selectedTempSpEmpList.id;
              // baseAttributes = {
              //   office, orgLevel, employee, employeeId, year, vacancyId, announcementId,
              //   cancelled, internalSelecteeOffice, internalSelecteeOrgLevel, firstName, lastName, middleInitial
              // };

            }
          }
          if (params.colDef.field === 'hiringPlanGrade') {
            let ids = [];
            const mappings = this.smartListService.getTitleMapping();
            ids = mappings.filter(e => e.jobTitle === params.data.jobTitle && e.payPlan === params.data.payPlan);
            ids = Array.from(new Set(ids.map((item: any) => item.grade)));
            this.selctedRowsData.forEach(element => {
              if (element.vacancyId === params.data.vacancyId) {
                element['rowDataValid'] = ids.indexOf(params.value) !== -1 ? true : false;
                element['grade'] = params.newValue;
              }
            });
          }
          const values = this.selctedRowsData.filter(e => e.rowDataValid === false);
          this.validGrade = values.length > 0 ? false : true;

          if (params.data.selecteeMiddleInitial === null) {
            params.data.selecteeMiddleInitial = '';
          }
          this.selctedRowsData.forEach(sRow => {
            if (sRow.vacancyId === params.data.vacancyId) {
              const rowIndex = this.selctedRowsData.findIndex(temp => temp.vacancyId === params.data.vacancyId);
              if (rowIndex >= 0) {
                this.selctedRowsData.splice(rowIndex, 1);
              }
            }
          });
          this.selctedRowsData.push(params.data);

          // Bring back focus and redraw the updated row with new data
          const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApi.redrawRows({ rowNodes: [row] });
          this.bringFocusBack();
        }
        accessibilityFix(this.el);
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
    this.getColDefs();
  }
  public loadSearchForm() {
    this.searchForm = this.fb.group({
      search: [null],
      filter: [null],
    });
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.searchForm.controls.search.value);
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
    this.onGridReady(this.gridOptions);
  }
  public resetFilterView() {
    this.resetFilterViewDataMultisort(this.searchForm);
  }
  public openFilterDialog() {
    const filterValue = this.searchForm.get('filter').value;
    const filterGridValue = this.searchForm.controls.filter.value;
    const screenObject = {
      screenName: 'PendingSelections'
    };
    this.openFilterDialogViewMultisort(this.searchForm, screenObject);
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
  onRowSelected(event) {
    accessibilityFix(this.el); // 508 fix
  }
  onSelectionChanged(params: any) {
    this.rowsSelectionChanged(params);
  }
  pendingVacanicesList() {
  }
  // to submit the Selected Vacanies to selection template
  submitSelectedRows() {
    let count = 0;
    this.validationVacancyIds = [];
    this.gridApi.clearFocusedCell();
    setTimeout(() => {
      if (this.selctedRowsData.length > 0) {
        this.selctedRowsData.forEach(elementValue => {
          if ((elementValue.selectionDate === '' || elementValue.selectionDate === null || elementValue.selectionDate === undefined) ||
            (elementValue.selecteeFirstName === '' || elementValue.selecteeFirstName === null ||
              elementValue.selecteeFirstName === undefined) ||
            (elementValue.selecteeLastName === '' || elementValue.selecteeLastName === null ||
              elementValue.selecteeLastName === undefined) ||
            (elementValue.selectionType === '' || elementValue.selectionType === null || elementValue.selectionType === undefined)
          ) {
            count++;
            this.validationVacancyIds.push(elementValue.vacancyDisplayId);
          }
        });
      }
      if (count > 0) {
        const initialState = {
          selectionValidationPopup: true,
          header: 'Invalid Data',
          message: 'Vacancies that are being added to the Selections template must '
            + 'have a value for Last Name, First Name, Selection Type and Selection Date.',
          validationVacancyIds: this.validationVacancyIds
          // header: 'Departure Log entries must include a departure date.',
          // details: duplicateJobRequestIds
        };
        this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.submitBtnName = 'Submit';
      } else {
        this.selctedRowsData.forEach(element => {
          element.readyForSelection = true;
          const e = JSON.parse(this.originalData).find(e => e.vacancyId === element.vacancyId);
          element.hiringPlanGrade = e.hiringPlanGrade;
        });
        const initialState = {
          buttonTitle: 'Yes',
          message: 'Are you sure you want to add these vacancies to the Selections template?',
          selectedparentModelRef: this.vsModalRef,
          screenName: 'selectedVacancies',
          year: this.year,
          selctedRowsData: this.selctedRowsData
        };
        this.saveConfirmationDialog123 = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      }
    }, 100);
  }
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Announcement ID',
        field: 'announcementDisplayId',

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Office',
        field: 'office',

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Vacancy ID',
        field: 'vacancyDisplayId',

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Initial Job Req',
        field: 'initialJobReq',

        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        cellEditor: 'ddSmartList',

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Pay Plan ',
        field: 'payPlan',
        cellEditor: 'ddSmartList',

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Series',
        field: 'series',

        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' }
      },
      {
        headerName: 'Grade',
        field: 'hiringPlanGrade',
        cellClass: 'textFormat',
        comparator: numberSort,
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'gradeDdVal',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Type of Hire',
        field: 'typeOfHire',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        editable: true
      },
      {
        headerName: 'Non-Competitive Selection?',
        field: 'nonCompetitiveSelection',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        editable: true
      },
      {
        headerName: 'Certs Issued',
        field: 'certsIssuedDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Hiring Manager',
        field: 'hiringManagerLevel',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Selection Type',
        field: 'selectionType',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Associate Existing Employee',
        field: 'associateExistingEmployee',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellEditorParams: {
          screenName: 'selectionTemplate'
        },
        cellStyle: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return { 'text-align': 'right' };
          }
          return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
        },
        editable: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return true;
          }
          return false;
        },
      },
      {
        headerName: 'Full Name',
        field: 'fullName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Last Name',
        field: 'selecteeLastName',
        // cellStyle: { 'text-align': 'right' },
        cellStyle: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return { backgroundColor: '#E6E6E6', 'text-align': 'right' };

          }
          return { 'text-align': 'right' };
        },
        editable: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return false;
          }
          return true;
        },
      },
      {
        headerName: 'First Name',
        field: 'selecteeFirstName',
        // cellStyle: { 'text-align': 'right' },
        cellStyle: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return { backgroundColor: '#E6E6E6', 'text-align': 'right' };

          }
          return { 'text-align': 'right' };
        },
        editable: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return false;
          }
          return true;
        },
      },
      {
        headerName: 'Middle Initial',
        field: 'selecteeMiddleInitial',
        // cellStyle: { 'text-align': 'right' },
        // editable: true
        cellStyle: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return { backgroundColor: '#E6E6E6', 'text-align': 'right' };

          }
          return { 'text-align': 'right' };
        },
        editable: params => {
          if (params.data.selectionType === 'Internal to CTP') {
            return false;
          }
          return true;
        },
      },

      {
        headerName: 'Staff Member Type',
        field: 'staffMemberType',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Selection Job Req',
        field: 'selectionJobReq',
        cellStyle: { 'text-align': 'right' },
        editable: true
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
        cellStyle: { 'text-align': 'right' },
        editable: true
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
        cellStyle: { 'text-align': 'right' },
        editable: true
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
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'EOD',
        field: 'eodDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Declination/Cancelled Action',
        field: 'declinationDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Comments',
        field: 'comments',
        cellStyle: { 'text-align': 'right' },
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000'
        },
      },
    ];
  }
  close() {
    const initialState = {
      buttonTitle: 'OK',
      message: `Closing this window will cause these selected positions to not
      appear on the Selections template. Press Cancel to close this popup,
      or OK to proceed.`,
    };
    this.bsModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.bsModalRef.content.event.subscribe((response: boolean) => {
      setTimeout(() => {
        if (response === true) {
          this.vsModalRef.hide();
          this.cleartheObject();
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  cleartheObject() {
    this.selctedRowsData.forEach(ele => {
      ele.typeOfHire = '';
      ele.certsIssuedDate = '';
      ele.hiringManagerLevel = '';
      ele.selectionType = '';
      ele.selecteeLastName = '';
      ele.selecteeFirstName = '';
      ele.selecteeMiddleInitial = '';
      ele.staffMemberType = '';
      ele.selectionJobReq = '';
      ele.selectionDate = '';
      ele.tentativeOfferDate = '';
      ele.finalOfferDate = '';
      ele.eodDate = '';
      ele.declinationDate = '';
      ele.comments = '';
      ele.associateExistingEmployee = '';
      ele.fullName = '';
    });

  }
}
