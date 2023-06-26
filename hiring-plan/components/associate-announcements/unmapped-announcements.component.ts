import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { AppDropdownSmartList, CellRendererComponent, DropdownText, GridTextAreaComponent } from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { accessibilityFix, columnVisibleAccessbility, numberSort, printSortStateToConsole } from '../../../../shared/utilities';


@Component({
  selector: 'app-unmapped-announcements',
  templateUrl: './unmapped-announcements.component.html',
  styleUrls: ['./associate-announcements.component.scss']
})
export class UnmappedAnnouncementsComponent extends BasePageComponent implements OnInit, OnDestroy, OnChanges {
  public unMappedTopForm;

  @ComponentForm(true)
  public unMappedAnnouncementForm;

  public staffingPlanList = [];
  public frameworkComponents;
  public colDefs = [];
  public unmappedAnnoucementColDefs = [];
  public colAnnouncementDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public busyTableSave: Subscription;
  public data = [];
  public errorDetails: any = [];
  public originalData: string;

  @Input() unmappedAnnouncementList;
  @Input() reqNoList;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancelClicked = new EventEmitter<boolean>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCellValueUpdated = new EventEmitter<boolean>();

  public editedData: any = [];

  private screenObject = {
    screenName: 'Unmapped Announcements'
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
      if (propName === 'unmappedAnnouncementList') {
        const chg = changes[propName];
        if (chg.currentValue.length > 0) {
          this.unmappedAnnouncementList = this.unmappedAnnouncementList;
          this.originalData = JSON.stringify(this.unmappedAnnouncementList);
          this.getUnmappedAnnouncementData();
        }
      }
    }
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
      dropdownText: DropdownText,
      ddSmartList: AppDropdownSmartList,
      gridTextAreaComponent: GridTextAreaComponent
    };
    this.gridOptions = {
      context: {
        componentParent: this,
      },

      defaultColDef: {
        singleClickEdit: true,
        enableSorting: true,
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
      // on cell values changed to get the rows based on unique id
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          this.unMappedAnnouncementForm.markAsDirty();
          const announcementId = params.data.announcementId;
          const baseAttributes = { announcementId };
          const originalRow = JSON.parse(this.originalData).find(f => f.announcementId === params.data.announcementId);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);

          // Collect all the changed rows within the grid
          if (this.editedData.length > 0) {
            const rowIndex = this.editedData.findIndex(temp => temp.announcementId === params.data.announcementId);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }

          if (this.editedData.length > 0) {
            this.unMappedAnnouncementForm.markAsDirty();
            this.onCellValueUpdated.emit(true);
          } else {
            this.unMappedAnnouncementForm.markAsPristine();
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
    this.unMappedAnnouncementForm = this.fb.group({});
    this.showSearch = false;
    this.unMappedTopForm = this.fb.group({
      search: [null],
      filter: [null],
    });
    this.getCustomFilterNames(this.screenObject);
  }

  getUnmappedAnnouncementData() {
    this.unMappedTopForm.controls.filter.setValue(null);
    this.unmappedAnnoucementColDefs = [];
    this.editedData = [];
    setTimeout(() => this.unmappedAnnouncements(), 100);
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.unMappedTopForm.controls.search.value);
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
    this.resetFilterViewData(this.unMappedTopForm);
  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'Unmapped Announcements',
    };
    this.openFilterDialogView(this.unMappedTopForm, screenObject);
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

  public unmappedAnnouncements() {

    this.unmappedAnnoucementColDefs = [
      {
        headerName: 'Office',
        field: 'office',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Announcement  ID',
        field: 'announcementDisplayId',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        cellEditor: 'gridTextAreaComponent',
        editable: true,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Associate HREPS Recruit Job Req #',
        field: 'recruitJobReqNbr',
        cellEditor: 'ddSmartList',
        cellEditorParams: {
          cellHeight: 50,
          values: this.reqNoList,
        },
        cellClass: 'textFormat',
        cellRenderer: 'dropdownText',
        editable: true,
        sortingOrder: ['asc', 'desc', 'null'],
        sort: 'asc',
        comparator: numberSort,
        cellStyle: { 'text-align': 'right' }
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        cellEditor: 'gridTextAreaComponent',
        editable: true,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Series',
        field: 'series',
        cellClass: 'textFormat',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' }
      },
      {
        headerName: 'Pay Plan',
        field: 'payPlan',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Grade',
        field: 'grade',
        comparator: numberSort,
        editable: false,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' }
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Recruit Package Submitted to HR',
        field: 'recruitPackageSubmittedToHr',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Preconsult Conducted',
        field: 'preconsultConducted',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Job Req Release Date',
        field: 'jobReqReleaseDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Vacancy Opened',
        field: 'vacancyOpenDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Vacancy Closed',
        field: 'vacancyClosedDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Certs Issued Date',
        field: 'certsIssuedDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Selection Date',
        field: 'selectionDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Tentative Offer Date',
        field: 'tentativeOfferDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Final Offer Date (1st Selection)',
        field: 'finalOfferDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EOD Date',
        field: 'eodDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      }
    ];
  }
  // Find duplicate values of specific column in the grid
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

  saveAnnouncements() {
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
        const obj = new announcementData();
        obj.recruitJobReqNbr = element.recruitJobReqNbr;
        obj.announcementId = element.announcementId;
        newEditedData.push(obj);
      });
      const duplicateJobRequestIds = this.getDuplicateCloumnValues('recruitJobReqNbr');
      if (duplicateJobRequestIds.length > 0) {
        const initialState = {
          invalidHREPS: true,
          header: 'Invalid HREPS Recruit Job Req # Associations',
          message:
            'The following job req #s are used across multiple announcements. Please adjust the data'
            + '<br> [' + duplicateJobRequestIds + ']',
          // details: duplicateJobRequestIds
        };
        this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.submitBtnName = 'Submit';
      } else {
        this.busyTableSave = this.humanCapitalService.postAnnouncements(newEditedData).subscribe(data => {
          this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
          this.getUnmappedAnnouncementData();
          this.editedData = [];
          this.unMappedAnnouncementForm.markAsPristine();
          this.onCellValueUpdated.emit(false);
        }, error => {
          this.toaster.pop('error', 'Failed', this.errorDetails);
        });
      }
    }
  }


}

export class announcementData {
  announcementId: number;
  recruitJobReqNbr: string;
  officePriority: string;
}

