import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  AppDropdownSmartList,
  CellRendererComponent,
  DropdownText,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import {
  SubmitPushVacaniestoHiringPlanDialogComponent,
} from 'src/app/shared/submit-push-vacaniesto-hiring-plan-dialog/submit-push-vacaniesto-hiring-plan-dialog.component';

import { accessibilityFix, columnVisibleAccessbility, printSortStateToConsole, onJobTitleChange } from '../../../../shared/utilities';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { PushVacancyService } from './push-vacancy.service';
import { sortAlphaNum, changeYearDropDownVales } from 'src/app/shared/grid-utilities';

@Component({
  selector: 'app-push-vacancies',
  templateUrl: './push-vacancies.component.html',
  styleUrls: ['./push-vacancies.component.scss']
})
export class PushVacanciesComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  public pushVacancyForm: FormGroup;
  public changeForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
  public officeName: any;
  public year: any;
  public showSearch = false;
  public pushVacancylist = [];
  public frameworkComponents;
  private defaultColDef: ColDef;
  public colDefs = [];
  public errorDetails: any = [];
  public gridOptions: GridOptions;
  public statusBar;
  public originalData: string;
  public editedData: any = [];
  private screenObject = {
    screenName: 'Push Vacancies'
  };
  public jobTitleMapping: any;
  public selectedList;

  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    private pushvacancyService: PushVacancyService,
    toaster: ToasterService,
    modalService: BsModalService,
    public _adminService: AdminService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.changeForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });
    this.pushvacancyService.listen().subscribe((m: any) => {
      this.editedData = [];
      this.onGoClickPushVacancies();
    });
  }

  ngOnInit() {
    this.getCustomFilterNames(this.screenObject);
    // get the year and office list from API
    this.loadBusyTable();
  }
  // public loadSearchForm() {
  // }
  public loadBusyTable() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      // change the year dropdown based on requirement FY23 ,FY22
      this.yearsList = changeYearDropDownVales(this.yearsList);
      this.officeList = args.officeOrgLevelMapping;
      this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      this.humanCapitalService.getSmartList().subscribe(args => {
        this.smartListService.setDDVals(args);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListService.setTitleMapping(this.jobTitleMapping);
          }
        });
      });
      //  this.loadSearchForm();
      this.loadGridOptions();
      this.showSearch = false;
      this.pushVacancyForm = this.fb.group({});
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
      ddSmartList: AppDropdownSmartList,
      cellRendererComponent: CellRendererComponent,
      dropdownText: DropdownText,
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

      // redarw rows

      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          this.pushVacancyForm.markAsDirty();
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const employee = params.data.vacancyId;
          const baseAttributes = { office, orgLevel, employee };
          if (params.colDef.field === 'jobTitle' || params.colDef.field === 'grade' || params.colDef.field === 'jobCode'
            || params.colDef.field === 'series' || params.colDef.field === 'payPlan' || params.colDef.field === 'fpl') {
            onJobTitleChange(params);
          }
          const originalRow = JSON.parse(this.originalData).find(f => f.vacancyId === params.data.vacancyId);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);

          // Collect all the changed rows within the grid
          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.employee === params.data.vacancyId);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }

          if (this.editedData.length > 0) {
            this.pushVacancyForm.markAsDirty();
          } else {
            this.pushVacancyForm.markAsPristine();
          }

          // Bring back focus and redraw the updated row with new data
          const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApi.redrawRows({ rowNodes: [row] });
          this.bringFocusBack();
        }
        accessibilityFix(this.el);
      },
      //
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

  public onOfficeChangeEvent(event: any) {
    this.officeName = this.changeForm.controls.office.value;
  }

  public onYearChangeEvent(event: any) {
    this.year = this.changeForm.controls.year.value;
  }
  // get the Un associates vacanies information from API
  public onGoClickPushVacancies() {
    localStorage.removeItem('selectedRows1');
    // For warning message with out save to another page(like..)
    if (this.editedData.length > 0) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe((response) => {
        this.getVacancyData();
        this.pushVacancyForm.markAsPristine();
      });
      this.bsModalRef.content.onCancel.subscribe((response) => {
        const tempSearchDDVal = this.pushvacancyService.getSearchDDVals();
        this.changeForm.controls.office.setValue(tempSearchDDVal.office);
        this.changeForm.controls.year.setValue(tempSearchDDVal.year);
      });
    } else {
      this.getVacancyData();
    }
  }
  // GET Unasscoaited Vacanies from API(get call)
  getVacancyData() {
    this.showSearch = true;
    this.colDefs = [];
    this.pushVacancylist = [];
    this.editedData = [];
    this.rowsSelected = false;
    this.changeForm.controls.filter.setValue(null);
    this.getColDefs();
    this.pushvacancyService.setSearchDDVals(this.changeForm.value);
    this.showSearch = true;
    this.busyTableSave = this.humanCapitalService.getPushVacancies(this.officeName, this.year).subscribe(args => {
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
        this.originalData = JSON.stringify(a);
        this.pushVacancylist = a;
      }
    });
  }
  // for checkboxes should be selected after save
  onRowDataChanged() {
    this.selectedList = JSON.parse(localStorage.getItem('selectedRows1'));
    if (this.selectedList) {
      const selectIds = this.selectedList.map(row => { return row.vacancyId });
      this.gridOptions.api.forEachNode(node => {
        if (selectIds.includes(node.data.vacancyId)) {
          node.setSelected(true);
        }
      })
    }
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.changeForm.controls.search.value);
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
    this.resetFilterViewData(this.changeForm);
  }

  public openFilterDialog() {
    const filterValue = this.changeForm.get('filter').value;
    const filterGridValue = this.changeForm.controls.filter.value;
    const screenObject = {
      screenName: 'Push Vacancies',
    };
    this.openFilterDialogView(this.changeForm, screenObject);
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
  // return count for differnt vacancies selected
  public sameorDifferntVacancies(): any {
    let differntVacanies = false;
    let count = 0;
    const firstRow = this.selectedRows[0];
    this.selectedRows.forEach(element => {
      if (element.payPlan === firstRow.payPlan && element.hiringMechanism === firstRow.hiringMechanism) {
        differntVacanies = false;
      } else {
        count++;
        differntVacanies = true;
      }
    });
    return count;
  }
  // Validating selected rows in grid before push vacanies to Hiring plan
  public ValidateSelectedRows() {
    let rowValidation = false;
    this.selectedRows.forEach(element => {
      const jobTitle = element.jobTitle;
      const payPlan = element.payPlan;
      const series = element.series;
      const grade = element.grade;
      const hiringMechanism = element.hiringMechanism;
      if ((jobTitle === null || jobTitle === undefined || jobTitle === '') ||
        (payPlan === null || payPlan === undefined || payPlan === '') ||
        (series === null || series === undefined || series === '') ||
        (grade === null || grade === undefined || grade === '') ||
        (hiringMechanism === null || hiringMechanism === undefined || hiringMechanism === '')) {
        rowValidation = true;
      }
    });
    return rowValidation;
  }
  public openSubmitDialog() {
    const count = this.sameorDifferntVacancies();
    const validateselectedRow = this.ValidateSelectedRows();
    // edited data should save before submit
    // else if null Validate selected rows
    // else if differnt vacanies selected
    if (this.editedData.length > 0) {
      const initialState = {
        unSavedData: true
      };
      this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
    } else if (validateselectedRow === true) {
      const initialState = {
        validateselectedRow
      };
      this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
    } else if (count > 0) {
      const initialState = {
        differntVacanciesData: true
      };
      this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
    } else {
      const initialState = {
        office: this.officeName,
        year: this.year,
        selectedRows: this.selectedRows,
        parentModalRef: this.bsModalRef
      };
      this.bsModalRef = this.modalService.show(SubmitPushVacaniestoHiringPlanDialogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
    }
  }
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        field: 'office',
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Vacancy',
        field: 'fullName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Vacancy Status',
        field: 'vacancyStatus',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Series',
        field: 'series',
        cellClass: 'textFormat',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Pay Plan',
        field: 'payPlan',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Grade',
        cellClass: 'textFormat',
        field: 'grade',
        editable: true,
        sortable: sortAlphaNum,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
    ];
  }

  public savePushVacancyChanges() {
    if (this.editedData.length === 0) {
      this.toaster.pop('error', 'Not Saved', 'No updates are present');
    } else if (this.editedData.length > 0) {
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
      // save the pushVacanices to hiringplan
      const tempSearchDDVal = this.pushvacancyService.getSearchDDVals();
      this.changeForm.controls.office.setValue(tempSearchDDVal.office);
      this.changeForm.controls.year.setValue(tempSearchDDVal.year);
      this.year = this.changeForm.controls.year.value;
      this.officeName = this.changeForm.controls.office.value;
      this.busyTableSave = this.humanCapitalService.saveAllStaff(this.changeForm.controls.year.value, this.editedData).subscribe(data => {
        this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
        localStorage.setItem('selectedRows1', JSON.stringify(this.selectedRows));
        const tempSearchDDVal = this.pushvacancyService.getSearchDDVals();
        this.changeForm.controls.office.setValue(tempSearchDDVal.office);
        this.changeForm.controls.year.setValue(tempSearchDDVal.year);
        this.getVacancyData();
        this.editedData = [];
        this.pushVacancyForm.markAsPristine();
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
    localStorage.removeItem('selectedRows1');
  }

}
