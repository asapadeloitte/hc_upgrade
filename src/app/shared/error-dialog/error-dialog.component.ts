import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {
  @Input() departureLogDate: boolean;
  @Input() unSavedData: boolean;
  @Input() header: string;
  @Input() message: string;
  @Input() invalidHREPS: boolean;
  @Input() invalidEHCM: boolean;
  @Input() invalidPriority: boolean;
  @Input() differntVacanciesData: boolean;
  @Output() closeClick = new EventEmitter<boolean>();
  @Input() validateselectedRow;
  @Input() validateselectedRowVacany;
  @Input() vacancyChangesforAnnouncement;
  @Input() duplicateassociates;
  @Input() selectionValidation: boolean;
  @Input() validationVacancyIds;
  @Input() selectionValidationPopup: boolean;
  @Input() saveFormData: boolean;
  public title = 'Invalid Change Amount';
  public errorMessage: string;
  constructor(
    private bsModalRef: BsModalRef) { }

  ngOnInit() {
    if (this.saveFormData === true) {
      this.title = 'Unsaved Data';
      this.errorMessage =
        'Please save the data before adding an entry to the Recruitment and Logistics Log.';
    }
    if (this.unSavedData === true) {
      this.title = 'Unsaved Data';
      this.errorMessage =
        'Please save data before pushing vacancies to Hiring Plan.';
    } else if (this.validateselectedRow) {
      this.title = 'Invalid Data';
      this.errorMessage = `Selected vacancies must all have a value for Job Title,
      Pay Plan, Series, Grade and Hiring Mechanism. Please adjust the data.`;
    } else if (this.differntVacanciesData === true) {
      this.title = 'Invalid Selection';
      this.errorMessage =
      'Pay Plan and Hiring Mechanism for selected vacancies must be the same. Please adjust the data.';
    } else if (this.vacancyChangesforAnnouncement) {
      this.title = 'Invalid Data';
      this.errorMessage =
        'Pay Plan for vacancies within the same announcement must be the same. Please adjust the data.';
    } else if (this.validateselectedRowVacany) {
      this.title = 'Invalid Data';
      this.errorMessage =
        'Selected vacancies must all have a value for Job Title, Pay Plan, Series, Grade . Please adjust the data.';
    } else if (this.invalidHREPS) {
      this.title = this.header;
      this.errorMessage = this.message;
    } else if (this.invalidEHCM) {
      this.title = this.header;
      this.errorMessage = this.message;
    } else if (this.departureLogDate) {
      this.title = 'Invalid Data';
      this.errorMessage = 'Departure Log entries must include a departure date.';
    } else if (this.invalidPriority) {
      this.title = this.header;
      this.errorMessage = this.message;
    } else if (this.selectionValidation) {
      this.title = this.header;
      this.errorMessage = this.message + '<br>' + this.validationVacancyIds;
    } else if (this.selectionValidationPopup) {
      this.title = this.header;
      this.errorMessage = this.message + '<br>' + this.validationVacancyIds;
    }
  }
  close() {
    this.bsModalRef.hide();
    this.closeClick.emit(true);
  }

}
