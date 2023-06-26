import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OneStaffService } from 'src/app/modules/staffing-plan/components/edit-member-vacancy-one-staff/one-staff.service';

import { RecruitmentLogistics } from '../../models/reports.model';
import { HumanCapitalService } from '../../services/humanCapital.service';


@Component({
  selector: 'app-add-recruitment-logistics',
  templateUrl: './add-recruitment-logistics.component.html',
  styleUrls: ['./add-recruitment-logistics.component.scss']
})
export class AddRecruitmentLogisticsComponent implements OnInit {


  @Output() closeClick = new EventEmitter<boolean>();
  @Input() recruitmentLogisticsData;
  @Input() year;
  @Input() office;
  @Input() orgLevel;
  @Input() oneStaffData;
  @Input() screenType;
  @Input() parentModelRef;
  @Input() message;
  public errorDetails: any = [];
  public data = [];
  constructor(
    private humanCapitalService: HumanCapitalService,
    private addbsModalRef: BsModalRef,
    public toaster: ToasterService,
    public oneStaffService: OneStaffService) { }

  ngOnInit() {
  }
  addRecruitmentLogistics() {
    this.constructDataObject();
    this.addbsModalRef.hide();
  }
  constructDataObject() {
    if (this.screenType === 'hyperlink') {
      this.oneStaffData = [this.oneStaffData];
    }
    const tab1Value = this.recruitmentLogisticsData.controls.tab1.value;
    const logisticsData = new RecruitmentLogistics();
    logisticsData.orgLevel = this.orgLevel;
    logisticsData.orgLevelAlias = this.oneStaffData[0].orgLevelAlias;
    logisticsData.office = this.office;
    logisticsData.year = this.year;
    logisticsData.lastName = this.oneStaffData[0].lastName;
    logisticsData.firstName = this.oneStaffData[0].firstName;
    logisticsData.middleInitial = this.oneStaffData[0].middleInitial;
    logisticsData.jobTitle = tab1Value.jobTitle;
    logisticsData.jobCode = tab1Value.jobCode;
    logisticsData.payPlan = tab1Value.payPlan;
    logisticsData.series = tab1Value.series;
    logisticsData.grade = tab1Value.grade;
    logisticsData.action = tab1Value.action;
    logisticsData.rlEffectiveDate = tab1Value.rlEffectiveDate;
    logisticsData.roomNbr = tab1Value.roomNo;
    logisticsData.bargainingUnit = tab1Value.bargainingUnit;
    logisticsData.recruitmentComments = tab1Value.comments;
    logisticsData.laptopPropertyCodeNbr = tab1Value.laptopSetupPropertyCodeNo;
    logisticsData.laptopRequestTicketNbr = tab1Value.laptopRequestTicketNo;
    logisticsData.previouslyFromFda = tab1Value.previouslyFromFda;
    logisticsData.newHireToFda = tab1Value.newHireToFda;
    logisticsData.previousFdaCenter = tab1Value.previousFdaCenter;
    logisticsData.currentSupervisor = tab1Value.currentSupervisor;
    logisticsData.previousEmployer = tab1Value.previousEmployer;
    logisticsData.hcLiaison = tab1Value.hcLiaison;
    logisticsData.clpEligibilityDate = tab1Value.clpEligibilityDate;
    logisticsData.ctpEod = tab1Value.ctpEod;
    this.humanCapitalService.addRecruitmentLogistics(logisticsData).subscribe(data => {
      this.toaster.pop('success', 'Saved', 'Successfully saved the Recruitment and Logistics');
    }, error => {
      error.error.errorDetails.forEach(element => {
        this.errorDetails.push(element.message);
      });
      this.toaster.pop('error', 'Failed', this.errorDetails);
    });
  }
  close() {
    this.addbsModalRef.hide();
    this.closeClick.emit(true);
  }
}
