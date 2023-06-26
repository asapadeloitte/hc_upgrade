import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { HumanCapitalService } from '../services/humanCapital.service';
import { Announcement, VacancyInfo } from '../models/hiring-plan.model';
import { ToasterService } from 'angular2-toaster';
import { PushVacancyService } from 'src/app/modules/hiring-plan/components/push-vacancies/push-vacancy.service';
import { SaveConfirmationDialogComponent } from '../components/save-confirmation-dialog/save-confirmation-dialog.component';


@Component({
  selector: 'app-submit-push-vacaniesto-hiring-plan-dialog',
  templateUrl: './submit-push-vacaniesto-hiring-plan-dialog.component.html',
  styleUrls: ['./submit-push-vacaniesto-hiring-plan-dialog.component.scss']
})
export class SubmitPushVacaniestoHiringPlanDialogComponent implements OnInit {
  public busyTableSave: Subscription;
  public announcementList: any;
  public announcement: Announcement;
  @Input() year;
  @Input() office;
  @Input() selectedRows;
  childModalRef: BsModalRef;
  public disableSubmit = true;
  public sharedCertificateConfirmation: string;
  constructor(
    public humanCapitalService: HumanCapitalService,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    public toaster: ToasterService,
    public pushVacancyService: PushVacancyService
  ) { }

  ngOnInit() {
    // get the existing  announcements from API
    const payPlan = this.selectedRows[0].payPlan;
    const hiringMechanism = this.selectedRows[0].hiringMechanism;
    this.busyTableSave = this.humanCapitalService.getAssociatedVacaniesData
      (this.year, payPlan, hiringMechanism).subscribe(args => {
        if (args.length > 0) {
          args.forEach(element => {
            if (element.jobReqNbr !== null) {
              element.announcementDisplayId = element.announcementDisplayId + ' - Job Req #' + element.jobReqNbr;
            }
          });
          const nullItems = args.filter(e => e.jobReqNbr !== null);
          this.announcementList =
            [...nullItems.sort((a, b) => +a.jobReqNbr > +b.jobReqNbr ? 1 : -1), ...args.filter(y => y.jobReqNbr === null)];
          this.announcementList.forEach(element => {
            element.announcementDisplayId = element.jobReqNbr === null ?
              element.announcementDisplayId + ' - Pending Job Req #' : element.announcementDisplayId;
          });
        }
      });
  }
  // call the service to submit vacanies to hiringplan
  submitApproval() {
    this.disableSubmit = true;
    if (this.sharedCertificateConfirmation === 'sharedCertificate') {
      const initialState = {
        message: 'Warning: Are you sure this position will be filled via a shared certificate?',
        parentModelRef: this.bsModalRef,
        buttonTitle: 'Yes'
      };
      this.childModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      this.childModalRef.content.event.subscribe((response: boolean) => {
        if (response === true) {
          this.submitAnnouncement();
        }
      });
    } else if (this.sharedCertificateConfirmation === 'nonCompetitiveSelection') {
      const initialState = {
        message: 'Warning: Are you sure this position will be filled via a Non-Competitive Selection?',
        parentModelRef: this.bsModalRef,
        buttonTitle: 'Yes'
      };
      this.childModalRef = this.modalService.show(SaveConfirmationDialogComponent, { initialState });
      this.childModalRef.content.event.subscribe((response: boolean) => {
        if (response === true) {
          this.submitAnnouncement();
        }
      });
    } else {
      this.submitAnnouncement();
    }
  }
  // call the API
  submitAnnouncement() {
    this.busyTableSave = this.humanCapitalService.associateVacancies(this.announcement).subscribe((data) => {
      if (data.success === true) {
        this.bsModalRef.hide();
        this.toaster.pop('success', 'Success', 'Successfully Pushed Vacancies to Hiring Plan');
        this.pushVacancyService.onSave(true);
      }
    });
  }
  onAnnouncementSelection(event: any) {
    this.disableSubmit = false;
    this.announcement = new Announcement();
    this.announcement.year = this.year;
    if (event === 'sharedCertificate') {
      this.sharedCertificateConfirmation = event;
      this.announcement.sharedCertificate = true;
      this.announcement.announcementId = null;
      this.announcement.nonCompetitiveSelection = false;
    } else if (event === 'nonCompetitiveSelection') {
      this.sharedCertificateConfirmation = event;
      this.announcement.sharedCertificate = false;
      this.announcement.announcementId = null;
      this.announcement.nonCompetitiveSelection = true;
    } else {
      this.announcement.sharedCertificate = false;
      this.announcement.nonCompetitiveSelection = false;
      this.sharedCertificateConfirmation = event;
      if (event === 'null' || event === null || event === undefined) {
        this.announcement.announcementId = null;
      } else {
        this.announcement.announcementId = event.announcementId;
      }
    }
    this.selectedRows.forEach(element => { // CBAS-6257
      const vacancyInfo = new VacancyInfo();
      vacancyInfo.orgLevel = element.orgLevel;
      vacancyInfo.office = element.office;
      vacancyInfo.vacancyId = element.vacancyId;
      vacancyInfo.year = element.year;
      this.announcement.associatedVacancyInfo.push(vacancyInfo);
    });
    if (event === undefined) {
      this.disableSubmit = true;
    }
  }
  close() {
    this.bsModalRef.hide();
  }
}

