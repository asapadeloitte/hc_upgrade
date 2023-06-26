import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { CellRendererComponent, DropdownText } from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { columnVisibleAccessbility, printSortStateToConsole } from '../../../../shared/utilities';
import { SelectionsService } from '../selections/selections.service';



@Component({
  selector: 'app-associate-announcements',
  templateUrl: './associate-announcements.component.html',
  styleUrls: ['./associate-announcements.component.scss']
})
export class AssociateAnnouncementsComponent extends BasePageComponent implements OnInit, OnDestroy {
  public unMappedAnnouncementTopForm;

  @ComponentForm(true)
  public unMappedAnnouncementForm;

  public staffingPlanList = [];
  public frameworkComponents;
  public headerHeight;
  public rowHeight;
  private defaultColDef: ColDef;
  public colDefs = [];
  public unmappedHREPSColDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public busyTableSave: Subscription;
  public unmappedHREPSDataList = [];
  public unmappedAnnouncementList = [];
  public reqNoList = [];

  public officeList = [];
  public yearsList = [];
  public gridOptionsforHr: GridOptions;
  public gridApiSel: GridApi;
  public gridColumnApiSel: any;
  public originalData: string;
  public formEdited = false;


  public officeName: any;
  public year: any;
  public editedData: any = [];
  private screenObject = {
    screenName: 'Unmapped HREPSData'
  };


  public announcementsData = [];
  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    activatedRoute: ActivatedRoute,
    private selectionsService: SelectionsService,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
  }

  ngOnInit() {
    this.loadGridOptions();

    this.loadSearchForm();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.officeList = args.officeOrgLevelMapping;
    });
    this.unMappedAnnouncementForm = this.fb.group({});
  }

  onCancelClicked(event) {
    if (event) {
      const tempSearchDDVal = this.selectionsService.getSearchDDVals();
      this.unMappedAnnouncementTopForm.controls.office.setValue(tempSearchDDVal.office);
      this.unMappedAnnouncementTopForm.controls.year.setValue(tempSearchDDVal.year);
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
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
      stopEditingWhenGridLosesFocus: true
    } as GridOptions;
  }

  public loadSearchForm() {
    this.showSearch = false;
    this.unMappedAnnouncementTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });
    this.getCustomFilterNames(this.screenObject);
  }

  onGoClickAnnouncements() {
    if (this.formEdited) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe((response) => {
        this.getAssociateAnnouncementData();
        this.unMappedAnnouncementForm.markAsPristine();
        this.formEdited = false;
      });
      this.bsModalRef.content.onCancel.subscribe((response) => {
        const tempSearchDDVal = this.selectionsService.getSearchDDVals();
        this.unMappedAnnouncementTopForm.controls.office.setValue(tempSearchDDVal.office);
        this.unMappedAnnouncementTopForm.controls.year.setValue(tempSearchDDVal.year);
      });
    } else {
      this.getAssociateAnnouncementData();
    }
  }
  getAssociateAnnouncementData() {
    this.reqNoList = [];
    this.colDefs = [];
    this.unmappedAnnouncementList = [];
    this.showSearch = true;
    this.editedData = [];
    this.unmappedHREPSDataList = [];
    this.unMappedAnnouncementTopForm.controls.filter.setValue(null);
    this.selectionsService.setSearchDDVals(this.unMappedAnnouncementTopForm.value);
    this.busyTableSave = this.humanCapitalService.getunMappedHrepsData(
      this.unMappedAnnouncementTopForm.controls.office.value,
      this.unMappedAnnouncementTopForm.controls.year.value).subscribe(args => {
        if ((args != null) && (args.length > 0)) {
          this.getColDefs();
          let a = [];
          const smartListValues = this.smartListService.getDDVals();
          a = args;
          a.forEach(el => {
            this.reqNoList.push(el.recruitJobReqNbr);
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
          this.unmappedHREPSDataList = a;
          this.originalData = JSON.stringify(this.unmappedAnnouncementList);
        }
      });

    this.busyTableSave = this.humanCapitalService.getunMappedAnnoucementData(
      this.unMappedAnnouncementTopForm.controls.office.value,
      this.unMappedAnnouncementTopForm.controls.year.value).subscribe(args => {
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
          this.unmappedAnnouncementList = a;
          this.originalData = JSON.stringify(this.unmappedAnnouncementList);
        }
      });
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.unMappedAnnouncementTopForm.controls.search.value);
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
    this.resetFilterViewData(this.unMappedAnnouncementTopForm);
  }

  public openFilterDialog() {
    const screenObject1 = {
      screenName: 'Unmapped HREPSData',
    };
    this.openFilterDialogView(this.unMappedAnnouncementTopForm, screenObject1);
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

  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'HREPS_Admin Code',
        field: 'adminCode',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Recruit Job Req #',
        field: 'recruitJobReqNbr',
        editable: false,
        cellClass: 'textFormat',
        sortingOrder: ['asc', 'desc', 'null'],
        sort: 'asc',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Position Title',
        field: 'positionTitle',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Hiring Mechanism ',
        field: 'hiringMechanism',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Recruit Pacakage Submitted to HR',
        field: 'recruitPackageSbmtdToHr',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Preconsult Conducted',
        field: 'preconsultConductedDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Job Req Release Date',
        field: 'jobReqReleaseDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Vacancy Opened',
        field: 'vacancyOpenDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Vacancy Closed',
        field: 'vacancyClosedDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Certs Issued Date',
        field: 'certsIssuedDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Selection Date',
        field: 'selectionDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Tentative Offer Date',
        field: 'tentativeOfferDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_Final Offer Date (1st Selection)',
        field: 'finalOfferDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'HREPS_EOD Date',
        field: 'eodDate',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      }
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
    };

  }



  onOfficeChangeEvent(event: any) {
    this.officeName = event;
  }


  onYearChangeEvent(event: any) {
    this.year = this.unMappedAnnouncementTopForm.controls.year.value;
  }

  onCellValueUpdated(event) {
    if (event) {
      this.unMappedAnnouncementForm.markAsDirty();
      this.formEdited = true;
    } else {
      this.unMappedAnnouncementForm.markAsPristine();
      this.formEdited = false;
    }
  }
  onUpload() {
    const initialState = {
      year: this.year,
      fileType: 'xlsx File Only',
      screenName: 'HREPS',
      title: 'Upload New HREPS Data',
      warningMessage:
        `Warning: This will clear and refresh the entire HREPS data set for all offices,
        including HREPS records that have already been associated with a job req #.`,
      bodyFileType: 'Drag and drop .xlsx file(s) here'
    };
    this.bsModalRef = this.modalService.show(FileUploadComponent, { initialState });
    this.bsModalRef.content.successEvent.subscribe((response) => {
      if (response === true) {
        this.getAssociateAnnouncementData();
        this.unMappedAnnouncementForm.markAsPristine();
        this.formEdited = false;
      }
    });
  }
}
