import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  @Input() field: any;
  @Input() fomGroup: FormGroup;
  @Input() formControl: any;
  @Output() selectedValueChange = new EventEmitter<any>();
  @Output() jobTitleChange = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.fomGroup.valueChanges.subscribe(change => {
      this.valueChange.emit(this.fomGroup);
    });
   }

  selectionChanges(formControlName, selectedValue, fomGroup, smartListName) {
    if (formControlName === 'reassignmentOffice' || formControlName === 'reassignmentOrgLevel' ||
      formControlName === 'ctpDetailOffice' || formControlName === 'ctpDetailOrgLevel'
      || formControlName === 'detailType' || formControlName === 'action'
      || formControlName === 'vacancy' || formControlName === 'newOffice') {
      this.selectedValueChange.emit({
        formControl: formControlName,
        value: selectedValue,
        formGroup: fomGroup
      });
    }

    if (formControlName === 'jobTitle' || formControlName === 'payPlan' || formControlName === 'series'
      || formControlName === 'grade' || formControlName === 'jobCode' || formControlName === 'fpl') {
      this.jobTitleChange.emit({
        formControl: formControlName,
        value: selectedValue,
        formGroup: fomGroup,
        smartList: smartListName
      });
    }
    if (formControlName === 'ctpDetailJobTitle' || formControlName === 'ctpDetailPayPlan'
      || formControlName === 'ctpDetailGrade' || formControlName === 'ctpDetailSeries') {
      this.jobTitleChange.emit({
        formControl: formControlName,
        value: selectedValue,
        formGroup: fomGroup,
        smartList: smartListName
      });
    }
    if (formControlName === 'ctpDetailSupFullName') {
      this.selectedValueChange.emit({
        formControl: formControlName,
        value: selectedValue,
        formGroup: fomGroup
      });
    }

  }
  startdateChange() {
    if (this.field.name === 'detailEffectiveDate' || this.field.name === 'detailNteDate') {
      this.fomGroup.controls.detailEffectiveDate.updateValueAndValidity();
      this.fomGroup.controls.detailNteDate.updateValueAndValidity();
}
  }

}
