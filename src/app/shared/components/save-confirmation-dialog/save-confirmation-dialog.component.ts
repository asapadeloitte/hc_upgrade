import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HumanCapitalService } from '../../services/humanCapital.service';
import { ToasterService } from 'angular2-toaster';
import { SelectionsService } from 'src/app/modules/hiring-plan/components/selections/selections.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { SmartListConversionService } from '../../services/smartListConversion.service';





@Component({
  selector: 'app-save-confirmation-dialog',
  templateUrl: './save-confirmation-dialog.component.html',
  styleUrls: ['./save-confirmation-dialog.component.scss']
})
export class SaveConfirmationDialogComponent implements OnInit {
  // @Input() title;
  @Input() message;
  @Input() parentModelRef;
  @Input() buttonTitle;
  @Input() screenName;
  @Output() event = new EventEmitter();
  @Output() year;
  @Output() selctedRowsData;
  @Input() displayAnnouncementjoqreq;
  public busyTableSave: Subscription;
  public errorDetails: any = [];
  @Input() selectedparentModelRef;
  public yesButtonDisable = false;
  public displayNoSelectionDate = [];

  // @Output() cancelEvent = new EventEmitter();
  constructor(
    private bsModalRef: BsModalRef,
    private smartListService: SmartListConversionService,
    private humanCapitalService: HumanCapitalService,
    private toaster: ToasterService,
    public selectionService: SelectionsService,
  ) { }

  ngOnInit() {
    if (this.displayAnnouncementjoqreq) {
      let copyDisplayAnnouncementjoqreq = [...this.displayAnnouncementjoqreq];
      const nullItems = copyDisplayAnnouncementjoqreq.filter(e => e.recruitJobReqNbr !== null);
      copyDisplayAnnouncementjoqreq =
        [...nullItems.sort((a, b) => +a.recruitJobReqNbr > +b.recruitJobReqNbr ? 1 : -1),
          ...copyDisplayAnnouncementjoqreq.filter(y => y.recruitJobReqNbr === null)];

      copyDisplayAnnouncementjoqreq.forEach(element => {
        element.announcementDisplayId = (element.recruitJobReqNbr === null || element.recruitJobReqNbr.trim() === '') ?
          element.announcementDisplayId + ' - Pending Job Req #' :
          element.announcementDisplayId + ' - Job Req #' + element.recruitJobReqNbr;
        this.displayNoSelectionDate.push(element.announcementDisplayId);
       // this.displayNoSelectionDate = this.removeDuplicates(this.displayNoSelectionDate);
      });
    }
  }

//    removeDuplicates(arr) {
//     return arr.filter((item,
//         index) => arr.indexOf(item) === index);
// }
  onSubmit() {
    this.event.emit(true);
    if (this.screenName === 'selectedVacancies') {
      this.selectedVacanciesSubmitCall();
    } else {
      this.yesButtonDisable = true;
      this.bsModalRef.hide();
      if (this.parentModelRef) {
        this.parentModelRef.hide();
      }
    }
  }
  onCancel() {
    this.event.emit(false);
    this.bsModalRef.hide();
   // this.displayAnnouncementjoqreq = [];
   // this.displayNoSelectionDate = [];
    if (this.parentModelRef) {
      this.parentModelRef.hide();
    }
  }
  close() {
    this.event.emit(false);
    this.bsModalRef.hide();
    // this.displayAnnouncementjoqreq = [];
    // this.displayNoSelectionDate = [];
    if (this.parentModelRef) {
      this.parentModelRef.hide();
    }
  }
  selectedVacanciesSubmitCall() {

    const smartListGlobal = this.smartListService.getDDVals();
    const dateList = this.smartListService.getDateFieldList();
    this.selctedRowsData.forEach(obj => {
      Object.keys(obj).forEach(key => {
        const smartListObject = smartListGlobal.find(element => element.smartListName === key);
        const tempDateVal = dateList.find(f => f === key);
        if (smartListObject && smartListObject.smartListValues.length > 0) {
          smartListObject.smartListValues.forEach(element => {
            if (obj[key] === element.value) {
              obj[key] = element.id;
            }
          });
        }
        if (tempDateVal) {
          if (key === tempDateVal) {
            obj[key] =
              obj[key] !== null && obj[key] !== '' && obj[key] !== undefined ? moment(obj[key]).format('MM/DD/YYYY') : obj[key];
          }
        }
      });
    });

    this.busyTableSave = this.humanCapitalService.saveHMVacancy(this.year, this.selctedRowsData).subscribe(data => {
      if (data.success === true) {
        this.toaster.pop('success', 'Saved', 'Successfully saved the vacancy details');
        this.selectionService.onReloadVacancy(true);
      }
      this.bsModalRef.hide();
      if (this.selectedparentModelRef) {
        this.selectedparentModelRef.hide();
      }
    }, error => {
      error.error.errorDetails.forEach(element => {
        this.errorDetails.push(element.message);
      });
      this.toaster.pop('error', 'Failed', this.errorDetails);
    });
  }
}

