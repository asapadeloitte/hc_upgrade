import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  StartDtValCellRenderrComponent,
  AppDropdownSmartList,
  CellRendererComponent,
  CurrencyEditorComponent,
  DropdownText,
  DatePicker,
  GridTextAreaComponent,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';

import {
  accessibilityFix,
  columnVisibleAccessbility,
  numberSort,
  printSortStateToConsole,
} from '../../../../shared/utilities';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { HiringMechanismService } from './hiring-mechanism.services';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import * as moment from 'moment';
import { dateValueFormatter, changeYearDropDownVales } from 'src/app/shared/grid-utilities';
import { SaveConfirmationDialogComponent } from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
import { SelectionsService } from '../selections/selections.service';

@Component({
  selector: 'app-hiring-mechanisms',
  templateUrl: './hiring-mechanisms.component.html',
  styleUrls: ['./hiring-mechanisms.component.scss']
})
export class HiringMechanismsComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public hiringMechanismForm: FormGroup;

  public hiringMechTopForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
  public tempEditedRows: any = [];
  public editedData: any = [];
  public officeName: any;
  public year: any;
  public showSearch = false;
  public announcementList = [];
  public frameworkComponents;
  public originalData: string;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public hiringMechList: any;
  public deleteObj;
  public deleteClicked = false;
  public announcementDataLength: number;
  public priorityAnnouncementId;
  public originalAPIData;
  public noSelectionDateMap = [];
  childModalRef: BsModalRef;
  public multiSortKey: 'ctrl' = 'ctrl';


  private screenObject = {
    screenName: 'hiringMechanism'
  };
  public errorDetails: any = [];
  public smartList: any;
  public pOrder: boolean = false;

  constructor(
    private fb: FormBuilder,
    humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    private hiringService: HiringMechanismService,
    activatedRoute: ActivatedRoute,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,
    public _adminService: AdminService,
    public selectionsService: SelectionsService
  ) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.hiringMechTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      hiringMechanism: [null, Validators.required],
      search: [null],
      filter: [null],
    });
    this.hiringService.listen().subscribe((m: any) => {
      this.editedData = [];
      this.getHiringReportData();
    });
    this.selectionsService.selectedVacancyListen().subscribe((m: any) => {
      const tempSearchDDVal = this.hiringService.getSearchDDVals();
      this.hiringMechTopForm.controls.office.setValue(tempSearchDDVal.office);
      this.hiringMechTopForm.controls.year.setValue(tempSearchDDVal.year);
      this.hiringMechTopForm.controls.hiringMechanism.setValue(tempSearchDDVal.hiringMechanism);
      this.getHiringReportData();
    });
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
  onGoClickHiringMechanism() {
    if (this.gridApi) {
      this.gridApi.clearFocusedCell();
      setTimeout(() => {
        if (this.editedData.length > 0) {
          this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
          this.bsModalRef.content.okSave.subscribe((response) => {
            this.getHiringReportData();
            this.hiringMechanismForm.markAsPristine();
            this.hiringMechTopForm.controls.filter.setValue(null);
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.hiringService.getSearchDDVals();
            this.hiringMechTopForm.controls.office.setValue(tempSearchDDVal.office);
            this.hiringMechTopForm.controls.year.setValue(tempSearchDDVal.year);
            this.hiringMechTopForm.controls.hiringMechanism.setValue(tempSearchDDVal.hiringMechanism);
          });
        } else {
          this.getHiringReportData();
        }
      }, 300);
    } else {
      this.getHiringReportData();
    }
  }
  ngOnInit() {
    this.loadSearchForm();
    this.loadBusyTable();
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }

  public loadSearchForm() {
    this.hiringMechanismForm = this.fb.group({});
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
    this.sideBar = {
      toolPanels: ['columns', 'filters']
    };
    this.frameworkComponents = {
      cellRendererComponent: CellRendererComponent,
      ddSmartList: AppDropdownSmartList,
      dropdownText: DropdownText,
      hyperlinkComponent: HyperlinkComponent,
      currencyEditor: CurrencyEditorComponent,
      deleteUserRenderer: DeleteUserCellRendererComponent,
      gridTextAreaComponent: GridTextAreaComponent,
    },
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
          filter: true,
        },
        // redarw rows

        onCellValueChanged: params => {
          if (params.oldValue !== params.newValue && params.newValue !== undefined) {
            const dateList = this.smartListService.getDateFieldList();
            const dateField = dateList.findIndex(e => e === params.colDef.field);
            if (dateField >= 0) {
              const updatedItemIndex =
                this.announcementList.findIndex(f => f.announcementId === params.data.announcementId && f[params.colDef.field] === params.newValue);
              this.announcementList[updatedItemIndex][params.colDef.field] =
                this.announcementList[updatedItemIndex][params.colDef.field] !== null &&
                  this.announcementList[updatedItemIndex][params.colDef.field] !== '' &&
                  this.announcementList[updatedItemIndex][params.colDef.field] !== undefined ?
                  new Date(this.announcementList[updatedItemIndex][params.colDef.field]).toISOString() :
                  this.announcementList[updatedItemIndex][params.colDef.field];
            }
            this.hiringMechanismForm.markAsDirty();
            const announcementId = params.data.announcementId;
            const announcementDisplayId = params.data.announcementDisplayId;
            if (params.colDef.field === 'hiringMechanism') {
              if (this.officeName !== 'All Offices') {
                this.colDefs.forEach(col => {
                  if (col.field === 'officePriority') {
                    col.editable = false;
                    col.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'right' };
                  }
                });
              } else {
                this.colDefs.forEach(col => {
                  if (col.field === 'ctpPriority') {
                    col.editable = false;
                    col.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'right' };
                  }
                });
              }
            }
            this.gridOptions.api.setColumnDefs(this.colDefs);
            const baseAttributes = { announcementId, announcementDisplayId };
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

            if (params.colDef.field === 'ctpPriority' || params.colDef.field === 'officePriority') {
              this.priorityAnnouncementId = params.data.announcementId;
              let showError;
              if (params.oldValue !== null && params.newValue > (JSON.parse(this.originalData).reduce((op, item) =>
                op = op > +item[params.colDef.field] ? op : +item[params.colDef.field], 0))) {
                showError = true;
              } else if (params.oldValue === null &&
                params.newValue > (JSON.parse(this.originalData).reduce((op, item) =>
                  op = op > +item[params.colDef.field] ? op : +item[params.colDef.field], 0)) + 1) {
                showError = true;
              } else {
                showError = this.checkforPriorityValidity(this.editedData);
              }
              if (showError === true) {
                const initialState = {
                  invalidPriority: true,
                  header: 'Invalid Priority',
                  message:
                    'Invalid entry. Please enter a valid priority number.'
                };
                this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
                this.bsModalRef.content.closeClick.subscribe((response) => {
                  this.getHiringReportData();
                });
              } else {
                this.priorityReorder(params.colDef.field, params);
                this.pOrder = true;
                this.saveAnnouncements();
              }
            } else {
              this.pOrder = false;
            }

            if (this.editedData.length > 0) {
              this.hiringMechanismForm.markAsDirty();
            } else {
              this.hiringMechanismForm.markAsPristine();
            }

            // Bring back focus and redraw the updated row with new data
            // const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
            this.gridApi.redrawRows();
            this.bringFocusBack();
          }
          accessibilityFix(this.el);
        },
        //
        onColumnVisible: (params) => {
          columnVisibleAccessbility(params, this.el);
        },
        processCellForClipboard: params => {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.column.getColId());
          if (dateField >= 0) {
            return moment(params.value).format('MM/DD/YYYY');
          } else {
            return params.value;
          }
        }
      } as GridOptions;
  }

  // noSelectionDateValidation(orginalrow, updatedrow) {
  //   console.log('orginalrow, updatedrow', orginalrow, updatedrow);

  //   if (updatedrow.noSelectionDate !== null && orginalrow.noSelectionDate === '') {
  //     const joqreqId = ' - Job Req #  ' + updatedrow.recruitJobReqNbr;
  //     this.noSelectionDateMap.set(updatedrow.announcementDisplayId, joqreqId + '<br>');
  //     console.log('this', this.noSelectionDateMap);

  //   }
  // }
  priorityReorder(colDef, params) {
    if (colDef) {
      const originalCTP = JSON.parse(this.originalData).find(f => f.announcementId === params.data.announcementId);
      if (originalCTP) {
        // changed the code for empty column can allow previous values too
        if (!Number(originalCTP[colDef]) && params.newValue !== '') {
          JSON.parse(this.originalData).forEach(announcement => {
            if (((Number(announcement[colDef]) > Number(params.newValue)))
              || announcement[colDef] === params.newValue) {
              this.announcementList.find(e => e.announcementId === announcement.announcementId)[colDef]
                = Number(announcement[colDef]) + 1;
              const announcementId = announcement.announcementId;
              const baseAttributes = { announcementId };
              const updatedAttributes =
                this.getJSONdifference(announcement, this.announcementList.find(e => e.announcementId === announcement.announcementId));
              if (JSON.stringify(updatedAttributes) !== '{}') {
                const payload = { ...baseAttributes, ...updatedAttributes };
                this.editedData.push(payload);
              }
            }
          });
        } else {
          if (Number(originalCTP[colDef]) < Number(params.newValue) && params.newValue !== '') {
            JSON.parse(this.originalData).forEach(announcement => {
              if (((Number(announcement[colDef]) > Number(originalCTP[colDef])) && Number((announcement[colDef]) < Number(params.newValue)))
                || Number(announcement[colDef]) === Number(params.newValue)) {
                this.announcementList.find(e => e.announcementId === announcement.announcementId)[colDef] = Number(announcement[colDef]) - 1;
                const announcementId = announcement.announcementId;
                const baseAttributes = { announcementId };
                const updatedAttributes =
                  this.getJSONdifference(announcement, this.announcementList.find(e => e.announcementId === announcement.announcementId));
                if (JSON.stringify(updatedAttributes) !== '{}') {
                  const payload = { ...baseAttributes, ...updatedAttributes };
                  this.editedData.push(payload);
                }
                // announcement[colDef] = announcement[colDef] - 1;
              }
            });
          }
          if (params.newValue === '') {
            JSON.parse(this.originalData).forEach(announcement => {
              if (Number(announcement[colDef]) > Number(originalCTP[colDef])) {
                this.announcementList.find(e => e.announcementId === announcement.announcementId)[colDef] =
                  Number(announcement[colDef]) - 1;
                const announcementId = announcement.announcementId;
                const baseAttributes = { announcementId };
                const updatedAttributes =
                  this.getJSONdifference(announcement, this.announcementList.find(e => e.announcementId === announcement.announcementId));
                if (JSON.stringify(updatedAttributes) !== '{}') {
                  const payload = { ...baseAttributes, ...updatedAttributes };
                  this.editedData.push(payload);
                }
              }
            });
          }
          if (Number(originalCTP[colDef]) > Number(params.newValue) && params.newValue !== '') {
            JSON.parse(this.originalData).forEach(announcement => {
              if (((Number(announcement[colDef]) > Number(params.newValue))
                && (Number(announcement[colDef]) < Number(originalCTP[colDef]))
                || (announcement[colDef] === params.newValue))) {
                this.announcementList.forEach(e => {
                  if (e.announcementId === announcement.announcementId) {
                    e[colDef] = +announcement[colDef] + 1;
                    const announcementId = announcement.announcementId;
                    const baseAttributes = { announcementId };
                    const updatedAttributes =
                      this.getJSONdifference(announcement, e);
                    if (JSON.stringify(updatedAttributes) !== '{}') {
                      const payload = { ...baseAttributes, ...updatedAttributes };
                      this.editedData.push(payload);
                    }
                  }
                });
              }
            });
          }
        }
      }
    }
  }
  public loadBusyTable() {
    this.roleList = this.authService.jwt_getRole();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.yearsList = changeYearDropDownVales(this.yearsList);
      this.officeList = args.officeOrgLevelMapping;
      if (this.roleList === 'admin' || this.roleList === 'CTPHC_SRT_Analyst_User') {
        this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      }
      this.humanCapitalService.getSmartList().subscribe(smartListArgs => {
        const temp = this.hiringService.getAdditionalSmartLists();
        this.smartList = smartListArgs;
        temp.forEach(element => {
          this.smartList.push(element);
        });
        this.smartListService.setDDVals(this.smartList);
        this.hiringMechList = this.smartListService.getDDVals().find(e => e.smartListName === 'hiringMechanism').smartListValues;
        this.hiringMechList = this.hiringMechList.filter(({ value }) =>
          value === 'DE' || value === 'DH' || value === 'Pathways' || value === 'MP');
        this.hiringMechList.unshift({ smartListName: 'Hiring_Mechanism', id: '', value: 'All Hiring Mechanisms' });
      });
      this.loadGridOptions();
      // this.loadSearchForm();
    });
  }

  // public onOfficeChangeEvent(event: any) {
  //   this.officeName = event;
  // }

  public onYearChangeEvent(event: any) {
  }

  onHmChangeEvent() {
  }

  onGridReady(params) {
    this.gridOptions.onBodyScroll = (event) => {
      printSortStateToConsole(this.el);
    };
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const defaultSortModel = [
      {
        colId: 'jobReqReleaseDate',
        sort: 'desc',
        sortIndex: 0,
      },
      {
        colId: 'office',
        sort: 'asc',
        sortIndex: 1,
      },
      {
        colId: 'jobTitle',
        sort: 'asc',
        sortIndex: 2,
      },
    ];
    params.columnApi.applyColumnState({ state: defaultSortModel });
  }

  public getHiringReportData() {
    this.officeName = this.hiringMechTopForm.controls.office.value;
    this.year = this.hiringMechTopForm.controls.year.value;
    this.showSearch = true;
    this.colDefs = [];
    this.editedData = [];
    this.noSelectionDateMap = [];
    this.hiringMechTopForm.controls.filter.setValue(null);
    this.hiringService.setSearchDDVals(this.hiringMechTopForm.value);
    this.busyTableSave = this.humanCapitalService.getAnnouncements(
      this.hiringMechTopForm.controls.office.value,
      this.hiringMechTopForm.controls.year.value,
      this.hiringMechTopForm.controls.hiringMechanism.value
    ).subscribe(args => {
      this.originalAPIData = args;
      this.announcementDataLength = args.length;
      if ((args != null) && (args.length > 0)) {
        this.getColDefs();
        if (this.roleList !== 'CTPHC_SRT_Analyst_User' && this.roleList !== 'admin') {
          this.colDefs = this.colDefs.filter(el => el.headerName !== 'CTP Priority'
            && el.headerName !== 'Recruit Job Req #' && el.headerName !== 'Submission Date'
            && el.headerName !== 'Status' && el.headerName !== 'Preconsult Conducted');
          this.gridOptions.api.setColumnDefs(this.colDefs);
        }
        if (this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst')
          || (this.roleList.includes('HOA_Analyst_QHP_Analyst'))) {
          this.colDefs.forEach(col => {
            if (col.field === 'hrAction') {
              this.colDefs = this.colDefs.filter(el => el.field !== 'hrAction');
              this.gridOptions.api.setColumnDefs(this.colDefs);
            }
            this.colDefs.forEach(colSel => {
              if (col.field === 'officePriority' && this.hiringMechTopForm.controls.hiringMechanism.value !== 'All Hiring Mechanisms') {
                col.editable = true;
                col.cellStyle = { 'text-align': 'left' };
              } else {
                col.editable = false;
                col.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'left' };
              }
            });
          });
        }
        let a = [];
        const smartListValues = this.smartListService.getDDVals();
        const dateList = this.smartListService.getDateFieldList();
        a = args;
        a.forEach(el => {
          Object.keys(el).forEach(key => {
            if (smartListValues) {
              const tempVal = smartListValues.find(f => f.smartListName === key && key !== 'status' && key !== 'grade');
              const tempDateVal = dateList.find(f => f === key);
              if (tempVal) {
                const tempVal1 = tempVal.smartListValues.find(f => f.id === el[key]);
                el[key] = tempVal1 !== undefined ? tempVal1.value : el[key];
              } else if (tempDateVal) {
                el[key] = el[key] !== null && el[key] !== '' && el[key] !== undefined ? new Date(el[key]).toISOString() : el[key];
              }
            }
          });

        });
        this.originalData = JSON.stringify(a);
        this.onGridReady(this.gridOptions);
        if (this.officeName === 'All Offices') {
          const nullItems = a.filter(e => e.ctpPriority !== null);
          this.announcementList =
            [...nullItems.sort((a, b) => +a.ctpPriority > +b.ctpPriority ? 1 : -1), ...a.filter(y => y.ctpPriority === null)];
        } else {
          const nullItems = a.filter(f => f.officePriority !== null);
          this.announcementList =
            [...nullItems.sort((a, b) => +a.officePriority > +b.officePriority ? 1 : -1), ...a.filter(y => y.officePriority === null)];
        }

      }
    });
  }

  public isColumnEditable(params) {
    if (params.colDef.field === 'ctpPriority' && this.officeName === 'All Offices'
      && this.hiringMechTopForm.controls.hiringMechanism.value !== 'All Hiring Mechanisms') {
      if (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin') {
        return true;
      }
    }
    if (params.colDef.field === 'officePriority' && this.officeName !== 'All Offices'
      && this.hiringMechTopForm.controls.hiringMechanism.value !== 'All Hiring Mechanisms' && !params.data.office.includes('/')) {
      if (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin' ||
        this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst') ||
        this.roleList.includes('HOA_Analyst_QHP_Analyst')) {
        return true;
      }
    }
    if (params.colDef.field === 'recruitJobReqNbr') {
      if (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin') {
        return true;
      }
    }
    if (params.colDef.field === 'eodDate' || params.colDef.field === 'selectionDate') {
      if (!params.data.noSelectionDate && params.data.noSelectionDate === '') {
        return true;
      }
    }
    return false;
  }

  getCellStyle(params) {
    if (params.colDef.field === 'ctpPriority' && this.officeName === 'All Offices' &&
      this.hiringMechTopForm.controls.hiringMechanism.value !== 'All Hiring Mechanisms') {
      if (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin') {
        return { 'text-align': 'right' };
      }
    } else if (params.colDef.field === 'officePriority' && this.officeName !== 'All Offices'
      && this.hiringMechTopForm.controls.hiringMechanism.value !== 'All Hiring Mechanisms' && !params.data.office.includes('/')
      && (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin' ||
        this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst')
        || this.roleList.includes('HOA_Analyst_QHP_Analyst'))) {
      return { 'text-align': 'right' };
    } else if (params.colDef.field === 'recruitJobReqNbr') {
      if (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin') {
        return { 'text-align': 'right' };
      }
    } else if (params.colDef.field === 'eodDate' || params.colDef.field === 'selectionDate') {
      if (!params.data.noSelectionDate && params.data.noSelectionDate === '') {
        return { 'text-align': 'right' };
      }
    }
    return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
  }

  /* to check the validaity for CTP Priority and Office Priority columns*/
  checkforPriorityValidity(editedValues) {
    let showError = false;
    editedValues.forEach(element => {
      const ctpPriority = Number(element.ctpPriority);
      const officePriority = Number(element.officePriority);
      if (element.announcementId === this.priorityAnnouncementId) {
        if (this.officeName === 'All Offices') {
          if (element.ctpPriority === undefined || element.ctpPriority === '') {
            showError = false;
          } else if (ctpPriority === 0 ||
            ctpPriority > this.announcementDataLength) {
            showError = true;
          }
        } else {
          if (element.officePriority === undefined || element.officePriority === '') {
            showError = false;
          } else if (officePriority === 0 ||
            officePriority > this.announcementDataLength) {
            showError = true;
          }
        }
      }
    });
    return showError;
  }

  saveAnnouncements() {
    this.gridApi.clearFocusedCell();
    setTimeout(() => {
      if (this.editedData.length > 0) {
        const smartListGlobal = this.smartListService.getDDVals();
        const dateList = this.smartListService.getDateFieldList();
        this.noSelectionDateMap = [];
        this.editedData.forEach(obj => {
          Object.keys(obj).forEach(key => {
            const smartListObject = smartListGlobal.find(element => element.smartListName === key && key !== 'status' && key !== 'grade');
            const tempDateVal = dateList.find(f => f === key);
            if (smartListObject && smartListObject.smartListValues.length > 0) {
              smartListObject.smartListValues.forEach(element => {
                if (obj[key] === element.value) {
                  obj[key] = element.id;
                }
              });
            }
            if (tempDateVal) {
              if (key === tempDateVal) {
                obj[key] =
                  obj[key] !== null && obj[key] !== '' && obj[key] !== undefined ? moment(obj[key]).format('MM/DD/YYYY') : obj[key];
              }
            }
          });

          const originalRow = JSON.parse(this.originalData).find(f => f.announcementId === obj.announcementId);
          const updatedRow = { ...originalRow, ...obj };
          if (obj.noSelectionDate && originalRow.noSelectionDate === '' && originalRow.noSelectionDate !== obj.noSelectionDate) {
            const tempSelectionEdit = obj;
            tempSelectionEdit.recruitJobReqNbr = !obj.recruitJobReqNbr ? updatedRow.recruitJobReqNbr : obj.recruitJobReqNbr;
            this.noSelectionDateMap.push(tempSelectionEdit);
          }

        });

        if (this.noSelectionDateMap.length > 0) {
          const initialState = {
            message: `Warning: The following announcements marked as having no selections will
            have the vacancies associated with them removed from the Hiring Plan.
            This cannot be undone if "Yes" is selected.`,
            //  parentModelRef: this.bsModalRef,
            buttonTitle: 'Yes',
            displayAnnouncementjoqreq: JSON.parse(JSON.stringify(this.noSelectionDateMap))
          };
          this.bsModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
          this.bsModalRef.content.event.subscribe((response: boolean) => {
            if (response === true) {
              this.SaveAnouncementsData();
              this.editedData = [];
              this.onGoClickHiringMechanism();
            } else if (response === false) {
              this.noSelectionDateMap = [];
            }
          });
        } else {
          this.SaveAnouncementsData();
        }


      }
    }, 200);
  }
  public SaveAnouncementsData() {
    this.humanCapitalService.postAnnouncements(this.editedData).subscribe(data => {
      if (!this.pOrder) {
        this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');

      }
      const tempSearchDDVal = this.hiringService.getSearchDDVals();
      this.hiringMechTopForm.controls.office.setValue(tempSearchDDVal.office);
      this.hiringMechTopForm.controls.year.setValue(tempSearchDDVal.year);
      this.hiringMechTopForm.controls.hiringMechanism.setValue(tempSearchDDVal.hiringMechanism);
      this.getHiringReportData();
      this.editedData = [];
      this.hiringMechanismForm.markAsPristine();
    }, error => {
      error.error.errorDetails.forEach(element => {
        this.errorDetails.push(element.message);
      });
      this.toaster.pop('error', 'Failed', this.errorDetails);
    });
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.hiringMechTopForm.controls.search.value);
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
    this.resetFilterViewData(this.hiringMechTopForm);
    this.onGridReady(this.gridOptions);
  }

  public openFilterDialog() {
    const filterValue = this.hiringMechTopForm.get('filter').value;
    const filterGridValue = this.hiringMechTopForm.controls.filter.value;
    const screenObject = {
      screenName: 'hiringMechanism',
    };
    this.openFilterDialogView(this.hiringMechTopForm, screenObject);
  }

  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public openExportModal() {
    this.gridApi.clearFocusedCell();
    this.ExportGridData();
  }

  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }

  public getColDefs() {
    this.colDefs = [
      {
        headerName: 'Announcement ID',
        field: 'announcementDisplayId',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        cellRenderer: 'hyperlinkComponent',
        cellRendererParams: {
          year: this.year,
        },
      },
      {
        headerName: 'Office Priority',
        field: 'officePriority',
        cellEditor: 'currencyEditor',
        comparator: numberSort,
        cellStyle: this.getCellStyle.bind(this),
        editable: this.isColumnEditable.bind(this)
      },
      {
        headerName: 'CTP Priority',
        field: 'ctpPriority',
        cellEditor: 'currencyEditor',
        comparator: numberSort,
        cellStyle: this.getCellStyle.bind(this),
        editable: this.isColumnEditable.bind(this),
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Office',
        field: 'office',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        cellEditor: 'gridTextAreaComponent',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: true
      },
      {
        headerName: 'Vacancies',
        field: 'vacanciesDisplayIds',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        cellEditor: 'gridTextAreaComponent',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: true
      },
      {
        headerName: 'Pay Plan ',
        field: 'payPlan',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Series',
        field: 'series',
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Grade',
        field: 'grade',
        cellClass: 'textFormat',
        comparator: numberSort,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Number of Vacancies to Fill',
        field: 'nbrOfVacanciesToFill',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Classification Needed',
        field: 'classificationNeeded',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' },
        editable: true
      },
      // {
      //   headerName: 'Recruit Package Submitted to HR',
      //   field: 'recruitPackageSubmittedToHr',
      //   cellEditor: 'ddSmartList',
      //   cellRenderer: 'dropdownText',
      //   cellStyle: { 'text-align': 'right' },
      //   editable: true
      // },
      {
        headerName: 'Recruit Job Req #',
        field: 'recruitJobReqNbr',
        cellEditor: 'currencyEditor',
        comparator: numberSort,
        cellStyle: this.getCellStyle.bind(this),
        editable: this.isColumnEditable.bind(this)
      },
      {
        // headerName: 'Job Req Release Date',
        headerName: 'Submission Date',
        field: 'jobReqReleaseDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Vacancy Opened',
        field: 'vacancyOpenDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Vacancy Closed',
        field: 'vacancyCloseDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Certs Issued',
        field: 'certsIssuedDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Selectee Name(s)',
        field: 'selecteeNames',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Selection Date',
        field: 'selectionDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: this.getCellStyle.bind(this),
        editable: this.isColumnEditable.bind(this)
      },
      {
        headerName: 'Tentative Offer Date',
        field: 'tentativeOfferDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Final Offer Date',
        field: 'finalOfferDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'EOD Date',
        field: 'eodDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: this.getCellStyle.bind(this),
        editable: this.isColumnEditable.bind(this)
      },
      {
        headerName: 'No Selections Date',
        field: 'noSelectionDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: { 'text-align': 'right' },
        editable: true
      },
      {
        headerName: 'Status',
        field: 'status',
        cellStyle: { 'text-align': 'right' },
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000'
        }
      },
      {
        headerName: 'Action Completed?',
        field: 'complete',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Action',
        field: 'hrAction',
        cellRenderer: 'deleteUserRenderer',
        cellRendererParams: {
          screenName: 'hiringMechanism',
          onClick: this.deleteAnnouncement.bind(this),
        }
      }
    ];
  }
  deleteAnnouncement(params: number) {
    if (this.editedData.length > 0) {
      this.onGoClickHiringMechanism();
    }
    this.deleteClicked = true;
    this.deleteObj = { announcementId: params };
  }

  reloadAnnouncments(reload: boolean) {
    if (reload) {
      const tempSearchDDVal = this.hiringService.getSearchDDVals();
      this.hiringMechTopForm.controls.office.setValue(tempSearchDDVal.office);
      this.hiringMechTopForm.controls.year.setValue(tempSearchDDVal.year);
      this.hiringMechTopForm.controls.hiringMechanism.setValue(tempSearchDDVal.hiringMechanism);
      this.getHiringReportData();
    }
  }

  announcementDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'Announcement Deleted',
        'Announcement has been Deleted Successfully');
    }
  }

  resetDeleteClicked(event: boolean) {
    if (event) {
      this.deleteClicked = false;
    }
  }
}
