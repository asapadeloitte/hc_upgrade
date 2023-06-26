import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { AppDropdownSmartList, CellRendererComponent, DropdownText } from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { generateGridTotalDataQHP } from 'src/app/shared/grid-utilities';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { accessibilityFix, columnVisibleAccessbility, numberSort, printSortStateToConsole } from 'src/app/shared/utilities';
import { QhpService } from '../quartely-hiring-plan-main/qhp.service';





@Component({
  selector: 'app-quarterly-hiring-plan',
  templateUrl: './quarterly-hiring-plan.component.html',
  styleUrls: ['./quarterly-hiring-plan.component.scss']
})
export class QuarterlyHiringPlanComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  public quartelyHiringPlanForm: FormGroup;
  public quartelyHiringPlanSearchForm: FormGroup;
  public searchForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
  public tempEditedRows: any = [];
  public editedData: any = [];
  public officeName: any;
  public year: any;
  public showSearch = false;
  public vacanciesList = [];
  public frameworkComponents;
  public originalData: string;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public hiringMechList: any;
  public deleteObj;
  public deleteClicked = false;
  public id;
  private screenObject = {
    screenName: 'quartely-hiringplan'
  };
  public errorDetails: any = [];
  private defaultColDef: ColDef;
  public smartList: any;
  public employees: any;
  public currentYear;
  public previousYear;
  public qtr1Complete;
  public qtr2Complete;
  public qtr3Complete;
  public qtr4Complete;
  public roles = null;
  public previousYearAttritionRate;
  public previousOnlyYear;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCellValueUpdated = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancelClicked = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,
    private qhpService: QhpService,
    public _adminService: AdminService,
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.qhpService.onVacanciesListen().subscribe(response => {
      if (response === true) {
        this.onGoClickQHP();
      }
    });
  }

  ngOnInit() {
    this.roles = this.authService.jwt_getRole();
    this.loadGridOptions();
    this.loadSearchForm();
    this.onGoClickQHP();
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
      defaultColDef: {
        singleClickEdit: true,
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
      getRowStyle(params) {
        if (params.data.office === 'CTP Total') {
          return { 'font-weight': 'bold', backgroundColor: '#E6E6E6' };
        }
        return null;
      },
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          this.quartelyHiringPlanForm.markAsDirty();
          this.onCellValueUpdated.emit(true);
          const office = params.data.office;
          const baseAttributes = { office };
          const originalRow = JSON.parse(this.originalData).find(f => f.office === params.data.office);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);
          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.office === params.data.office);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }

          if (this.editedData.length > 0) {
            this.quartelyHiringPlanForm.markAsDirty();
            this.onCellValueUpdated.emit(true);
          } else {
            this.quartelyHiringPlanForm.markAsPristine();
          }

          // Bring back focus and redraw the updated row with new data
          const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApi.redrawRows({ rowNodes: [row] });
          this.bringFocusBack();
          setTimeout(() => {
            const pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
            this.pinnedBottomData = pinnedBottomData;
            this.gridApi.setPinnedBottomRowData([pinnedBottomData]);
          }, 500);
        }
        accessibilityFix(this.el);
      },
     onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
      stopEditingWhenGridLosesFocus: true
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
  public loadSearchForm() {
    this.quartelyHiringPlanForm = this.fb.group({});
    this.quartelyHiringPlanSearchForm = this.fb.group({
      search: [null],
      filter: [null],
    });
    this.getCustomFilterNames(this.screenObject);
  }
  public loadOfficeForm() {
  }
  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }
  onGoClickQHP() {
    if (this.editedData.length > 0) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe(() => {
        this.getData();
        this.quartelyHiringPlanForm.markAsPristine();
        this.quartelyHiringPlanSearchForm.controls.filter.setValue(null);
      });
      this.bsModalRef.content.onCancel.subscribe(() => {
      });
    } else {
      this.getData();
    }

  }
  public isColumnEditable(params) {
    if (params.data.office === 'CTP Total' || this.roles.includes('CTPHC_QHP_Analyst') || this.roles.includes('HOA_Analyst_QHP_Analyst')) {
      return false;
    }
    return true;
  }

  public getData() {
    this.showSearch = true;
    this.colDefs = [];
    this.vacanciesList = [];
    this.editedData = [];
    this.rowsSelected = false;
    this.quartelyHiringPlanSearchForm.controls.filter.setValue(null);
    this.showSearch = true;
    this.busyTableSave = this.humanCapitalService.getQHP().subscribe(argsValues => {
      // data from API
      const args = argsValues.details;
      this.currentYear = argsValues.currentYear;
      this.previousYear = argsValues.previousYear;
      this.qtr1Complete = argsValues.qtr1Complete;
      this.qtr2Complete = argsValues.qtr2Complete;
      this.qtr3Complete = argsValues.qtr3Complete;
      this.qtr4Complete = argsValues.qtr4Complete;
      this.previousYearAttritionRate = argsValues.previousYearAttritionRate;
      this.previousOnlyYear = this.previousYear.substring(2);
      this.getColDefs();
      if (this.qtr1Complete === true) {
        this.quarterDynamicDataDisplay('Q1 Target');
      } else {
        this.quarterDynamicDataDisplay('Q1 Actuals');
      }
      if (this.qtr2Complete === true) {
        this.quarterDynamicDataDisplay('Q2 Target');
      } else {
        this.quarterDynamicDataDisplay('Q2 Actuals');
      }
      if (this.qtr3Complete === true) {
        this.quarterDynamicDataDisplay('Q3 Target');
      } else {
        this.quarterDynamicDataDisplay('Q3 Actuals');
      }
      if (this.qtr4Complete === true) {
        this.quarterDynamicDataDisplay('Q4 Target');
      } else {
        this.quarterDynamicDataDisplay('Q4 Actuals');
      }
      if ((args != null) && (args.length > 0)) {
        if (!this.roles.includes('CTPHC_QHP_Analyst') || this.roles.includes('HOA_Analyst_QHP_Analyst')) {
          setTimeout(() => {
            this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
            this.gridApi.setPinnedBottomRowData([this.pinnedBottomData]);
          }, 100);
        }
        this.originalData = JSON.stringify(args);
        this.vacanciesList = args;
      }
    });
  }
  generatePinnedBottomData(gridOptions: GridOptions) {
    const sumColumns = ['office', 'previousFyPlannedPositions', 'previousEoyPositionsOnboard', 'hiresCalculated',
      'hiresAdjustments', 'hires', 'departuresCalculated', 'departuresAdjustments', 'departures',
      'reassignmentsInCalculated', 'reassignmentsInAdjustments', 'reassignmentsIn', 'reassignmentsOutCalculated',
      'reassignmentsOutAdjustments', 'reassignmentsOut', 'stdntCnvrsnToYrRound', 'calculatedPositionsOnboard',
      'adjustedPositionsOnboard', 'actualPositionsOnboard', 'remainingPlannedVacancies', 'plannedPositions',
      'spendPlanTarget', 'fivePrcntpositionFlexibility', 'qtr1Target', 'qtr1Actuals', 'qtr2Target', 'qtr2Actuals',
      'qtr3Target', 'qtr3Actuals', 'qtr4Target', 'qtr4Actuals', 'attritionRate'];
    const screen = { screenName: 'QHP', value: this.previousYearAttritionRate };
    this.pinnedBottomData = generateGridTotalDataQHP(gridOptions, sumColumns, screen);
    this.pinnedBottomData['office'] = 'CTP Total';
    return this.pinnedBottomData;
  }
  quarterDynamicDataDisplay(headerName: string) {
    this.colDefs = this.colDefs.filter(el => el.headerName !== headerName);
    this.gridOptions.api.setColumnDefs(this.colDefs);
  }
  onSave() {
    if (this.editedData.length > 0) {
      this.busyTableSave = this.humanCapitalService.saveQHP(this.editedData).subscribe(data => {
        this.toaster.pop('success', 'Saved', 'Successfully saved the data');
        this.getData();
        this.editedData = [];
        this.quartelyHiringPlanForm.markAsPristine();
        this.onCellValueUpdated.emit(false);
      }, error => {
        error.error.errorDetails.forEach(element => {
          this.errorDetails.push(element.message);
        });
        this.toaster.pop('error', 'Failed', this.errorDetails);
      });
    }
  }
  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  public openFilterDialog() {
    const screenObject1 = {
      screenName: 'quartely-hiringplan'
    };
    this.openFilterDialogView(this.quartelyHiringPlanSearchForm, screenObject1);
  }
  public resetFilterView() {
    this.resetFilterViewData(this.quartelyHiringPlanSearchForm);
  }
  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public openExportModal() {
    this.ExportGridData();
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.quartelyHiringPlanSearchForm.controls.search.value);
    printSortStateToConsole(this.el);
  }

  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }
  // when editable true we need to call the getRowStyle
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        field: 'office',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: this.previousYear + ' ' + 'Planned Positions',
        field: 'previousFyPlannedPositions',
        cellEditorParams: {
          roleList: this.roleList
        },
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        comparator: numberSort,
      },
      {
        headerName: this.previousYear + ' ' + 'EOY Positions Onboard as of 9/30/20' + '' + this.previousOnlyYear,
        field: 'previousEoyPositionsOnboard',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Hires Calculated',
        field: 'hiresCalculated',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Hires Adjustments',
        field: 'hiresAdjustments',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Hires',
        field: 'hires',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Departures Calculated',
        field: 'departuresCalculated',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      // FY21 Departures Adjustments
      {
        headerName: this.currentYear + ' ' + 'Departures Adjustments',
        field: 'departuresAdjustments',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        comparator: numberSort,
      },
      // FY21 Departure
      {
        headerName: this.currentYear + ' ' + 'Departure',
        field: 'departures',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Reassignments In Calculated',
        field: 'reassignmentsInCalculated',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Reassignments In Adjustments',
        field: 'reassignmentsInAdjustments',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Reassignments In',
        field: 'reassignmentsIn',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Reassignments Out Calculated',
        field: 'reassignmentsOutCalculated',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Reassignments Out Adjustments',
        field: 'reassignmentsOutAdjustments',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Reassignments Out',
        field: 'reassignmentsOut',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Student Conversion',
        field: 'stdntCnvrsnToYrRound',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        comparator: numberSort,
      },
      {
        headerName: 'Calculated Positions Onboard',
        field: 'calculatedPositionsOnboard',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Adjusted Positions Onboard',
        field: 'adjustedPositionsOnboard',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        comparator: numberSort,
      },
      {
        headerName: 'Actuals Positions Onboard',
        field: 'actualPositionsOnboard',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Remaining Planned Vacancies',
        field: 'remainingPlannedVacancies',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Planned Positions',
        field: 'plannedPositions',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.currentYear + ' ' + 'Spend Plan Target',
        field: 'spendPlanTarget',
        editable: this.isColumnEditable.bind(this),
        cellStyle: this.getCellStyle.bind(this),
        comparator: numberSort,
      },
      {
        headerName: '5% Positions Flexibility',
        field: 'fivePrcntpositionFlexibility',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q1 Target',
        field: 'qtr1Target',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q1 Actuals',
        field: 'qtr1Actuals',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q2 Target',
        field: 'qtr2Target',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q2 Actuals',
        field: 'qtr2Actuals',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q3 Target',
        field: 'qtr3Target',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q3 Actuals',
        field: 'qtr3Actuals',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q4 Target',
        field: 'qtr4Target',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: 'Q4 Actuals',
        field: 'qtr4Actuals',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      },
      {
        headerName: this.previousYear + ' ' + 'Attrition Rate',
        field: 'attritionRate',
        // editable: this.isColumnEditable.bind(this),
        valueFormatter: this.formatPercent,
        // cellStyle: this.getCellStyle.bind(this),
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        comparator: numberSort,
      },
    ];
    // this.defaultColDef = {
    //   flex: 1,
    //   minWidth: 100,
    //   resizable: true,
    // };
  }
  formatPercent(params: any) {
    const data = params.value;
    return data + '%';
  }
  getCellStyle(params) {
    if (this.roles.includes('CTPHC_QHP_Analyst') ||  this.roles.includes('HOA_Analyst_QHP_Analyst')) {
      return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
    } else {
      return { 'text-align': 'right' };
    }
  }
}
