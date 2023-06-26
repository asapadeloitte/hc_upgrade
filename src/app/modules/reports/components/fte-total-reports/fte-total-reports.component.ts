import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { ColDef, GridOptions } from 'ag-grid-community';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToasterService } from 'angular2-toaster';
import { printSortStateToConsole, columnVisibleAccessbility, dateComparator, accessibilityFix } from '../../../../shared/utilities';
import {
  DropdownText, CellRendererComponent, AppDropdownSmartList, StartDtValCellRenderrComponent
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  CopyOverHrepsService
} from 'src/app/modules/hiring-plan/components/copy-over-hreps-data-to-hiring-plan/copy-over-hreps-data-to-hiring-plan.service';
import { DetailTemPromotionLogService } from '../detail-temporary-promotion-log/detail-tem-promotion-log.service';
import { SaveConfirmationDialogComponent } from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
import { changeYearDropDownVales } from 'src/app/shared/grid-utilities';
import * as saveAs from 'file-saver';


@Component({
  selector: 'app-fte-total-reports',
  templateUrl: './fte-total-reports.component.html',
  styleUrls: ['./fte-total-reports.component.scss']
})
export class FteTotalReportsComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public fteTotalReportsForm: FormGroup;

  public fteTopForm: FormGroup;
  public autoGroupColumnDef;
  // public pushVacancyForm: FormGroup;
  public busyTableSave: Subscription;
  public periodList = [];
  public yearsList = [];
  public previousDate;
  public currentDate;
  public showDownloadButton = true;
  public payPeriod: any;
  public payPeriodListBasedonYear = [];
  public selectedPayPeriod;
  public showSearch = false;
  public staffingPlanList = [];
  public frameworkComponents;
  public defaultColDef: ColDef;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public id;
  public editedData: any = [];
  public fteTotalFormData: any = [];
  public originalData: string;
  public jobTitleMapping: any;
  public payPeriodName;
  public groupDefaultExpanded = 1;
  public errorDetails: any = [];
  private screenObject = {
    screenName: 'FTE Reports'
  };
  private saveConfirmationModalRef: BsModalRef;

  public currentCount;
  public previousCount;
  public employees: any;
  public smartList: any;
  public officeList: any;
  public civilianCCValue = ['Civilian', 'CC'];
  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private _adminService: AdminService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public allStaffService: AllStaffService,
    private detailTemPromotionLogService: DetailTemPromotionLogService,
    public copyOverHrepsService: CopyOverHrepsService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);

  }

  ngOnInit() {
    this.roleList = this.authService.jwt_getRole();
    this.loadSearchForm();
    this.loadGridOptions();
    this.fteTotalReportsForm = this.fb.group({});
    this.busyTableSave = this.humanCapitalService.getSmartList().subscribe(smValues => {
      if (smValues) {
        this.smartList = smValues;
        this.smartListService.setDDVals(this.smartList);
        this.humanCapitalService.getDropdownValues().subscribe(args => {
          if (args) {
            this.periodList = args.payPeriods;
            this.yearsList = args.years;
            // 17.1 year dropdown value changes CBAS-6807
            this.yearsList = changeYearDropDownVales(this.yearsList);
            this.officeList = args.officeOrgLevelMapping;
            this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeList, '');
            const temp = this.detailTemPromotionLogService.getAdditionalSmartLists();
            const tempOrgLevels = this.detailTemPromotionLogService.getOrgLevelSmartLists();
            this.smartList.push(temp);
            this.smartList.push(tempOrgLevels);
            this.smartListService.setDDVals(this.smartList);
          }
        });
      }
    });
  }

  public loadSearchForm() {
    this.fteTopForm = this.fb.group({
      payPeriod: [null, [Validators.required]],
      year: [null, Validators.required],
      search: [null],
      filter: [null],
    });

    this.getCustomFilterNames(this.screenObject);
  }

  generateReport() {

    // show popup warning message on genearte report button
    const initialState = {
      message:
        `Warning: Generating the FTE Totals Report will clear any edits made to
        the existing version and rebuild the report based solely on the Staffing Plan Logs.`,
      buttonTitle: 'OK'
    };
    this.saveConfirmationModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.saveConfirmationModalRef.content.event.subscribe((response: boolean) => {
      if (response === true) {
        this.showDownloadButton = false;
        const payload = {
          year: this.year,
          payPeriod: this.payPeriod,
        };
        this.busyTableSave = this.humanCapitalService.generateFTEReports(payload).subscribe(args => {
          if ((args != null)) {
            this.getfteTotalFormData();
           }
        });
      } else {
      }
    });


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
      ddSmartList: AppDropdownSmartList,
      dropdownText: DropdownText,
      deleteUserRenderer: DeleteUserCellRendererComponent
    };

    this.gridOptions = {
      context: {
        componentParent: this,
      },
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          this.fteTotalReportsForm.markAsDirty();
          const id = params.data.id;

          const baseAttributes = { id };
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
            this.fteTotalReportsForm.markAsDirty();
          } else {
            this.fteTotalReportsForm.markAsPristine();
          }

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

      stopEditingWhenGridLosesFocus: true
    } as GridOptions;

  }

  public onYearChangeEvent(event: any) {
    this.payPeriodListBasedonYear = [];
    this.year = this.fteTopForm.controls.year.value;
    this.periodList.forEach(element => {
      if (element.year === this.year) {
        this.payPeriodListBasedonYear.push({
          id: element.payPeriod,
          list: element.beginningDate + '-' + element.endDate
        }
        );
      }
    });
  }

  public onpayPeriodChangeEvent(event: any) {
    if (event !== undefined) {
      this.payPeriod = event.id;
      this.selectedPayPeriod = event.list;
    } else {
      this.showDownloadButton = true;
    }
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.fteTopForm.controls.search.value);
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

  public resetFilterView() {
    this.resetFilterViewData(this.fteTopForm);
  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'FTE Reports',
    };
    this.openFilterDialogView(this.fteTopForm, screenObject);
  }

  public saveFTEReport() {
    if (this.editedData.length > 0) {
      const smartListGlobal = this.smartListService.getDDVals();
      this.editedData.forEach(obj => {
        Object.keys(obj).forEach(key => {
          const smartListObject = smartListGlobal.find(element => element.smartListName === key);
          if (smartListObject && smartListObject.smartListValues.length > 0) {
            smartListObject.smartListValues.forEach(element => {
              if (obj[key] === element.value) {
                obj[key] = element.id;
              }
            });
          }
        });
      });
      this.busyTableSave = this.humanCapitalService.saveFTEReport(this.editedData).subscribe(data => {
        this.toaster.pop('success', 'Saved', 'FTE Report saved successfully');
        this.getfteTotalFormData();
        this.editedData = [];
        this.fteTotalReportsForm.markAsPristine();
      }, error => {
        this.toaster.pop('error', 'Failed', this.errorDetails);
      });
    }
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

  public openSubmitDialog() {
    // TO-DO
  }
  onGoClickFTEReports() {
    if (this.payPeriod !== null || this.payPeriod !== '') {
      this.showDownloadButton = false;
    } else {
      this.showDownloadButton = true;
    }

    if (this.editedData.length > 0) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe((response) => {
        this.getfteTotalFormData();
        this.fteTotalReportsForm.markAsPristine();
      });
      this.bsModalRef.content.onCancel.subscribe((response) => {
        const tempSearchDDVal = this.copyOverHrepsService.getSearchDDVals();
        this.fteTopForm.controls.office.setValue(tempSearchDDVal.office);
        this.fteTopForm.controls.payPeriod.setValue(tempSearchDDVal.payPeriod);
      });
    } else {
      this.getfteTotalFormData();
    }
  }
  getfteTotalFormData() {
    this.showSearch = true;
    this.colDefs = [];
    this.fteTotalFormData = [];
    this.editedData = [];
    this.rowsSelected = false;
    this.fteTopForm.controls.filter.setValue(null);
    this.copyOverHrepsService.setSearchDDVals(this.fteTopForm.value);

    this.busyTableSave = this.humanCapitalService.getFTEReports(this.year, this.payPeriod).subscribe(args => {
      if ((args != null)) {
        this.getColDefs();
        let a = [];
        const smartListValues = this.smartListService.getDDVals();
        this.currentDate = args.currentPpDate;
        this.currentCount = args.currentPpFteCount;

        this.previousDate = args.previousPpDate;
        this.previousCount = args.previousPpFteCount;
        a = args.details;
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
        this.originalData = JSON.stringify(a);
        this.fteTotalFormData = a;
      }
    });

  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  reloadFTEReport(reload: boolean) {
    if (reload) {
      this.getfteTotalFormData();
    }
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

  public downloadPdf() {

    this.busyTableSave = this.humanCapitalService.getfteTotalReportTotalPDF(this.year, this.payPeriod).subscribe(args => {
      saveAs(new Blob([args], { type: 'application/pdf;charset=utf-8' }),
        'FTE Total Report');
      this.toaster.pop('success', 'Saved', 'File Downloaded Successfully');

    });

  }
  getColDefs() {

    this.colDefs = [
      {
        field: 'action',
        rowGroup: true,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Office',
        field: 'office',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Admin Code',
        field: 'adminCode',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Notes',
        field: 'notes',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'BU/NBU',
        field: 'bargainingUnit',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },

      {
        headerName: 'Civilian/CC',
        field: 'civilianOrCc',
        editable: true,
        cellEditor: 'ddSmartList',
        cellEditorParams: {
          cellHeight: 50,
          values: this.civilianCCValue,
        },
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Action',
        field: 'deleteFTE',
        cellRenderer: 'deleteUserRenderer',
        maxWidth: 150,
        cellRendererParams: {
          screenName: 'FTE Reports',
          onClick: this.deleteFteReport.bind(this),
        }
      }
    ];
    this.defaultColDef = {
      singleClickEdit: true,
      filter: true,
      sortable: true,
      resizable: true,
    };
    this.autoGroupColumnDef = {
      headerName: 'Name',
      field: 'name',
      editable: true,
     // minWidth: 250,
      cellRenderer: 'agGroupCellRenderer',
    };
  }

  deleteFteReport(params: number) {
    if (this.editedData) {
      this.onGoClickFTEReports();
    }
    this.id = params;
  }

  reloadFTEEntry(reload: boolean) {
    if (reload) {
      this.getfteTotalFormData();
    }
  }

  fteEntryDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'FTE Report Entry Deleted Successfully');
    }
  }

}
