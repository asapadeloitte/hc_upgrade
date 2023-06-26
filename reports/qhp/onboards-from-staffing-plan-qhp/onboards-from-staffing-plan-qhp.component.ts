import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { QhpService } from '../quartely-hiring-plan-main/qhp.service';
import { sortAlphaNum, generateGridTotalData } from 'src/app/shared/grid-utilities';
import { numberSort, printSortStateToConsole } from 'src/app/shared/utilities';

@Component({
  selector: 'app-onboards-from-staffing-plan-qhp',
  templateUrl: './onboards-from-staffing-plan-qhp.component.html',
  styleUrls: ['./onboards-from-staffing-plan-qhp.component.scss']
})
export class OnboardsFromStaffingPlanQHPComponent extends BasePageComponent implements OnInit {
  public busyTableSave: Subscription;
  public gridOptions: GridOptions;
  @Input() office;
  public statusBar;
  public colDefs = [];
  public onBoardsRowData = [];
  private defaultColDef: ColDef;
  // constructor
  constructor(
    humanCapitalService: HumanCapitalService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    private qhpService: QhpService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.qhpService.listen().subscribe((response: any) => {
      if (response === true) {
        this.getData();
      }
    });
   }
  ngOnInit() {
    this.loadGridOptions();
    this.getData();
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
    this.gridOptions = {
      context: {
        componentParent: this,
      },
      getRowStyle(params) {
        if (params.data.jobTitle === 'Total') {
          return { 'font-weight': 'bold', backgroundColor: '#E6E6E6' };
        }
        return null;
      },
      defaultColDef: {
        singleClickEdit: true,
        flex: 1,
        minWidth: 80,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true,
        resizable: true,
      },
     } as GridOptions;
  }

  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: sortAlphaNum,
      },
      {
        headerName: 'Pay Plan',
        field: 'payPlan',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: sortAlphaNum,
      },
      {
        headerName: 'Grade Level',
        field: 'grade',
        cellClass: 'textFormat',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: sortAlphaNum,
      },
      {
        headerName: 'No of Positions',
        field: 'positionsOnboard',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        comparator: numberSort,
      }
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 80,
      resizable: true,
    };
  }
  public getData() {
    this.showSearch = true;
    this.colDefs = [];
    this.rowsSelected = false;
    this.showSearch = true;
    this.busyTableSave = this.humanCapitalService.getOnBoardsData(this.office).subscribe(args => {
      if ((args != null) && (args.length > 0)) {
        this.getColDefs();
        setTimeout(() => {
          this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
          this.gridApi.setPinnedBottomRowData([this.pinnedBottomData]);
        }, 100);
      }
      this.onBoardsRowData = args;
    });
  }
  generatePinnedBottomData(gridOptions: GridOptions) {
    const sumColumns = ['jobTitle', 'positionsOnboard'];
    this.pinnedBottomData = generateGridTotalData(gridOptions, sumColumns, 'dashboardStaffingSummary');
    this.pinnedBottomData['jobTitle'] = 'Total';
    return this.pinnedBottomData;
  }
}
