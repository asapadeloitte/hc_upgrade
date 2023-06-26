import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  StartDtValCellRenderrComponent, AppDropdownSmartList, CellRendererComponent, CurrencyEditorComponent,
  DropdownText, DatePicker, AppSmDdValcellRendererComponent
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { Classfication } from 'src/app/shared/models/hiring-plan.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import {
  accessibilityFix, columnVisibleAccessbility, numberSort, onJobTitleChange, printSortStateToConsole
} from '../../../../shared/utilities';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { ClassficationService } from './classfication.service';
import * as moment from 'moment';
import { dateValueFormatter, changeYearDropDownVales } from 'src/app/shared/grid-utilities';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import {
  DetailTemPromotionLogService
} from 'src/app/modules/reports/components/detail-temporary-promotion-log/detail-tem-promotion-log.service';


@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: ['./classifications.component.scss']
})
export class ClassificationsComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public classficationForm: FormGroup;

  public classificationTopForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
  public officeName: any;
  public year: any;
  public showSearch = false;
  public staffingPlanList = [];
  public frameworkComponents;
  private defaultColDef: ColDef;
  public colDefs = [];
  public gridOptions: GridOptions;
  public statusBar;
  public acquisitionType: any;
  public version: any;
  public editedData: any = [];
  public classficationRowsData = [];
  public originalData: string;
  public jobTitleMapping: any;
  public id;
  public orgLevelsBasedonOffice = [];
  public getData;
  public disableAddClassification = false;
  public addClassification = true;
  public bsModalRef1: BsModalRef;
  public errorDetails: any = [];
  public validClassificationRow = true;
  private screenObject = {
    screenName: 'Classification View'
  };
  public employees: any;
  public smartList: any;
  public currentYear: string;
  public pOrder: boolean = false;
  public priorityId;
  public classificationDataLength: number;

  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private _adminService: AdminService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    private classficationservice: ClassficationService,
    toaster: ToasterService,
    modalService: BsModalService,
    public allStaffService: AllStaffService,
    private detailTemPromotionLogService: DetailTemPromotionLogService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.classificationTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
    });
  }

  ngOnInit() {
    this.roleList = this.authService.jwt_getRole();
    this.loadBusyTable();
  }

  public loadSearchForm() {
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
      deleteUserRenderer: DeleteUserCellRendererComponent,
      smDdValcellRenderer: AppSmDdValcellRendererComponent,
      currencyEditor: CurrencyEditorComponent,
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
      // on cell values changed to get the rows based on unique id
      onCellValueChanged: params => {
        if (params.oldValue !== params.newValue && params.newValue !== undefined) {
          const dateList = this.smartListService.getDateFieldList();
          const dateField = dateList.findIndex(e => e === params.colDef.field);
          if (dateField >= 0) {
            const updatedItemIndex =
              this.classficationRowsData.findIndex(f => f.id === params.data.id && f[params.colDef.field] === params.newValue);
            this.classficationRowsData[updatedItemIndex][params.colDef.field] =
              this.classficationRowsData[updatedItemIndex][params.colDef.field] !== null &&
                this.classficationRowsData[updatedItemIndex][params.colDef.field] !== '' &&
                this.classficationRowsData[updatedItemIndex][params.colDef.field] !== undefined ?
                new Date(this.classficationRowsData[updatedItemIndex][params.colDef.field]).toISOString() :
                this.classficationRowsData[updatedItemIndex][params.colDef.field];
          }
          if (params.colDef.field === 'jobTitle' || params.colDef.field === 'grade' || params.colDef.field === 'jobCode'
            || params.colDef.field === 'series' || params.colDef.field === 'payPlan' || params.colDef.field === 'fpl') {
            onJobTitleChange(params);
          }
          this.classficationForm.markAsDirty();
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const year = params.data.year;
          const id = params.data.id;
          if (params.colDef.field === 'office') {
            this.colDefs.forEach(col => {
              if (col.field === 'officePriority') {
                col.editable = false;
                col.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'right' };
              }
            });
          }
          if (params.colDef.field === 'office' || params.colDef.field === 'orgLevelAlias') {
            params.data.rowDataValid = (params.data.office && params.data.orgLevelAlias) ? true : false;
          }
          const values = this.classficationRowsData.filter(e => e.rowDataValid === false);
          this.validClassificationRow = values.length > 0 ? false : true;
          const baseAttributes = { office, orgLevel, year, id };
          this.gridOptions.api.setColumnDefs(this.colDefs);
          const originalRow = JSON.parse(this.originalData).find(f => f.id === params.data.id);
          const updatedRow = params.data;
          const updatedAttributes = this.getJSONdifference(originalRow, updatedRow);

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
          if (params.colDef.field === 'ctpPriority' || params.colDef.field === 'officePriority') {
            this.priorityId = params.data.id;
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
                this.getClassfication();
              });
            } else {
              this.priorityReorder(params.colDef.field, params);
              this.pOrder = true;
              this.saveClassification();
            }
          } else {
            this.pOrder = false;
          }
          if (this.editedData.length > 0) {
            this.classficationForm.markAsDirty();
          } else {
            this.classficationForm.markAsPristine();
          }

          // Bring back focus and redraw the updated row with new data
          // let refreshParams;
          // this.colDefs.forEach(function (col, index) {
          //   refreshParams = {
          //     columns: [col],
          //   };
          // });
          // const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
          this.gridApi.redrawRows();
          // this.gridApi.refreshCells(refreshParams)
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

  priorityReorder(colDef, params) {
    if (colDef) {
      const originalCTP = JSON.parse(this.originalData).find(f => f.id === params.data.id);
      if (originalCTP) {
        // changed the code for empty column can allow previous values too
        if (!Number(originalCTP[colDef]) && params.newValue !== '') {
          JSON.parse(this.originalData).forEach(classification => {
            if (((Number(classification[colDef]) > Number(params.newValue)))
              || classification[colDef] === params.newValue) {
              this.classficationRowsData.find(e => e.id === classification.id)[colDef]
                = Number(classification[colDef]) + 1;
              const id = classification.id;
              const office = classification.office;
              const orgLevel = classification.orgLevel;
              const year = classification.year;
              const baseAttributes = { id, office, orgLevel, year };
              const updatedAttributes =
                this.getJSONdifference(classification, this.classficationRowsData.find(e => e.id === classification.id));
              if (JSON.stringify(updatedAttributes) !== '{}') {
                const payload = { ...baseAttributes, ...updatedAttributes };
                this.editedData.push(payload);
              }
            }
          });
        } else {
          if (Number(originalCTP[colDef]) < Number(params.newValue) && params.newValue !== '') {
            JSON.parse(this.originalData).forEach(classification => {
              if (((Number(classification[colDef]) > Number(originalCTP[colDef]))
                && Number((classification[colDef]) < Number(params.newValue)))
                || Number(classification[colDef]) === Number(params.newValue)) {
                this.classficationRowsData.find(e => e.id === classification.id)[colDef] = Number(classification[colDef]) - 1;
                const id = classification.id;
                const office = classification.office;
                const orgLevel = classification.orgLevel;
                const year = classification.year;
                const baseAttributes = { id, office, orgLevel, year };
                const updatedAttributes =
                  this.getJSONdifference(classification, this.classficationRowsData.find(e => e.id === classification.id));
                if (JSON.stringify(updatedAttributes) !== '{}') {
                  const payload = { ...baseAttributes, ...updatedAttributes };
                  this.editedData.push(payload);
                }
                // announcement[colDef] = announcement[colDef] - 1;
              }
            });
          }
          if (params.newValue === '') {
            JSON.parse(this.originalData).forEach(classification => {
              if (Number(classification[colDef]) > Number(originalCTP[colDef])) {
                this.classficationRowsData.find(e => e.id === classification.id)[colDef] =
                  Number(classification[colDef]) - 1;
                const id = classification.id;
                const office = classification.office;
                const orgLevel = classification.orgLevel;
                const year = classification.year;
                const baseAttributes = { id, office, orgLevel, year };
                const updatedAttributes =
                  this.getJSONdifference(classification, this.classficationRowsData.find(e => e.id === classification.id));
                if (JSON.stringify(updatedAttributes) !== '{}') {
                  const payload = { ...baseAttributes, ...updatedAttributes };
                  this.editedData.push(payload);
                }
              }
            });
          }
          if (Number(originalCTP[colDef]) > Number(params.newValue) && params.newValue !== '') {
            JSON.parse(this.originalData).forEach(classification => {
              if (((Number(classification[colDef]) > Number(params.newValue))
                && (Number(classification[colDef]) < Number(originalCTP[colDef]))
                || (classification[colDef] === params.newValue))) {
                this.classficationRowsData.forEach(e => {
                  if (e.id === classification.id) {
                    e[colDef] = +classification[colDef] + 1;
                    const id = classification.id;
                    const office = classification.office;
                    const orgLevel = classification.orgLevel;
                    const year = classification.year;
                    const baseAttributes = { id, office, orgLevel, year };
                    const updatedAttributes =
                      this.getJSONdifference(classification, e);
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
    this.loadSearchForm();
    this.loadGridOptions();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.yearsList = changeYearDropDownVales(this.yearsList);
      this.officeList = args.officeOrgLevelMapping;
      this.currentYear = args.currentYear;
      this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeList, '');
      if (this.roleList === 'admin' || this.roleList === 'CTPHC_SRT_Analyst_User') {
        this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      }
      this.humanCapitalService.getSmartList().subscribe(args => {
        const temp = this.classficationservice.getAdditionalSmartLists();
        const tempOffice = this.detailTemPromotionLogService.getAdditionalSmartLists();
        const tempOrgLevels = this.detailTemPromotionLogService.getOrgLevelSmartLists();
        this.smartList = args;
        temp.forEach(element => {
          this.smartList.push(element);
        });
        this.smartList.push(tempOffice);
        this.smartList.push(tempOrgLevels);
        this.smartListService.setDDVals(this.smartList);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListService.setTitleMapping(this.jobTitleMapping);
          }
        });
      });
      this.classficationForm = this.fb.group({});
    });
  }

  public onYearChangeEvent(event: any) {
    // this.year = this.classificationTopForm.controls.year.value;
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.classificationTopForm.controls.search.value);
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
    this.resetFilterViewData(this.classificationTopForm);
  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'Classification View',
    };
    this.openFilterDialogView(this.classificationTopForm, screenObject);
  }

  public isColumnEditable(params) {
    if (params.colDef.field === 'ctpPriority' && this.officeName === 'All Offices') {
      if (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin') {
        return true;
      }
    }
    if (params.colDef.field === 'officePriority' && this.officeName !== 'All Offices') {
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
    return false;
  }
  getCellStyle(params) {
    if (params.colDef.field === 'ctpPriority' && this.officeName === 'All Offices' &&
      (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin')) {
      return { 'text-align': 'right' };
    } else if (params.colDef.field === 'officePriority' && this.officeName !== 'All Offices'
      && (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin' ||
        this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst')
        || this.roleList.includes('HOA_Analyst_QHP_Analyst'))) {
      return { 'text-align': 'right' };
    } else if (params.colDef.field === 'recruitJobReqNbr') {
      if (this.roleList === 'CTPHC_SRT_Analyst_User' || this.roleList === 'admin') {
        return { 'text-align': 'right' };
      }
    } else {
      return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
    }
  }
  /* to check the validaity for CTP Priority and Office Priority columns*/
  checkforPriorityValidity(editedValues) {
    let showError = false;
    editedValues.forEach(element => {
      const ctpPriority = Number(element.ctpPriority);
      const officePriority = Number(element.officePriority);
      if (element.id === this.priorityId) {
        if (this.officeName === 'All Offices') {
          if (element.ctpPriority === undefined || element.ctpPriority === '') {
            showError = false;
          } else if (ctpPriority === 0 ||
            ctpPriority > this.classificationDataLength) {
            showError = true;
          }
        } else {
          if (element.officePriority === undefined || element.officePriority === '') {
            showError = false;
          } else if (officePriority === 0 ||
            officePriority > this.classificationDataLength) {
            showError = true;
          }
        }
      }
    });
    return showError;
  }
  public saveClassification() {
    this.gridApi.clearFocusedCell();
    setTimeout(() => {
      if (this.editedData.length > 0) {
        const smartListGlobal = this.smartListService.getDDVals();
        const dateList = this.smartListService.getDateFieldList();
        this.editedData.forEach(obj => {
          if (obj.orgLevelAlias) {
            const smartListObject = smartListGlobal.find(element => element.smartListName === 'orgLevel');
            if (smartListObject) {
              const tempOrg = smartListObject.smartListValues.find(e => e.orgLevelAlias === obj.orgLevelAlias);
              if (tempOrg) {
                obj.orgLevel = tempOrg.orgLevel;
              }
            }
          }
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
        const tempSearchDDVal = this.classficationservice.getSearchDDVals();
        this.classificationTopForm.controls.office.setValue(tempSearchDDVal.office);
        this.classificationTopForm.controls.year.setValue(tempSearchDDVal.year);
        this.busyTableSave =
          this.humanCapitalService.saveClassifications(this.classificationTopForm.controls.year.value, this.editedData).subscribe(data => {
            if (!this.pOrder) {
              this.toaster.pop('success', 'Saved', 'Successfully saved classifications');
            }
            this.getClassfication();
            this.editedData = [];
            this.classficationForm.markAsPristine();
          }, error => {
            // error.error.errorDetails.forEach(element => {
            //   this.errorDetails.push(element.message);
            // });
            this.toaster.pop('error', 'Failed', this.errorDetails);
          });
      } else {
        this.toaster.pop('success', 'Saved', 'Successfully saved the grid view');
      }
    }, 200);
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

  public openSubmitDialog() {
    // TO-DO
  }
  onGoClickClassification() {
    if (this.gridApi) {
      this.gridApi.clearFocusedCell();
      setTimeout(() => {
        if (this.editedData.length > 0) {
          this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
          this.bsModalRef.content.okSave.subscribe((response) => {
            this.getClassfication();
            this.classficationForm.markAsPristine();
          });
          this.bsModalRef.content.onCancel.subscribe((response) => {
            const tempSearchDDVal = this.classficationservice.getSearchDDVals();
            this.classificationTopForm.controls.office.setValue(tempSearchDDVal.office);
            this.classificationTopForm.controls.year.setValue(tempSearchDDVal.year);
          });
        } else {
          this.getClassfication();
        }
      }, 300);
    } else {
      this.getClassfication();
    }
  }
  getClassfication() {
    this.officeName = this.classificationTopForm.controls.office.value;
    this.year = this.classificationTopForm.controls.year.value;
    this.showSearch = true;
    this.colDefs = [];
    this.classficationRowsData = [];
    this.editedData = [];
    this.rowsSelected = false;
    this.classificationTopForm.controls.filter.setValue(null);
    this.classficationservice.setSearchDDVals(this.classificationTopForm.value);
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      this.officeName,
      'Employee',
      this.currentYear).subscribe(args => {
        this.employees = args;
        this.allStaffService.setEmployees(this.employees);
      });
    // get method the Classification
    this.busyTableSave =
      this.humanCapitalService.getClassifications(
        this.officeName, this.year).subscribe(args => {
          if ((args != null) && (args.length > 0)) {
            this.getColDefs();
            this.roleList = this.authService.jwt_getRole();
            if (this.roleList !== 'CTPHC_SRT_Analyst_User' && this.roleList !== 'admin') {
              this.colDefs.forEach(col => {
                if (col.headerName === 'CTP Priority') {
                  this.colDefs = this.colDefs.filter(el => el.field !== 'ctpPriority');
                  this.gridOptions.api.setColumnDefs(this.colDefs);
                }
              });
            }
            if (this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst')) {
              this.colDefs.forEach(col => {

                if (col.field === 'officePriority') {
                  col.editable = true;
                  col.cellStyle = { 'text-align': 'left' };
                } else {
                  col.editable = false;
                  col.cellStyle = { backgroundColor: '#E6E6E6', 'text-align': 'left' };
                }
                if (col.field === 'deleteClassification' || col.field === 'classificationJobReq') {
                  this.colDefs = this.colDefs.filter(el => el.field !== 'deleteClassification');
                  this.colDefs = this.colDefs.filter(el => el.field !== 'classificationJobReq');
                  this.gridOptions.api.setColumnDefs(this.colDefs);
                }
              });
            }
            let a = [];
            const smartListValues = this.smartListService.getDDVals();
            const dateList = this.smartListService.getDateFieldList();
            a = args;
            a.forEach(el => {
              el['rowDataValid'] = (el.orgLevelAlias === undefined || el.orgLevelAlias === null || el.orgLevelAlias === '' || el.office === undefined || el.office === null || el.office === '') ? false : true;
              Object.keys(el).forEach(key => {
                if (smartListValues) {
                  const tempVal = smartListValues.find(f => f.smartListName === key && key !== 'status');
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

            this.classificationDataLength = args.length;
            // this.classficationRowsData = a;
            if (this.officeName === 'All Offices') {
              const nullItems = a.filter(e => e.ctpPriority !== null);
              this.classficationRowsData =
                [...nullItems.sort((a, b) => +a.ctpPriority > +b.ctpPriority ? 1 : -1), ...a.filter(y => y.ctpPriority === null)];
            } else {
              const nullItems = a.filter(f => f.officePriority !== null);
              this.classficationRowsData =
                [...nullItems.sort((a, b) => +a.officePriority > +b.officePriority ? 1 : -1), ...a.filter(y => y.officePriority === null)];
            }
            const values = this.classficationRowsData.filter(e => e.rowDataValid === false);
            this.validClassificationRow = values.length > 0 ? false : true;
            // disable the add classification button
            if (this.officeName === 'All Offices' || this.roleList.includes('Hiring_Office_Analyst') ||
              this.roleList.includes('HOA_Analyst_QHP_Analyst')) {
              this.disableAddClassification = true;
            } else {
              this.disableAddClassification = false;
            }
            this.officeList.forEach(element => {
              if (element.office === this.officeName) {
                this.orgLevelsBasedonOffice = element.orgLevels;
              }
            });
          }
        });

  }
  public onOfficeChangeEvent(event: any) {
    // this.officeName = this.classificationTopForm.controls.office.value;
  }

  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  reloadClassfication(reload: boolean) {
    if (reload) {
      const tempSearchDDVal = this.classficationservice.getSearchDDVals();
      this.classificationTopForm.controls.office.setValue(tempSearchDDVal.office);
      this.classificationTopForm.controls.year.setValue(tempSearchDDVal.year);
      this.getClassfication();
    }
  }

  classificationDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'Classification Deleted', 'Classification Deleted Successfully');
    }
  }
  deleteClassification(params: number) {
    if (this.editedData.length > 0) {
      this.onGoClickClassification();
    }
    this.id = params;
  }
  //  column defination

  public getColDefs() {

    this.colDefs = [
      {
        headerName: 'CTP Priority',
        field: 'ctpPriority',
        cellEditor: 'currencyEditor',
        comparator: numberSort,
        cellStyle: this.getCellStyle.bind(this),
        editable: this.isColumnEditable.bind(this)
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
        headerName: 'Office',
        field: 'office',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'smDdValcellRenderer',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'smDdValcellRenderer',
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
        headerName: 'Pay Plan',
        field: 'payPlan',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Series',
        field: 'series',
        cellStyle: { 'text-align': 'right' },
        editable: true,
        cellClass: 'textFormat'
      },
      {
        headerName: 'Grade',
        field: 'grade',
        comparator: numberSort,
        cellStyle: { 'text-align': 'right' },
        editable: true,
        cellClass: 'textFormat'
      },
      {
        headerName: 'Reason For Action',
        field: 'reasonForAction',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Classification Package Submitted to HR',
        field: 'classPkgsubmittedToHr',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        editable: true,
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Classification Job Req #',
        field: 'classificationJobReq',
        cellStyle: { 'text-align': 'right' },
        editable: true,
        cellClass: 'textFormat'
      },
      {
        headerName: 'Date PD Classified',
        field: 'pdClassifiedDt',
        cellClass: 'dateUS',
        cellEditor: DatePicker,
        editable: true,
        valueFormatter: dateValueFormatter,
        filterParams: {
          valueFormatter: dateValueFormatter
        },
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'HC Liaison',
        field: 'hcLiaison',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Hiring Manager',
        field: 'hiringManager',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: { 'text-align': 'left' }
      },
      {
        headerName: 'Status',
        field: 'status',
        cellStyle: { 'text-align': 'left' },
        editable: true,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorParams: {
          maxLength: '4000'
        }
      },
      {
        headerName: 'Action Completed?',
        field: 'complete',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
        editable: false
      },
      {
        headerName: 'Delete Classification',
        field: 'deleteClassification',
        cellRenderer: 'deleteUserRenderer',
        maxWidth: 150,
        cellRendererParams: {
          screenName: 'classification',
          onClick: this.deleteClassification.bind(this),
        }
      }

    ];
  }

}
