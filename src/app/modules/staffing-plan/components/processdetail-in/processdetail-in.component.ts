import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { ISelectOption } from 'src/app/shared/components/dropdown/types';
import {
  SaveConfirmationDialogComponent,
} from 'src/app/shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { FieldMapping } from 'src/app/shared/models/user.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { checkPayPeriodEffectiveDates, checkPayPeriodNteDates, jobTitleMapping, triggerValidations, trimObject } from 'src/app/shared/utilities';

import { OneStaffService } from '../edit-member-vacancy-one-staff/one-staff.service';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { FormValues } from './processdetail-in.enum';


@Component({
  selector: 'app-processdetail-in',
  templateUrl: './processdetail-in.component.html',
  styleUrls: ['./processdetail-in.component.scss']
})
export class ProcessdetailInComponent implements OnInit {
  public yearsList = [];
  public processDetailyearForm: FormGroup;
  @ComponentForm(true)
  public processDetailForm: FormGroup;
  public busyTableSave: Subscription;
  public status: ISelectOption[] = [];
  public detailType: ISelectOption[] = [];
  public formFields: any[] = [];
  public smartListData = [];
  public officeOrgList: any;
  public jobTitleMapping: FieldMapping[];
  public bsModalRef: BsModalRef;
  private saveConfirmationModalRef: BsModalRef;
  public employees: any;
  public showForm = false;
  public currentYear: string;
  public validPayPeriodDates: any = [];
  constructor(
    private fb: FormBuilder,
    private humanCapitalService: HumanCapitalService,
    private _smartListService: SmartListConversionService,
    private authService: AuthService,
    private toaster: ToasterService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    public changeHistoryService: ChangeHistoryService,
    private oneStaffService: OneStaffService,
    private _adminService: AdminService,
    el: ElementRef,
  ) {
    this.formFields = FormValues.formControls;
  }

  ngOnInit() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.officeOrgList = args.officeOrgLevelMapping;
      this.currentYear = args.currentYear;
      this.humanCapitalService.getSmartList().subscribe(smList => {
        this._smartListService.setDDVals(smList);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListData = this._smartListService.getDDVals();
            if (this.smartListData) {
              this.formFields.forEach(formControl => {
                if (formControl.type === 'dropdown') {
                  if (formControl.name !== 'ctpDetailOffice') {
                    const dropdownOptions = this.smartListData.find(f => f.smartListName === formControl.smartListName);
                    formControl.options = dropdownOptions ? dropdownOptions.smartListValues : [];
                    // if (formControl.name === 'ctpDetailSeries') {
                    //   formControl.options.unshift({
                    //     id: '0',
                    //     smartListName: 'Series',
                    //     value: '0000'
                    //   });
                    // }
                    if (formControl.smartListName === 'jobTitle') {
                      formControl.options = formControl.options.filter(x => this.jobTitleMapping.some(y => y.jobTitle.includes(x.value)));
                      formControl.options = trimObject(formControl.options);
                      formControl.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                    }
                    if (formControl.smartListName === 'grade') {
                      formControl.options = trimObject(formControl.options);
                      formControl.options.sort((a, b) => (+a.value > +b.value ? -1 : 1));
                    }
                  }
                  if (formControl.name === 'ctpDetailOffice') {
                    formControl.options = this.officeOrgList.map(x => ({
                      id: x.office,
                      smartListName: x.office,
                      value: x.office
                    }));
                  }
                  if (formControl.name === 'detailType') {
                    const dropdownOptionsDT = this.smartListData.find(f => f.smartListName === formControl.smartListName);
                    formControl.options = dropdownOptionsDT ? dropdownOptionsDT.smartListValues
                      .filter(e => e.id === '4' || e.id === '3') : [];
                  }
                }
              });
            }
          }
        });
      });
    });
    this.loadProcessDetailYearForm();
  }

  public loadProcessDetailYearForm() {
    this.processDetailyearForm = this.fb.group({
      year: [null, [Validators.required]]
    });
  }

  public loadProcessDetailForm() {
    this.humanCapitalService.getPayPeriodDatesList().subscribe(args => {
      this.validPayPeriodDates = args;
    });
    if (this.processDetailForm) {
      if (this.processDetailForm.dirty) {
        this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
        this.bsModalRef.content.okSave.subscribe((response) => {
          this.showForm = false;
          this.processDetailForm.markAsPristine();
          this.processDetailForm = this.fb.group({});
          setTimeout(() => {
            this.createForm();
          }, 200);
        });
        this.bsModalRef.content.onCancel.subscribe((response) => {
          const tempDDVals = this.oneStaffService.getOneStaffSearchDDVals();
          this.processDetailyearForm.controls.year.setValue(tempDDVals.year);
        });
      } else {
        this.showForm = false;
        this.processDetailForm = this.fb.group({});
        setTimeout(() => {
          this.createForm();
        }, 200);
      }
    } else {
      this.showForm = false;
      this.processDetailForm = this.fb.group({});
      setTimeout(() => {
        this.createForm();
      }, 200);
    }
  }

  public createForm() {

    this.showForm = true;
    const formCtrls = {};

    this.formFields.forEach(v => {
      formCtrls[v.name] = new FormControl(v.value || '', v.required ? v.validators : []);
    });
    this.processDetailForm = this.fb.group(formCtrls);
    setTimeout(() => {
      this.oneStaffService.setOneStaffSearchDDVals(this.processDetailyearForm.value);
      triggerValidations(this.processDetailForm);
    }, 500);
  }

  public onYearChangeEvent(e) {
  }


  public ProcessDetailFormSubmit() {
    const year = this.processDetailyearForm.controls.year.value;
    if (typeof this.processDetailForm.controls.ctpDetailSupFullName.value !== 'string') {
      this.processDetailForm.controls.ctpDetailSupFullName.setValue(null);
    }
    const tempForm = this.processDetailForm.value;
    const datePipe = new DatePipe('en-US');
    const regex = RegExp('(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])');
    for (const key in tempForm) {
      if (regex.test(tempForm[key])) {
        tempForm[key] = datePipe.transform(tempForm[key], 'MM/dd/yyyy');
      }
    }
    if (this.processDetailForm.valid) {
      // added for Effective Date and Nte Dtaes Checks align with PayPeriod 20.0 release 
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
            this.AddDetailTemporaryPromotionLog(tempForm, year);
          }
        });
      } else {
        // related to save confirmation dialog component
        this.AddDetailTemporaryPromotionLog(tempForm, year);
      }

    } else {
      triggerValidations(this.processDetailForm);
    }

  }
  AddDetailTemporaryPromotionLog(tempForm, year) {
    const initialState = {
      message: 'Are you sure you want to add an entry to the Detail/Temporary Promotion Log?',
      buttonTitle: 'Yes'
    };
    this.saveConfirmationModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
    this.saveConfirmationModalRef.content.event.subscribe((response: boolean) => {
      if (response === true) {
        this.saveProcessDetailIn(tempForm, year);
      }
    });

  }
  saveProcessDetailIn(tempForm, year) {
    this.busyTableSave = this.humanCapitalService.saveDetailIn(tempForm, year).subscribe(args => {
      this.toaster.pop('success', 'Saved', 'Process detail in saved successfully.');
      this.processDetailForm.reset();
      this.processDetailForm.markAsPristine();
      this.processDetailyearForm.reset();
      this.showForm = false;
    });
  }
  selectedRAOffice(selectedObject) {
    const temp = this.officeOrgList.find(e => e.office === selectedObject.value);
    if (selectedObject.formControl === 'ctpDetailOffice' && selectedObject.value) {
      this.busyTableSave = this.humanCapitalService.getSupervisorData(
        selectedObject.value,
        'Employee',
        this.currentYear).subscribe(args => {
          this.employees = args;
          this.formFields.forEach(element => {
            if (selectedObject.formControl === 'ctpDetailOffice') {
              if (selectedObject.value) {
                this.formFields.forEach(element => {
                  if (element.name === 'ctpDetailSupFullName') {
                    element.options = [];
                    element.options = this.employees.filter(emp => emp.supervisor).map(x => ({
                      id: x.fullName,
                      smartListName: x.office,
                      value: x.fullName
                    }));
                    element.options = trimObject(element.options);
                    element.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                  }
                });
              } else {
                if (element.name === 'ctpDetailSupFullName') {
                  element.options = [];
                }
              }
              selectedObject.formGroup.controls.ctpDetailOrgLevel.setValue('');
              selectedObject.formGroup.controls.ctpDetailSupFullName.setValue('');
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
            }
          });
        });
    }
    if (selectedObject.formControl === 'ctpDetailOffice' && !selectedObject.value) {
      this.formFields.forEach(element => {
        if (element.name === 'ctpDetailSupFullName' || element.name === 'ctpDetailOrgLevel') {
          element.options = [];
        }
      });
      selectedObject.formGroup.controls.ctpDetailOrgLevel.setValue('');
      selectedObject.formGroup.controls.ctpDetailSupFullName.setValue('');
    }
  }

  onSelectChange(e) {
    if (e.smartList === 'jobTitle') {
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.formFields, e);
      // this.formFields.forEach(element => {
      //   if (element.name === 'ctpDetailSeries') {
      //     const tempIndex = element.options.findIndex(temp => temp.id === '0');
      //     if (tempIndex < 0) {
      //       element.options.unshift({
      //         id: '0',
      //         smartListName: 'Series',
      //         value: '0000'
      //       });
      //     }
      //   }
      // });
      e.formGroup.controls.ctpDetailSeries.setValue('');
      e.formGroup.controls.ctpDetailPayPlan.setValue('');
      e.formGroup.controls.ctpDetailGrade.setValue('');
    } else if (e.smartList === 'series') {
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.formFields, e);
      e.formGroup.controls.ctpDetailGrade.setValue('');
      e.formGroup.controls.ctpDetailPayPlan.setValue('');
    } else if (e.smartList === 'payPlan') {
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.formFields, e);
      e.formGroup.controls.ctpDetailGrade.setValue('');
    }
  }
}
