import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { SelectionsService } from 'src/app/modules/hiring-plan/components/selections/selections.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  StartDtValCellRenderrComponent,
  AppDropdownSmartList,
  CellRendererComponent,
  DropdownText,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';

import { columnVisibleAccessbility, printSortStateToConsole } from '../../../../shared/utilities';


@Component({
  selector: 'app-associate-vacaniceswith-ehcmdata',
  templateUrl: './associate-vacaniceswith-ehcmdata.component.html',
  styleUrls: ['./associate-vacaniceswith-ehcmdata.component.scss']
})
export class AssociateVacaniceswithEHCMDataComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  unmappedEHCMForm: FormGroup;
  public frameworkComponents;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public formEdited = false;
  public topGridList = [];
  public originalData;
  public busyTableSave: Subscription;
  public reqNoList = [];
  public fileUploadBSModalRef: BsModalRef;

  public officeList = [];
  public yearsList = [];
  public unmappedVacanciesList = [];

  public changeForm: FormGroup;

  public officeName: any;
  public year: any;
  private screenObject = {
    screenName: 'Associate-EHCMDATA'
  };

  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    private selectionsService: SelectionsService,
    toaster: ToasterService,
    modalService: BsModalService,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,

  ) {
    super(authService, toaster, humanCapitalService, modalService, el);

  }
  ngOnInit() {
    this.getCustomFilterNames(this.screenObject);

    this.busyTableSave = this.humanCapitalService.getSmartList().subscribe(args => {
      this.smartListService.setDDVals(args);
    });
    this.loadSearchForm();
    this.loadGridOptions();
    this.loadBusyTable();


  }
  public loadSearchForm() {
    this.unmappedEHCMForm = this.fb.group({});
    this.changeForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });

    this.getCustomFilterNames(this.screenObject);
  }
  public loadBusyTable() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.officeList = args.officeOrgLevelMapping;
      if (this.roleList === 'admin' || this.roleList === 'CTPHC_SRT_Analyst_User') {
        this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
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
      dropdownText: DropdownText
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
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
      stopEditingWhenGridLosesFocus: true
    } as GridOptions;

  }
  onFilterTextBoxChanged() {
    this.onGridSearch(this.changeForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  onSortChange() {
    printSortStateToConsole(this.el);
  }
  autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }
  resetFilterView() {
    this.resetFilterViewData(this.changeForm);
  }
  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }

  openFilterDialog() {
    const screenObject = {
      screenName: 'Associate-EHCMDATA',
    };
    this.openFilterDialogView(this.changeForm, screenObject);
  }
  onexportOptionsChangeEvent(e) {
    this.exportOption = e.target.value;
  }
  openExportModal() {
    this.ExportGridData();
  }

  onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }
  onCancelClicked(event) {
    if (event) {
      const tempSearchDDVal = this.selectionsService.getSearchDDVals();
      this.changeForm.controls.office.setValue(tempSearchDDVal.office);
      this.changeForm.controls.year.setValue(tempSearchDDVal.year);
    }
  }

  onGoClick() {
    if (this.formEdited) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe(() => {
        this.getData();
        this.unmappedEHCMForm.markAsPristine();
        this.formEdited = false;
      });
      this.bsModalRef.content.onCancel.subscribe(() => {
        const tempSearchDDVal = this.selectionsService.getSearchDDVals();
        this.changeForm.controls.office.setValue(tempSearchDDVal.office);
        this.changeForm.controls.year.setValue(tempSearchDDVal.year);
      });
    } else {
      this.getData();
    }
  }
  getData() {
    this.reqNoList = [];
    this.colDefs = [];
    this.topGridList = [];
    this.unmappedVacanciesList = [];
    this.showSearch = true;
    this.changeForm.controls.filter.setValue(null);
    this.selectionsService.setSearchDDVals(this.changeForm.value);
    this.busyTableSave = this.humanCapitalService.getunMappedEHCMData(
      this.changeForm.controls.office.value,
      this.changeForm.controls.year.value).subscribe(args => {
        if ((args != null) && (args.length > 0)) {
          this.getColDefs();
          let a = [];
          const smartListValues = this.smartListService.getDDVals();
          a = args;
          a.forEach(el => {
            this.reqNoList.push(el.ehcmId);
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
          this.topGridList = a;
          this.originalData = JSON.stringify(this.topGridList);
        }
      });

    setTimeout(() => {
      this.busyTableSave = this.humanCapitalService.getunMappedVacanies(
        this.changeForm.controls.office.value,
        this.changeForm.controls.year.value).subscribe(args => {
          if ((args != null) && (args.length > 0)) {
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
            this.unmappedVacanciesList = a;
            this.originalData = JSON.stringify(this.unmappedVacanciesList);
          }
        });
    }, 500);
  }

  getColDefs() {
    this.colDefs = [
      {
        headerName: 'EHCM_ID',
        field: 'ehcmId',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Dept ID',
        field: 'ehcmDeptId',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Name',
        field: 'ehcmName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Job Title',
        field: 'ehcmJobTitle',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Pay Plan',
        field: 'ehcmPayPlan',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Series',
        field: 'ehcmSeries',
        cellClass: 'textFormat',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Grade',
        field: 'ehcmGrade',
        cellClass: 'textFormat',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Step',
        field: 'ehcmStep',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },

      {
        headerName: 'EHCM_FLSA Start',
        field: 'ehcmFlsaStat',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Bargaining Unit',
        field: 'ehcmBargainingUnit',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Job Code',
        field: 'ehcmJobCode',
        cellClass: 'textFormat',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Manager Level',
        field: 'ehcmManagerLevel',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Military Status',
        field: 'ehcmMilitaryStatus',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Location ID',
        field: 'ehcmLocationId',
        editable: false,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Location Description',
        field: 'ehcmLocationDescription',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      }
    ];
  }
  onOfficeChangeEvent(event: any) {
    this.officeName = event;
  }


  onYearChangeEvent() {
    this.year = this.changeForm.controls.year.value;
  }


  selectionChanges() {
  }
  onCellValueUpdated(event) {
    if (event) {
      this.unmappedEHCMForm.markAsDirty();
      this.formEdited = true;
    } else {
      this.unmappedEHCMForm.markAsPristine();
      this.formEdited = false;
    }
  }
  onUpload() {
    const initialState = {
      year: this.year,
      fileType: 'xlsx File Only',
      screenName: 'EHCM',
      title: 'Upload New EHCM Data',
      warningMessage:
        // tslint:disable-next-line: max-line-length
        `Warning: This will clear and refresh the entire EHCM data set for all offices,
        including EHCM records that have already been associated with an employee ID.`,
      bodyFileType: 'Drag and drop .xlsx file(s) here'
    };
    this.bsModalRef = this.modalService.show(FileUploadComponent, { initialState });
    this.bsModalRef.content.successEvent.subscribe((response) => {
      if (response === true) {
        this.getData();
        this.unmappedEHCMForm.markAsPristine();
        this.formEdited = false;
      }
    });
  }
}


