import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import { QhpService } from './qhp.service';
import { SelectionsService } from 'src/app/modules/hiring-plan/components/selections/selections.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-quartely-hiring-plan-main',
  templateUrl: './quartely-hiring-plan-main.component.html',
  styleUrls: ['./quartely-hiring-plan-main.component.scss']
})
export class QuartelyHiringPlanMainComponent extends BasePageComponent implements OnInit {
  @ComponentForm(true)
  public qhpMainForm: FormGroup;
  public qHPStaffingPlanVacancySearchForm: FormGroup;
  public busyTableSave: Subscription;
  public yearsList = [];
  public officeList = [];
  public formEdited = false;
  public showbottomGridData = false;
  public officeName: any;
  public qhpExportData;
  public warningBsModalRef: BsModalRef;
  constructor(
    private fb: FormBuilder,
    protected humanCapitalService: HumanCapitalService,
    authService: AuthService,
    toaster: ToasterService,
    modalService: BsModalService,
    private selectionsService: SelectionsService,
    private qhpService: QhpService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);

  }

  ngOnInit() {
    this.qHPStaffingPlanVacancySearchForm = this.fb.group({
      office: [null, Validators.required],
    });
    this.loadBusyTable();
    this.roleList = this.authService.jwt_getRole();
    if (this.roleList === 'IT_Admin') {
      this.busyTableSave = this.humanCapitalService.qhpConsolidate().subscribe(args => {
        this.qhpExportData = args;
      });
    }
  }
  public loadBusyTable() {
    this.qhpMainForm = this.fb.group({});
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.officeList = args.officeOrgLevelMapping;
    });
  }
  public onOfficeChangeEvent(e) {
    this.officeName = this.qHPStaffingPlanVacancySearchForm.controls.office.value;
  }
  onGoClick() {
    if (this.officeList.length > 0) {
      this.showbottomGridData = true;
      this.qhpService.onGo(true);
    }
  }

  exportAsXLSX() {
    const headerNames = [['Fiscal Year',
      'Hiring QTR (Fiscal)', 'Office', 'JobTitle', 'Pay Plan', 'Grade', 'Positions on Board', 'Vacancy']];
    const wb = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, headerNames);

    XLSX.utils.sheet_add_json(ws, this.qhpExportData, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'export.xlsx');
  }

  onCellValueUpdated(event) {
    if (event) {
      this.qhpMainForm.markAsDirty();
      this.formEdited = true;
    } else {
      this.qhpMainForm.markAsPristine();
      this.formEdited = false;
    }
  }

}
