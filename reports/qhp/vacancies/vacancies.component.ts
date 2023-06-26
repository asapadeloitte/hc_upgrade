import { Component, ElementRef, Input, OnDestroy, OnInit, Output, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import {
  AppDropdownSmartList,
  CellRendererComponent,
  DropdownText,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { accessibilityFix, columnVisibleAccessbility, printSortStateToConsole } from 'src/app/shared/utilities';

import { AddVacancyComponent } from './add-vacancy/add-vacancy.component';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { QhpService } from '../quartely-hiring-plan-main/qhp.service';


@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
// OnChanges
export class VacanciesComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ComponentForm(true)
  public vacancyForm: FormGroup;
  @Input() office;
  @Input() yearsList;
  @Output() deleteevent = new EventEmitter();
  private defaultColDef: ColDef;
  public vacancySearchForm: FormGroup;
  public busyTableSave: Subscription;
  public showSearch = false;
  public frameworkComponents;
  public colDefs = [];
  public gridOptions: GridOptions;
  public smartList: any;
  public statusBar;
  public id;
  public officeName: any;
  public errorDetails: any = [];
  public editedData: any = [];
  public originalData: string;
  public mockData;
  public addVacancyBSModelRef: BsModalRef;
  private screenObject = {
    screenName: 'vacancies'
  };
  public quartersList = ['Q1', 'Q2', 'Q3', 'Q4'];
  public smartListGradeValue = [];
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCellValueUpdated = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancelClicked = new EventEmitter<boolean>();
  public vacanciesList = [];
  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    private smartListService: SmartListConversionService,
    private qhpService: QhpService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.qhpService.listen().subscribe((response: any) => {
      if (response === true) {
        this.onGoClick();
      }
    });
  }
  onGoClick() {
    if (this.editedData.length > 0) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe(() => {
        this.getData();
        // this.viewConfig = null;
        this.vacancyForm.markAsPristine();
        this.vacancySearchForm.controls.filter.setValue(null);
      });
      this.bsModalRef.content.onCancel.subscribe(() => {
      });
    } else {
      this.getData();
    }

  }
  ngOnInit() {
    this.loadGridOptions();
    this.loadSearchForm();
    this.loadBusyTable();
    this.onGoClick();
  }
  loadBusyTable() {
    this.busyTableSave = this.humanCapitalService.getSmartList().subscribe(args => {
      this.smartListService.setDDVals(args);
    });
  }
  public getData() {

    this.showSearch = true;
    this.colDefs = [];
    this.vacanciesList = [];
    this.editedData = [];
    this.rowsSelected = false;
  //  this.getColDefs();
    this.vacancySearchForm.controls.filter.setValue(null);
    this.showSearch = true;
   // this.vacancySearchForm.controls.search.setValue(null);
    this.busyTableSave = this.humanCapitalService.getQHPVacancies(this.office).subscribe(args => {
      // data from API
      if ((args != null) && (args.length > 0)) {
        // reload main grid here something changes
        this.getColDefs();
        const a = [];
        const smartListValues = this.smartListService.getDDVals();
        args.forEach(element => {
          element['vacancy'] = 'VACANCY';
          a.push(element);
        });
        a.forEach(el => {
          Object.keys(el).forEach(key => {
            if (smartListValues) {
              const tempVal = smartListValues.find(f => f.smartListName === key && key !== 'status');
              if (tempVal) {
                const tempVal1 = tempVal.smartListValues.find(f => f.id === el[key]);
                el[key] = tempVal1 !== undefined ? tempVal1.value : el[key];
              }
            }
          });

        });
        this.originalData = JSON.stringify(a);
        this.vacanciesList = a;
      }
    });

  }
  public loadSearchForm() {
    this.vacancyForm = this.fb.group({});
    this.vacancySearchForm = this.fb.group({
      search: [null],
      filter: [null],
    });
// this.getColDefs();
    this.getCustomFilterNames(this.screenObject);
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
      cellRendererComponent: CellRendererComponent,
      dropdownText: DropdownText,
      hyperlinkComponent: HyperlinkComponent,
      ddSmartList: AppDropdownSmartList,
      deleteUserRenderer: DeleteUserCellRendererComponent
    };
    this.gridOptions = {
      context: {
        componentParent: this,
        groupDisplayType: 'singleColumn', // singleColumn or groupRows
        isGroupOpenByDefault: params => {
          return (params.field === 'year' || params.field === 'quarter');
        },
      },
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          this.vacancyForm.markAsDirty();
          this.onCellValueUpdated.emit(true);
          const id = params.data.id;
          const baseAttributes = { id};
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
            this.vacancyForm.markAsDirty();
            this.onCellValueUpdated.emit(true);
          } else {
            this.vacancyForm.markAsPristine();
          }

          // Bring back focus and redraw the updated row with new data
          const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApi.redrawRows({ rowNodes: [row] });
          this.bringFocusBack();
        }
        accessibilityFix(this.el);
      },
      defaultColDef: {
        singleClickEdit: true,
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
      autoGroupColumnDef: {
        headerName: 'FY/Quarter',
        cellClass: this.getIndentClass,
        // enableGroupEdit: true,
       // minWidth: 150,
        editable: false,
        pinned: 'left',
        cellRenderer: 'agGroupCellRenderer',
        groupIncludeFooter: false,
        cellRendererParams: {
          suppressCount: true, // turn off the row count (to skip default stack counting)
          footerValueGetter: params => {
            const isRootLevel = params.node.level === -1;
            if (isRootLevel) {
              return `<span style="color:navy; font-weight:bold">Grand Total</span>`;
            }
            return `<span style="font-weight:bold">Total ${params.value}</span>`;
          },
          innerRenderer: this.customInnerRenderer.bind(this)
        },
      },
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
      suppressAggFuncInHeader: true,
      stopEditingWhenGridLosesFocus: true
    } as GridOptions;
  }
  customInnerRenderer(params) {
    if (params.node.group) {
      const label = params.value ? params.value : '-';
      return label + ' (' + (params.node.aggData.numberOfVacancies) + ')';
    }
  }
  getIndentClass(params) {
    let indent = 0;
    let node = params.node;
    while (node && node.parent) {
      indent++;
      node = node.parent;
    }
    return 'indent-' + indent;
  }
  onCreateVacancy() {
    const initialState = {
      office: this.office,
      grade: this.smartListGradeValue,
      noOfVacancies: '',
      comments: '',
    };
    this.addVacancyBSModelRef = this.modalService.show(AddVacancyComponent, { initialState });
    this.addVacancyBSModelRef.content.reloadVacancyOnSave.subscribe(response => {
      if (response === true) {
        this.getData();
        this.qhpService.onVacancies(true);
        this.vacancyForm.markAsPristine();
        this.addVacancyBSModelRef.hide();
      }
    });
  }
  public onFilterTextBoxChanged() {
    this.onGridSearch(this.vacancySearchForm.controls.search.value);
    printSortStateToConsole(this.el);
  }
  public openExportModal() {
    this.exportGridColumns(null);
  }
  public openFilterDialog() {
    const screenObject = {
      screenName: 'vacancies'
    };
    this.openFilterDialogView(this.vacancySearchForm, screenObject);
  }
  public resetFilterView() {
    this.resetFilterViewData(this.vacancySearchForm);
  }
  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }
  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }
  public onFilterChangeEvent(event: any) {
    this.filterChangeEvent(event);
  }
  deleteVacancy(params: number) {
    this.id = params;
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
  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        colId: 'office',
        field: 'office',
        editable: false,
        // width: 50,
        // minWidth: 100,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'FY',
        colId: 'year',
        field: 'year',
        editable: true,
        rowGroup: true,
        cellEditor: 'ddSmartList',
        cellEditorParams: {
          cellHeight: 50,
          values: this.yearsList,
        },
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        isGroupOpenByDefault: true,
      },
      {
        headerName: 'Quarter',
        colId: 'quarter',
        field: 'quarter',
        editable: true,
        rowGroup: true,
        cellEditor: 'ddSmartList',
        cellEditorParams: {
          cellHeight: 50,
          values: this.quartersList,
        },
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
      },
      {
        headerName: 'Vacancy',
        colId: 'vacancy',
        field: 'vacancy',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Grade',
        colId: 'vacancyGrade',
        field: 'vacancyGrade',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
      },
      {
        headerName: '# of Vacancies',
        field: 'nbrOfVacancies',
        colId: 'numberOfVacancies',
        editable: true,
        aggFunc: 'sum',
        allowedAggFuncs: ['sum'],
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Comments',
        colId: 'comments',
        field: 'comments',
        editable: true,
        cellStyle: { 'text-align': 'left' },
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000',
        },
      },
      {
        headerName: 'Action',
        colId: 'deleteQHPVacanices',
        field: 'deleteQHPVacanices',
        cellRenderer: 'deleteUserRenderer',
        maxWidth: 150,
        cellRendererParams: {
          screenName: 'QHPVacancy',
          onClick: this.deleteVacancy.bind(this),
        }
      }
    ];
  }
  mySum(params) {
    if (params) {
      let sum = 0;
      params.values.forEach(value => sum += value);
      return sum;
    }
  }
  reloadQHPVacanices(reload: boolean) {
    if (reload) {
      this.qhpService.onVacancies(true);
      this.getData();
    }
  }

  QHPVacanicesDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'Vacancies  Deleted Successfully');
    }
  }
  saveQHPVacancies() {
    if (this.editedData.length > 0) {
      this.busyTableSave = this.humanCapitalService.saveVacancy(this.editedData).subscribe(data => {
        this.toaster.pop('success', 'Saved', 'Successfully saved the data');
        this.qhpService.onVacancies(true);
        this.getData();
        this.editedData = [];
        this.vacancyForm.markAsPristine();
        this.onCellValueUpdated.emit(false);
      }, error => {
        error.error.errorDetails.forEach(element => {
          this.errorDetails.push(element.message);
        });
        this.toaster.pop('error', 'Failed', this.errorDetails);
      });
    }
  }
}
