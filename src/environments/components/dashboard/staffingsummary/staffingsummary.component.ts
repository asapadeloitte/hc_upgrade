import { Component, OnInit, Input, ElementRef, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';
import { columnVisibleAccessbility, printSortStateToConsole, numberSort } from 'src/app/shared/utilities';
import { Subscription } from 'rxjs';
import { generateGridTotalData, changeHistoryExport } from 'src/app/shared/grid-utilities';
import { ReloadEvent } from 'src/app/shared/events/reloadEvent';

@Component({
  selector: 'app-staffingsummary',
  templateUrl: './staffingsummary.component.html',
  styleUrls: ['./staffingsummary.component.scss']
})
export class StaffingsummaryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() year;
  @Input() staffingSummaryData;
  public colDefs;
  public gridOptions: GridOptions;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public busyTableSave: Subscription;
  public staffingSummary;
  public yearData;
  private pinnedBottomData: any;
  public excelStyles;

  constructor(private el: ElementRef,
              private reloadEvent: ReloadEvent) {
    this.excelStyles = [
      {
        id: 'header',
        font: { bold: true },
      },
    ];

    this.gridOptions = {
      rowHeight: 40,
      getRowStyle(params) {
        if (params.data.office === 'CTP Total') {
          return { 'font-weight': 'bold', backgroundColor: '#E6E6E6' };
        }
        return null;
      },
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
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },

      stopEditingWhenGridLosesFocus: true
    } as GridOptions;
    this.reloadEvent.listen().subscribe(response => {
      if (response) {
        this.loadData();
      }
    });
  }
  onGridReady(params) {
    this.gridOptions.onBodyScroll = () => {
      printSortStateToConsole(this.el);
    };
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.getColDefs();
    this.loadData();
  }
  ngOnInit() {
  }
  getContextMenuItems(params) {
    const keyValue = Object.keys(params.node.data);
    const cellHistoryFieldsArr = keyValue;
    const result = changeHistoryExport(params, cellHistoryFieldsArr);
    return result;
  }
  loadData() {
    setTimeout(() => {
      this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
      this.gridApi.setPinnedBottomRowData([this.pinnedBottomData]);
    }, 100);
    }
  generatePinnedBottomData(gridOptions: GridOptions) {
    const sumColumns = ['office', 'hiresInQueue', 'departuresInQueue', 'hires',
      'departures', 'actualPositionsOnboard', 'remainingPlannedVacancies', 'plannedPositions', 'spendPlanTarget'];
    this.pinnedBottomData = generateGridTotalData(gridOptions, sumColumns, 'dashboardStaffingSummary');
    this.pinnedBottomData['office'] = 'CTP Total';
    return this.pinnedBottomData;
  }
  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  getColDefs() {
    this.colDefs =
      [{
        headerName: 'Office',
        field: 'office',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: this.year + ' ' + 'Hires in Queue',
        field: 'hiresInQueue',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: this.year + ' ' + 'Departures in Queue',
        field: 'departuresInQueue',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: this.year + ' ' + 'Hires',
        field: 'hires',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: this.year + ' ' + 'Departures',
        field: 'departures',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Current Positions Onboard',
        field: 'actualPositionsOnboard',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Remaining Planned Vacancies',
        field: 'remainingPlannedVacancies',
        editable: false,
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      // FY21 Departures Adjustments
      {
        headerName: this.year + ' ' + 'Planned Positions',
        field: 'plannedPositions',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      // FY21 Departure
      {
        headerName: this.year + ' ' + 'Spend Plan Target',
        field: 'spendPlanTarget',
        comparator: numberSort,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      }];
  }
}
