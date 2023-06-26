import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  AppDropdownSmartList,
  CellRendererComponent,
  DropdownText,
  DatePicker,
  CurrencyEditorComponent,
  GridTextAreaComponent,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { HyperlinkComponent } from 'src/app/shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { ExportModalComponent } from 'src/app/shared/components/export-modal/export-modal.component';
import { FilterDailogComponent } from 'src/app/shared/components/filter-dailog/filter-dailog.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import {
  editableBasedonCondition, gridExport,
  noneditableRowColor, dateValueFormatter, changeYearDropDownVales, editableBasedonSelectionType, cellStyleBasedonSelectionType
} from 'src/app/shared/grid-utilities';
import { GridFilterModel } from 'src/app/shared/models/acquisition.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import * as moment from 'moment';

import {
  accessibilityFix,
  columnVisibleAccessbility,
  numberSort,
  printSortStateToConsole,
} from '../../../../shared/utilities';
import { HiringMechanismService } from '../hiring-mechanisms/hiring-mechanism.services';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { SelectionsService } from './selections.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { VcaddtoselectionComponent } from './vcaddtoselection/vcaddtoselection.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { SaveConfirmationDialogComponent } from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';


@Component({
  selector: 'app-selections',
  templateUrl: './selections.component.html',
  styleUrls: ['./selections.component.scss']
})
export class SelectionsComponent extends BasePageComponent implements OnInit, OnDestroy {
  public changeForm: FormGroup;
  @ComponentForm(true)
  public selectionsForm: FormGroup;
  public busyTableSave: Subscription;
  public showSearch = false;
  public disableAddButton = true;
  public staffingPlanList = [];
  public frameworkComponents;
  public yearsList = [];
  public officeList = [];
  private defaultColDef: ColDef;
  public colDefs = [];
  public colSelectionDefs = [];
  public gridOptions: GridOptions;
  public gridOptionsforHr: GridOptions;
  public gridApiSel: GridApi;
  public gridColumnApiSel: any;
  public selctionsubscription: Subscription;
  public customFilterNamesforSelections: any;
  protected viewsIdforSelection: any;
  public deletePopupModal: BsModalRef;
  public pendingSelectionVacancies = [];
  public allSelectionList = [];
  public statusBar;
  public officeName: any;
  public editedData: any = [];
  public originalData: string;
  public errorDetails: any = [];
  public validationVacancyIds = [];
  private multiSortKey;
  public internalSelecteeOffice: string;
  public internalSelecteeOrgLevel: string;
  public internalSelecteeEmployeeId: string;

  private screenObject1 = {
    screenName: 'hrSelectionView'
  };

  private screenObject2 = {
    screenName: 'selectionView'
  };

  public currentYear: string;

  public selectionsList = [];
  public jobTitleMapping: any;
  public smartList: any;
  public employees: any;
  public allSpEmployees: any;
  public vcbsModalRef: BsModalRef;
  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private selectionsService: SelectionsService,
    private hmService: HiringMechanismService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    private adminService: AdminService,
    public allStaffService: AllStaffService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.changeForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      selectionSearch: [null],
      selectionFilter: [null],
      hmSearch: [null],
      filter: [null],
    });
    this.selectionsService.selectedVacancyListen().subscribe((m: any) => {
      const tempSearchDDVal = this.selectionsService.getSearchDDVals();
      this.changeForm.controls.office.setValue(tempSearchDDVal.office);
      this.changeForm.controls.year.setValue(tempSearchDDVal.year);
      this.getSelectionsData();
    });
  }
  ngOnInit() {
    this.roleList = this.authService.jwt_getRole();
    this.loadGridOptions();
    this.loadSearchForm();
    this.loadBusyTable();
  }
  public loadBusyTable() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.yearsList = changeYearDropDownVales(this.yearsList);
      this.officeList = args.officeOrgLevelMapping;
      this.currentYear = args.currentYear;
      if (this.roleList === 'admin' || this.roleList === 'CTPHC_SRT_Analyst_User') {
        this.disableAddButton = false;
        this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      }
      // this.loadGridOptions();
      // this.loadSearchForm();
      this.humanCapitalService.getSmartList().subscribe(args => {
        const temp = this.selectionsService.getAdditionalSmartLists();
        this.smartList = args;
        this.humanCapitalService.getAllEmployeesData().subscribe(allSpEmp => {
          this.allSpEmployees = allSpEmp;
          this.allStaffService.setAllSpEmployees(this.allSpEmployees);
        });
        temp.forEach(element => {
          this.smartList.push(element);
        });
        this.smartListService.setDDVals(this.smartList);
        this.adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListService.setTitleMapping(this.jobTitleMapping);
          }
        });
      });
    });
    // this.selectionsForm = this.fb.group({});
  }
  public loadSearchForm() {
    this.selectionsForm = this.fb.group({});
    this.getCustomFilterNames(this.screenObject1);
    this.getCustomFilterNamesforSelection(this.screenObject2);

  }

  public getCustomFilterNamesforSelection(screenObject: any) {
    const userId = localStorage.getItem('UserID');
    this.busyTableSave = this.humanCapitalService.getAcquisitionGridFilter(userId).subscribe(args => {
      if (args) {
        args.forEach(el => {
          if (el.screenName === screenObject.screenName) {
            el.filterJson = JSON.parse(el.filterJson);
            this.viewsIdforSelection = el.userFilterId;

          }
        });
        this.customFilterNamesforSelections = _.filter(args, p => p.screenName === screenObject.screenName);
      }
    });
  }
  public onOfficeChangeEvent(event: any) {
    this.officeName = this.changeForm.controls.office.value;
  }

  public onYearChangeEvent(event: any) {
    // this.year = this.changeForm.controls.year.value;
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
      deleteUserRenderer: DeleteUserCellRendererComponent,
      currencyEditor: CurrencyEditorComponent,
      gridTextAreaComponent: GridTextAreaComponent,
    };
    this.multiSortKey = 'ctrl';
    this.gridOptions = {
      context: {
        componentParent: this,
      },
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.colDef.field);
          if (dateField >= 0) {
            const updatedItemIndex =
              this.selectionsList.findIndex(f => f.vacancyId === params.data.vacancyId && f.cancelled === false);
            this.selectionsList[updatedItemIndex][params.colDef.field] =
              this.selectionsList[updatedItemIndex][params.colDef.field] !== null &&
                this.selectionsList[updatedItemIndex][params.colDef.field] !== '' &&
                this.selectionsList[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.selectionsList[updatedItemIndex][params.colDef.field]).toISOString() :
                this.selectionsList[updatedItemIndex][params.colDef.field];
          }
          this.selectionsForm.markAsDirty();
          if (params.colDef.field === 'jobTitle') {
            params.data.series = '';
            params.data.grade = '';
          }
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const employee = params.data.employee;
          const employeeId = params.data.employeeId;
          const year = params.data.year;
          const vacancyId = params.data.vacancyId;
          const cancelled = params.data.cancelled;
          const announcementId = params.data.announcementId;
          const vacancyDisplayId = params.data.vacancyDisplayId;

          let baseAttributes;

          if (params.colDef.field === 'selectionType') {
            if (params.oldValue) {
              params.data.selecteeFirstName = '';
              params.data.selecteeLastName = '';
              params.data.selecteeMiddleInitial = '';
              params.data.fullName = '';
              params.data.associateExistingEmployee = '';
            } else if (params.oldValue === undefined || params.oldValue === '') {
              if (params.newValue === 'External to CTP') {

              } else if (params.newValue === 'Internal to CTP') {
                params.data.selecteeFirstName = '';
                params.data.selecteeLastName = '';
                params.data.selecteeMiddleInitial = '';
                params.data.fullName = '';
                params.data.associateExistingEmployee = '';
              }
            }
          }
          if (params.colDef.field === 'associateExistingEmployee') {
            const tempEmp = this.allSpEmployees.find(e => e.displaySummary === params.newValue);
            if (tempEmp !== undefined) {
              params.data.fullName = tempEmp.fullName;
              params.data.selecteeFirstName = tempEmp.firstName;
              params.data.selecteeLastName = tempEmp.lastName;
              params.data.selecteeMiddleInitial = tempEmp.middleInitial;

              this.internalSelecteeOffice = tempEmp.office;
              this.internalSelecteeOrgLevel = tempEmp.orgLevel;
              this.internalSelecteeEmployeeId = tempEmp.employeeId;

            }
          }
          if (params.data.selecteeMiddleInitial === null) {
            params.data.selecteeMiddleInitial = '';
          }
          const internalSelecteeOffice = this.internalSelecteeOffice;
          const internalSelecteeOrgLevel = this.internalSelecteeOrgLevel;
          const internalSelecteeEmployeeId = this.internalSelecteeEmployeeId;
          // base attributes modified for 19.0 sprint 1 -6617
          baseAttributes = {
            office, orgLevel, employee, employeeId, year, vacancyId, announcementId, vacancyDisplayId,
            cancelled, internalSelecteeOffice, internalSelecteeOrgLevel, internalSelecteeEmployeeId,
            selecteeFirstName: params.data.selecteeFirstName, selecteeLastName: params.data.selecteeLastName,
            selecteeMiddleInitial: params.data.selecteeMiddleInitial
          };
          // else {
          //   baseAttributes = { office, orgLevel, employee, employeeId, year, vacancyId, announcementId, cancelled };
          // }
          const originalRow =
            JSON.parse(this.originalData).find(f => f.vacancyId === params.data.vacancyId && f.cancelled === false);
          // const originalRow = JSON.parse(this.originalData).find(f => f.vacancyId === params.data.vacancyId);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);
          if (this.editedData.length > 0) {
            const rowIndex =
              this.editedData.findIndex(temp => temp.vacancyId === params.data.vacancyId && temp.cancelled === false);
            //  this.editedData.findIndex(temp => temp.vacancyId === params.data.vacancyId);
            if (rowIndex >= 0) {
              this.editedData.splice(rowIndex, 1);
            }
          }
          if (JSON.stringify(updatedAttributes) !== '{}') {
            const payload = { ...baseAttributes, ...updatedAttributes };
            this.editedData.push(payload);
          }
          if (this.editedData.length > 0) {
            this.selectionsForm.markAsDirty();
          } else {
            this.selectionsForm.markAsPristine();
          }

          // Bring back focus and redraw the updated row with new data
          const row = this.gridApiSel.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApiSel.redrawRows({ rowNodes: [row] });
          this.bringFocusBack();
        }
        accessibilityFix(this.el);
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

    this.gridOptionsforHr = {
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
        filter: true
      },
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },
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
  public getSelectionsData() {
    this.colDefs = [];
    this.selectionsList = [];
    this.staffingPlanList = [];
    this.pendingSelectionVacancies = [];
    this.colSelectionDefs = [];
    this.showSearch = true;
    this.editedData = [];
    this.changeForm.controls.filter.setValue(null);
    this.changeForm.controls.selectionFilter.setValue(null);
    this.selectionsService.setSearchDDVals(this.changeForm.value);
    this.year = this.changeForm.controls.year.value;
    this.officeName = this.changeForm.controls.office.value;
    this.getColDefs();
    this.getHmColDefs();
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      this.changeForm.controls.office.value,
      'Employee',
      this.currentYear).subscribe(args => {
        this.employees = args;
        this.allStaffService.setEmployees(this.employees);
        this.busyTableSave = this.humanCapitalService.getSelectionsData(
          this.changeForm.controls.office.value,
          this.changeForm.controls.year.value).subscribe(args => {
            if ((args != null) && (args.length > 0)) {
              let a = [];
              const smartListValues = this.smartListService.getDDVals();
              const dateList = this.smartListService.getDateFieldList();
              a = args;
              a.forEach(el => {
                Object.keys(el).forEach(key => {
                  if (smartListValues) {
                    const tempVal = smartListValues.find(f => f.smartListName === key);
                    const tempDateVal = dateList.find(f => f === key);
                    if (tempVal) {
                      const tempVal1 = tempVal.smartListValues.find(f => f.id === el[key]);
                      el[key] = tempVal1 !== undefined ? tempVal1.value : el[key];
                    } else if (tempDateVal) {
                      el[key] = el[key] !== null && el[key] !== '' && el[key] !== undefined ? new Date(el[key]).toISOString() : el[key];
                    }
                  }
                });
                if (el.associatedVacancyDetails.length > 0) {
                  el.associatedVacancyDetails.forEach(e => {
                    Object.keys(e).forEach(tempKey => {
                      if (smartListValues) {
                        const tempVal = smartListValues.find(f => f.smartListName === tempKey);
                        const tempDateVal = dateList.find(f => f === tempKey);
                        if (tempVal) {
                          const tempVal1 = tempVal.smartListValues.find(f => f.id === e[tempKey]);
                          e[tempKey] = tempVal1 !== undefined ? tempVal1.value : e[tempKey];
                        } else if (tempDateVal) {
                          e[tempKey] =
                            e[tempKey] !== null &&
                              e[tempKey] !== '' && e[tempKey] !== undefined ? new Date(e[tempKey]).toISOString() : e[tempKey];
                        }
                      }
                    });
                  });
                }
              });
              const tempSelections = [];
              a.forEach(element => {
                element.associatedVacancyDetails.forEach(vacancy => {
                  vacancy.key = vacancy.announcementId + vacancy.vacancyId;
                  // cancelled true
                  if (vacancy.readyForSelection === true || vacancy.cancelled === true) {
                    tempSelections.push(vacancy);
                  } else {
                    this.pendingSelectionVacancies.push(vacancy);
                  }
                });
              });
              this.originalData = JSON.stringify(tempSelections);
              this.selectionsList = tempSelections;
              this.onGridReadyforSelections(this.gridOptions);
              this.onGridReady(this.gridOptionsforHr);
              this.staffingPlanList = a;
              this.roleList = this.authService.jwt_getRole();
              // newly added for Remove from Selections  field for Hiring office Analyst
              if (this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst')) {
                this.colSelectionDefs = this.colSelectionDefs.filter(el => el.headerName !== 'Remove from Selections' &&
                  el.headerName !== 'Initial Job Req' && el.headerName !== 'Selection Job Req');
                this.gridOptions.api.setColumnDefs(this.colSelectionDefs);
              } //
              if (this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst')) {
                this.colSelectionDefs.forEach(colSel => {
                  colSel.editable = false;
                  colSel.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'left' };
                });
              }
              if (this.roleList !== 'CTPHC_SRT_Analyst_User' && this.roleList !== 'admin') {
                this.colDefs = this.colDefs.filter(el => el.headerName !== 'CTP Priority'
                  && el.headerName !== 'Recruit Job Req #' && el.headerName !== 'Submission Date'
                  && el.field !== 'officePriority'
                  && el.headerName !== 'Status' && el.headerName !== 'Preconsult Conducted');
                this.gridOptionsforHr.api.setColumnDefs(this.colDefs);
              }
            }
          });
      });
  }

  public onSelectionFilterTextBoxChanged() {
    this.onGridSearchSel(this.changeForm.controls.selectionSearch.value);
    printSortStateToConsole(this.el);
  }

  public onHmFilterTextBoxChanged() {
    this.onGridSearch(this.changeForm.controls.hmSearch.value);
    printSortStateToConsole(this.el);
  }

  public onGridSearchSel(filterString: string) {
    if (this.gridApiSel.isAnyFilterPresent()) {
      this.gridApiSel.onFilterChanged();
    }
    this.gridApiSel.setQuickFilter(filterString);
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

  public onFilterChangeEventforSelection(event: any) {
    this.filterChangeEventforSelection(event);
    this.onGridReadyforSelections(this.gridOptions);
    this.onGridReady(this.gridOptionsforHr);
  }

  public resetFilterViewforSel() {
    this.viewsId = null;
    this.changeForm.controls.selectionFilter.setValue(null);
    this.gridColumnApiSel.resetColumnState();
    this.gridColumnApiSel.resetColumnGroupState();
    // this.gridColumnApiSel.applyColumnState(null);
    this.gridApiSel.setFilterModel(null);
    // added for multisort
    this.onGridReadyforSelections(this.gridOptions);
    this.onGridReady(this.gridOptionsforHr);
  }
  public resetFilterView() {
    this.resetFilterViewData(this.changeForm);
  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'hrSelectionView',
    };
    this.openFilterDialogView(this.changeForm, screenObject);
  }
  public openFilterDialogforSelection() {
    const screenObject = {
      screenName: 'selectionView',
    };
    this.openFilterDialogViewforSelection(this.changeForm, screenObject);
  }


  public autoSizeColsforSel(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApiSel.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApiSel.autoSizeColumns(allColumnIds, skipHeader);
  }

  public autoSizeCols(skipHeader) {
    this.autoSizeColumns(skipHeader);
    printSortStateToConsole(this.el);
  }

  public openExportModal() {
    this.gridApiSel.clearFocusedCell();
    this.ExportGridData();
  }

  public openExportModalforHr() {
    this.ExportGridDataforHr();
  }

  public ExportGridDataforHr() {
    this.bsModalRef = this.modalService.show(ExportModalComponent);
    this.bsModalRef.content.exportSubmit.subscribe((response) => {
      gridExport(response, this.gridOptionsforHr);
      this.bsModalRef.hide();
      this.toaster.pop('success', 'File Download', 'Downloaded File Successfully');
    });
  }

  public onSortChange(e) {
    printSortStateToConsole(this.el);
  }

  public saveSelections() {
    let count = 0;
    this.validationVacancyIds = [];
    this.gridApiSel.clearFocusedCell();
    setTimeout(() => {
      if (this.editedData.length === 0) {
        this.toaster.pop('error', 'Not Saved', 'No updates are present');
      } else if (this.editedData.length > 0) {
        // show validation message on Lastname,firstName,Selection date is empty
        this.editedData.forEach(ele => {
          if (ele.selectionDate === '' || ele.selecteeLastName === ''
            || ele.selecteeFirstName === '' || ele.selectionType === '') {
            count++;
            this.validationVacancyIds.push(ele.vacancyDisplayId);
          }
        });
        const smartListGlobal = this.smartListService.getDDVals();
        const dateList = this.smartListService.getDateFieldList();
        this.editedData.forEach(obj => {
          Object.keys(obj).forEach(key => {
            const smartListObject = smartListGlobal.find(element => element.smartListName === key);
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
        });
        if (count > 0) {
          const initialState = {
            selectionValidation: true,
            header: 'Invalid Data',
            message: 'Vacancies in the Selections template must have a value for Last Name, First Name, Selection Type and Selection Date.',
            validationVacancyIds: this.validationVacancyIds
          };
          this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
          this.bsModalRef.content.closeBtnName = 'Close';
          this.bsModalRef.content.submitBtnName = 'Submit';
        } else {
          // save the pushVacanices to hiringplan
          this.editedData.forEach(element => {
            delete element.associateExistingEmployee;
            delete element.fullName;
          });
          const tempSearchDDVal = this.selectionsService.getSearchDDVals();
          this.changeForm.controls.office.setValue(tempSearchDDVal.office);
          this.changeForm.controls.year.setValue(tempSearchDDVal.year);
          this.busyTableSave =
            this.humanCapitalService.saveHMVacancy(this.changeForm.controls.year.value, this.editedData).subscribe(data => {
              this.toaster.pop('success', 'Saved', 'Successfully saved the vacancy details');
              this.getSelectionsData();
              this.editedData = [];
              this.selectionsForm.markAsPristine();
            }, error => {
              error.error.errorDetails.forEach(element => {
                this.errorDetails.push(element.message);
              });
              this.toaster.pop('error', 'Failed', this.errorDetails);
            });
        }
      }
    }, 200);
  }
  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }

  // newly added for Initial job req editable
  public isColumnEditable(params) {
    if (params.data.cancelled !== true) {
      if (params.data.sharedCertificate === true || (params.data.hiringMechanism !== 'DE'
        && params.data.hiringMechanism !== 'DH' && params.data.hiringMechanism !== 'MP' && params.data.hiringMechanism !== 'Pathways')) {
        return true;
      }
    }
    return false;
  }
  // dynamicallly update the cellstyle
  getCellStyle(params) {
    if (params.data.cancelled !== true && (params.data.sharedCertificate === true ||
      (params.data.hiringMechanism !== 'DE'
        && params.data.hiringMechanism !== 'DH' && params.data.hiringMechanism !== 'MP' && params.data.hiringMechanism !== 'Pathways'))) {
      return { 'text-align': 'right' };
    } else {
      return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
    }
  }
  getVacancyList() {
    const initialState = {
      pendingSelectionVacancies: this.pendingSelectionVacancies,
      year: this.year,
      class: 'modal-xl',
    };
    this.vcbsModalRef = this.modalService.show(VcaddtoselectionComponent, { initialState });
    this.vcbsModalRef.content.closeBtnName = 'Close';
    this.vcbsModalRef.content.submitBtnName = 'Submit';
  }
  public getColDefs() {
    this.colSelectionDefs = [
      {
        headerName: 'Announcement ID',
        field: 'announcementDisplayId',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        cellRenderer: 'hyperlinkComponent',
        cellRendererParams: {
          year: this.year,
          office: this.officeName,
        },
      },
      {
        headerName: 'Vacancy ID',
        field: 'vacancyDisplayId',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Initial Job Req',
        field: 'initialJobReq',
        cellEditor: 'currencyEditor',
        comparator: numberSort,
        // cellClass: 'textFormat',
        cellStyle: this.getCellStyle.bind(this),
        editable: this.isColumnEditable.bind(this),
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
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
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellEditorParams: {
          screenName: 'selections'
        },
        editable: editableBasedonCondition,
        cellStyle: params => {
          if (params.node.data.cancelled === true) {
            return { backgroundColor: '#E6E6E6', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }
      },
      {
        headerName: 'Pay Plan ',
        field: 'payPlan',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Series',
        field: 'series',
        cellClass: 'textFormat',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: editableBasedonCondition,
        cellStyle: params => {
          if (params.node.data.cancelled === true) {
            return { backgroundColor: '#E6E6E6', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }
      },
      {
        headerName: 'Grade',
        field: 'grade',
        cellClass: 'textFormat',
        comparator: numberSort,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: editableBasedonCondition,
        cellStyle: params => {
          if (params.node.data.cancelled === true) {
            return { backgroundColor: '#E6E6E6', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }
      },
      {
        headerName: 'Type of Hire',
        field: 'typeOfHire',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'Non-Competitive Selection?',
        field: 'nonCompetitiveSelection',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
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
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'Hiring Manager',
        field: 'hiringManagerLevel',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'Selection Type',
        field: 'selectionType',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'Associate Existing Employee',
        field: 'associateExistingEmployee',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellEditorParams: {
          screenName: 'selectionTemplate'
        },
        cellStyle: params => {
          if (params.node.data.cancelled === true) {
            return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
          } else if (params.data.selectionType === 'Internal to CTP') {
            const currentDate = new Date();
            if (params.data.eodDate &&
              params.data.eodDate !== undefined && params.data.eodDate !== '' && new Date(params.data.eodDate) <= currentDate) {
              return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
            } else {
              return { 'text-align': 'right' };
            }
          } else {
            return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
          }
        },
        editable: params => {
          if (params.node.data.cancelled === true) {
            return false;
          } else if (params.data.selectionType === 'Internal to CTP') {
            const currentDate = new Date();
            if (params.data.eodDate &&
              params.data.eodDate !== undefined && params.data.eodDate !== '' && new Date(params.data.eodDate) <= currentDate) {
              return false;
            } else {
              return true;
            }
          } else {
            return false;
          }
        },
      },
      {
        headerName: 'Full Name',
        field: 'fullName',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Last Name',
        field: 'selecteeLastName',
        cellStyle: cellStyleBasedonSelectionType,
        editable: editableBasedonSelectionType
      },
      {
        headerName: 'First Name',
        field: 'selecteeFirstName',
        cellStyle: cellStyleBasedonSelectionType,
        editable: editableBasedonSelectionType
      },
      {
        headerName: 'Middle Initial',
        field: 'selecteeMiddleInitial',
        cellStyle: cellStyleBasedonSelectionType,
        editable: editableBasedonSelectionType
      },
      {
        headerName: 'Staff Member Type',
        field: 'staffMemberType',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'Selection Job Req',
        field: 'selectionJobReq',
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
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
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
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
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
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
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'EOD',
        field: 'eodDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'Declination/Cancelled Action',
        field: 'declinationDate',
        cellClass: 'dateUS',
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellEditor: DatePicker,
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition
      },
      {
        headerName: 'Comments',
        field: 'comments',
        cellStyle: noneditableRowColor,
        editable: editableBasedonCondition,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000'
        },
      },
      {
        headerName: 'Action Completed?',
        field: 'complete',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Remove from Selections',
        field: 'deleteSelectedVacancy',
        cellRenderer: 'deleteUserRenderer',
        width: 150,
        cellStyle: noneditableRowColor,
        cellRendererParams: {
          screenName: 'Selection',
          onClick: this.removeSelectionVacancy.bind(this),
        }
      }
    ];
  }
  removeSelectionVacancy(params) {
    if (this.editedData.length > 0) {
      this.onGoClickSelections();
    } else {
      const vacancyId = params.vacancyId;
      const announcementId = params.announcementId;
      const initialState = {
        buttonTitle: 'OK',
        message: `Removing a vacancy from the Selections template will
      clear its associated selections data. This will not remove it from
       the Hiring Plan. It can be added back to the Selections template via the “+” icon.`
      };
      this.deletePopupModal = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      this.deletePopupModal.content.event.subscribe((response: boolean) => {
        if (response === true) {
          this.busyTableSave = this.humanCapitalService.deleteSelectedVacancy(vacancyId, announcementId).subscribe(data => {
            if (data.success === true) {
              this.getSelectionsData();
            }
          });
          this.deletePopupModal.hide();
        } else {
        }
      });
    }
  }
  public getHmColDefs() {
    this.colDefs = [
      {
        headerName: 'Announcement ID',
        field: 'announcementDisplayId',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        cellRenderer: 'hyperlinkComponent',
        cellRendererParams: {
          year: this.year,
          office: this.officeName,
        },
      },
      {
        headerName: 'Office Priority',
        field: 'officePriority',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'CTP Priority',
        field: 'ctpPriority',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
      },
      {
        headerName: 'Hiring Mechanism',
        field: 'hiringMechanism',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
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
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Series',
        field: 'series',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'textFormat'
      },
      {
        headerName: 'Grade',
        field: 'grade',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false,
        cellClass: 'textFormat'
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
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      // {
      //   headerName: 'Recruit Package Submited to HR',
      //   field: 'recruitPackageSubmittedToHr',
      //   cellEditor: 'ddSmartList',
      //   cellRenderer: 'dropdownText',
      //   cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
      //   editable: false
      // },
      {
        headerName: 'Recruit Job Req #',
        field: 'recruitJobReqNbr',
        comparator: numberSort,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Submission Date',
        // headerName: 'Job Req Release Date',
        field: 'jobReqReleaseDate',
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Vacancy Opened',
        field: 'vacancyOpenDate',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
      },
      {
        headerName: 'Vacancy Closed',
        field: 'vacancyCloseDate',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
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
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Selectee Name(s)',
        field: 'selecteeNames',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false
      },
      {
        headerName: 'Selection Date',
        field: 'selectionDate',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
      },
      {
        headerName: 'Tentative Offer Date',
        field: 'tentativeOfferDate',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
      },
      {
        headerName: 'Final Offer Date',
        field: 'finalOfferDate',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
      },
      {
        headerName: 'EOD Date',
        field: 'eodDate',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
      },
      {
        headerName: 'No Selections Date',
        field: 'noSelectionDate',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
        cellClass: 'dateUS',
        valueFormatter: (params) => {
          if (params.value !== null && params.value !== '') {
            const date = new Date(params.value);
            return moment(date).format('MM/DD/YYYY');
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            if (params.value !== null && params.value !== '') {
              const date = new Date(params.value);
              return moment(date).format('MM/DD/YYYY');
            }
          },
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'right' },
        editable: false,
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
      }
    ];
  }

  onGoClickSelections() {
    if (this.gridApiSel) {
      this.gridApiSel.clearFocusedCell();
      setTimeout(() => {
        if (this.editedData.length > 0) {
          this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
          this.bsModalRef.content.okSave.subscribe((response) => {
            this.getSelectionsData();
            this.selectionsForm.markAsPristine();
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.selectionsService.getSearchDDVals();
            this.changeForm.controls.office.setValue(tempSearchDDVal.office);
            this.changeForm.controls.year.setValue(tempSearchDDVal.year);
          });
        } else {
          this.getSelectionsData();
        }
      }, 300);
    } else {
      this.getSelectionsData();
    }
  }

  onGridReadyforSelections(params) {
    this.gridOptions.onBodyScroll = () => {
      printSortStateToConsole(this.el);
    };
    this.gridApiSel = params.api;
    this.gridColumnApiSel = params.columnApi;
    const defaultSortModel = [
      {
        colId: 'selectionDate',
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
      {
        colId: 'hiringMechanism',
        sort: 'asc',
        sortIndex: 3,
      },
    ];
    params.columnApi.applyColumnState({ state: defaultSortModel });
  }

  onGridReady(params) {
    this.gridOptionsforHr.onBodyScroll = () => {
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
    // }
    // params.api.sizeColumnsToFit();
  }
  public filterChangeEventforSelection(event: any) {

    let sortModel = null;
    let colModel = null;
    let filterModel = null;
    let groupModel = null;
    this.customFilterNamesforSelections.forEach(element => {
      if (event === element.filterName) {
        this.viewsIdforSelection = element.userFilterId;
        sortModel = element.filterJson.sortState;
        colModel = element.filterJson.colState;
        filterModel = element.filterJson.filterState;
        groupModel = element.filterJson.groupState;

        this.gridApiSel.setSortModel(sortModel);
        this.gridColumnApiSel.setColumnState(colModel);
        this.gridApiSel.setFilterModel(filterModel);
        this.gridColumnApiSel.setColumnGroupState(groupModel);

      } else if (event === null) {
        this.gridApiSel.setSortModel(sortModel);
        this.gridApiSel.setFilterModel(filterModel);
        this.gridColumnApiSel.resetColumnState(colModel);
        this.gridColumnApiSel.resetColumnGroupState(groupModel);

      }
    });
    printSortStateToConsole(this.el);
    this.autoSizeColsforSel(false);
  }

  public openFilterDialogViewforSelection(form: FormGroup, screenObject: any) {

    const filterValue = form.get('selectionFilter').value;
    const filterGridValue = form.controls.selectionFilter.value;

    if (filterValue !== null) {
      const newfilterJson = {
        colState: this.gridColumnApiSel.getColumnState(),
        groupState: this.gridColumnApiSel.getColumnGroupState(),
        sortState: this.gridApiSel.getSortModel(),
        filterState: this.gridApiSel.getFilterModel()
      };

      const initialState = {
        title: 'Rename/Delete View',
        id: this.viewsIdforSelection,
        gridView: filterGridValue,
        filterList: this.customFilterNamesforSelections,
        updatedfilterList: newfilterJson
      };
      this.bsModalRef = this.modalService.show(FilterDailogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
      this.bsModalRef.content.delete.subscribe((response: string) => {
        // TODO read response
        this.deleteFilterViewforSelection();
        this.resetFilterViewDataforSelection(form);
        this.getCustomFilterNamesforSelection(screenObject);
      });
      this.bsModalRef.content.save.subscribe((updatedResponse: string) => {
        this.updateFilterViewforSelection(updatedResponse, screenObject);
        this.selectedFilterName = updatedResponse;
        setTimeout(() => {
          form.controls.selectionFilter.setValue(updatedResponse);
        }, 500);
      });

    } else {
      const initialState = {
        title: 'Save View',
        id: null,
        gridView: form.controls.selectionFilter.value,
        filterList: this.customFilterNamesforSelections
      };
      this.bsModalRef = this.modalService.show(FilterDailogComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
      this.bsModalRef.content.submitBtnName = 'Submit';
      this.bsModalRef.content.save.subscribe((receivedEntry) => {
        this.saveFilterViewforSelection(form, receivedEntry, screenObject);
      });
    }
    this.autoSizeColsforSel(false);
  }

  public saveFilterViewforSelection(form: FormGroup, filtername: string, screenObject: any) {
    const initialGridState = {
      filterName: filtername,
      filterJson: JSON.stringify({
        colState: this.gridColumnApiSel.getColumnState(),
        groupState: this.gridColumnApiSel.getColumnGroupState(),
        sortState: this.gridApiSel.getSortModel(),
        filterState: this.gridApiSel.getFilterModel()
      }),
      filterCategory: '',
      userId: localStorage.getItem('UserID'),
      screenName: screenObject.screenName
    };
    this.busyTableSave = this.humanCapitalService
      .postAcquisitionGridFilter(JSON.stringify(initialGridState))
      .subscribe(
        args => {
          console.log(args);
        },
        e => {
          this.stateSave = true;
          this.getCustomFilterNamesforSelection(screenObject);
          this.bsModalRef.hide();
          this.selectedFilterName = filtername;
          form.controls.selectionFilter.setValue(filtername);
          this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
        }
      );
  }

  public updateFilterViewforSelection(updatedResponse: string, screenObject: any) {
    const userId = localStorage.getItem('UserID');
    const model = new GridFilterModel();
    model.userId = Number(userId);
    model.userFilterId = this.viewsIdforSelection;
    model.screenName = screenObject.screenName;
    model.filterName = updatedResponse;
    const newfilterJson = JSON.stringify({
      colState: this.gridColumnApiSel.getColumnState(),
      groupState: this.gridColumnApiSel.getColumnGroupState(),
      sortState: this.gridApiSel.getSortModel(),
      filterState: this.gridApiSel.getFilterModel()
    });
    model.filterJson = newfilterJson;
    this.busyTableSave = this.humanCapitalService.updateAcquisitionGridFilter(model).subscribe(args => {
      this.getCustomFilterNamesforSelection(screenObject);
      this.bsModalRef.hide();
      this.toaster.pop('success', 'Updated', 'Updated view successfully');
    });
  }

  public deleteFilterViewforSelection() {

    const userId = localStorage.getItem('UserID');
    const model = new GridFilterModel();
    model.userId = Number(userId);
    model.userFilterId = this.viewsIdforSelection;
    this.busyTableSave = this.humanCapitalService.deleteViews(model).subscribe(args => {
      if (args.code === 'DELETED') {
        this.bsModalRef.hide();
        this.toaster.pop('success', 'Deleted', 'Deleted view successfully');
        this.selectedFilterName = '';
      }
    });
  }
  public resetFilterViewDataforSelection(form: FormGroup) {
    this.viewsIdforSelection = null;
    form.controls.selectionFilter.setValue(null);
    this.gridColumnApiSel.resetColumnState();
    this.gridColumnApiSel.resetColumnGroupState();
    this.gridApiSel.setSortModel(null);
    this.gridApiSel.setFilterModel(null);
    // added for multisort
    this.onGridReadyforSelections(this.gridOptions);
    this.onGridReady(this.gridOptionsforHr);
  }

}


