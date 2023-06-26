import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import {
  AddRecruitmentLogisticsComponent,
} from 'src/app/shared/components/add-recruitment-logistics/add-recruitment-logistics.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import {
  SaveConfirmationDialogComponent,
} from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { FieldMapping } from 'src/app/shared/models/user.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import {
  checkPayPeriodEffectiveDates, checkPayPeriodNteDates, jobTitleMapping, triggerValidations, trimObject
} from 'src/app/shared/utilities';

import { SmartListConversionService } from '../../../../shared/services/smartListConversion.service';
import { FormValues } from '../edit-member-vacancy-one-staff/one-staff.enum';
import { OneStaffService } from '../edit-member-vacancy-one-staff/one-staff.service';
import {
  DetailTemPromotionLogService
} from 'src/app/modules/reports/components/detail-temporary-promotion-log/detail-tem-promotion-log.service';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import * as moment from 'moment';
import { departureDataCheck, processReassignmentDataCheck, disabledVacancyDDOptions } from 'src/app/shared/grid-utilities';


@Component({
  selector: 'app-empvac-hyperlink',
  templateUrl: './empvac-hyperlink.component.html',
  styleUrls: ['./empvac-hyperlink.component.scss']
})
export class EmpvacHyperlinkComponent implements OnInit {
  @Input() screenName;
  @Input() displayName;
  public officeOrgList = [];
  public yearsList = [];
  public orgList = [];
  public positionTypeList = [];
  public empVacList = [];
  public oneEmpVac = [];
  public smartListData = [];
  public tabs: any = [];
  @Input() year;
  @Input() office;
  public isdisableprocesstab = false;
  public validPayPeriodDates: any = [];


  @ComponentForm(true)
  public lintStaffForm: FormGroup;
  @Input() vacancyFormData;
  public selectedTab = 0;
  public selectedTabName;
  public busyTableSave: Subscription;
  public tabControls = [];
  public cancelClicked = false;
  @Input() orgLevel;
  @Input() employeeId;
  @Input() employees;
  public acquisitionModel;
  public formFields: any[] = [];
  public saveSuccess = false;
  @Output() closeEmit = new EventEmitter();
  public editedData;
  public jobTitleMapping: FieldMapping[];
  employeeData: string;
  vacancyDisplay = [];
  public showRecruitmentLogisticButton = true;
  public processDepartureScreen = true;
  public currentYear;
  public departurebsModalRef: BsModalRef;
  private disableDepartureLog = true;
  private disableReassignClearButton = true;
  private isEditStaffDataSave = false;
  private isEditStafflatestData;


  public formValid: boolean;
  constructor(
    public bsModalRef: BsModalRef,
    public bsModalUnsavedRef: BsModalRef,
    public saveConfirmationModalRef: BsModalRef,
    public unSavedDataBsModelRef: BsModalRef,
    public toaster: ToasterService,
    private modalService: BsModalService,
    private smartListService: SmartListConversionService,
    private _fb: FormBuilder,
    private oneStaffService: OneStaffService,
    private humanCapitalService: HumanCapitalService,
    private _adminService: AdminService,
    private detailTemPromotionLogService: DetailTemPromotionLogService,
  ) {
    this.tabs = FormValues.getTabs;
  }

  ngOnInit() {
    this.humanCapitalService.getPayPeriodDatesList().subscribe(args => {
      this.validPayPeriodDates = args;
    });
    this.busyTableSave = this._adminService.getFieldMappings().subscribe(data => {
      if (data) {
        const vacancyFormDataArray = [];
        vacancyFormDataArray.push(this.vacancyFormData);
        this.disableReassignClearButton = processReassignmentDataCheck(vacancyFormDataArray);
        // TO Check the departure data avaialble or not
        this.disableDepartureLog = departureDataCheck(vacancyFormDataArray);
        // public disableReassignClearButton = true;

        this.jobTitleMapping = data;
        this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeOrgList, this.jobTitleMapping);
        //  this.smartListData = this.smartListService.getDDVals();
        this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
          this.officeOrgList = args.officeOrgLevelMapping;
          this.yearsList = args.years;
          this.currentYear = args.currentYear;
          this.positionTypeList = args.positionTypes;
          this.smartListData = this.smartListService.getDDVals();
          this.smartListData.find(e => e.smartListName === 'grade').smartListValues.sort((a, b) => (+a.value > +b.value ? -1 : 1));
          const tempOrgLevels = this.detailTemPromotionLogService.getOrgLevelSmartLists();
          const tempFplSmartList = this.detailTemPromotionLogService.getFplSmartLists();
          this.smartListData.push(tempOrgLevels);
          this.smartListData.push(tempFplSmartList);
          if (this.smartListData) {
            this.tabs.forEach(element => {
              if (element.formControls) {
                element.formControls.forEach(formControl => {
                  if (formControl.type === 'dropdown') {
                    if (formControl.name !== 'reassignmentOffice' || formControl.name !== 'reassignmentOrgLevel'
                      || formControl.name !== 'ctpDetailOffice'
                      || formControl.name !== 'newOffice' || formControl.name !== 'newYear') {
                      const dropdownOptions = this.smartListData.find(f => f.smartListName === formControl.smartListName);
                      formControl.options = dropdownOptions ? dropdownOptions.smartListValues : [];
                      if (formControl.smartListName === 'jobTitle') {
                        formControl.options = formControl.options.filter(x => this.jobTitleMapping.some(y => y.jobTitle.includes(x.value)));
                        // sorting for jobTitle
                        formControl.options = trimObject(formControl.options);
                        formControl.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                      }
                      if (formControl.smartListName === 'jobCode') {
                        formControl.options = this.jobTitleMapping.map(x => ({
                          id: x.jobCode,
                          smartListName: 'jobCode',
                          value: x.jobCode
                        }));
                      }
                    }
                    if (formControl.name === 'reassignmentOffice'
                      || formControl.name === 'ctpDetailOffice'
                      || formControl.name === 'newOffice') {
                      formControl.options = this.officeOrgList.map(x => ({
                        id: x.office,
                        smartListName: x.office,
                        value: x.office
                      }));
                    }
                    // fix for onload clear the values in reassignmentOrgLevel
                    if (formControl.name === 'reassignmentOrgLevel') {
                      const dropdownOptions = this.smartListData.find(f => f.smartListName === 'orgLevel');
                      formControl.options = dropdownOptions.smartListValues.map(x => ({
                        id: x.orgLevel,
                        smartListName: 'orgLevel',
                        value: x.orgLevelAlias
                      }));
                    }
                    if (formControl.name === 'newYear') {
                      formControl.options = this.yearsList.map(x => ({
                        id: x,
                        smartListName: x,
                        value: x
                      }));
                      formControl.options.forEach(option => {
                        if (option.value === this.year) {
                          option.disabled = true;
                        }
                      });
                    }
                    if (formControl.name === 'currentSupervisor') {
                      formControl.options = this.employees.filter(emp => emp.supervisor).map(x => ({
                        id: x.id,
                        smartListName: x.office,
                        value: x.fullName
                      }));
                      // sorting for current supervisior name
                      formControl.options = trimObject(formControl.options);
                      formControl.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                    }
                    if (formControl.name === 'actingCtpStaffName') {
                      formControl.options = this.employees.map(x => ({
                        id: x.id,
                        smartListName: x.office,
                        value: x.fullName
                      }));
                      // sorting for actingCtpStaffName
                      formControl.options = trimObject(formControl.options);
                      formControl.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                    }
                    // this method for disable action unncesessary values
                    if (element.key === 'tab1') {
                      if (formControl.name === 'action') {
                        const dropdownOptions = this.smartListData.find(f => f.smartListName === formControl.name);
                        // disaplay the action values after sorting(alphabatical order)
                        const actionDropdownValues = dropdownOptions.smartListValues;
                        actionDropdownValues.sort((a, b) => (a.value < b.value ? -1 : 1));
                        actionDropdownValues.forEach(element1 => {
                          if (element1.value === 'Reassignment' || element1.value === 'Reassignment (Prev. on Detail to CTP)') {
                            element1.disabled = true;
                          } else {
                            element1.disabled = false;
                          }
                        });
                      }
                    } // added for get the proper values onload forjobtitle mapping
                    this.onloadJobTitleMapping(formControl);
                    if (formControl.name === 'grade') {
                      formControl.options = trimObject(formControl.options);
                      formControl.options.sort((a, b) => (a.value > b.value ? -1 : 1));
                    }
                    /* to hide the some of  drodown values on detail Type*/
                    if (element.title === 'Process a Detail/Temporary Promotion') {
                      if (formControl.name === 'detailType') {
                        const dropdownOptions = this.smartListData.find(f => f.smartListName === formControl.name);
                        formControl.options = dropdownOptions ? dropdownOptions.smartListValues
                          .filter(el => el.id !== '3' && el.id !== '4') : [];
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
    const dateList = this.smartListService.getDateFieldList();
    Object.keys(this.vacancyFormData).forEach((key) => {
      const tempDateVal = dateList.find(f => f === key);
      if (tempDateVal) {
        if (key === tempDateVal) {
          if (this.vacancyFormData[key] !== null && this.vacancyFormData[key] !== '' && this.vacancyFormData[key] !== undefined) {
            this.vacancyFormData[key] = moment(this.vacancyFormData[key]).format('MM/DD/YYYY');
          }
        }
      }
    });
    this.vacancyFormData.year = this.year;
    this.lintStaffForm = this.createFormGroups(this.vacancyFormData);
    if (this.employeeId.startsWith('V')) {
      this.tabs = FormValues.getTabs;

      this.tabs = [];
      FormValues.getTabs.forEach(tab => {
        // this.tabs = FormValues.getTabs.filter(ele => ele.key !== 'tab3' );
        if (tab.key === 'tab1' || tab.key === 'tab5' || tab.key === 'tab6') {
          this.tabs.push(tab);
        }
      });
    } else {
      this.tabs = FormValues.getTabs.filter(ele => ele.key !== 'tab5');
      // this.showRecruitmentLogisticButton = true;
    }
    this.tabs.forEach(tab => {
      if (tab.title === 'Edit Staff/ Vacancy Information') {
        tab.active = true;
      }
    });
    const tabActive = this.tabs.find(tab => tab.title === 'Edit Staff/ Vacancy Information');
    this.cancelClicked = false;
    this.oneStaffService.setTabForm('');
    const e = { heading: 'Edit Staff/ Vacancy Information' };
    this.onSelect(e, tabActive.formControls, 'tab1', 0);
    this.formValid = true;
  }
  formCntrlValueChange(form) {
    if (this.selectedTabName !== 'Edit Staff/ Vacancy Information') {
      this.formValid = form.invalid ? false : true;
    } else {
      this.formValid = true;
    }
  }
  hideDDOptions(tab, formControls) {
    if (tab === 'Process a Reassignment') {
      const i = formControls.find(e => e.name === 'action');
      // updated for otherthan ressignment AND Reassignment (Prev. on Detail to CTP) set value to null -CBAS 6555
      const fg1 = this.lintStaffForm.controls['tab2'] as FormGroup;
      if ((fg1.controls.action.value !== '4' && fg1.controls.action.value !== 'Reassignment') &&
        (fg1.controls.action.value !== '7' && fg1.controls.action.value !== 'Reassignment (Prev. on Detail to CTP)')) {
        fg1.controls.action.setValue(null);
      }
      i.options.forEach(element => {
        if (element.value === 'Reassignment' || element.value === 'Reassignment (Prev. on Detail to CTP)') {
          element.disabled = false;
        } else {
          element.disabled = true;
        }
      });
    } else if (tab === 'Edit Staff/ Vacancy Information') {
      const i = formControls.find(e => e.name === 'action');
      i.options.forEach(element => {
        if (element.value === 'Reassignment' || element.value === 'Reassignment (Prev. on Detail to CTP)') {
          element.disabled = true;
        } else {
          element.disabled = false;
        }
      });
    }
  }
  getTabName(tab: string) {
    this.selectedTabName = tab;
  }

  selectedRAOffice(selectedObject) {
    // added on disable or enable the save button in proceess reassignment tab
    if (selectedObject.formControl === 'action') {
      if (this.selectedTabName === 'Process a Reassignment') {
        if (selectedObject.value === '4'
          || selectedObject.value === '7'
          || selectedObject.value === 'Reassignment'
          || selectedObject.value === 'Reassignment (Prev. on Detail to CTP)') {
          this.isdisableprocesstab = true;
        } else {
          this.isdisableprocesstab = false;
        }
      }
    }
    let selectedVacancyValue;
    if (selectedObject.formControl === 'vacancy') {
      selectedVacancyValue = selectedObject.formGroup.controls.vacancy.value;
      if (selectedVacancyValue && selectedVacancyValue.length !== 0 &&
        selectedObject.formGroup.controls.reassignmentOffice.value &&
        selectedObject.formGroup.controls.reassignmentOrgLevel.value) {
        this.busyTableSave = this.humanCapitalService.getEmpployeeData(
          selectedObject.formGroup.controls.reassignmentOffice.value,
          selectedObject.formGroup.controls.reassignmentOrgLevel.value,
          this.year,
          selectedObject.formGroup.controls.vacancy.value).subscribe(args => {
            if (args) {
              let vacancyData = [];
              vacancyData = args;
              this.tabControls.forEach(element => {
                if (element.name === 'reassignmentjobTitle') {
                  selectedObject.formGroup.controls.reassignmentjobTitle.setValue(vacancyData[0].jobTitle);
                }
                if (element.name === 'reassignmentSeries') {
                  selectedObject.formGroup.controls.reassignmentSeries.setValue(vacancyData[0].series);
                }
                if (element.name === 'reassignmentpayPlan') {
                  selectedObject.formGroup.controls.reassignmentpayPlan.setValue(vacancyData[0].payPlan);
                }
                if (element.name === 'reassignmentGrade') {
                  selectedObject.formGroup.controls.reassignmentGrade.setValue(vacancyData[0].grade);
                }
                if (element.name === 'reassignmentjobCode') {
                  selectedObject.formGroup.controls.reassignmentjobCode.setValue(vacancyData[0].jobCode);
                }
                if (element.name === 'reassignmentStep') {
                  selectedObject.formGroup.controls.reassignmentStep.setValue(vacancyData[0].step);
                }

              });
            }
          });
      } else {
        this.tabControls.forEach(element => {
          if (element.name === 'reassignmentjobTitle') {
            selectedObject.formGroup.controls.reassignmentjobTitle.setValue('');
          }
          if (element.name === 'reassignmentSeries') {
            selectedObject.formGroup.controls.reassignmentSeries.setValue('');
          }
          if (element.name === 'reassignmentpayPlan') {
            selectedObject.formGroup.controls.reassignmentpayPlan.setValue('');
          }
          if (element.name === 'reassignmentGrade') {
            selectedObject.formGroup.controls.reassignmentGrade.setValue('');
          }
          if (element.name === 'reassignmentjobCode') {
            selectedObject.formGroup.controls.reassignmentjobCode.setValue('');
          }
          if (element.name === 'reassignmentStep') {
            selectedObject.formGroup.controls.reassignmentStep.setValue('');
          }

        });

      }
    }
    const temp = this.officeOrgList.find(e => e.office === selectedObject.value);
    if (selectedObject.formControl === 'ctpDetailOffice' && selectedObject.value) {
      this.busyTableSave = this.humanCapitalService.getSupervisorData(
        selectedObject.value,
        'Employee',
        this.currentYear).subscribe(args => {
          this.employees = args;
          this.tabControls.forEach(element => {
            if (element.name === 'ctpDetailSupFullName') {
              element.options = this.employees.filter(emp => emp.supervisor).map(x => ({
                id: x.fullname,
                smartListName: x.office,
                value: x.fullName
              }));
              element.options = trimObject(element.options);
              element.options.sort((a, b) => (a.value < b.value ? -1 : 1));
            }
            if (element.name === 'ctpDetailOrgLevel') {
              element.options = [];
              if (temp) {
                element.options = temp.orgLevels.map(x => ({
                  id: x.orgLevel,
                  smartListName: x.office,
                  value: x.orgLevelAlias
                }));
              }
            }
          });
          selectedObject.formGroup.controls.ctpDetailOrgLevel.setValue('');
          selectedObject.formGroup.controls.ctpDetailSupFullName.setValue('');

        });
    }
    if (selectedObject.formControl === 'ctpDetailOrgLevel' && selectedObject.value) {
      if (selectedObject.formGroup.controls.ctpDetailOffice.value) {
        this.tabControls.forEach(element => {
          if (element.name === 'ctpDetailSupFullName') {
            element.options = this.employees.filter(emp => emp.supervisor).map(x => ({
              id: x.fullName,
              smartListName: x.office,
              value: x.fullName
            }));
            element.options = trimObject(element.options);
            element.options.sort((a, b) => (a.value < b.value ? -1 : 1));
          }
        });
      }
    }
    if (selectedObject.formControl === 'newOffice') {
      selectedObject.formGroup.controls.newOrgLevel.setValue('');
      this.tabControls.forEach(element => {
        if (element.name === 'newOrgLevel') {
          element.options = [];
          if (temp) {
            element.options = temp.orgLevels.map(x => ({
              id: x.orgLevel,
              smartListName: x.office,
              value: x.orgLevelAlias
            }));
            element.options.forEach(e => {
              if (e.value === selectedObject.formGroup.controls.orgLevelAlias.value) {
                e.disabled = true;
              }
            });
          }
        }
      });
    }
    if (selectedObject.formControl === 'ctpDetailOffice' && !selectedObject.value) {
      this.tabControls.forEach(element => {
        if (element.name === 'ctpDetailSupFullName' || element.name === 'ctpDetailOrgLevel') {
          element.options = [];
        }
      });
      selectedObject.formGroup.controls.ctpDetailOrgLevel.setValue('');
      selectedObject.formGroup.controls.ctpDetailSupFullName.setValue('');
    }
    if (selectedObject.formControl === 'reassignmentOffice') {
      if (selectedObject.formControl === 'reassignmentOffice') {
        selectedObject.formGroup.controls.vacancy.setValue([]);
        selectedObject.formGroup.controls.reassignmentjobTitle.setValue([]);
        selectedObject.formGroup.controls.reassignmentOrgLevel.setValue([]);
        selectedObject.formGroup.controls.reassignmentpayPlan.setValue([]);
        selectedObject.formGroup.controls.reassignmentGrade.setValue([]);
        selectedObject.formGroup.controls.reassignmentSeries.setValue([]);
        selectedObject.formGroup.controls.reassignmentStep.setValue([]);
        selectedObject.formGroup.controls.reassignmentjobCode.setValue([]);
        this.tabControls.forEach(element => {
          if (element.name === 'reassignmentOrgLevel' || element.name === 'ctpDetailOrgLevel') {
            element.options = [];
            if (temp) {
              element.options = temp.orgLevels.map(x => ({
                id: x.orgLevel,
                smartListName: x.office,
                value: x.orgLevelAlias
              }));
            }
          }
        });
      }
    } else if (selectedObject.formControl === 'reassignmentOrgLevel') {
      if (selectedObject.value) {
        this.tabControls.forEach(element => {
          if (element.name === 'vacancy') {
            selectedObject.formGroup.controls.vacancy.setValue([]);
            element.options = [];
            if (selectedObject.formGroup.controls.reassignmentOffice.value &&
              selectedObject.formGroup.controls.reassignmentOrgLevel.value.length !== 0 &&
              selectedObject.formGroup.controls.reassignmentOrgLevel.value) {
              this.busyTableSave = this.humanCapitalService.getAvailableVacancies(
                selectedObject.formGroup.controls.reassignmentOffice.value,
                selectedObject.formGroup.controls.reassignmentOrgLevel.value,
                'Vacancy',
                this.year).subscribe(args => {
                  // to disable the VacancyDropdown based on condition
                  disabledVacancyDDOptions(args, this.tabControls);
                });
            }
          }
        });
      } else if (selectedObject.value === '') {
        selectedObject.formGroup.controls.vacancy.setValue([]);
        selectedObject.formGroup.controls.reassignmentjobTitle.setValue([]);
        selectedObject.formGroup.controls.reassignmentpayPlan.setValue([]);
        selectedObject.formGroup.controls.reassignmentGrade.setValue([]);
        selectedObject.formGroup.controls.reassignmentSeries.setValue([]);
        selectedObject.formGroup.controls.reassignmentStep.setValue([]);
        selectedObject.formGroup.controls.reassignmentjobCode.setValue([]);
      }
    }
    if (selectedObject.formControl === 'detailType') {
      this.renderFieldValidity(selectedObject);
      setTimeout(() => {
        this.fieldsToShow(selectedObject);
        if (selectedObject.value === '2' || selectedObject.value === '1') {
          selectedObject.formGroup.controls.ctpDetailOffice.setValue('');
          selectedObject.formGroup.controls.ctpDetailOrgLevel.setValue('');
          selectedObject.formGroup.controls.ctpDetailSupFullName.setValue('');
          selectedObject.formGroup.controls.ctpDetailJobTitle.setValue('');
          if (selectedObject.value === '1') {
            selectedObject.formGroup.controls.ctpDetailGrade.setValue(selectedObject.formGroup.controls.grade.value);
          }
        }
        selectedObject.formGroup.controls.detailBargainingUnit.setValue('');
        selectedObject.formGroup.controls.detailEffectiveDate.setValue('');
        selectedObject.formGroup.controls.detailLogComments.setValue('');
        selectedObject.formGroup.controls.detailNteDate.setValue('');
      }, 1500);
      setTimeout(() => {
        triggerValidations(selectedObject.formGroup);
      }, 2000);

    }
  }

  renderFieldValidity(selectedObject: any) {
    if (selectedObject) {
      this.tabControls.forEach(element => {
        if (selectedObject.formControl === 'detailType') {
          if (selectedObject.value === '1') {
            if (element.name === 'ctpDetailGrade') {
              element.disabled = true;
              element.type = 'dropdown';
              element.required = true;
            }
            if (element.name === 'nonCtpDetailOfficeCenter') {
              element.label = 'CTP Detail Office';
              element.type = 'dropdown';
              element.name = 'ctpDetailOffice';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailOfficeCenter');
              selectedObject.formGroup.addControl('ctpDetailOffice', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailOrgLevel') {
              element.label = 'CTP Detail Organizational Level';
              element.type = 'dropdown';
              element.name = 'ctpDetailOrgLevel';
              element.smartListName = 'ctpDetailOrgLevel';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailOrgLevel');
              selectedObject.formGroup.addControl('ctpDetailOrgLevel', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailSupFullName') {
              element.label = 'CTP Detail Supervisor Full Name';
              element.type = 'dropdown';
              element.name = 'ctpDetailSupFullName';
              element.required = false;
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailSupFullName');
              selectedObject.formGroup.addControl('ctpDetailSupFullName', new FormControl(''));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailJobTitle') {
              element.label = 'CTP Detail Job Title';
              element.type = 'dropdown';
              element.name = 'ctpDetailJobTitle';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailJobTitle');
              selectedObject.formGroup.addControl('ctpDetailJobTitle', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailSeries') {
              element.label = 'CTP Detail Series or Equivalent';
              element.type = 'text';
              element.name = 'ctpDetailSeries';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.smartListName = 'series';
              selectedObject.formGroup.removeControl('nonCtpDetailSeries');
              selectedObject.formGroup.addControl('ctpDetailSeries', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailPayPlan') {
              element.label = 'CTP Detail Pay Plan';
              element.type = 'text';
              element.name = 'ctpDetailPayPlan';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.smartListName = 'payPlan';
              selectedObject.formGroup.removeControl('nonCtpDetailPayPlan');
              selectedObject.formGroup.addControl('ctpDetailPayPlan', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailGrade') {
              element.label = 'CTP Detail Grade';
              element.type = 'text';
              element.name = 'ctpDetailGrade';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.disabled = false;
              element.smartListName = 'grade';
              selectedObject.formGroup.removeControl('nonCtpDetailGrade');
              selectedObject.formGroup.addControl('ctpDetailGrade', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'detailLogComments') {
              element.type = 'text';
            }
          } else if (selectedObject.value === '2') {
            if (element.name === 'ctpDetailGrade') {
              element.type = 'text';
              element.required = true;
              element.disabled = false;
            }
            if (element.name === 'nonCtpDetailOfficeCenter') {
              element.label = 'CTP Detail Office';
              element.type = 'dropdown';
              element.name = 'ctpDetailOffice';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailOfficeCenter');
              selectedObject.formGroup.addControl('ctpDetailOffice', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailOrgLevel') {
              element.label = 'CTP Detail Organizational Level';
              element.type = 'dropdown';
              element.name = 'ctpDetailOrgLevel';
              element.smartListName = 'ctpDetailOrgLevel';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailOrgLevel');
              selectedObject.formGroup.addControl('ctpDetailOrgLevel', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailSupFullName') {
              element.label = 'CTP Detail Supervisor Full Name';
              element.type = 'dropdown';
              element.name = 'ctpDetailSupFullName';
              element.required = false;
              // element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailSupFullName');
              selectedObject.formGroup.addControl('ctpDetailSupFullName', new FormControl(''));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailJobTitle') {
              element.label = 'CTP Detail Job Title';
              element.type = 'dropdown';
              element.name = 'ctpDetailJobTitle';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('nonCtpDetailJobTitle');
              selectedObject.formGroup.addControl('ctpDetailJobTitle', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailSeries') {
              element.label = 'CTP Detail Series or Equivalent';
              element.type = 'text';
              element.name = 'ctpDetailSeries';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.smartListName = 'series';
              selectedObject.formGroup.removeControl('nonCtpDetailSeries');
              selectedObject.formGroup.addControl('ctpDetailSeries', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailPayPlan') {
              element.label = 'CTP Detail Pay Plan';
              element.type = 'text';
              element.name = 'ctpDetailPayPlan';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.smartListName = 'payPlan';
              selectedObject.formGroup.removeControl('nonCtpDetailPayPlan');
              selectedObject.formGroup.addControl('ctpDetailPayPlan', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'nonCtpDetailGrade') {
              element.label = 'CTP Detail Grade';
              element.type = 'text';
              element.name = 'ctpDetailGrade';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.disabled = false;
              selectedObject.formGroup.removeControl('nonCtpDetailGrade');
              selectedObject.formGroup.addControl('ctpDetailGrade', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'detailLogComments') {
              element.type = 'text';
            }
          } else if (selectedObject.value === '5' || selectedObject.value === '6') {
            if (element.name === 'ctpDetailGrade') {
              element.type = 'dropdown';
              element.required = true;
              element.disabled = false;
            }
            if (element.name === 'ctpDetailOffice') {
              element.label = 'Non-CTP Detail Office/Center';
              element.type = 'text';
              element.name = 'nonCtpDetailOfficeCenter';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('ctpDetailOffice', new FormControl('', Validators.required));
              selectedObject.formGroup.addControl('nonCtpDetailOfficeCenter', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'ctpDetailOrgLevel') {
              element.label = 'Non-CTP Detail Organizational Level';
              element.type = 'text';
              element.name = 'nonCtpDetailOrgLevel';
              element.required = false;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('ctpDetailOrgLevel', new FormControl('', Validators.required));
              selectedObject.formGroup.addControl('nonCtpDetailOrgLevel', new FormControl(''));
              selectedObject.formGroup.updateValueAndValidity();
            }
            // Non -CTP Detail Supervisor Full Name
            // detailSupervisorName

            if (element.name === 'ctpDetailSupFullName') {
              element.label = 'Non-CTP Detail Supervisor Full Name';
              element.type = 'text';
              element.name = 'nonCtpDetailSupFullName';
              element.value = '';
              selectedObject.formGroup.removeControl('ctpDetailSupFullName');
              selectedObject.formGroup.addControl('nonCtpDetailSupFullName', new FormControl(''));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'ctpDetailJobTitle') {
              element.label = 'Non-CTP Detail Job Title';
              element.type = 'text';
              element.name = 'nonCtpDetailJobTitle';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              selectedObject.formGroup.removeControl('ctpDetailJobTitle');
              selectedObject.formGroup.addControl('nonCtpDetailJobTitle', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'ctpDetailSeries') {
              element.label = 'Non-CTP Detail Series or Equivalent';
              element.type = 'text';
              element.name = 'nonCtpDetailSeries';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.options = element.options;
              selectedObject.formGroup.removeControl('ctpDetailSeries');
              selectedObject.formGroup.addControl('nonCtpDetailSeries', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'ctpDetailPayPlan') {
              element.label = 'Non-CTP Detail Pay Plan';
              element.type = 'text';
              element.name = 'nonCtpDetailPayPlan';
              element.required = true;
              element.validators = [Validators.required];
              element.value = '';
              element.smartListName = 'nonCtpDetailPayPlan';
              const dropdownOptions = this.smartListData.find(f => f.smartListName === 'payPlan');
              element.options = dropdownOptions.smartListValues;
              selectedObject.formGroup.removeControl('ctpDetailPayPlan');
              selectedObject.formGroup.updateValueAndValidity();
              selectedObject.formGroup.addControl('nonCtpDetailPayPlan', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'ctpDetailGrade') {
              element.label = 'Non-CTP Detail Grade';
              element.type = 'text';
              element.name = 'nonCtpDetailGrade';
              element.required = true;
              element.validators = [Validators.required];
              element.disabled = false;
              const dropdownOptions = this.smartListData.find(f => f.smartListName === 'grade');
              element.options = dropdownOptions.smartListValues;
              selectedObject.formGroup.removeControl('ctpDetailGrade');
              selectedObject.formGroup.addControl('nonCtpDetailGrade', new FormControl('', Validators.required));
              selectedObject.formGroup.updateValueAndValidity();
            }
            if (element.name === 'detailLogComments') {
              element.type = 'hidden';
            }
          }
        }
      });
    }
    setTimeout(() => {
      triggerValidations(selectedObject.formGroup);
    }, 3000);
  }
  fieldsToShow(selectedObject) {
    this.tabControls.forEach(element => {
      if (selectedObject.value === '5' || selectedObject.value === '6') {
        if (element.name === 'nonCtpDetailPayPlan') {
          element.label = 'Non-CTP Detail Pay Plan';
          element.type = 'dropdown';
          element.name = 'nonCtpDetailPayPlan';
          element.required = true;
          element.validators = [Validators.required];
          element.value = [];
          element.smartListName = 'nonCtpDetailPayPlan';
          const dropdownOptions = this.smartListData.find(f => f.smartListName === 'payPlan');
          element.options = dropdownOptions.smartListValues;
          selectedObject.formGroup.updateValueAndValidity();
        }
        if (element.name === 'nonCtpDetailGrade') {
          element.label = 'Non-CTP Detail Grade';
          element.type = 'dropdown';
          element.name = 'nonCtpDetailGrade';
          element.required = true;
          element.validators = [Validators.required];
          element.disabled = false;
          selectedObject.formGroup.updateValueAndValidity();
        }
      } else if (selectedObject.value === '2') {
        if (element.name === 'ctpDetailSeries') {
          element.label = 'CTP Detail Series or Equivalent';
          element.type = 'dropdown';
          element.name = 'ctpDetailSeries';
          element.required = true;
          element.validators = [Validators.required];
          element.value = '';
          element.smartListName = 'series';
          selectedObject.formGroup.updateValueAndValidity();
        }
        if (element.name === 'ctpDetailPayPlan') {
          element.label = 'CTP Detail Pay Plan';
          element.type = 'dropdown';
          element.name = 'ctpDetailPayPlan';
          element.required = true;
          element.validators = [Validators.required];
          element.value = '';
          element.smartListName = 'payPlan';
          selectedObject.formGroup.updateValueAndValidity();
        }
        if (element.name === 'ctpDetailGrade') {
          element.label = 'CTP Detail Grade';
          element.type = 'dropdown';
          element.name = 'ctpDetailGrade';
          element.required = true;
          element.validators = [Validators.required];
          element.value = '';
          element.disabled = false;
          selectedObject.formGroup.updateValueAndValidity();
        }
      } else if (selectedObject.value === '1') {
        if (element.name === 'ctpDetailSeries') {
          element.label = 'CTP Detail Series or Equivalent';
          element.type = 'dropdown';
          element.name = 'ctpDetailSeries';
          element.required = true;
          element.validators = [Validators.required];
          element.value = '';
          element.smartListName = 'series';
          selectedObject.formGroup.updateValueAndValidity();
        }
        if (element.name === 'ctpDetailPayPlan') {
          element.label = 'CTP Detail Pay Plan';
          element.type = 'dropdown';
          element.name = 'ctpDetailPayPlan';
          element.required = true;
          element.validators = [Validators.required];
          element.value = '';
          element.smartListName = 'payPlan';
          selectedObject.formGroup.updateValueAndValidity();
        }
        if (element.name === 'ctpDetailGrade') {
          element.label = 'CTP Detail Grade';
          element.type = 'dropdown';
          element.name = 'ctpDetailGrade';
          element.required = true;
          element.validators = [Validators.required];
          element.disabled = true;
          element.smartListName = 'grade';
          selectedObject.formGroup.updateValueAndValidity();
        }
      }
    });
  }
  onSelectChange(e) {
    if (e.formControl === 'jobTitle' || e.formControl === 'grade' || e.formControl === 'jobCode'
      || e.formControl === 'series' || e.formControl === 'payPlan' || e.formControl === 'fpl') {
      if (e.formControl === 'jobTitle') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        e.formGroup.controls.series.setValue('');
        e.formGroup.controls.payPlan.setValue('');
        e.formGroup.controls.jobCode.setValue('');
        e.formGroup.controls.grade.setValue('');
        e.formGroup.controls.fpl.setValue('');
      } else if (e.formControl === 'series') {
      } else if (e.formControl === 'payPlan') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        e.formGroup.controls.grade.setValue('');
        e.formGroup.controls.jobCode.setValue('');
        e.formGroup.controls.fpl.setValue('');
      } else if (e.formControl === 'grade') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        e.formGroup.controls.jobCode.setValue('');
        e.formGroup.controls.fpl.setValue('');
      } else if (e.formControl === 'jobCode') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        e.formGroup.controls.fpl.setValue('');
      }

    } else {
      if (e.smartList === 'jobTitle') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        e.formGroup.controls.ctpDetailSeries.setValue([]);
        e.formGroup.controls.ctpDetailPayPlan.setValue([]);
        if (e.formGroup.controls.detailType.value !== '1') {
          e.formGroup.controls.ctpDetailGrade.setValue([]);
        }
      } else if (e.smartList === 'series') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        if (e.formGroup.controls.detailType.value !== '1') {
          e.formGroup.controls.ctpDetailGrade.setValue([]);
        }
        e.formGroup.controls.ctpDetailPayPlan.setValue([]);
      } else if (e.smartList === 'payPlan') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        if (e.formGroup.controls.detailType.value !== '1') {
          e.formGroup.controls.ctpDetailGrade.setValue([]);
        }
      }
    }
  }
  onSelect(e, formControls, form, index) {
    const prevFormName = this.oneStaffService.getTabFormName();

    if (prevFormName && !this.cancelClicked) {
      const prevFormGroup = this.lintStaffForm.controls[prevFormName] as FormGroup;

      if (prevFormGroup.dirty && !this.cancelClicked) {
        this.unSavedDataBsModelRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
        this.unSavedDataBsModelRef.content.okSave.subscribe((response) => {

          prevFormGroup.reset();
          this.hideDDOptions(e.heading, formControls);
          Object.keys(prevFormGroup.controls).forEach(k => {
            prevFormGroup.controls[k].setValue(this.vacancyFormData[k]);
          });
          prevFormGroup.markAsPristine();
          this.selectedTabName = e.heading;
          this.tabControls = formControls;
          this.oneStaffService.setTabForm(form);
          this.cancelClicked = false;
          triggerValidations(this.lintStaffForm);
        });
        this.unSavedDataBsModelRef.content.onCancel.subscribe((response) => {

          this.tabs.forEach(tab => {
            tab.active = tab.title === this.selectedTabName ? true : false;
          });

          this.selectedTab = index;
          this.cancelClicked = true;
        });
      } else {
        this.hideDDOptions(e.heading, formControls);
        this.selectedTabName = e.heading;
        this.tabControls = formControls;
        const fg = this.lintStaffForm.controls[form] as FormGroup;
        if (this.tabControls.findIndex(cntl => cntl.name === 'homeOfficeSupervisorFullName') > 0) {
          fg.controls.homeOfficeSupervisorFullName.setValue(this.vacancyFormData.currentSupervisor);
        }
        if (this.tabControls.findIndex(cntl => cntl.name === 'reassignmentOrgLevel') > 0 &&
          this.tabControls.findIndex(cntl => cntl.name === 'reassignmentOffice') > 0) {
          if (fg.controls.reassignmentOffice.value && fg.controls.reassignmentOrgLevel.value) {
            this.busyTableSave = this.humanCapitalService.getAvailableVacancies(
              fg.controls.reassignmentOffice.value,
              fg.controls.reassignmentOrgLevel.value,
              'Vacancy',
              this.year).subscribe(args => {
                disabledVacancyDDOptions(args, this.tabControls);
              });
          }

        }
        // added for updated controls based on first tab fix(CBAS-6564)
        if (this.isEditStaffDataSave === true && e.heading !== 'Edit Staff/ Vacancy Information') {
          if (e.heading === 'Process a Reassignment') {
            if (this.isEditStafflatestData[0].jobTitle) {
              const jobTitleValue = this.convertingIdDatatoValue('jobTitle');
              fg.controls.jobTitle.setValue(jobTitleValue);
            } else {
              fg.controls.jobTitle.setValue('');
            }
            if (this.isEditStafflatestData[0].payPlan) {
              const payPlanValue = this.convertingIdDatatoValue('payPlan');
              fg.controls.payPlan.setValue(payPlanValue);
            } else {
              fg.controls.payPlan.setValue('');
            }
            if (this.isEditStafflatestData[0].series) {
              const seriesValue = this.convertingIdDatatoValue('series');
              fg.controls.series.setValue(seriesValue);
            } else {
              fg.controls.series.setValue('');
            }
            fg.controls.jobCode.setValue(this.isEditStafflatestData[0].jobCode);
            fg.controls.grade.setValue(this.isEditStafflatestData[0].grade);
            fg.controls.step.setValue(this.isEditStafflatestData[0].step);
          }
          if (e.heading === 'Process a Departure') {
            if (this.isEditStafflatestData[0].jobTitle) {
              const jobTitleValue = this.convertingIdDatatoValue('jobTitle');
              fg.controls.jobTitle.setValue(jobTitleValue);
            } else {
              fg.controls.jobTitle.setValue('');
            }
            if (this.isEditStafflatestData[0].payPlan) {
              const payPlanValue = this.convertingIdDatatoValue('payPlan');
              fg.controls.payPlan.setValue(payPlanValue);
            } else {
              fg.controls.payPlan.setValue('');
            }
            if (this.isEditStafflatestData[0].series) {
              const seriesValue = this.convertingIdDatatoValue('series');
              fg.controls.series.setValue(seriesValue);
            } else {
              fg.controls.series.setValue('');
            }
            if (this.isEditStafflatestData[0].bargainingUnit) {
              const bargainingUnitValue = this.convertingIdDatatoValue('bargainingUnit');
              fg.controls.bargainingUnit.setValue(bargainingUnitValue);
            } else {
              fg.controls.bargainingUnit.setValue('');
            }
            fg.controls.jobCode.setValue(this.isEditStafflatestData[0].jobCode);
            fg.controls.grade.setValue(this.isEditStafflatestData[0].grade);
            fg.controls.step.setValue(this.isEditStafflatestData[0].step);
            fg.controls.currentSupervisor.setValue(this.isEditStafflatestData[0].currentSupervisor);
            fg.controls.ctpEod.setValue(this.isEditStafflatestData[0].ctpEod);
          }
          if (e.heading === 'Process a Detail/Temporary Promotion') {
            if (this.isEditStafflatestData[0].jobTitle) {
              const jobTitleValue = this.convertingIdDatatoValue('jobTitle');
              fg.controls.jobTitle.setValue(jobTitleValue);
            } else {
              fg.controls.jobTitle.setValue('');
            }
            if (this.isEditStafflatestData[0].payPlan) {
              const payPlanValue = this.convertingIdDatatoValue('payPlan');
              fg.controls.payPlan.setValue(payPlanValue);
            } else {
              fg.controls.payPlan.setValue('');
            }
            if (this.isEditStafflatestData[0].series) {
              const seriesValue = this.convertingIdDatatoValue('series');
              fg.controls.series.setValue(seriesValue);
            } else {
              fg.controls.series.setValue('');
            }
            fg.controls.grade.setValue(this.isEditStafflatestData[0].grade);
            fg.controls.homeOfficeSupervisorFullName.setValue(this.isEditStafflatestData[0].currentSupervisor);
          }
        } // till here
        // added for Action update
        this.tabControls.find(element => {
          if (element.name === 'action') {
            const tab1ActionValue = this.lintStaffForm.value.tab1.action;
            if (tab1ActionValue === null || tab1ActionValue === '' || tab1ActionValue === undefined) {
              fg.controls.action.setValue(tab1ActionValue);
            } else {
              const updatedValue = this.changeIdtoValue(this.tabControls);
              if (element.group === 'Recruitment & Logistics Information') {
                if (tab1ActionValue !== updatedValue) {
                  fg.controls.action.setValue(tab1ActionValue);
                }
              } else {
                // updated for otherthan ressignment AND Reassignment (Prev. on Detail to CTP) set value to null -CBAS 6555
                if (updatedValue !== 'Reassignment' && updatedValue !== 'Reassignment (Prev. on Detail to CTP)' &&
                  tab1ActionValue !== 'Reassignment' && tab1ActionValue !== 'Reassignment (Prev. on Detail to CTP)') {
                  fg.controls.action.setValue('');
                } else {
                  if (tab1ActionValue !== updatedValue) {
                    fg.controls.action.setValue(tab1ActionValue);
                  }
                }
              }
            }
          }
        });
        if (this.tabControls.findIndex(cntl => cntl.name === 'vacancy') > 0 && fg.controls.vacancy.value) {
          this.busyTableSave = this.humanCapitalService.getEmpployeeData(
            fg.controls.reassignmentOffice.value,
            fg.controls.reassignmentOrgLevel.value,
            this.year,
            fg.controls.vacancy.value).subscribe(args => {
              if (args) {
                fg.controls.vacancy.setValue(args[0].displaySummary);
                fg.controls.reassignmentjobTitle.setValue(args[0].jobTitle);
                fg.controls.reassignmentSeries.setValue(args[0].series);
                fg.controls.reassignmentpayPlan.setValue(args[0].payPlan);
                fg.controls.reassignmentGrade.setValue(args[0].grade);
                fg.controls.reassignmentjobCode.setValue(args[0].jobCode);
                fg.controls.reassignmentStep.setValue(args[0].step);
              }
            });
        }
        this.oneStaffService.setTabForm(form);
        triggerValidations(fg);
        this.cancelClicked = false;
      }
    } else {
      this.hideDDOptions(e.heading, formControls);
      this.selectedTabName = e.heading;
      this.tabControls = formControls;
      const fg = this.lintStaffForm.controls[form] as FormGroup;
      this.oneStaffService.setTabForm(form);
      if (this.tabControls.findIndex(cntl => cntl.name === 'homeOfficeSupervisorFullName') > 0) {
        fg.controls.homeOfficeSupervisorFullName.setValue(this.vacancyFormData.currentSupervisor);
      }
      triggerValidations(fg);
      this.cancelClicked = false;
    }
  }
  // chnged the Ids to values for dropdowns for process reassignment tab
  changeIdtoValue(tabvalue) {
    const value = tabvalue.find(element => element.name === 'action');
    let tab1ActionValue = this.lintStaffForm.value.tab1.action;
    const tab2ActionValue = this.lintStaffForm.value.tab2.action;
    value.options.forEach(element => {
      if (element.id === tab1ActionValue) {
        tab1ActionValue = element.value;
      }
    });
    if (tab1ActionValue !== tab2ActionValue) {
      return tab1ActionValue;

    }
  }
  // added for converting the value to id
  convertingIdDatatoValue(name) {
    if (name === 'jobTitle') {
      if (name) {
        const smartlistvalue = this.smartListData.find(f => f.smartListName === 'jobTitle').smartListValues;
        console.log('smatlistvalues', smartlistvalue);
        const value = smartlistvalue.find(el => el.id === this.isEditStafflatestData[0].jobTitle).value;
        return value;
      } else {
        return '';
      }
    }
    if (name === 'payPlan') {
      if (name) {
        const smartlistvalue = this.smartListData.find(f => f.smartListName === 'payPlan').smartListValues;
        console.log('smatlistvalues', smartlistvalue);
        const value = smartlistvalue.find(el => el.id === this.isEditStafflatestData[0].payPlan).value;
        return value;
      } else {
        return '';
      }
    }
    if (name === 'series') {
      if (name) {
        const smartlistvalue = this.smartListData.find(f => f.smartListName === 'series').smartListValues;
        const value = smartlistvalue.find(el => el.id === this.isEditStafflatestData[0].series).value;
        return value;
      } else {
        return '';
      }
    }
    if (name === 'bargainingUnit') {
      if (name) {
        const smartlistvalue = this.smartListData.find(f => f.smartListName === 'bargainingUnit').smartListValues;
        const value = smartlistvalue.find(el => el.id === this.isEditStafflatestData[0].bargainingUnit).value;
        return value;
      } else {
        return '';
      }
    }
  }

  close() {
    if (this.lintStaffForm.dirty) {
      this.bsModalUnsavedRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalUnsavedRef.content.okSave.subscribe((response) => {
        this.bsModalUnsavedRef.hide();
        this.bsModalRef.hide();
        this.closeEmit.emit();
        this.lintStaffForm.markAsPristine();
      });
    } else {
      this.bsModalRef.hide();
      this.closeEmit.emit();
    }
  }

  createFormGroups(data) {
    const groups = {};
    this.tabs.forEach(t => {
      groups[t.key] = this._fb.group(this.createFormControls(t.formControls, data));
    });
    return this._fb.group(groups);
  }

  createFormControls(ctrls, data) {
    const formCtrls = {};
    ctrls.forEach(c => {
      formCtrls[c.name] = new FormControl(data[c.name], c.required ? c.validators : []);
    });
    return formCtrls;
  }

  onSubmit(e: string, title: string) {
    const fg = this.lintStaffForm.controls[e] as FormGroup;
    triggerValidations(fg);
    const smartListGlobal = this.smartListService.getDDVals();
    this.editedData = {
      orgLevel: this.orgLevel,
      employee: this.employeeId,
      office: this.office,
    };
    if (this.selectedTabName === 'Process a Reassignment' || this.selectedTabName === 'Process a Departure') {
      this.editedData = {
        orgLevel: this.orgLevel,
        employee: this.employeeId,
        office: this.vacancyFormData.office,
        lastName: this.vacancyFormData.lastName
      };
    }
    if (this.selectedTabName === 'Change Fiscal Year') {
      this.editedData = {
        currYear: this.year,
        orgLevel: this.orgLevel,
        employee: this.employeeId,
        office: this.office
      };
    }
    if (this.selectedTabName === 'Process a Detail/Temporary Promotion') {
      this.editedData = {
        orgLevel: this.orgLevel,
        office: this.vacancyFormData.office,
        employee: this.employeeId,
        firstName: this.vacancyFormData.firstName,
        lastName: this.vacancyFormData.lastName,
        middleInitial: this.vacancyFormData.middleInitial
      };
    }
    if (this.selectedTabName === 'Change Org. Level') {
      this.editedData = {
        year: this.year,
        orgLevel: this.orgLevel,
        employee: this.employeeId,
        office: this.office
      };
    }
    if (fg.valid) {
      const form: Form = fg.value;
      const vacancyFormData: JSON = JSON.parse(JSON.stringify(this.vacancyFormData));
      for (const value in form) {
        if (value) {
          for (const key in this.vacancyFormData) {
            if (value === key) {
              if (vacancyFormData[key] !== form[key]) {
                const datePipe = new DatePipe('en-US');
                const regex = RegExp('(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])');
                if (regex.test(form[key])) {
                  form[key] = datePipe.transform(form[key], 'MM/dd/yyyy');
                }
                if (key === 'currentSupervisor') {
                  const i = this.employees.find(emp => emp.id === form[key]);
                  if (i) {
                    form[key] = i.fullName;
                    // for Name checking
                  } else {
                    const checkforName = this.employees.find(emp => emp.fullName === form[key]);
                    form[key] = checkforName.fullName;
                  }
                }
                this.editedData[value] = form[key];
              }
            } else {
              const datePipe = new DatePipe('en-US');
              const regex = RegExp('(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])');
              if (regex.test(form[value])) {
                form[value] = datePipe.transform(form[value], 'MM/dd/yyyy');
              }
              this.editedData[value] = form[value];
            }
          }
        }
      }
      const a = this.editedData;
      let tempSaveData = [];
      if (Object.keys(a).length !== 0) {
        Object.keys(a).forEach(key => {
          const smartListObject = smartListGlobal.find(element => element.smartListName === key);
          if (smartListObject && smartListObject.smartListValues.length > 0) {
            smartListObject.smartListValues.forEach(element => {
              if (a[key] === element.value) {
                a[key] = element.id;
              }
            });
          }
        });
        tempSaveData = [];
        tempSaveData.push(this.editedData);
      }
      if (e === 'tab3' || e === 'tab4' || e === 'tab6' || e === 'tab5') {
        let message;
        if (e === 'tab3') {
          message = `WARNING: If an entry is already created on the Departure Log for this action,
           any edits will need to be completed in the Staffing Plan, not the Departure Log.`;
        } else if (e === 'tab6') {
          message = 'Are you sure you want to move this employee/vacancy to another organizational level?';
        } else if (e === 'tab5') {
          message = 'Are you sure you want to change the fiscal year for this vacancy?';
        } else {
          message = 'Are you sure you want to add an entry to the Detail/Temporary Promotion Log?';
          this.PayPlanPeriodsValid(tempSaveData[0], message, tempSaveData, title, fg);
        }

        if (e !== 'tab4') {
          this.SubmitData(message, tempSaveData, title, fg);
        }
      } else {
        this.saveOneStaffData(tempSaveData, title, fg);
      }
    }
  }
  SubmitData(message, tempSaveData, title, fg) {
    const initialState = {
      message,
      buttonTitle: 'Yes'
    };
    this.saveConfirmationModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.saveConfirmationModalRef.content.event.subscribe((response: boolean) => {
      if (response === true) {
        this.saveOneStaffData(tempSaveData, title, fg);
      }
    });
  }
  PayPlanPeriodsValid(tempForm, message, tempSaveData, title, fg) {
    const validEffectiveDate = tempForm.detailEffectiveDate;
    const validNteDate = tempForm.detailNteDate;
    const isEffectiveDateValid = checkPayPeriodEffectiveDates(validEffectiveDate, this.validPayPeriodDates);
    const isNteDateVlid = checkPayPeriodNteDates(validNteDate, this.validPayPeriodDates);
    if (isEffectiveDateValid === false || isNteDateVlid === false) {
      const initialState = {
        message: 'Warning: The Detail - Effective Date or Detail - NTE Date do not align with a pay period.' + '<br>' + '<br>' + 'Do you want to continue?',
        buttonTitle: 'Yes'
      };
      this.saveConfirmationModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      this.saveConfirmationModalRef.content.event.subscribe((response: boolean) => {
        if (response === true) {
          this.SubmitData(message, tempSaveData, title, fg);
        }
      });
    } else {
      this.SubmitData(message, tempSaveData, title, fg);
    }

  }
  saveOneStaffData(tempSaveData, title, fg) {
    // warning message popup for process a reassignment tab
    if (title === 'Process a Reassignment') {
      const initialState = {
        message: `Warning: Processing a reassignment will reassign the selected employee to the selected vacancy within another
         Office/organizational level. This will be reflected on the Staffing Plan once the effective date is reached.`,
        buttonTitle: 'OK'
      };
      this.saveConfirmationModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      this.saveConfirmationModalRef.content.event.subscribe((response: boolean) => {
        if (response === true) {
          this.saveOneStaff(tempSaveData, title, fg);
        }
      });
    } else {
      // save  for the remaining tabs
      this.saveOneStaff(tempSaveData, title, fg);
    }
  }
  saveOneStaff(tempSaveData, title, fg) {
    this.busyTableSave = this.humanCapitalService.postOneStaffData(
      this.year, tempSaveData, title).subscribe(
        args => {
          this.toaster.pop('success', 'Saved', 'Saved data Successfully');
          fg.markAsPristine();
          this.oneStaffService.onSave(true);
          if (this.selectedTabName !== 'Edit Staff/ Vacancy Information') {
            this.bsModalRef.hide();
          } else {
            this.isEditStaffDataSave = true;
            this.isEditStafflatestData = tempSaveData;
          }
        }, error => {
          this.toaster.pop('error', 'Failed', error.error.errorDetails[0].message);
        });
  }
  addRecruitmentandLogistics() {
    if (this.lintStaffForm.dirty) {
      const initialState = {
        saveFormData: true,
      };
      this.modalService.show(ErrorDialogComponent, { initialState });
    } else {
      const smartListGlobal = this.smartListService.getDDVals();
      const dateList = this.smartListService.getDateFieldList();
      Object.keys(this.lintStaffForm.controls.tab1.value).forEach(key => {
        const smartListObject = smartListGlobal.find(element => element.smartListName === key);
        const tempDateVal = dateList.find(f => f === key);
        if (smartListObject && smartListObject.smartListValues.length > 0) {
          smartListObject.smartListValues.forEach(element => {
            if (this.lintStaffForm.controls.tab1.value[key] === element.value) {
              this.lintStaffForm.controls.tab1.value[key] = element.id;
            }
          });
        }
        if (tempDateVal) {
          if (key === tempDateVal) {
            this.lintStaffForm.controls.tab1.value[key] =
              this.lintStaffForm.controls.tab1.value[key] !== null &&
                this.lintStaffForm.controls.tab1.value[key] !== '' &&
                this.lintStaffForm.controls.tab1.value[key] !== undefined ? moment(this.lintStaffForm.controls.tab1.value[key]).format('MM/DD/YYYY') : this.lintStaffForm.controls.tab1.value[key];
          }
        }
      });
      const initialState = {
        oneStaffData: this.vacancyFormData,
        screenName: 'addrecruitment',
        recruitmentLogisticsData: this.lintStaffForm,
        message: `To add a new entry to the Recruitment and Logistics Log, press OK. After an entry is created,
        any future edits will need to be completed in the Recruitment and Logistics Log, not the Staffing Plan.`,
        office: this.vacancyFormData.office,
        year: this.year,
        orgLevel: this.orgLevel,
        screenType: 'hyperlink',
        parentModelRef: this.bsModalRef
      };
      this.modalService.show(AddRecruitmentLogisticsComponent, { initialState });
    }
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.submitBtnName = 'Submit';
  }

  clearReassignment(tabs) {
    const initialState = {
      screenName: 'clearReassignment',
      message: `Warning: Are you sure you want to clear reassignment data from the Staffing Plan?`,
      buttonTitle: 'Yes'
    };
    this.saveConfirmationModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.saveConfirmationModalRef.content.event.subscribe((response: boolean) => {
      if (response === true) {

        this.humanCapitalService.clearReassignmentRow(this.year, this.orgLevel, this.employeeId).subscribe(data => {
          this.toaster.pop('success', 'Deleted', 'Deleted view successfully');
        });
        this.oneStaffService.onSave(true);
        this.saveConfirmationModalRef.hide();
        this.bsModalRef.hide();
        // const fg = this.lintStaffForm.controls[tabs.key] as FormGroup;
        // fg.controls.reassignmentEffectiveDate.setValue('');
        // fg.controls.action.setValue('');
        // fg.controls.reassignmentOffice.setValue('');
        // fg.controls.reassignmentOrgLevel.setValue('');
        // fg.controls.vacancy.setValue('');
      }
    });

  }
  clearDepartureData() {
    const initialState = {
      message: 'Are you sure you want to delete the Departure data? This will clear the corresponding entry in the Departure Log.',
      buttonTitle: 'Yes'
    };
    this.departurebsModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.departurebsModalRef.content.event.subscribe((response: boolean) => {
      if (response === true) {
        // call the API
        this.humanCapitalService.clearDepartureRow(this.year, this.orgLevel, this.employeeId).subscribe(data => {
          this.toaster.pop('success', 'Deleted', 'Deleted view successfully');
        });
        this.oneStaffService.onSave(true);
        this.departurebsModalRef.hide();
        this.bsModalRef.hide();
      }
    });
  }
  onloadJobTitleMapping(e) {
    let tab1formGroup;
    if (e.name === 'jobTitle' && this.vacancyFormData.jobTitle) {
      const id = this.smartListData.find(f => f.smartListName === e.name).smartListValues
        .find(el => el.value === this.vacancyFormData.jobTitle).id;
      this.lintStaffForm.controls.tab1.value.jobTitle = id;
      tab1formGroup = {
        formControl: 'jobTitle',
        hyperlinkPopup: true,
        formGroup: this.lintStaffForm.controls.tab1, smartList: 'jobTitle', value: id
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);

      // } else if (e.name === 'series' && this.vacancyFormData.series) {
      //   const seriesId = this.smartListData.find(f => f.smartListName === e.name).smartListValues
      //     .find(el => el.value === this.vacancyFormData.series).id;
      //   console.log(seriesId);
      //   this.lintStaffForm.controls.tab1.value.series = seriesId;
      //   tab1formGroup = {
      //       formControl: 'series',
      //       formGroup: this.lintStaffForm.controls.tab1, smartList: 'series', value : seriesId
      //     };
      //   jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    } else if (e.name === 'payPlan' && this.vacancyFormData.payPlan) {
      const payPlanid = this.smartListData.find(f => f.smartListName === e.name).smartListValues
        .find(el => el.value === this.vacancyFormData.payPlan).id;
      this.lintStaffForm.controls.tab1.value.payPlan = payPlanid;
      tab1formGroup = {
        formControl: 'payPlan',
        hyperlinkPopup: true,
        formGroup: this.lintStaffForm.controls.tab1, smartList: 'payPlan', value: payPlanid
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    } else if (e.name === 'grade' && this.vacancyFormData.grade) {
      const gradeId = this.smartListData.find(f => f.smartListName === e.name).smartListValues
        .find(el => el.value === this.vacancyFormData.grade).id;
      tab1formGroup = {
        formControl: 'grade',
        hyperlinkPopup: true,
        formGroup: this.lintStaffForm.controls.tab1, smartList: 'grade', value: gradeId
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    } else if (e.name === 'jobCode' && this.vacancyFormData.jobCode) {
      tab1formGroup = {
        formControl: 'jobCode',
        hyperlinkPopup: true,
        formGroup: this.lintStaffForm.controls.tab1, smartList: 'jobCode', value: this.vacancyFormData.jobCode
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    }
  }
}
