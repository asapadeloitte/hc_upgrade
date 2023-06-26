import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
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
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { accessibilityFix, columnVisibleAccessbility, numberSort, printSortStateToConsole } from 'src/app/shared/utilities';

@Component({
  selector: 'app-associate-unmappedvacancieswith-ehcmdata',
  templateUrl: './associate-unmappedvacancieswith-ehcmdata.component.html',
  styleUrls: ['./associate-unmappedvacancieswith-ehcmdata.component.scss']
})
export class AssociateUnmappedvacancieswithEhcmdataComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {

  public ehcmVacancyTopForm: FormGroup;

  @ComponentForm(true)
  public unMappedVacanciesForm;

  public staffingPlanList = [];
  public frameworkComponents;
  public headerHeight;
  public rowHeight;
  public colDefs = [];
  public unmappedVacanciesColDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public busyTableSave: Subscription;
  public data = [];
  public errorDetails: any = [];
  public originalData: string;

  @Input() unmappedVacanciesList;
  @Input() reqNoList;
  @Input() year;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancelClicked = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCellValueUpdated = new EventEmitter<boolean>();

  public editedData: any = [];

  public screenObject = {
    screenName: 'Unmapped_Vacancies'
  };

  public announcementsData = [];
  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
  }

  ngOnInit() {
    this.loadSearchForm();
    this.loadGridOptions();
    this.busyTableSave = this.humanCapitalService.getSmartList().subscribe(args => {
      this.smartListService.setDDVals(args);
    });

  }


  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'unmappedVacanciesList') {
        const chg = changes[propName];
        if (chg.currentValue.length > 0) {
          this.showSearch = true;
          this.unmappedVacanciesList = this.unmappedVacanciesList;
          this.originalData = JSON.stringify(this.unmappedVacanciesList);
          this.getUnmappedAnnouncementData();
        }
      }
    }
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
    this.frameworkComponents = {
      cellRendererComponent: CellRendererComponent,
      dropdownText: DropdownText,
      ddSmartList: AppDropdownSmartList
    };
    this.gridOptions = {
      context: {
        componentParent: this,
      },

      defaultColDef: {
        singleClickEdit: true,
        enableSorting : true,
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
      // on cell values changed to get the rows based on unique id
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          this.unMappedVacanciesForm.markAsDirty();
          const employee = params.data.employee;
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const baseAttributes = { employee, office, orgLevel };
          const originalRow = JSON.parse(this.originalData).find(f => f.employee === params.data.employee);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);

          // Collect all the changed rows within the grid
          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.employee === params.data.employee);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }

          if (this.editedData.length > 0) {
            this.unMappedVacanciesForm.markAsDirty();
            this.onCellValueUpdated.emit(true);
          } else {
            this.unMappedVacanciesForm.markAsPristine();
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
  public loadSearchForm() {
    this.unMappedVacanciesForm = this.fb.group({});
    this.showSearch = false;
    this.ehcmVacancyTopForm = this.fb.group({
      search: [null],
      filter: [null],
    });
    this.getCustomFilterNames(this.screenObject);
  }

  getUnmappedAnnouncementData() {
    this.colDefs = [];
    this.editedData = [];
    setTimeout(() => this.getColDefs(), 100);
    this.ehcmVacancyTopForm.controls.filter.setValue(null);
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.ehcmVacancyTopForm.controls.search.value);
    printSortStateToConsole(this.el);
  }

  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }

  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public resetFilterView() {
    this.resetFilterViewData(this.ehcmVacancyTopForm);
  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'Unmapped_Vacancies',
    };
    this.openFilterDialogView(this.ehcmVacancyTopForm, screenObject);
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

  getColDefs() {
    this.colDefs = [
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Vacancy',
        field: 'employeeAlias',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM ID Association',
        field: 'ehcmId',
        cellEditor: 'ddSmartList',
        cellEditorParams: {
          cellHeight: 50,
          values: this.reqNoList,
        },
        sortingOrder: ['asc', 'desc', 'null'],
        sort: 'asc',
        cellRenderer: 'dropdownText',
        editable: true,
        // comparator: numberSort,
        cellStyle: { 'text-align': 'right' }
      },
      {
        headerName: 'Admin Code',
        field: 'adminCode',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Full Name',
        field: 'fullName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Middle initial',
        field: 'middleInitial',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Job Code',
        field: 'jobCode',
        editable: false,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Pay Plan',
        field: 'payPlan',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Series',
        field: 'series',
        editable: false,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Grade',
        field: 'grade',
        cellClass: 'textFormat',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Step',
        field: 'step',
        comparator: numberSort,
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'FLSA',
        field: 'flsa',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Barganing Unit',
        field: 'bargainingUnit',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Manager Level',
        field: 'managerLevel',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Veteran',
        field: 'veteran',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Remote Employee Location(city,state)',
        field: 'remoteEmployeeLocation',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Location ID',
        field: 'locationId',
        editable: false,
        cellClass : 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      }
    ];
  }
  getDuplicateCloumnValues(columnName: string) {
    const columnValues: any[] = [];
    let duplicateValues: any[] = [];
    this.gridApi.forEachNode(node => {
      const data = node.data[columnName];
      if (!(data === null || data === undefined || data === '')) {
        columnValues.push((data).toString());
      }
    });
    return duplicateValues = this.findDuplicateValues(columnValues);
  }

  findDuplicateValues(arry: any[]) {
    const uniqueElements = new Set(arry);
    const duplicateElements = arry.filter(item => {
      if (uniqueElements.has(item)) {
        uniqueElements.delete(item);
      } else {
        return item;
      }
    });
    return [...new Set(duplicateElements)];
  }
  saveVacancies() {
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
      const newEditedData = [];
      this.editedData.forEach(element => {
        // tslint:disable-next-line: no-use-before-declare
        const obj = new SaveVacanciesData();
        obj.employee = element.employee;
        obj.office = element.office;
        obj.orgLevel = element.orgLevel;
        obj.ehcmId = element.ehcmId;
        newEditedData.push(obj);
      });
      const duplicateEhcmIds = this.getDuplicateCloumnValues('ehcmId');
      if (duplicateEhcmIds.length > 0) {
        const initialState = {
          invalidEHCM: true,
          header: 'Invalid EHCM ID Associations',
          message:
            'The following EHCM ID #s are used across multiple vacancies. Please adjust the data'
            + '<br> [' + duplicateEhcmIds + ']',
        };
        this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.submitBtnName = 'Submit';
      } else {
        this.busyTableSave = this.humanCapitalService.postVacancies(this.year, newEditedData).subscribe(data => {
          this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
          this.getUnmappedAnnouncementData();
          this.editedData = [];
          this.unMappedVacanciesForm.markAsPristine();
          this.onCellValueUpdated.emit(false);
        }, error => {
          this.toaster.pop('error', 'Failed', this.errorDetails);
        });
      }
    }
  }
}
export class SaveVacanciesData {
  employee: string;
  office: string;
  orgLevel: string;
  ehcmId: string;
}





