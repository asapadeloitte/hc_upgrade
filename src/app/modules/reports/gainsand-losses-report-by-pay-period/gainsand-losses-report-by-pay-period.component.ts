import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid-community';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { accessibilityFix, columnVisibleAccessbility, printSortStateToConsole } from 'src/app/shared/utilities';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  DropdownText, CellRendererComponent,
  AppDropdownSmartList
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { generateGridTotalData } from 'src/app/shared/grid-utilities';

@Component({
  selector: 'app-gainsand-losses-report-by-pay-period',
  templateUrl: './gainsand-losses-report-by-pay-period.component.html',
  styleUrls: ['./gainsand-losses-report-by-pay-period.component.scss']
})
export class GainsandLossesReportByPayPeriodComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public payPeriodFormGroup: FormGroup;
  public payPeriodSearchForm: FormGroup;
  public busyTableSave: Subscription;
  public gainLossesPayPeriodData = [];
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
  private screenObject = {
    screenName: 'gains-losses-payperiod'
  };
  public errorDetails: any = [];
  public smartList: any;
  public employees: any;

  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,
    public _adminService: AdminService,
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
    }

  ngOnInit() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.officeList = args.officeOrgLevelMapping;
    });
    this.loadGridOptions();
    this.loadSearchForm();
    this.onGoClick();
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
          this.payPeriodFormGroup.markAsDirty();
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const id = params.data.id;
          // Collect all the changed rows within the grid
          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.id === params.data.id);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }

          this.editedData.push(params.data);

          if (this.editedData.length > 0) {
            this.payPeriodFormGroup.markAsDirty();
          } else {
            this.payPeriodFormGroup.markAsPristine();
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
        flex: 1,
        minWidth: 200,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
      stopEditingWhenGridLosesFocus: true
    } as GridOptions;
  }
  public loadSearchForm() {
    this.payPeriodSearchForm = this.fb.group({
      year: [null, [Validators.required]],
      version: [null, Validators.required],
      payPeriod: [null, Validators.required],
      search: [null],
      filter: [null],
    });
    this.getCustomFilterNames(this.screenObject);
  }
  public loadOfficeForm() {
  }
  onGoClick() {
    if (this.editedData.length > 0) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe(() => {
        this.getData();
        this.payPeriodFormGroup.markAsPristine();
        this.payPeriodSearchForm.controls.filter.setValue(null);
      });
      this.bsModalRef.content.onCancel.subscribe(() => {
      });
    } else {
      this.getData();
    }
  }
  public getData() {

    this.showSearch = true;
    this.colDefs = [];
    this.detailLogList = [];
    this.editedData = [];
    this.rowsSelected = false;
    this.payPeriodSearchForm.controls.filter.setValue(null);
    this.getColDefs();
    this.showSearch = true;
    this.busyTableSave = this.humanCapitalService.getPromotionLogData('FY21').subscribe(args => {
      if ((args != null) && (args.length > 0)) {
        this.getColDefs();
        let a = [];
        const smartListValues = this.smartListService.getDDVals();
        a = args;
        a.forEach(el => {
          Object.keys(el).forEach(key => {
            if (smartListValues) {
              const tempVal = smartListValues.find(f => f.smartListName === key);
              if (tempVal) {
                const tempVal1 = tempVal.smartListValues.find(f => f.id === el[key]);
                el[key] = tempVal1 !== undefined ? tempVal1.value : el[key];
              }
            }
          });
        });
        setTimeout(() => {
          this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
          this.gridApi.setPinnedBottomRowData([this.pinnedBottomData]);
        }, 1500);
        this.originalData = JSON.stringify(a);
        this.gainLossesPayPeriodData = a;
      }
    });
  }
  generatePinnedBottomData(gridOptions: GridOptions) {
    const sumColumns = ['office', 'estimatedRevisedAmount', 'projectDetails'];
    this.pinnedBottomData = generateGridTotalData(gridOptions, sumColumns, 'gains');
    this.pinnedBottomData['office'] = 'CTP Total';
    return this.pinnedBottomData;
  }
  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  public openFilterDialog() {
    const screenObject1 = {
      screenName: 'gains-losses-payperiod'
    };
    this.openFilterDialogView(this.payPeriodSearchForm, screenObject1);
  }
  public resetFilterView() {
    this.resetFilterViewData(this.payPeriodSearchForm);
  }
  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }
  public openExportModal() {
    this.ExportGridData();
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.payPeriodSearchForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }
  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }
  public onYearChangeEvent(event: any) {
    this.year = this.payPeriodSearchForm.controls.year.value;
  }
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        field: 'office',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: '9/30/2020',
        field: 'fullName',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Gains Calculated',
        field: 'lastName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Gains Adjustments',
        field: 'firstName',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Gains',
        field: 'middleInitial',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Loses Calculated',
        field: 'detailType',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Loses Adjustments ',
        field: 'firstName',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      // FY21 Departures Adjustments
      {
        headerName: 'Loses ',
        field: 'firstName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      // FY21 Departure
      {
        headerName: 'Net Hires (9/30/2020 + Gains + Loses)',
        field: 'firstName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Current Onboard',
        field: 'ctpHomeOrgLevel',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Needed to Meet Planned Positions',
        field: 'nonCtpHomeOfficeCenter',
        editable: true,
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Planned Positions',
        field: 'nonCtpHomeOrgLevel',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
    ];
  }
}
