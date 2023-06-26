import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { saveAs } from 'file-saver';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { SelectionsService } from 'src/app/modules/hiring-plan/components/selections/selections.service';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { PdfConfirmationDialogComponent } from 'src/app/shared/components/pdf-confirmation-dialog/pdf-confirmation-dialog.component';
import { generateGridTotalData } from 'src/app/shared/grid-utilities';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { columnVisibleAccessbility, printSortStateToConsole } from 'src/app/shared/utilities';



@Component({
  selector: 'app-summary-capacity-report',
  templateUrl: './summary-capacity-report.component.html',
  styleUrls: ['./summary-capacity-report.component.scss']
})
export class SummaryCapacityReportComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  public capacityLogForm: FormGroup;
  public changeForm: FormGroup;
  public busyTableSave: Subscription;
  public showSearch = false;
  public capacityLogList = [];
  public frameworkComponents;
  public yearsList = [];
  public officeList = [];
  public colDefs = [];
  public gridOptions: GridOptions;
  public jobTitleMapping: any;
  public smartList: any;
  public employees: any;
  public statusBar;
  public id;
  public date;
  public autoGroupColumnDef;
  public officeName: any;
  public originalData: string;
  public errorDetails: any = [];
  public officeCount: any = {};
  public ocdOfficeLength: number;
  public oceOfficelength: number;
  public ohceOfficelength: number;
  public omOfficelength: number;
  public orOfficelength: number;
  public osOfficelength: number;
  private screenObject = {
    screenName: 'Capacity Report'
  };
  public disabledGrid = true;
  suppressRowTransform;
  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private selectionsService: SelectionsService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public allStaffService: AllStaffService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
   }

  ngOnInit() {
    this.suppressRowTransform = true;
    this.loadDropDown();
    this.loadGridOptions();

    this.loadSearchForm();

    this.busyTableSave = this.humanCapitalService.getSmartList().subscribe(args => {
      const temp = this.selectionsService.getAdditionalSmartLists();
      this.smartList = args;
      temp.forEach(element => {
        this.smartList.push(element);
      });
      this.smartListService.setDDVals(args);
    });
    this.capacityLogForm = this.fb.group({});

    this.getCapacityReportData();
  }
  public downloadPdf() {
    this.bsModalRef = this.modalService.show(PdfConfirmationDialogComponent);
    this.bsModalRef.content.officeEvent.subscribe((selectedOffice: string) => {
      if (selectedOffice) {
        this.busyTableSave = this.humanCapitalService.getcapacityReportDetail(selectedOffice).subscribe(args => {
          saveAs(new Blob([args], { type: 'application/pdf;charset=utf-8' }),
            'Detailed Capacity Report');
          this.toaster.pop('success', 'Saved', 'File Downloaded Successfully');
        });
        this.bsModalRef.hide();
      }
    });
  }
  public loadSearchForm() {
    this.changeForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });

    this.getCustomFilterNames(this.screenObject);
  }

  public loadDropDown() {
    setTimeout(() => {
      this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
        const currentPeriod = args.currentPayPeriod;
        this.date = currentPeriod.beginningDate;
      });
    }, 500);
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
    };
    this.gridOptions = {
      context: {
        componentParent: this,
      },
      getRowStyle(params) {
        if (params.data && params.data.orgLevel === 'Office Total') {
          return { 'font-weight': 'bold' };
        }
        return null;
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
      stopEditingWhenGridLosesFocus: true,
      suppressRowTransform: true,
    } as GridOptions;

  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'Capacity Report',
    };
    this.openFilterDialogView(this.changeForm, screenObject);
  }
  public getCapacityReportData() {
    this.colDefs = [];
    this.capacityLogList = [];
    this.showSearch = true;
    this.changeForm.controls.filter.setValue(null);
    this.selectionsService.setSearchDDVals(this.changeForm.value);
    this.busyTableSave = this.humanCapitalService.getcapacityReport().subscribe(args => {
      if ((args != null) && (args.length > 0)) {
        this.getColDefs();
        let a = [];
        a = args;
        setTimeout(() => {
          this.pinnedBottomData = this.generatePinnedBottomData(this.gridOptions);
          this.gridApi.setPinnedBottomRowData([this.pinnedBottomData]);
        }, 1500);

        for (const element of a) {
          element.newOffice = element.office;
          this.officeCount[element.office] = this.officeCount[element.office] ? this.officeCount[element.office] + 1 : 1;
        }
        this.originalData = JSON.stringify(a);
        this.capacityLogList = this.dataFilter(a);
        // this.capacityLogList = a;
      }
    });
  }

  generatePinnedBottomData(gridOptions: GridOptions) {
    const sumColumns = ['totalPositions', 'currentlyOnboard',
      'totalVacancies', 'projectedVacancies', 'totalWithProjectedVacancies', 'capacityPercentage'];
    this.pinnedBottomData = generateGridTotalData(gridOptions, sumColumns, 'capacity');
    this.pinnedBottomData['office'] = 'CTP Total';
    return this.pinnedBottomData;
  }

  dataFilter(originalData) {

    const temp = ['OCD', 'OCE', 'OHCE', 'OM', 'OR', 'OS'];

    const tempCapacityData = [];
    temp.forEach(el => {
      let tempArray = [];
      tempArray = originalData.filter(element => el === element.office);
      tempArray.forEach((e, index) => {
        // to find out length of each office based on orglevels
        if (e.office === 'OCD') {
          this.ocdOfficeLength = tempArray.length;
        } else if (e.office === 'OCE') {
          this.oceOfficelength = tempArray.length;
         } else if (e.office === 'OHCE') {
          this.ohceOfficelength = tempArray.length;
         } else if (e.office === 'OM') {
          this.omOfficelength = tempArray.length;
          } else if (e.office === 'OR') {
          this.orOfficelength = tempArray.length;
         } else if (e.office === 'OS') {
          this.osOfficelength = tempArray.length;
          }
        if (index !== 0) {
        e.office = '';
        }
        tempCapacityData.push(e);
      });
    });
    this.disabledGrid = false;
    return tempCapacityData;
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.changeForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }

  public resetFilterView() {
    this.resetFilterViewData(this.changeForm);
  }

  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public openExportModal() {
    this.ExportGridData();
  }

  public onSortChange() {
    printSortStateToConsole(this.el);
  }
  formatPercent(params: any) {
    const data = params.value;
    return data + '%';
  }
  officeRowSpan(params) {
    let eachofficelength;
    if (params.data.office === 'OCD') {
      eachofficelength = this.ocdOfficeLength - 1;
      return eachofficelength;
    } else if (params.data.office === 'OCE') {
      eachofficelength = this.oceOfficelength - 1;
      return eachofficelength;
    } else if (params.data.office === 'OHCE') {
      eachofficelength = this.ohceOfficelength - 1;
      return eachofficelength;
     } else if (params.data.office === 'OR') {
      eachofficelength = this.orOfficelength - 1;
      return eachofficelength;
     } else if (params.data.office === 'OS') {
      eachofficelength = this.osOfficelength - 1;
      return eachofficelength;
     } else if (params.data.office === 'OM') {
      eachofficelength = this.omOfficelength - 1;
      return eachofficelength;
    }
      }

  public getColDefs() {
    this.colDefs = [
      {
        field: 'office',
        wrapText: true,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        rowSpan: this.officeRowSpan.bind(this),
       },
      {
        headerName: 'New Office',
        field: 'newOffice',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        hide: true
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevel',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
      },
      {
        headerName: 'Total Positions',
        field: 'totalPositions',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Currently Onboard',
        field: 'currentlyOnboard',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Total Vacancies',
        field: 'totalVacancies',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Projected Vacancies',
        field: 'projectedVacancies',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Total with Projected Vacancies',
        field: 'totalWithProjectedVacancies',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Capacity % ',
        field: 'capacityPercentage',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        valueFormatter: this.formatPercent,
      },
    ];

  //   this.autoGroupColumnDef = {
  //     headerName: 'CTP Office',
  //     cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
  //     cellRenderer: 'agGroupCellRenderer',
  //     cellRendererParams: {
  //       suppressCount: true
  //     },
  //  };
  }
}

