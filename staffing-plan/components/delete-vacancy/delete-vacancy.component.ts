import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import {
  WarningUnsavedChangesDialogComponent,
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';

import { DeleteVacancyFormValues } from './delete-vacancy.enum';
import {
  DetailTemPromotionLogService
} from 'src/app/modules/reports/components/detail-temporary-promotion-log/detail-tem-promotion-log.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { FieldMapping } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-delete-vacancy',
  templateUrl: './delete-vacancy.component.html',
  styleUrls: ['./delete-vacancy.component.scss']
})
export class DeleteVacancyComponent implements OnInit {
  deleteVacancyTopForm: FormGroup;
  deleteVacancyDataForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public year: string;
  public office: string;
  public orgLevel: string;
  public vacancy: string;
  public officeOrgList: any;
  public orgList: any;
  public vacancyList: any;
  public vacancyData = [];
  public bsModalRef: BsModalRef;
  public formFields: any[] = [];
  public smartListData = [];
  public jobTitleMapping: FieldMapping[];
  constructor(
    private fb: FormBuilder,
    private humanCapitalService: HumanCapitalService,
    private _smartListService: SmartListConversionService,
    private authService: AuthService,
    private toaster: ToasterService,
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    public changeHistoryService: ChangeHistoryService,
    el: ElementRef,
    private _adminService: AdminService,
    private detailTemPromotionLogService: DetailTemPromotionLogService
  ) {
    this.formFields = DeleteVacancyFormValues.formControls;
  }

  ngOnInit() {
    this.deleteVacancyTopForm = this.fb.group({
      year: [null, [Validators.required]],
      office: [null, [Validators.required]],
      orgLevel: [null, [Validators.required]],
      vacancy: [null, [Validators.required]]
    });
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.officeOrgList = args.officeOrgLevelMapping;
      this.yearsList = args.years;
      this.smartListData = this._smartListService.getDDVals();
      this.detailTemPromotionLogService.addAdditionalSmartLists(this.officeOrgList, this.jobTitleMapping);
      const tempFplSmartList = this.detailTemPromotionLogService.getFplSmartLists();
      this.smartListData.push(tempFplSmartList);

      if (this.smartListData) {
        this.formFields.forEach(formControl => {
          if (formControl.type === 'dropdown') {
            const dropdownOptions = this.smartListData.find(f => f.smartListName === formControl.name);
            formControl.options = dropdownOptions ? dropdownOptions.smartListValues : [];
          }
        });
      }
    });
  }

  public createForm(data) {
    const formCtrls = {};

    this.formFields.forEach(v => {
      formCtrls[v.name] = new FormControl(data[v.name] || '', v.required ? v.validators : []);
    });
    return this.deleteVacancyDataForm = this.fb.group(formCtrls);
  }

  onOfficeChangeEvent(e) {
    this.orgList = [];
    this.deleteVacancyTopForm.controls.orgLevel.reset();
    this.deleteVacancyTopForm.controls.vacancy.reset();
    const officeOrgList = this.officeOrgList.filter(org => org.office === this.deleteVacancyTopForm.controls.office.value);
    this.orgList = officeOrgList[0].orgLevels;
  }

  onYearChangeEvent(e) {
    this.deleteVacancyTopForm.controls.office.reset();
    this.deleteVacancyTopForm.controls.orgLevel.reset();
  }
  onOrgChangeEvent(e) {
    this.deleteVacancyTopForm.controls.vacancy.reset();
    this.busyTableSave = this.humanCapitalService.getEmpployeeVacancies(
      this.deleteVacancyTopForm.controls.office.value,
      this.deleteVacancyTopForm.controls.orgLevel.value, 'Vacancy',
      this.deleteVacancyTopForm.controls.year.value).subscribe(args => {
        this.vacancyList = args;
      });
  }
  onVacancyChangeEvent(e) {

  }
  getVacancyData() {
    this.busyTableSave = this.humanCapitalService.getEmpployeeData(
      this.deleteVacancyTopForm.controls.office.value,
      this.deleteVacancyTopForm.controls.orgLevel.value,
      this.deleteVacancyTopForm.controls.year.value,
      this.deleteVacancyTopForm.controls.vacancy.value).subscribe(args => {
        if (args) {
          this.vacancyData = args;
          this.deleteVacancyDataForm = this.createForm(args[0]);
        }
      });
  }

  public confirmDelete() {
    const year = this.deleteVacancyTopForm.value.year;
    const office = this.deleteVacancyTopForm.value.office;
    const orgLevel = this.deleteVacancyTopForm.value.orgLevel;
    const vacancy = this.deleteVacancyTopForm.value.vacancy;
    if (this.deleteVacancyDataForm) {
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.componentName = 'delete-vacancy';
      this.bsModalRef.content.okSave.subscribe((response) => {
        this.deleteVacancyDataForm.markAsPristine();
        this.deleteVacancy();
      });
      this.bsModalRef.content.onCancel.subscribe((response) => {
        this.deleteVacancyTopForm.controls.year.setValue(year);
        this.deleteVacancyTopForm.controls.office.setValue(office);
        this.deleteVacancyTopForm.controls.orgLevel.setValue(orgLevel);
        this.deleteVacancyTopForm.controls.vacancy.setValue(vacancy);
      });
    }
  }

  public deleteVacancy() {
    const deleteVacancy = {
      office: this.deleteVacancyTopForm.controls.office.value,
      orgLevel: this.deleteVacancyTopForm.controls.orgLevel.value,
      vacancyId: this.deleteVacancyTopForm.controls.vacancy.value
    };
    this.busyTableSave = this.humanCapitalService.deleteVacancy(deleteVacancy,
      this.deleteVacancyTopForm.controls.year.value).subscribe(args => {
        this.toaster.pop('success', 'Vacancy Deleted', 'Vacancy deleted successfully');
        this.deleteVacancyDataForm.reset();
        this.deleteVacancyTopForm.reset();
        this.orgList = [];
        this.vacancyList = [];
      });
  }
}
