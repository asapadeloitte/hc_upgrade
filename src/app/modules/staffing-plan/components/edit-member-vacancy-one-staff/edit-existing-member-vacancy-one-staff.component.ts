import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Subscription } from 'rxjs';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
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
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import {
  checkPayPeriodEffectiveDates, checkPayPeriodNteDates, jobTitleMapping, triggerValidations, trimObject
} from 'src/app/shared/utilities';

import { FormValues } from './one-staff.enum';
import { OneStaffService } from './one-staff.service';
import {
  DetailTemPromotionLogService
} from 'src/app/modules/reports/components/detail-temporary-promotion-log/detail-tem-promotion-log.service';
import { departureDataCheck, processReassignmentDataCheck, disabledVacancyDDOptions } from 'src/app/shared/grid-utilities';



@Component({
  selector: 'app-edit-existing-member-vacancy-one-staff',
  templateUrl: './edit-existing-member-vacancy-one-staff.component.html',
  styleUrls: ['./edit-existing-member-vacancy-one-staff.component.scss']
})
export class EditExistingMemberVacancyOneStaffComponent implements OnInit {

  @ViewChild('contentunChangedModal', { static: true })
  unChangedModal: ElementRef;

  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;

  public busyTableSave: Subscription;
  public oneStaffSearchForm: FormGroup;
  @ComponentForm(true)
  public oneStaffForm: FormGroup;
  public selectedTabName: string;
  tabs: any[] = [];
  public fieldMappingsData: FieldMapping[];
  public officeOrgList = [];
  public yearsList = [];
  public orgList = [];
  public positionTypeList = [];
  public empVacList = [];
  public oneEmpVac = [];
  public smartListData = [];
  public tabControls = [];
  public formValid: boolean;
  public oneStaffData = [];
  public editedData;
  public cancelClicked = false;
  public selectedTab = 0;
  public empVac: string;
  public jobTitleMapping: FieldMapping[];
  public employees: any;
  bsModalRef: BsModalRef;
  private saveConfirmationModalRef: BsModalRef;
  public showRecruitmentLogisticButton = true;
  public processDepartureScreen = true;
  public logisticsBasedonTabs = true;
  private disableDepartureLog = true;
  private disableReassignClearButton = true;
  public currentYear: string;
  public positionType: string;
  public validPayPeriodDates: any = [];
  public selectedEmpVacOrg;
  constructor(
    private _fb: FormBuilder,
    private humanCapitalService: HumanCapitalService,
    private _adminService: AdminService,
    private _smartListService: SmartListConversionService,
    private toaster: ToasterService,
    private modalService: BsModalService,
    private oneStaffService: OneStaffService,
    private detailTemPromotionLogService: DetailTemPromotionLogService,
  ) {
    this.tabs = FormValues.getTabs;
    this.formValid = true;
    this.cancelClicked = false;
  }

  ngOnInit() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.officeOrgList = args.officeOrgLevelMapping;
      this.yearsList = args.years;
      this.positionTypeList = args.positionTypes;
      this.currentYear = args.currentYear;
      this.humanCapitalService.getSmartList().subscribe(smList => {
        this._smartListService.setDDVals(smList);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeOrgList, this.jobTitleMapping);
            this.smartListData = this._smartListService.getDDVals();
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
                          formControl.options =
                            formControl.options.filter(x => this.jobTitleMapping.some(y => y.jobTitle.includes(x.value)));
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
                        // if (formControl.name === 'ctpDetailSeries') {
                        //   formControl.options.unshift({
                        //     id: '0',
                        //     smartListName: 'Series',
                        //     value: '0000'
                        //   });
                        // }
                      }
                      if (formControl.name === 'reassignmentOffice' ||
                        formControl.name === 'ctpDetailOffice' ||
                        formControl.name === 'newOffice') {
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
              this.tabs.forEach(element => {
                if (element.title === 'Edit Staff/ Vacancy Information') {
                  const i = element.formControls.find(e => e.name === 'action');
                  // disaplay the action values after sorting(alphabatical order)
                  const actionDropdownValues = i.options;
                  actionDropdownValues.sort((a, b) => (a.value < b.value ? -1 : 1));
                  actionDropdownValues.forEach(el => {
                    if (el.value === 'Reassignment') {
                      el.disabled = true;
                    }
                    if (el.value === 'Reassignment (Prev. on Detail to CTP)') {
                      el.disabled = true;
                    }

                  });
                }
              });
            }
          }
        });
      });

    });

    this.oneStaffSearchForm = this._fb.group({
      orgLevel: [null],
      office: [null, Validators.required],
      year: [null, Validators.required],
      positnType: [null, Validators.required],
      empVac: [null, Validators.required]
    });
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

  getTabName(tab: string) {
    this.selectedTabName = tab;
  }

  onTabSelect(e, formControls, form, index) {

    const prevFormName = this.oneStaffService.getTabFormName();

    if (prevFormName && !this.cancelClicked) {
      const prevFormGroup = this.oneStaffForm.controls[prevFormName] as FormGroup;
      if (prevFormGroup.dirty && !this.cancelClicked) {
        this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
        this.bsModalRef.content.okSave.subscribe((response) => {
          prevFormGroup.reset();
          this.hideDDOptions(e.heading, formControls);
          Object.keys(prevFormGroup.controls).forEach(k => {
            prevFormGroup.controls[k].setValue(this.oneStaffData[0][k]);
          });
          prevFormGroup.markAsPristine();
          this.selectedTabName = e.heading;
          this.tabControls = formControls;
          this.oneStaffService.setTabForm(form);
          this.cancelClicked = false;
          triggerValidations(this.oneStaffForm);
        });
        this.bsModalRef.content.onCancel.subscribe((response) => {

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
        const fg = this.oneStaffForm.controls[form] as FormGroup;
        if (this.tabControls.findIndex(cntl => cntl.name === 'homeOfficeSupervisorFullName') > 0) {
          fg.controls.homeOfficeSupervisorFullName.setValue(this.oneStaffData[0].currentSupervisor);
        }
        if (this.tabControls.findIndex(cntl => cntl.name === 'reassignmentOrgLevel') > 0 &&
          this.tabControls.findIndex(cntl => cntl.name === 'reassignmentOffice') > 0) {
          if (fg.controls.reassignmentOffice.value && fg.controls.reassignmentOrgLevel.value) {
            this.busyTableSave = this.humanCapitalService.getAvailableVacancies(
              fg.controls.reassignmentOffice.value,
              fg.controls.reassignmentOrgLevel.value,
              'Vacancy',
              this.oneStaffSearchForm.controls.year.value).subscribe(args => {
                // added for disable the VacancyDD Option values based on condition availableForReassignment property
                disabledVacancyDDOptions(args, this.tabControls);
              });
          }
        }

        if (this.tabControls.findIndex(cntl => cntl.name === 'vacancy') > 0 && fg.controls.vacancy.value) {
          this.busyTableSave = this.humanCapitalService.getEmpployeeData(
            fg.controls.reassignmentOffice.value,
            fg.controls.reassignmentOrgLevel.value,
            this.oneStaffSearchForm.controls.year.value,
            fg.controls.vacancy.value).subscribe(args => {
              if (args) {
                fg.controls.vacancy.setValue(args[0].displaySummary);
                fg.controls.reassignmentjobTitle.setValue(args[0].jobTitle);
                fg.controls.reassignmentSeries.setValue(args[0].series);
                fg.controls.reassignmentpayPlan.setValue(args[0].payPlan);
                fg.controls.reassignmentGrade.setValue(args[0].grade);
                fg.controls.reassignmentjobCode.setValue(args[0].jobCode);
                fg.controls.reassignmentStep.setValue(args[0].step);
                // fg.controls.reassignmentComments.setValue(args[0].comments);
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
      const fg = this.oneStaffForm.controls[form] as FormGroup;
      this.oneStaffService.setTabForm(form);
      if (this.tabControls.findIndex(cntl => cntl.name === 'homeOfficeSupervisorFullName') > 0) {
        fg.controls.homeOfficeSupervisorFullName.setValue(this.oneStaffData[0].currentSupervisor);
      }
      triggerValidations(fg);
      this.cancelClicked = false;
    }

  }
  hideDDOptions(tab, formControls) {
    if (tab === 'Process a Reassignment') {
      const i = formControls.find(e => e.name === 'action');
      const fg1 = this.oneStaffForm.controls['tab2'] as FormGroup;
      if (this.oneStaffData[0].action !== '4' && this.oneStaffData[0].action !== '7') {
        fg1.controls.action.setValue(null);
      } else {
        console.log(fg1.controls.action.value);
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
  formCntrlValueChange(form) {
    if (this.selectedTabName !== 'Edit Staff/ Vacancy Information') {
      this.formValid = form.invalid ? false : true;
    } else {
      this.formValid = true;
    }
  }

  onSubmit(e: string, title: string) {
    const fg = this.oneStaffForm.controls[e] as FormGroup;
    triggerValidations(fg);
    this.editedData = {
      orgLevel: this.selectedEmpVacOrg,
      employee: this.oneStaffSearchForm.controls.empVac.value,
      office: this.oneStaffSearchForm.controls.office.value
    };
    if (this.selectedTabName === 'Process a Reassignment' || this.selectedTabName === 'Process a Departure') {
      this.editedData = {
        orgLevel: this.selectedEmpVacOrg,
        employee: this.oneStaffSearchForm.controls.empVac.value,
        office: this.oneStaffSearchForm.controls.office.value,
        lastName: this.oneStaffData[0].lastName
      };
    }
    if (this.selectedTabName === 'Change Org. Level') {
      this.editedData = {
        year: this.oneStaffSearchForm.controls.year.value,
        orgLevel: this.selectedEmpVacOrg,
        employee: this.oneStaffSearchForm.controls.empVac.value,
        office: this.oneStaffSearchForm.controls.office.value
      };
    }
    if (this.selectedTabName === 'Change Fiscal Year') {
      this.editedData = {
        currYear: this.oneStaffSearchForm.controls.year.value,
        orgLevel: this.selectedEmpVacOrg,
        employee: this.oneStaffSearchForm.controls.empVac.value,
        office: this.oneStaffSearchForm.controls.office.value
      };
    }
    if (this.selectedTabName === 'Process a Detail/Temporary Promotion') {
      this.editedData = {
        orgLevel: this.selectedEmpVacOrg,
        office: this.oneStaffSearchForm.controls.office.value,
        employee: this.oneStaffSearchForm.controls.empVac.value,
        firstName: this.oneStaffData[0].firstName,
        lastName: this.oneStaffData[0].lastName,
        middleInitial: this.oneStaffData[0].middleInitial
      };
    }
    if (fg.valid) {
      const tempForm = fg.value;
      for (const value in tempForm) {
        if (value) {
          for (const key in this.oneStaffData[0]) {
            if (value === key) {
              if (this.oneStaffData[0][value] !== tempForm[key]) {
                const datePipe = new DatePipe('en-US');
                const regex = RegExp('(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])');
                if (regex.test(tempForm[key])) {
                  tempForm[key] = datePipe.transform(tempForm[key], 'MM/dd/yyyy');
                }
                if (key === 'currentSupervisor') {
                  const i = this.employees.find(emp => emp.id === tempForm[key]);
                  tempForm[key] = i.fullName;
                }
                this.editedData[value] = tempForm[key];
              }
            } else {
              const datePipe = new DatePipe('en-US');
              const regex = RegExp('(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])');
              if (regex.test(tempForm[value])) {
                tempForm[value] = datePipe.transform(tempForm[value], 'MM/dd/yyyy');
              }
              this.editedData[value] = tempForm[value];
            }
          }
        }
      }
      const a = this.editedData;
      let tempSaveData = [];
      if (Object.keys(a).length !== 0) {
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
        message: `Warning: Processing a reassignment will reassign the selected employee to the selected vacancy within
        another Office/organizational level. This will be reflected on the Staffing Plan once the effective date is reached.`,
        buttonTitle: 'OK',
        parentModelRef: this.bsModalRef
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
  // to save the one-staff info
  saveOneStaff(tempSaveData, title, fg) {
    this.busyTableSave = this.humanCapitalService.postOneStaffData(
      this.oneStaffSearchForm.controls.year.value, tempSaveData, title).subscribe(
        args => {
          this.toaster.pop('success', 'Saved', 'Saved data Successfully');
          fg.markAsPristine();
          this.onGoClick();
        }, error => {
          this.toaster.pop('error', 'Failed', error.error.errorDetails[0].message);
        });
  }
  onOfficeChangeEvent(e) {
    this.oneStaffSearchForm.controls.year.reset();
    this.oneStaffSearchForm.controls.orgLevel.reset();
    this.selectedEmpVacOrg = null;
    this.oneStaffSearchForm.controls.positnType.reset();
    this.oneStaffSearchForm.controls.empVac.reset();
    this.orgList = [];
    this.empVacList = [];
    const officeOrgList = this.officeOrgList.filter(org => org.office === this.oneStaffSearchForm.controls.office.value);
    this.orgList = officeOrgList[0].orgLevels;
  }

  onPositnTypeChangeEvent(e) {
    this.positionType = e;
    this.oneStaffSearchForm.controls.empVac.reset();
    this.busyTableSave = this.humanCapitalService.getEmpployeeVacancies(
      this.oneStaffSearchForm.controls.office.value,
      this.oneStaffSearchForm.controls.orgLevel.value,
      this.oneStaffSearchForm.controls.positnType.value,
      this.oneStaffSearchForm.controls.year.value).subscribe(args => {
        // sorting for employee fullname
        args = trimObject(args);
        // args.sort((a, b) => (a.fullName < b.fullName ? -1 : 1));
        this.empVacList = args;
      });
  }
  onEmpVacChangeEvent(e) {
    this.selectedEmpVacOrg = e.orgLevel;
    // this.oneStaffSearchForm.controls.orgLevel.setValue(e.orgLevel);
  }
  onYearChangeEvent() {
    this.oneStaffSearchForm.controls.positnType.reset();
    this.oneStaffSearchForm.controls.empVac.reset();
    this.empVacList = [];
  }
  onOrgChangeEvent() {
    this.oneStaffSearchForm.controls.year.reset();
    this.oneStaffSearchForm.controls.positnType.reset();
    this.oneStaffSearchForm.controls.empVac.reset();
    this.empVacList = [];
  }

  onGoClick() {
    this.humanCapitalService.getPayPeriodDatesList().subscribe(args => {
      this.validPayPeriodDates = args;
    });
    document.getElementById('goButton').focus();
    this.tabs.forEach(element => {
      if (element.formControls) {
        element.formControls.forEach(formControl => {
          if (formControl.type === 'dropdown') {
            if (formControl.name === 'newYear') {
              formControl.options = this.yearsList.map(x => ({
                id: x,
                smartListName: x,
                value: x
              }));
              formControl.options.forEach(e => {
                if (e.value === this.oneStaffSearchForm.controls.year.value) {
                  e.disabled = true;
                }
              });
            }
          }
        });
      }
    });
    triggerValidations(this.oneStaffSearchForm);
    if (this.oneStaffForm) {
      if (this.oneStaffForm.dirty) {
        this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
        this.bsModalRef.content.okSave.subscribe((response) => {
          this.oneStaffData = [];
          this.tabs = [];
          this.oneStaffForm.markAsPristine();
          this.getOneStaffData();
        });
        this.bsModalRef.content.onCancel.subscribe((response) => {
          this.oneStaffSearchForm.reset();
          const tempSearch: any = this.oneStaffService.getOneStaffSearchDDVals();
          this.oneStaffSearchForm.controls.office.setValue(tempSearch.office);
          this.oneStaffSearchForm.controls.year.setValue(tempSearch.year);
          this.oneStaffSearchForm.controls.positnType.setValue(tempSearch.positnType);
          this.oneStaffSearchForm.controls.orgLevel.setValue(tempSearch.orgLevel);
          this.selectedEmpVacOrg = tempSearch.orgLevel;
          this.empVacList = this.oneStaffService.getAllEmpVacancies();
          this.oneStaffSearchForm.controls.empVac.setValue(tempSearch.empVac);
        });
      } else {
        this.oneStaffData = [];
        this.tabs = [];
        this.getOneStaffData();
      }
    } else {
      this.oneStaffData = [];
      this.tabs = [];
      this.getOneStaffData();
    }
  }

  getOneStaffData() {
    this.oneStaffService.setAllEmpVacancies(this.empVacList);
    this.oneStaffService.setOneStaffSearchDDVals(this.oneStaffSearchForm.value);
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      this.oneStaffSearchForm.controls.office.value,
      'Employee',
      this.currentYear).subscribe(supervisors => {
        this.employees = supervisors;
        this.busyTableSave = this.humanCapitalService.getEmpployeeData(
          this.oneStaffSearchForm.controls.office.value,
          this.selectedEmpVacOrg,
          this.oneStaffSearchForm.controls.year.value, this.oneStaffSearchForm.controls.empVac.value).subscribe(args => {
            if (args) {
              args[0].year = this.oneStaffSearchForm.controls.year.value;
              this.oneStaffData = args;
              // to check the process reassignment data
              this.disableReassignClearButton = processReassignmentDataCheck(this.oneStaffData);
              // TO Check the departure data avaialble or not
              this.disableDepartureLog = departureDataCheck(this.oneStaffData);
              this.empVac = args[0].fullName;
              // dynamic tabs based on employee(display 4 tabs) or vacancy(first tab)
              if (this.oneStaffSearchForm.controls.positnType.value.startsWith('V')) {
                this.tabs = [];
                FormValues.getTabs.forEach(tab => {
                  if (tab.key === 'tab1' || tab.key === 'tab5' || tab.key === 'tab6') {
                    this.tabs.push(tab);
                  }
                });
              } else {
                // display tabs except tab5
                this.tabs = FormValues.getTabs.filter(ele => ele.key !== 'tab5');
              }
              // ***
              this.tabs.forEach(tab => {
                if (tab.title === 'Edit Staff/ Vacancy Information') {
                  tab.active = true;
                }
              });
              this.oneStaffForm = this.createFormGroups(args[0]);
              const tabActive = this.tabs.find(tab => tab.title === 'Edit Staff/ Vacancy Information');
              this.cancelClicked = false;
              this.oneStaffService.setTabForm('');
              const e = { heading: 'Edit Staff/ Vacancy Information' };
              this.onTabSelect(e, tabActive.formControls, 'tab1', 0);
              this.formValid = true;
              this.tabControls.forEach(element => {
                if (element.name === 'currentSupervisor') {
                  element.options = this.employees.filter(emp => emp.supervisor).map(x => ({
                    id: x.id,
                    smartListName: x.office,
                    value: x.fullName
                  }));
                  // sorting for current supervisior name
                  element.options = trimObject(element.options);
                  element.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                }
                if (element.name === 'actingCtpStaffName') {
                  element.options = this.employees.map(x => ({
                    id: x.id,
                    smartListName: x.office,
                    value: x.fullName
                  }));
                  // sorting for actingCtpStaffName
                  element.options = trimObject(element.options);
                  element.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                }
                // added for get the proper values onload forjobtitle mapping
                this.onloadJobTitleMapping(element);
              });
            }
            this.oneStaffForm.markAsPristine();
          });
      });

  }
  selectedRAOffice(selectedObject) {
    let selectedVacancyValue;
    if (selectedObject.formControl === 'vacancy') {
      selectedVacancyValue = selectedObject.formGroup.controls.vacancy.value;
      if (selectedVacancyValue && selectedVacancyValue.length !== 0 &&
        selectedObject.formGroup.controls.reassignmentOffice.value &&
        selectedObject.formGroup.controls.reassignmentOrgLevel.value) {
        this.busyTableSave = this.humanCapitalService.getEmpployeeData(
          selectedObject.formGroup.controls.reassignmentOffice.value,
          selectedObject.formGroup.controls.reassignmentOrgLevel.value,
          this.oneStaffSearchForm.controls.year.value,
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
                id: x.fullName,
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
    if (selectedObject.formControl === 'ctpDetailOffice' && !selectedObject.value) {
      this.tabControls.forEach(element => {
        if (element.name === 'ctpDetailSupFullName' || element.name === 'ctpDetailOrgLevel') {
          element.options = [];
        }
      });
      selectedObject.formGroup.controls.ctpDetailOrgLevel.setValue('');
      selectedObject.formGroup.controls.ctpDetailSupFullName.setValue('');
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
              if (e.id === this.selectedEmpVacOrg) {
                e.disabled = true;
              }
            });
          }
        }
      });
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
        selectedObject.formGroup.controls.reassignmentComments.setValue('');
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
                this.oneStaffSearchForm.controls.year.value).subscribe(args => {
                  // added for disable the VacancyDD Option values based on condition availableForReassignment property
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
        selectedObject.formGroup.controls.reassignmentComments.setValue('');
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

        e.formGroup.controls.ctpDetailSeries.setValue('');
        e.formGroup.controls.ctpDetailPayPlan.setValue('');
        if (e.formGroup.controls.detailType.value !== '1') {
          e.formGroup.controls.ctpDetailGrade.setValue('');
        }
      } else if (e.smartList === 'series') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        if (e.formGroup.controls.detailType.value !== '1') {
          e.formGroup.controls.ctpDetailGrade.setValue('');
        }
        e.formGroup.controls.ctpDetailPayPlan.setValue('');
      } else if (e.smartList === 'payPlan') {
        jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, e);
        if (e.formGroup.controls.detailType.value !== '1') {
          e.formGroup.controls.ctpDetailGrade.setValue('');
        }
      }
    }
  }
  addRecruitmentandLogistics() {
    if (this.oneStaffForm.dirty) {
      const initialState = {
        saveFormData: true,
      };
      this.modalService.show(ErrorDialogComponent, { initialState });
    } else {
      const initialState = {
        oneStaffData: this.oneStaffData,
        screenName: 'addrecruitment',
        message: `To add a new entry to the Recruitment and Logistics Log, press OK. After an entry is created,
        any future edits will need to be completed in the Recruitment and Logistics Log, not the Staffing Plan.`,
        recruitmentLogisticsData: this.oneStaffForm,
        office: this.oneStaffSearchForm.controls.office.value,
        year: this.oneStaffSearchForm.controls.year.value,
        orgLevel: this.selectedEmpVacOrg,
        parentModelRef: this.bsModalRef
      };
      this.modalService.show(AddRecruitmentLogisticsComponent, { initialState });
    }
  }
  // TO Clear departure data button
  clearDepartureData() {
    const year = this.oneStaffSearchForm.controls.year.value;
    const orgLevel = this.selectedEmpVacOrg;
    const employeeId = this.oneStaffSearchForm.controls.empVac.value;
    const initialState = {
      message: 'Are you sure you want to delete the Departure data? This will clear the corresponding entry in the Departure Log.',
      buttonTitle: 'Yes'
    };
    this.bsModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.bsModalRef.content.event.subscribe((response: boolean) => {
      if (response === true) {
        // call the API
        this.humanCapitalService.clearDepartureRow(year, orgLevel, employeeId).subscribe(data => {
          if (data.success === true) {
            this.toaster.pop('success', 'Deleted', 'Deleted view successfully');
          }
        });
        this.onGoClick();
      }
    });
  }
  clearReassignment(tabs) {
    const year = this.oneStaffSearchForm.controls.year.value;
    const orgLevel = this.selectedEmpVacOrg;
    const employeeId = this.oneStaffSearchForm.controls.empVac.value;
    const initialState = {
      screenName: 'clearReassignment',
      message: `Warning: Are you sure you want to clear reassignment data from the Staffing Plan?`,
      buttonTitle: 'Yes'
    };
    this.bsModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.bsModalRef.content.event.subscribe((response: boolean) => {
      if (response === true) {

        this.humanCapitalService.clearReassignmentRow(year, orgLevel, employeeId).subscribe(data => {
          if (data.success === true) {
            this.toaster.pop('success', 'Deleted', 'Deleted view successfully');
          }
        });
        this.onGoClick();
      }
    });
  }
  // onload
  onloadJobTitleMapping(e) {
    let tab1formGroup;
    if (e.name === 'jobTitle' && this.oneStaffData[0].jobTitle) {
      tab1formGroup = {
        formControl: 'jobTitle',
        formGroup: this.oneStaffForm.controls.tab1, smartList: 'jobTitle', value: this.oneStaffData[0].jobTitle
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    } else if (e.name === 'payPlan' && this.oneStaffData[0].payPlan) {
      console.log('payPlan', this.oneStaffData[0].payPlan);
      tab1formGroup = {
        formControl: 'payPlan',
        formGroup: this.oneStaffForm.controls.tab1, smartList: 'payPlan', value: this.oneStaffData[0].payPlan
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    } else if (e.name === 'grade' && this.oneStaffData[0].grade) {
      tab1formGroup = {
        formControl: 'grade',
        formGroup: this.oneStaffForm.controls.tab1, smartList: 'grade', value: this.oneStaffData[0].grade
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    } else if (e.name === 'jobCode' && this.oneStaffData[0].jobCode) {
      tab1formGroup = {
        formControl: 'jobCode',
        formGroup: this.oneStaffForm.controls.tab1, smartList: 'jobCode', value: this.oneStaffData[0].jobCode
      };
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.tabControls, tab1formGroup);
    }
  }

}
