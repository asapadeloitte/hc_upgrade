import { Component, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToasterService } from 'angular2-toaster';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { columnVisibleAccessbility, printSortStateToConsole, accessibilityFix, numberSort } from 'src/app/shared/utilities';
import { GridOptions } from 'ag-grid-community';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectedvacanciesComponent } from '../selectedvacancies/selectedvacancies.component';
import { sortAlphaNum } from 'src/app/shared/grid-utilities';


@Component({
  selector: 'app-vcaddtoselection',
  templateUrl: './vcaddtoselection.component.html',
  styleUrls: ['./vcaddtoselection.component.scss']
})
export class VcaddtoselectionComponent extends BasePageComponent implements OnInit, OnDestroy {
  public statusBar;
  public showSearch = false;
  public colDefs = [];
  public multiSortKey;
  @Input() pendingSelectionVacancies;
  @Input() year;
  private screenObject = {
    screenName: 'Ready for Selections'
  };
  public searchForm: FormGroup;
  constructor(
    authService: AuthService,
    private fb: FormBuilder,
    toaster: ToasterService,
    protected humanCapitalService: HumanCapitalService,
    modalService: BsModalService,
    el: ElementRef, public vsModalRef: BsModalRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
  }

  ngOnInit() {
    this.loadSearchForm();
    this.loadGridOptions();
    this.showSearch = false;
    this.getCustomFilterNames(this.screenObject);
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
  }

  public loadGridOptions() {
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
      this.gridOptions = {
        context: {
          componentParent: this,
        },
        defaultColDef: {
          singleClickEdit: true,
          resizable: true,
          // flex: 1,
          // minWidth: 200,
          filterParams: { newRowsAction: 'keep' },
          sortable: true,
          unSortIcon: true,
          filter: true,
          editable: false
        },
        onColumnVisible: (params) => {
          columnVisibleAccessbility(params, this.el);
        },
        stopEditingWhenGridLosesFocus: true
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
      screenName: 'Ready for Selections'
    };
    this.openFilterDialogViewMultisort(this.searchForm, screenObject);
  }
  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public openExportModal() {
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
  submitSelectedRows() {
    this.vsModalRef.hide();
    const selctedRowsData = this.gridApi.getSelectedRows();
    const initialState = {
      selctedRowsData,
      year: this.year,
      class: 'modal-xl',
    };
    this.bsModalRef = this.modalService.show(SelectedvacanciesComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Submit';
  }
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Announcement ID',
        field: 'announcementDisplayId',
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
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
        comparator: sortAlphaNum,
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

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',
        comparator: sortAlphaNum,

        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
    ];
  }
  close() {
    this.vsModalRef.hide();
  }
}
