import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridOptions, RowNode } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { columnVisibleAccessbility, numberSort, printSortStateToConsole } from 'src/app/shared/utilities';

@Component({
  selector: 'app-previous-attrition-report',
  templateUrl: './previous-attrition-report.component.html',
  //   styleUrls: ['./previous-attrition-report.component.scss']
})
export class PreviousAttritionReportComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {
  public previousYearSearchForm: FormGroup;
  @ComponentForm(true)
  public busyTableSave: Subscription;
  public frameworkComponents;
  public yearsList = [];
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  private screenObject1 = {
    screenName: 'previousYearAttritionReport'
  };
  @Input() year;
  @Input() previousYearAttritionReportRowData;
  @Input() previousYearAnnualAverageFte;
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
  ngOnChanges(changes: SimpleChanges) {
    // tslint:disable-next-line: forin
    for (const propName in changes) {
      if (propName === 'previousYearAttritionReportRowData') {
        this.showSearch = true;
        const chg = changes[propName];
        if (chg.currentValue.length > 0) {
          this.previousYearAttritionReportRowData = this.previousYearAttritionReportRowData;
        }
      }
      if (propName === 'year') {
        this.showSearch = true;
        this.year = this.year;
        this.getDataforPreviousYear();
      }
    }
  }

  getDataforPreviousYear() {
    this.colDefs.forEach(() => {
      this.colDefs = null;
      this.gridOptions.api.setColumnDefs(this.colDefs);
    });
    if ((this.previousYearAttritionReportRowData != null) && (this.previousYearAttritionReportRowData.length > 0)) {
      this.getColDefs();
      setTimeout(() => {
        this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
        this.gridApi.setPinnedBottomRowData([this.pinnedBottomData]);
      }, 100);
    }
  }

  ngOnInit() {
    this.loadGridOptions();
    this.loadSearchForm();
    //  this.previousYearAttritionReportForm = this.fb.group({});
  }
  public loadSearchForm() {
    this.previousYearSearchForm = this.fb.group({
      search: [null],
      filter: [null],
    });
    this.getCustomFilterNames(this.screenObject1);
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
        // skipColumnHeaders: true,
        // skipColumnGroupHeaders: true,
        resizable: true,
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
  generatePinnedBottomData(gridOptions: GridOptions) {
    const screenNameForTotal = {
      screenName: 'previousAttrition', currentQuarter: 'Q4',
      previousyear: this.previousYearAnnualAverageFte,
      precisionNumber: 1
    };
    const sumColumns = ['office', 'q1AverageFte', 'q2AverageFte', 'q3AverageFte',
      'q4AverageFte', 'q1Departures', 'q2Departures', 'q3Departures', 'q4Departures',
      'q1AttritionRate', 'q2AttritionRate', 'q3AttritionRate', 'q4AttritionRate',
      'annualizedAttritionRate'];
    this.pinnedBottomData = this.generateGridTotalDataPreviousYear(gridOptions, sumColumns, screenNameForTotal);
    this.pinnedBottomData['office'] = 'Grand Total';
    return this.pinnedBottomData;
  }
  // generating total row
  generateGridTotalDataPreviousYear(gridOptions, sumColumns, screenDetails) {
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
      if (screenDetails.currentQuarter === 'Q4') {
        if (result['annualizedAttritionRate']) {
          result['annualizedAttritionRate'] =
            // tslint:disable-next-line: max-line-length
            ((Number(result['q1Departures']) + Number(result['q2Departures']) + Number(result['q3Departures']) + Number(result['q4Departures'])) / this.previousYearAnnualAverageFte) * 100;
          result['annualizedAttritionRate'] = parseFloat(result['annualizedAttritionRate']).toFixed(screenDetails.precisionNumber);
        }
      }
    });
    return result;
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
      screenName: 'previousYearAttritionReport'
    };
    this.openFilterDialogView(this.previousYearSearchForm, screenObject1);
  }
  public resetFilterView() {
    this.resetFilterViewData(this.previousYearSearchForm);
  }
  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }
  public openExportModal() {
    this.ExportGridData();
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.previousYearSearchForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public onSortChange() {
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
        editable: false
      },
      {
        headerName: this.year + ' Qtr 1',
        children: [{
          headerName: 'Avg FTE Qtr ',
          field: 'q1AverageFte',
          comparator: numberSort,
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false
        },
        {
          headerName: 'Departed',
          field: 'q1Departures',
          comparator: numberSort,
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false
        },
        {
          headerName: 'Attrition Rate',
          field: 'q1AttritionRate',
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          valueFormatter: this.formatPercent,
          comparator: numberSort,
        }],
      },
      {
        headerName: this.year + ' Qtr 2',
        children: [{
          headerName: 'Avg FTE Qtr ',
          field: 'q2AverageFte',
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          comparator: numberSort,
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
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          comparator: numberSort,
          valueFormatter: this.formatPercent
        }],
      },
      {
        headerName: this.year + ' Qtr 3',
        children: [{
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
          editable: false
        },
        {
          headerName: 'Attrition Rate',
          field: 'q3AttritionRate',
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          comparator: numberSort,
          valueFormatter: this.formatPercent
        }],
      },
      {
        headerName: this.year + ' Qtr 4',
        children: [{
          headerName: 'Avg FTE Qtr ',
          field: 'q4AverageFte',
          comparator: numberSort,
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false
        },
        {
          headerName: 'Departed',
          field: 'q4Departures',
          comparator: numberSort,
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false
        },
        {
          headerName: 'Attrition Rate',
          field: 'q4AttritionRate',
          comparator: numberSort,
          cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
          editable: false,
          valueFormatter: this.formatPercent
        }],
      },
      {
        headerName: this.year + ' Attrition Rate',
        field: 'annualizedAttritionRate',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        valueFormatter: this.formatPercent
      }
    ];
  }
}
