import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User, FieldMapping } from '../../../../shared/models/user.model';
import { AdminService } from '../../../../shared/services/admin.service';
import { HttpResponse } from '@angular/common/http';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { Subscription } from 'rxjs';



declare var jQuery: any;

@Component({
    selector: 'app-delete-user-popup',
    templateUrl: './delete-user-popup.template.html',
    styleUrls: ['./delete-user-popup.styles.scss'],
    encapsulation: ViewEncapsulation.None
})

export class DeleteUserPopupComponent implements OnChanges, OnInit, OnDestroy {
    router: Router;
    showErrorFlag: boolean;
    user = new User();
    public busyTableSave: Subscription;
    fieldMapping = new FieldMapping();
    public message;
    public btnText;

    @Input() screenName;
    @Input() userId;
    @Input() deleteObj;



    // For users deltes
    @Output() reloadUsers = new EventEmitter<boolean>();
    @Output() userDeleted = new EventEmitter<boolean>();

    // For Vacancy Deletes
    @Output() reloadVacancies = new EventEmitter<boolean>();
    @Output() vacancyDeleted = new EventEmitter<boolean>();

    // For Acnnouncement Deletes
    @Output() reloadAnnouncments = new EventEmitter<boolean>();
    @Output() announcementDeleted = new EventEmitter<boolean>();

    // For Departure Log Deletes
    @Output() reloadDepartureLog = new EventEmitter<boolean>();
    @Output() departureLogDeleted = new EventEmitter<boolean>();

    // For Classifications delete
    @Output() reloadClassification = new EventEmitter<boolean>();
    @Output() classificationDeleted = new EventEmitter<boolean>();
    @Output() resetDeleteClicked = new EventEmitter<boolean>();

    // For Recruitment and Logistics
    @Output() reloadRecruitmentLogisticsLog = new EventEmitter<boolean>();
    @Output() recruitmentLogisticsLogDeleted = new EventEmitter<boolean>();
    //  @Output() resetDeleteClicked = new EventEmitter<boolean>();


    // For Detail temporary promotion Log
    @Output() reloadPromotionLog = new EventEmitter<boolean>();
    @Output() promotionLogDeleted = new EventEmitter<boolean>();
    // For QHP Vacancies delete button

// For QHP Vcanacies Delete Action
    @Output() qhpReloadVacancy = new EventEmitter<boolean>();
    @Output() qhpVacancyDeleted = new EventEmitter<boolean>();

    @Output() reloadFTEEntry = new EventEmitter<boolean>();
    @Output() fteEntryDeleted = new EventEmitter<boolean>();

    ngOnInit() {
       this.btnText = 'Delete';
       if (this.screenName === 'fieldMapping') {
            this.message = 'Are you sure you want to delete this mapping';
        } else if (this.screenName === 'editVacancies') {
           this.message = 'Are you sure you want to remove the vacancy';
           this.btnText = 'Remove';
        } else if (this.screenName === 'hiringMechanism') {
            this.message = 'Are you sure you want to delete this Announcement';
        } else if (this.screenName === 'classification') {
            this.message = 'Are you sure you want to delete this Classification';
        } else if (this.screenName === 'departureLog') {
            this.message = 'Are you sure you want to delete this Departure Log';
        } else if (this.screenName === 'recruitmentLogisticsLog') {
            this.message = 'Are you sure you want to delete this Recruitment and Logistics Log';
        } else if (this.screenName === 'promotionLog') {
            this.message = 'Are you sure you want to delete this entry from the log';
        } else if (this.screenName === 'FTE Reports') {
            this.message = 'Are you sure you want to delete this FTE Report entry';
        } else if (this.screenName === 'QHPVacancy') {
            this.message = 'Are you sure you want to delete this Vacancy';
        } else {
            this.message = 'Are you sure you want to delete the user';
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // tslint:disable-next-line: forin
        for (const propName in changes) {
            if (propName === 'userId') {
                const chg = changes[propName];
                if (chg.currentValue) {
                    this.userId = chg.currentValue;
                }
            }
            if (propName === 'deleteObj') {
                const chg = changes[propName];
                if (chg.currentValue) {
                    this.deleteObj = chg.currentValue;
                }
            }
        }
    }

    constructor(
        router: Router,
        private _adminService: AdminService,
        private _hcService: HumanCapitalService
    ) {
        this.router = router;
        this.showErrorFlag = false;
    }

    reset() {
        jQuery('#delete-popup').modal('hide');
        jQuery('#delete-popup').data('modal', null);
        this.resetDeleteClicked.emit(true);
    }

    handleCancelAction() {
        this.reset();
    }

     handleDeleteAction() {
        if (this.screenName === 'fieldMapping') {
            this.busyTableSave =
                this._adminService.deleteFieldMapping(this.fieldMapping, this.userId).subscribe((response: HttpResponse<any>) => {
                if (response.status === 200) {
                    this.reset();
                    this.reloadUsers.emit(true);
                    this.userDeleted.emit(true);
                }
            });
        } else if (this.screenName === 'editVacancies') {
           this.busyTableSave = this._hcService.removeVacancies(this.deleteObj).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.reloadVacancies.emit(true);
                    this.vacancyDeleted.emit(true);
                }
            });
        } else if (this.screenName === 'hiringMechanism') {
            this.busyTableSave = this._hcService.deleteAnnouncement(this.deleteObj).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.announcementDeleted.emit(true);
                    this.reloadAnnouncments.emit(true);
                }
            });
        } else if (this.screenName === 'classification') {
            this.busyTableSave = this._hcService.removeClassification(this.userId).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.reloadClassification.emit(true);
                    this.classificationDeleted.emit(true);
                }
            });
        } else if (this.screenName === 'departureLog') {
            this.busyTableSave = this._hcService.deleteDepartureLog(this.userId).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.reloadDepartureLog.emit(true);
                    this.departureLogDeleted.emit(true);
                }
            });
        } else if (this.screenName === 'recruitmentLogisticsLog') {
            this.busyTableSave = this._hcService.deleteRecruitmentLogisticsLog(this.userId).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.reloadRecruitmentLogisticsLog.emit(true);
                    this.recruitmentLogisticsLogDeleted.emit(true);
                }
            });
        } else if (this.screenName === 'promotionLog') {
            this.busyTableSave = this._hcService.deletePromotionLog(this.userId).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.reloadPromotionLog.emit(true);
                    this.promotionLogDeleted.emit(true);
                }
            });
        } else if (this.screenName === 'FTE Reports') {
            this.busyTableSave = this._hcService.deleteFTEReport(this.userId).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.reloadFTEEntry.emit(true);
                    this.fteEntryDeleted.emit(true);
                }
            });
        } else if (this.screenName === 'QHPVacancy') {
            this.busyTableSave = this._hcService.deleteQHPVacancy(this.userId).subscribe((response) => {
                if (response.success === true) {
                    this.reset();
                    this.qhpReloadVacancy.emit(true);
                    this.qhpVacancyDeleted.emit(true);
                }
               });
        } else {
            this.busyTableSave = this._adminService.deleteUser(this.user, this.userId).subscribe((response: HttpResponse<any>) => {
                if (response.status === 200) {
                    this.reset();
                    this.reloadUsers.emit(true);
                    this.userDeleted.emit(true);
                }
            });
         }
    }
    ngOnDestroy() {
        if (this.busyTableSave) {
          this.busyTableSave.unsubscribe();
        }
      }
}
