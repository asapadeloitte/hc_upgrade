import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import {
  CopyOverHrepsService,
} from 'src/app/modules/hiring-plan/components/copy-over-hreps-data-to-hiring-plan/copy-over-hreps-data-to-hiring-plan.service';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  StartDtValCellRenderrComponent,
  AppDropdownSmartList,
  CellRendererComponent,
  DropdownText,

} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';

import {
  accessibilityFix, columnVisibleAccessbility, printSortStateToConsole, onJobTitleChange, numberSort
} from '../../../../shared/utilities';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { sortAlphaNum } from 'src/app/shared/grid-utilities';
import { copyOverEHCMDataObject } from 'src/app/shared/models/reports.model';


@Component({
  selector: 'app-copy-ehcmdata-to-staffing-paln',
  templateUrl: './copy-ehcmdata-to-staffing-paln.component.html',
  styleUrls: ['./copy-ehcmdata-to-staffing-paln.component.scss']
})
export class CopyEHCMDataToStaffingPalnComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public copyOverEHCMForm: FormGroup;

  public copyOverTopForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
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
  public copyOverEHCMData: any = [];
  public originalData: string;
  public jobTitleMapping: any;
  public id;
  public orgLevelsBasedonOffice = [];
  public getData;
  public bsModalRef1: BsModalRef;
  public errorDetails: any = [];
  public copyOverEHCMDataObject1: copyOverEHCMDataObject[] = [];
  public displaycopyOverEHCMDataConditionBased = [];
  private screenObject = {
    screenName: 'Copy over EHCM to Staffing Plan'
  };
  public disprencyOptions = ['All Records', 'Records with Discrepancies'];
  public employees: any;
  public smartList: any;
  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    private _adminService: AdminService,
    private smartListService: SmartListConversionService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    public allStaffService: AllStaffService,
    public copyOverHrepsService: CopyOverHrepsService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.copyOverTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, Validators.required],
      search: [null],
      filter: [null],
      disperency: ['All Records'],
    });
  }

  ngOnInit() {
    this.loadSearchForm();
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
          this.copyOverEHCMForm.markAsDirty();
          const office = params.data.office;
          const orgLevel = params.data.orgLevel;
          const employee = params.data.employee;
          const employeeId = params.data.employeeId;
          if (params.colDef.field === 'jobTitle' || params.colDef.field === 'grade' || params.colDef.field === 'jobCode'
            || params.colDef.field === 'series' || params.colDef.field === 'payPlan' || params.colDef.field === 'fpl') {
            onJobTitleChange(params);
          }
          const baseAttributes = { office, orgLevel, employee, employeeId };
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
            this.copyOverEHCMForm.markAsDirty();
          } else {
            this.copyOverEHCMForm.markAsPristine();
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
  public loadBusyTable() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.officeList = args.officeOrgLevelMapping;
      this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
      this.humanCapitalService.getSmartList().subscribe(args => {
        this.smartList = args;
        this.smartListService.setDDVals(this.smartList);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListService.setTitleMapping(this.jobTitleMapping);
          }
        });
      });
      // this.loadSearchForm();
      this.loadGridOptions();
      this.roleList = this.authService.jwt_getRole();
      this.copyOverEHCMForm = this.fb.group({});
    });
  }

  public onOfficeChangeEvent(event: any) {
  }

  public onYearChangeEvent(event: any) {
  }

  public onFilterTextBoxChanged() {
    this.onGridSearch(this.copyOverTopForm.controls.search.value);
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
    this.resetFilterViewData(this.copyOverTopForm);
  }

  public openFilterDialog() {
    const screenObject = {
      screenName: 'Copy over EHCM to Staffing Plan',
    };
    this.openFilterDialogView(this.copyOverTopForm, screenObject);
  }

  public saveCopyOverEHCM() {
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
      const tempSearchDDVal = this.copyOverHrepsService.getSearchDDVals();
      this.copyOverTopForm.controls.office.setValue(tempSearchDDVal.office);
      this.copyOverTopForm.controls.year.setValue(tempSearchDDVal.year);
      this.busyTableSave =
        this.humanCapitalService.saveAllStaff(this.copyOverTopForm.controls.year.value, this.editedData).subscribe(data => {
          this.toaster.pop('success', 'Saved', 'Successfully saved the copy over EHCM data');
          this.getCopyOverEhcmData();
          this.editedData = [];
          this.copyOverEHCMForm.markAsPristine();
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
  onGoClickCopyHreps() {
    if (this.editedData.length > 0) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe((response) => {
        this.getCopyOverEhcmData();
        this.copyOverEHCMForm.markAsPristine();
      });
      this.bsModalRef.content.onCancel.subscribe((response) => {
        const tempSearchDDVal = this.copyOverHrepsService.getSearchDDVals();
        this.copyOverTopForm.controls.office.setValue(tempSearchDDVal.office);
        this.copyOverTopForm.controls.year.setValue(tempSearchDDVal.year);
      });
    } else {
      this.getCopyOverEhcmData();
    }
  }

  getCopyOverEhcmData() {
    this.showSearch = true;
    this.colDefs = [];
    this.copyOverEHCMDataObject1 = [];
    this.copyOverEHCMData = [];
    this.editedData = [];
    this.rowsSelected = false;
    this.copyOverTopForm.controls.filter.setValue(null);
    this.copyOverTopForm.controls.disperency.setValue(null);
    this.copyOverHrepsService.setSearchDDVals(this.copyOverTopForm.value);

    this.busyTableSave =
      this.humanCapitalService.getCopyOverEHCMData(
        this.copyOverTopForm.controls.office.value, this.copyOverTopForm.controls.year.value).subscribe(args => {
        if ((args != null) && (args.length > 0)) {
          this.modifyObject(args);
          this.getColDefs();
          let a = [];
          const smartListValues = this.smartListService.getDDVals();
          a = this.copyOverEHCMDataObject1;
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
          // const a_new = JSON.parse(JSON.stringify(a).replace(/null/g, '" "'));
          this.copyOverEHCMData = a;
          this.displaycopyOverEHCMDataConditionBased = this.copyOverEHCMData;
        }
      });

  }

  selectDiscrepencies(selectedValue: string) {
    if (selectedValue === 'Records with Discrepancies') {
      this.copyOverEHCMData = this.displaycopyOverEHCMDataConditionBased.filter(ele => ele.hasDiscrepency === true);
    } else {
      this.copyOverEHCMData = this.displaycopyOverEHCMDataConditionBased;
    }
  }
  modifyObject(args) {
    console.log('args', args);
    let copyOverEHCMDataObject2;
    args.forEach(ele => {
      copyOverEHCMDataObject2 = new copyOverEHCMDataObject();
      copyOverEHCMDataObject2.employee = ele.employee;
      copyOverEHCMDataObject2.orgLevel = ele.orgLevel;
      // copyOverEHCMDataObject2.employeeId = ele.employeeId;
      copyOverEHCMDataObject2.office = ele.office;
      copyOverEHCMDataObject2.orgLevelAlias = ele.orgLevelAlias;
      copyOverEHCMDataObject2.ehcmDeptId = ele.deptId.ehcmData;
      copyOverEHCMDataObject2.adminCode = ele.deptId.hcData;
      copyOverEHCMDataObject2.ehcmName = ele.name.ehcmData;
      copyOverEHCMDataObject2.fullName = ele.name.hcData;
      copyOverEHCMDataObject2.lastName = ele.lastName;
      copyOverEHCMDataObject2.firstName = ele.firstName;
      copyOverEHCMDataObject2.middleInitial = ele.middleInitial;
      copyOverEHCMDataObject2.ehcmId = ele.id.ehcmData;
      copyOverEHCMDataObject2.employeeId = ele.id.hcData;
      copyOverEHCMDataObject2.ehcmJobTitle = ele.jobTitle.ehcmData;
      copyOverEHCMDataObject2.jobTitle = ele.jobTitle.hcData;
      copyOverEHCMDataObject2.ehcmOccSeries = ele.series.ehcmData;
      copyOverEHCMDataObject2.series = ele.series.hcData;
      copyOverEHCMDataObject2.ehcmPayPlan = ele.payPlan.ehcmData;
      copyOverEHCMDataObject2.payPlan = ele.payPlan.hcData;
      copyOverEHCMDataObject2.ehcmGrade = ele.grade.ehcmData;
      copyOverEHCMDataObject2.grade = ele.grade.hcData;
      copyOverEHCMDataObject2.ehcmJobCode = ele.jobCode.ehcmData;
      copyOverEHCMDataObject2.jobCode = ele.jobCode.hcData;
      copyOverEHCMDataObject2.ehcmStep = ele.step.ehcmData;
      copyOverEHCMDataObject2.step = ele.step.hcData;
      copyOverEHCMDataObject2.ehcmFlsaStat = ele.flsaStat.ehcmData;
      copyOverEHCMDataObject2.flsa = ele.flsaStat.hcData;
      copyOverEHCMDataObject2.ehcmBargUnit = ele.bargainingUnit.ehcmData;
      copyOverEHCMDataObject2.bargainingUnit = ele.bargainingUnit.hcData;
      copyOverEHCMDataObject2.ehcmMgrLevel = ele.managerLevel.ehcmData;
      copyOverEHCMDataObject2.managerLevel = ele.managerLevel.hcData;

      copyOverEHCMDataObject2.ehcmMilStatus = ele.militaryStatus.ehcmData;
      copyOverEHCMDataObject2.veteran = ele.militaryStatus.hcData;
      copyOverEHCMDataObject2.ehcmLocation = ele.locationId.ehcmData;
      copyOverEHCMDataObject2.locationId = ele.locationId.hcData;
      copyOverEHCMDataObject2.ehcmLocationDescr = ele.locationDescription.ehcmData;
      copyOverEHCMDataObject2.remoteEmployeeLocation = ele.locationDescription.hcData;
      copyOverEHCMDataObject2.hasDiscrepency = ele.hasDiscrepency;

      copyOverEHCMDataObject2.isNameValid = ele.name.equal;
      copyOverEHCMDataObject2.isLocationDescriptionEqualValid = ele.locationDescription.equal;
      copyOverEHCMDataObject2.isJobTitleValid = ele.jobTitle.equal;
      copyOverEHCMDataObject2.isSeriesValid = ele.series.equal;
      copyOverEHCMDataObject2.isPayPlanValid = ele.payPlan.equal;
      copyOverEHCMDataObject2.isGradeValid = ele.grade.equal;
      copyOverEHCMDataObject2.isJobCodeValid = ele.jobCode.equal;
      copyOverEHCMDataObject2.isStepValid = ele.step.equal;
      copyOverEHCMDataObject2.isFlsaValid = ele.flsaStat.equal;
      copyOverEHCMDataObject2.isLocationIdValid = ele.locationId.equal;
      copyOverEHCMDataObject2.isLocationDescriptionValid = ele.locationDescription.equal;
      copyOverEHCMDataObject2.isBargainingUnitValid = ele.bargainingUnit.equal;
      copyOverEHCMDataObject2.isMgrLevelValid = ele.managerLevel.equal;
      copyOverEHCMDataObject2.isVeteranValid = ele.militaryStatus.equal;
      this.copyOverEHCMDataObject1.push(copyOverEHCMDataObject2);

    });




  }
  ngOnDestroy() {
    if (this.busyTableSave) {
      this.busyTableSave.unsubscribe();
    }
  }
  reloadClassfication(reload: boolean) {
    if (reload) {
      this.getCopyOverEhcmData();
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

  getCellStyle(params) {
    if (params.data.isNameValid === false) {
      return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
    } else {
      return { 'text-align': 'left' };
    }
  }
  getColDefs() {
    this.colDefs = [
      {
        headerName: 'Office',
        field: 'office',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Organizational Level',
        field: 'orgLevelAlias',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Dept ID',
        field: 'ehcmDeptId',
        //  valueGetter: 'data.deptId.ehcmData',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Admin Code',
        field: 'adminCode',
        //   valueGetter: 'data.deptId.hcData',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'EHCM_Name',
        field: 'ehcmName',
        //  valueGetter: 'data.name.ehcmData',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Full Name',
        field: 'fullName',
        //  valueGetter: 'data.name.hcData',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }

      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        editable: true,
        cellStyle: this.getCellStyle.bind(this),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isNameValid === false;
          },
        },
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        editable: true,
        cellStyle: this.getCellStyle.bind(this),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isNameValid === false;
          },
        },
      },
      {
        headerName: 'Middle Initial',
        field: 'middleInitial',
        editable: true,
        cellStyle: this.getCellStyle.bind(this),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isNameValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_ID',
        field: 'ehcmId',
        //   valueGetter: 'data.id.ehcmData',
        cellStyle: { backgroundColor: '#E6E6E6' },
      },
      {
        headerName: 'Employee ID',
        field: 'employeeId',
        cellClass: 'textFormat',
        //   valueGetter: 'data.id.hcData',
        comparator: sortAlphaNum,
        cellStyle: { backgroundColor: '#E6E6E6' },
      },
      {
        headerName: 'EHCM_Job Title',
        field: 'ehcmJobTitle',

        // valueGetter: 'data.jobTitle.ehcmData',
        cellStyle: { backgroundColor: '#E6E6E6' }
      },
      {
        headerName: 'Job Title',
        field: 'jobTitle',
        //  valueGetter: 'data.jobTitle.hcData',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        // cellStyle: { 'text-align': 'left' }
        cellStyle: (params => {
          if (params.data.isJobTitleValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isJobTitleValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Series',
        field: 'ehcmOccSeries',
        // valueGetter: 'data.series.ehcmData',
        cellClass: 'textFormat',
        cellRenderer: 'dropdownText',
        cellStyle: { backgroundColor: '#E6E6E6' }
      },
      {
        headerName: 'Series',
        field: 'series',
        editable: true,
        cellClass: 'textFormat',
        //  valueGetter:'data.series.hcData',
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isSeriesValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isSeriesValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Pay Plan',
        field: 'ehcmPayPlan',
        //  valueGetter: 'data.payPlan.ehcmData',
        cellStyle: { backgroundColor: '#E6E6E6' }
      },
      {
        headerName: 'Pay Plan',
        field: 'payPlan',
        //  valueGetter: 'data.payPlan.hcData',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isPayPlanValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isPayPlanValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Grade',
        field: 'ehcmGrade',
        cellClass: 'textFormat',
        cellRenderer: 'dropdownText',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6' },
      },
      {
        headerName: 'Grade',
        field: 'grade',
        editable: true,
        cellClass: 'textFormat',
        comparator: numberSort,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isGradeValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isGradeValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Job Code',
        field: 'ehcmJobCode',
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6' }
      },
      {
        headerName: 'Job Code',
        cellClass: 'textFormat',
        field: 'jobCode',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isJobCodeValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isJobCodeValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Step',
        field: 'ehcmStep',
        cellStyle: { backgroundColor: '#E6E6E6' },
      },
      {
        headerName: 'Step',
        field: 'step',
        comparator: numberSort,
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isStepValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isStepValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_FLSA Stat',
        field: 'ehcmFlsaStat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'FLSA',
        field: 'flsa',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isFlsaValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isFlsaValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Bargaining Unit',
        field: 'ehcmBargUnit',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Bargaining Unit',
        field: 'bargainingUnit',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isBargainingUnitValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isBargainingUnitValid === false;
          },
        },
      },

      {
        headerName: 'EHCM_Manager Level',
        field: 'ehcmMgrLevel',
        cellStyle: { backgroundColor: '#E6E6E6' }
      },
      {
        headerName: 'Manager Level',
        field: 'managerLevel',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isMgrLevelValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isMgrLevelValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Military Status',
        field: 'ehcmMilStatus',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Veteran',
        field: 'veteran',
        editable: true,
        cellEditor: 'ddSmartList',
        cellRenderer: 'dropdownText',
        cellStyle: (params => {
          if (params.data.isVeteranValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isVeteranValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Location ID',
        field: 'ehcmLocation',
        editable: false,
        cellClass: 'textFormat',
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
      },
      {
        headerName: 'Location ID',
        field: 'locationId',
        editable: true,
        cellClass: 'textFormat',

        cellStyle: (params => {
          if (params.data.isLocationIdValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            return params.data.isLocationIdValid === false;
          },
        },
      },
      {
        headerName: 'EHCM_Location Description',
        field: 'ehcmLocationDescr',
        editable: false,
        cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' }
      },
      {
        headerName: 'Remote Employee Location(City,State)',
        field: 'remoteEmployeeLocation',
        editable: true,
        cellStyle: (params => {
          if (params.data.isLocationDescriptionValid === false) {
            return { backgroundColor: '#FDE0E0', 'text-align': 'left' };
          } else {
            return { 'text-align': 'left' };
          }
        }),
        cellClassRules: {
          EHCMDiscripencyColor: (params) => {
            console.log(params.data);
            return params.data.isLocationDescriptionValid === false;
          },
        },
      },
    ];
  }
}
