import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { FieldMapping } from 'src/app/shared/models/user.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { jobTitleMapping, triggerValidations, trimObject } from 'src/app/shared/utilities';

import { OneStaffService } from '../edit-member-vacancy-one-staff/one-staff.service';
import { CreateVacancyFormValues } from './createvacancy.enum';
import {
  DetailTemPromotionLogService
} from 'src/app/modules/reports/components/detail-temporary-promotion-log/detail-tem-promotion-log.service';

@Component({
  selector: 'app-createvacancy',
  templateUrl: './createvacancy.component.html',
  styleUrls: ['./createvacancy.component.scss']
})
export class CreatevacancyComponent implements OnInit {

  public yearsList = [];
  public createVacancyTopForm: FormGroup;
  @ComponentForm(true)
  public createVacancyDataForm: FormGroup;
  public busyTableSave: Subscription;
  public formFields: any[] = [];
  public officeOrgList: any;
  public orgList: any;
  public smartListData = [];
  public adminCode: string;
  public jobTitleMapping: FieldMapping[];
  public employees: any;
  public showForm = false;
  public currentYear: string;

  bsModalRef: BsModalRef;
  constructor(
    private fb: FormBuilder,
    private humanCapitalService: HumanCapitalService,
    private _smartListService: SmartListConversionService,
    private toaster: ToasterService,
    private modalService: BsModalService,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,
    private oneStaffService: OneStaffService,
    private _adminService: AdminService,
    private detailTemPromotionLogService: DetailTemPromotionLogService,
  ) {
    this.formFields = CreateVacancyFormValues.formControls;
  }

  ngOnInit() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.officeOrgList = args.officeOrgLevelMapping;
      this.yearsList = args.years;
      this.currentYear = args.currentYear;
      this.humanCapitalService.getSmartList().subscribe(smList => {
        this._smartListService.setDDVals(smList);
        this._adminService.getFieldMappings().subscribe(data => {
          if (data) {
            this.jobTitleMapping = data;
            this.smartListData = this._smartListService.getDDVals();
            this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeOrgList, this.jobTitleMapping);
            const tempFplSmartList = this.detailTemPromotionLogService.getFplSmartLists();
            this.smartListData.push(tempFplSmartList);
            if (this.smartListData) {
              this.formFields.forEach(formControl => {
                if (formControl.type === 'dropdown') {
                  const dropdownOptions = this.smartListData.find(f => f.smartListName === formControl.name);
                  formControl.options = dropdownOptions ? dropdownOptions.smartListValues : [];
                  if (formControl.smartListName === 'jobTitle') {
                    formControl.options = formControl.options.filter(x => this.jobTitleMapping.some(y => y.jobTitle.includes(x.value)));
                    formControl.options = trimObject(formControl.options);
                    formControl.options.sort((a, b) => (a.value < b.value ? -1 : 1));
                  }
                }
              });
            }
          }
        });
      });
    });
    this.loadVacancyTopForm();
  }

  loadVacancyTopForm() {
    this.createVacancyTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, [Validators.required]],
      orgLevel: [null, [Validators.required]]
    });
  }

  loadVacancyDetailForm() {
    if (this.createVacancyDataForm) {
      if (this.createVacancyDataForm.dirty) {
        this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
        this.bsModalRef.content.okSave.subscribe((response) => {
          this.createVacancyDataForm.markAsPristine();
          this.showForm = false;
          this.createVacancyDataForm = this.fb.group({});
          setTimeout(() => {
            this.createForm();
          }, 200);
        });
        this.bsModalRef.content.onCancel.subscribe((response) => {
          const tempDDVals = this.oneStaffService.getOneStaffSearchDDVals();
          this.createVacancyTopForm.controls.year.setValue(tempDDVals.year);
          this.createVacancyTopForm.controls.office.setValue(tempDDVals.office);
          this.createVacancyTopForm.controls.orgLevel.setValue(tempDDVals.orgLevel);
        });
      } else {
        this.showForm = false;
        setTimeout(() => {
          this.createForm();
        }, 200);
      }
    } else {
      this.showForm = false;
      setTimeout(() => {
        this.createForm();
      }, 200);
    }
  }
  onOfficeChangeEvent(e) {
    this.createVacancyTopForm.controls.orgLevel.reset();
    const officeOrgList = this.officeOrgList.filter(org => org.office === this.createVacancyTopForm.controls.office.value);
    this.orgList = officeOrgList[0].orgLevels;
  }

  onYearChangeEvent() {
  }
  onOrgChangeEvent(e) {
    this.adminCode = e.adminCode;
  }
  createForm() {
    this.showForm = true;
    this.busyTableSave = this.humanCapitalService.getSupervisorData(
      this.createVacancyTopForm.controls.office.value,
      'Employee',
      this.currentYear).subscribe(args => {
        this.employees = args;
        this.formFields.forEach(element => {
          if (element.name === 'currentSupervisor') {
            element.options = this.employees.filter(emp => emp.supervisor).map(x => ({
              id: x.id,
              smartListName: x.office,
              value: x.fullName
            }));
            element.options = trimObject(element.options);
            element.options.sort((a, b) => (a.value < b.value ? -1 : 1));
          }
        });
      });

    this.createVacancyDataForm = this.createFormGroups();
    setTimeout(() => {
      this.createVacancyDataForm.controls.adminCode.setValue(this.adminCode);
      this.oneStaffService.setOneStaffSearchDDVals(this.createVacancyTopForm.value);
      this.createVacancyDataForm.markAsPristine();
      triggerValidations(this.createVacancyDataForm);
    }, 500);
  }

  createFormGroups() {
    let groups: FormGroup;
    groups = this.fb.group(this.createFormControls(this.formFields));
    return groups;
  }

  createFormControls(ctrls) {
    const formCtrls = {};

    ctrls.forEach(c => {
      formCtrls[c.name] = new FormControl(c.value, c.required ? Validators.required : []);
    });
    return formCtrls;
  }

  public saveVacanacy() {
    const year = this.createVacancyTopForm.controls.year.value;
    if (typeof this.createVacancyDataForm.controls.jobCode.value !== 'string') {
      this.createVacancyDataForm.controls.jobCode.setValue(null);
    }
    if (this.createVacancyDataForm.controls.currentSupervisor.value) {
      const i = this.employees.find(emp => emp.id === this.createVacancyDataForm.controls.currentSupervisor.value);
      this.createVacancyDataForm.controls.currentSupervisor.setValue(i.fullName);
    }
    const createVacancy = this.createVacancyDataForm.value;
    createVacancy['office'] = this.createVacancyTopForm.controls.office.value;
    createVacancy['orgLevel'] = this.createVacancyTopForm.controls.orgLevel.value;
    if (this.createVacancyDataForm.valid) {
      this.busyTableSave = this.humanCapitalService.createVacancy(createVacancy, year).subscribe(args => {
        this.toaster.pop('success', 'Vacancy created', 'Vacancy created successfully');
        this.createVacancyDataForm.reset();
        this.createVacancyDataForm.markAsPristine();
        this.createVacancyTopForm.reset();
        this.showForm = false;
        this.orgList = [];
      });
    } else {
      triggerValidations(this.createVacancyDataForm);
    }
  }

  onSelectChange(e) {
    if (e.formControl === 'jobTitle') {
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.formFields, e);
      e.formGroup.controls.series.setValue('');
      e.formGroup.controls.payPlan.setValue('');
      e.formGroup.controls.jobCode.setValue('');
      e.formGroup.controls.grade.setValue('');
      e.formGroup.controls.fpl.setValue('');
    } else if (e.formControl === 'series') {
    } else if (e.formControl === 'payPlan') {
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.formFields, e);
      e.formGroup.controls.grade.setValue('');
      e.formGroup.controls.jobCode.setValue('');
      e.formGroup.controls.fpl.setValue('');
    } else if (e.formControl === 'grade') {
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.formFields, e);
      e.formGroup.controls.jobCode.setValue('');
      e.formGroup.controls.fpl.setValue('');
    } else if (e.formControl === 'jobCode') {
      jobTitleMapping(this.smartListData, this.jobTitleMapping, this.formFields, e);
      e.formGroup.controls.fpl.setValue('');
    }
  }

}
