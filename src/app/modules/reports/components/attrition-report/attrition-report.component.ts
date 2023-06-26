import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridOptions, RowNode } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { columnVisibleAccessbility, numberSort, printSortStateToConsole } from 'src/app/shared/utilities';
import { changeYearDropDownVales } from 'src/app/shared/grid-utilities';


@Component({
  selector: 'app-attrition-report',
  templateUrl: './attrition-report.component.html',
  styleUrls: ['./attrition-report.component.scss']
})
export class AttritionReportComponent extends BasePageComponent implements OnInit, OnDestroy {

  public searchForm: FormGroup;
  @ComponentForm(true)
  public currentYearAttritionReportForm: FormGroup;
  public busyTableSave: Subscription;
  public currentYearAttritionReportRowData = [];
  public previousYearAttritionReportRowData = [];
  public frameworkComponents;
  public yearsList = [];
  public colDefs = [];
  public previousYear;
  public currentYear;
  public lastQuarter;
  public gridOptions: GridOptions;
  public statusBar;
  public lastCompletedQuarter;
  public previousQuarter;
  public currentYearAnnualAverageFte;
  public previousYearAnnualAverageFte;
  public attritionCalculation;
  public excelStyles;
  public Q4attritionRate;
  private screenObject1 = {
    screenName: 'currentYearAttritionReport'
  };
  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.excelStyles = [
      {
        id: 'header',
        font: { bold: true },
       },
      {
        id: 'headerGroup',
        font: { bold: true },
        alignment: { horizontal: 'Center', vertical: 'Center'},
      }
    ];
    }
  ngOnInit() {
    this.loadGridOptions();
    this.loadSearchForm();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      // 17.1 year dropdown value changes CBAS-6807
      this.yearsList = changeYearDropDownVales(this.yearsList);
    });
    this.currentYearAttritionReportForm = this.fb.group({});
  }
  public loadSearchForm() {
    this.searchForm = this.fb.group({
      year: [null, [Validators.required]],
      search: [null],
      filter: [null],
    });
    this.getCustomFilterNames(this.screenObject1);
  }
  public onYearChangeEvent() {
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

    this.frameworkComponents = {
    };
    this.gridOptions = {
      context: {
        componentParent: this,
      },
      getRowStyle(params) {
        if (params.data && params.data.office === 'Grand Total') {
          return { 'font-weight': 'bold' };
        }
        return null;
      },
       defaultColDef: {
        singleClickEdit: true,
        resizable: true,
        // flex: 1,
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
  onGoClick() {
    this.year = this.searchForm.controls.year.value;
    this.getData();
  }
  getData() {
    this.currentYearAttritionReportRowData = [];
    this.previousYearAttritionReportRowData = [];
    this.colDefs = [];
    this.rowsSelected = false;
    this.searchForm.controls.filter.setValue(null);
    this.showSearch = true;
    this.busyTableSave = this.humanCapitalService.getAttritionReport(this.year).subscribe(args => {
      this.previousYear = args.previousYear;
      this.currentYear = args.currentYear;
      this.currentYearAnnualAverageFte = args.currentYearAnnualAverageFte;
      this.previousYearAnnualAverageFte = args.previousYearAnnualAverageFte;
      this.lastCompletedQuarter = args.lastCompletedQuarter;
      this.previousQuarter = 'Q4';


      if (this.lastCompletedQuarter === 'Q1') {
        this.attritionCalculation =
          'Annualized Attrition Rate Q1 = (Qtr 1 departures x 4 quarters) / Qtr 1 Average Positions Onboard';
        this.year = this.previousYear;
        this.lastQuarter = 'Qtr 4';
        this.quarterDynamicDataDisplay(this.currentYear + ' Qtr 2');
        this.quarterDynamicDataDisplay(this.currentYear + ' Qtr 3');
        this.quarterDynamicDataDisplay(this.currentYear + ' Qtr 4');
      }
      if (this.lastCompletedQuarter === 'Q2') {
        this.attritionCalculation =
          'Annualized Attrition Rate Q2 = (Q1 + Q2 departures) x 2 quarters) / Qtr 2 Average Positions Onboard';
        this.lastQuarter = 'Qtr 1';
        this.quarterDynamicDataDisplay(this.currentYear + ' Qtr 3');
        this.quarterDynamicDataDisplay(this.currentYear + ' Qtr 4');
      }
      if (this.lastCompletedQuarter === 'Q3') {
        this.attritionCalculation =
          'Annualized Attrition Rate Q3 = (Q1 + Q2 + Q3 departures) x 1.33) / Qtr 3 Average Positions Onboard';
        this.lastQuarter = 'Qtr 2';
        this.quarterDynamicDataDisplay(this.currentYear + ' Qtr 4');
      }

      if (this.lastCompletedQuarter === 'Q4') {
        this.lastQuarter = 'Qtr 3';
        this.getColDefs();
        this.attritionCalculation =
          'Annualized Attrition Rate Q4 = (Q1 + Q2+ Q3 + Q4 departures) / Average Positions Onboard for Current Fiscal Year';
      }


      if (args.previousYearDetails) {
        this.previousYearAttritionReportRowData = args.previousYearDetails;
      }
      if ((args.currentYearDetails !== null) && (args.currentYearDetails.length > 0)) {
        setTimeout(() => {
          this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
          this.gridApi.setPinnedBottomRowData([this.pinnedBottomData]);
        }, 100);
        this.currentYearAttritionReportRowData = args.currentYearDetails;
      } else {
        this.pinnedBottomData = null;
        this.getColDefs();
        setTimeout(() => {
          this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
          this.gridApi.setPinnedBottomRowData(null);
        }, 100);
      }
    });

  }
  generatePinnedBottomData(gridOptions: GridOptions) {
    const screenNameForTotal = {
      screenName: 'currentAttrition', lastCompletedQuarter: this.lastCompletedQuarter,
      previousYearData: this.previousYearAttritionReportRowData,
      previousYearAnnual: this.previousYearAnnualAverageFte,
      currentYearAnnual: this.currentYearAnnualAverageFte,
      precisionNumber: 1
    };
    const sumColumns = ['office', 'q1AverageFte', 'q2AverageFte', 'q3AverageFte',
      'q4AverageFte', 'q1Departures', 'q2Departures', 'q3Departures', 'q4Departures',
      'q1AttritionRate', 'q2AttritionRate', 'q3AttritionRate', 'q4AttritionRate'
      , 'attritionRateQuarterlyDelta', 'annualizedAttritionRate', 'previousYearAttritionRate',
    ];
    this.pinnedBottomData = this.generateGridTotalDataAttritionData(gridOptions, sumColumns, screenNameForTotal);
    this.pinnedBottomData['office'] = 'Grand Total';
    return this.pinnedBottomData;
  }
  generateGridTotalDataAttritionData(gridOptions, sumColumns, screenDetails) {
    // generate a row-data with null values
    const result = {};
    if (gridOptions.columnApi) {
      gridOptions.columnApi.getAllColumns().forEach(item => {
        result[item.getId()] = null;
      });
    }
    sumColumns.forEach(element => {
      if (gridOptions.columnApi) {
        gridOptions.api.forEachNode((rowNode: RowNode) => {
          if (rowNode.data[element] && !isNaN(rowNode.data[element])) {
            result[element] += Number((rowNode.data[element]).replace(/[$,]/g, ''));
          }
        });
      }
      if (result[element]) {
        if (!isNaN(result[element])) {
          result[element] = parseFloat(result[element]).toFixed(screenDetails.precisionNumber);
        }
        result[element] = `${result[element]}`;
      }
      if (result['previousYearAttritionRate']) {
        let sumQ1Departure = 0;
        let sumQ2Departure = 0;
        let sumQ3Departure = 0;
        let sumQ4Departure = 0;
        let q1AvergaeFTE = 0;
        let q2AvergaeFTE = 0;
        let q3AvergaeFTE = 0;
        let q4AvergaeFTE = 0;
        screenDetails.previousYearData.forEach(elementValue => {
          if (elementValue) {
            sumQ1Departure += Number(elementValue.q1Departures);
            sumQ2Departure += Number(elementValue.q2Departures);
            sumQ3Departure += Number(elementValue.q3Departures);
            sumQ4Departure += Number(elementValue.q4Departures);
            q1AvergaeFTE += Number(elementValue.q1AverageFte);
            q2AvergaeFTE += Number(elementValue.q2AverageFte);
            q3AvergaeFTE += Number(elementValue.q3AverageFte);
            q4AvergaeFTE += Number(elementValue.q4AverageFte);
          }
        });
        this.Q4attritionRate = Number(sumQ4Departure) / Number(q4AvergaeFTE) * 100;
        if (this.previousQuarter === 'Q4') {
          result['previousYearAttritionRate'] =
            (sumQ1Departure + sumQ2Departure + sumQ3Departure + sumQ4Departure) / Number(screenDetails.previousYearAnnual) * 100;
          result['previousYearAttritionRate'] = parseFloat(result['previousYearAttritionRate']).toFixed(screenDetails.precisionNumber);
        }
      }
      if (screenDetails.screenName === 'currentAttrition') {
        if (result['q1AttritionRate']) {
          result['q1AttritionRate'] = Number(result['q1Departures']) / Number(result['q1AverageFte']) * 100;
          result['q1AttritionRate'] = parseFloat(result['q1AttritionRate']).toFixed(screenDetails.precisionNumber);
        }
        if (result['q2AttritionRate']) {
          result['q2AttritionRate'] = Number(result['q2Departures']) / Number(result['q2AverageFte']) * 100;
          result['q2AttritionRate'] = parseFloat(result['q2AttritionRate']).toFixed(screenDetails.precisionNumber);
        }
        if (result['q3AttritionRate']) {
          result['q3AttritionRate'] = Number(result['q3Departures']) / Number(result['q3AverageFte']) * 100;
          result['q3AttritionRate'] = parseFloat(result['q3AttritionRate']).toFixed(screenDetails.precisionNumber);
        }
        if (result['q4AttritionRate']) {
          result['q4AttritionRate'] = Number(result['q4Departures']) / Number(result['q4AverageFte']) * 100;
          result['q4AttritionRate'] = parseFloat(result['q4AttritionRate']).toFixed(screenDetails.precisionNumber);
        }
        if (screenDetails.lastCompletedQuarter === 'Q1') {
          if (result['annualizedAttritionRate']) {
            // Annualized Attrition Rate Q1 = (Qtr 1 departures x 4 quarters) / Qtr 1 Average Positions Onboard
            result['annualizedAttritionRate'] =
              (Number(result['q1Departures']) * 4) / Number(result['q1AverageFte']) * 100;
            result['annualizedAttritionRate'] = parseFloat(result['annualizedAttritionRate']).toFixed(screenDetails.precisionNumber);
          }
          if (result['attritionRateQuarterlyDelta']) {
            result['attritionRateQuarterlyDelta'] = Number(result['q1AttritionRate']) - Number(this.Q4attritionRate);
            result['attritionRateQuarterlyDelta'] =
              parseFloat(result['attritionRateQuarterlyDelta']).toFixed(screenDetails.precisionNumber);
          }
        }
        if (screenDetails.lastCompletedQuarter === 'Q2') {
          if (result['annualizedAttritionRate']) {
            // Annualized Attrition Rate Q2 = (Q1 + Q2 departures) x 2 quarters) / Qtr 2 Average Positions Onboard
            result['annualizedAttritionRate'] =
              ((Number(result['q1Departures']) + Number(result['q2Departures'])) * 2) / Number(result['q2AverageFte']) * 100;
            result['annualizedAttritionRate'] = parseFloat(result['annualizedAttritionRate']).toFixed(screenDetails.precisionNumber);
          }
          if (result['attritionRateQuarterlyDelta']) {
            result['attritionRateQuarterlyDelta'] = Number(result['q2AttritionRate']) - Number(result['q1AttritionRate']);
            result['attritionRateQuarterlyDelta'] =
              parseFloat(result['attritionRateQuarterlyDelta']).toFixed(screenDetails.precisionNumber);
          }
        }
        if (screenDetails.lastCompletedQuarter === 'Q3') {
          if (result['annualizedAttritionRate']) {
            result['annualizedAttritionRate'] =
              // tslint:disable-next-line: max-line-length
              ((Number(result['q1Departures']) + Number(result['q2Departures']) + Number(result['q3Departures'])) * 1.33) / Number(result['q3AverageFte']) * 100;
            result['annualizedAttritionRate'] = parseFloat(result['annualizedAttritionRate']).toFixed(screenDetails.precisionNumber);
          }
          if (result['attritionRateQuarterlyDelta']) {
            result['attritionRateQuarterlyDelta'] = Number(result['q3AttritionRate']) - Number(result['q2AttritionRate']);
            result['attritionRateQuarterlyDelta'] =
              parseFloat(result['attritionRateQuarterlyDelta']).toFixed(screenDetails.precisionNumber);
          }
        }
        if (screenDetails.lastCompletedQuarter === 'Q4') {
          if (result['annualizedAttritionRate']) {
            result['annualizedAttritionRate'] =
              // tslint:disable-next-line: max-line-length
              ((Number(result['q1Departures']) + Number(result['q2Departures']) + Number(result['q3Departures']) + Number(result['q4Departures'])) / this.currentYearAnnualAverageFte) * 100;
            result['annualizedAttritionRate'] = parseFloat(result['annualizedAttritionRate']).toFixed(screenDetails.precisionNumber);
          }
          if (result['attritionRateQuarterlyDelta']) {
            result['attritionRateQuarterlyDelta'] = Number(result['q4AttritionRate']) - Number(result['q3AttritionRate']);
            result['attritionRateQuarterlyDelta'] =
              parseFloat(result['attritionRateQuarterlyDelta']).toFixed(screenDetails.precisionNumber);
          }
        }
      }
    });
    return result;
  }

  quarterDynamicDataDisplay(headerName: string) {
    this.getColDefs();
    setTimeout(() => {
      this.colDefs = this.colDefs.filter(el => el.headerName !== headerName);
      this.gridOptions.api.setColumnDefs(this.colDefs);
    }, 100);
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  formatPercent(params: any) {
    const data = params.value;
    return data + '%';
  }
  public openFilterDialog() {
    const screenObject1 = {
      screenName: 'currentYearAttritionReport'
    };
    this.openFilterDialogView(this.searchForm, screenObject1);
  }
  public resetFilterView() {
    this.resetFilterViewData(this.searchForm);
  }
  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }
  public openExportModal() {
    this.ExportGridData();
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.searchForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public onSortChange(e) {
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
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        field: 'office',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
      },
      {
        headerName: this.currentYear + ' Qtr 1',
        children: [
          {
            headerName: 'Avg FTE Qtr ',
            field: 'q1AverageFte',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
           },
          {
            headerName: 'Departed',
            field: 'q1Departures',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
          },
          {
            headerName: 'Attrition Rate',
            field: 'q1AttritionRate',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
            valueFormatter: this.formatPercent,
          }
        ],
      },
      {
        headerName: this.currentYear + ' Qtr 2',
        children: [
          {
            headerName: 'Avg FTE Qtr ',
            field: 'q2AverageFte',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
           },
          {
            headerName: 'Departed',
            field: 'q2Departures',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
          },
          {
            headerName: 'Attrition Rate',
            field: 'q2AttritionRate',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
            valueFormatter: this.formatPercent,
          }
        ],
      },
      {
        headerName: this.currentYear + ' Qtr 3',
        children: [
          {
            headerName: 'Avg FTE Qtr ',
            field: 'q3AverageFte',
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
            comparator: numberSort,
           },
          {
            headerName: 'Departed',
            field: 'q3Departures',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
           },
          {
            headerName: 'Attrition Rate',
            field: 'q3AttritionRate',
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
            valueFormatter: this.formatPercent,
            comparator: numberSort,
            }
        ],
      },
      {
        headerName: this.currentYear + ' Qtr 4',
        children: [
          {
            headerName: 'Avg FTE Qtr ',
            field: 'q4AverageFte',
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
            comparator: numberSort,
          },
          {
            headerName: 'Departed',
            field: 'q4Departures',
            comparator: numberSort,
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
            },
          {
            headerName: 'Attrition Rate',
            field: 'q4AttritionRate',
            cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
            editable: false,
            valueFormatter: this.formatPercent,
            comparator: numberSort,
          }
        ],
      },
      {
        headerName: '',
        headerClass: 'fill',
        children: [{
          headerName: '+/-' + [this.year] + ' ' + this.lastQuarter + ' Attrition Rate',
          field: 'attritionRateQuarterlyDelta',
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          valueFormatter: this.formatPercent,
          comparator: numberSort,
          },
        {
          headerName: 'Annualized Attrition Rate',
          field: 'annualizedAttritionRate',
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          valueFormatter: this.formatPercent,
          comparator: numberSort,
       },
        {
          headerName: this.previousYear + ' Attrition Rate',
          field: 'previousYearAttritionRate',
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          valueFormatter: this.formatPercent,
          comparator: numberSort,
          },
        ]
      }
    ];
  }
}
