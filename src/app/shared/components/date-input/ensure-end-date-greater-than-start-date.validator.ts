import {
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  FormGroup,
  FormArray
} from '@angular/forms';
import * as moment from 'moment';


export const ensureEndDateGreaterThanStartDateValidator = (
  startDateControlName: string
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || !control.value) {
      return null;
    }
    const form = control.parent;
    if (!form) {
      return null;
    }
    if (!form.get(startDateControlName) || !form.get(startDateControlName).value) {
      return null;
    }
    const startDate = moment(form.get(startDateControlName).value)
      .startOf('day')
      .toDate();
    const endDate = moment(control.value)
      .startOf('day')
      .toDate();
    if (endDate < startDate) {
      return { ensureEndDateGreaterThanStartDate: true };
    }
    return null;
  };
};

export const ensureEndDateNotEqualsToStartDateValidator = (
  startDateControlName: string
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || !control.value) {
      return null;
    }
    const form = control.parent;
    if (!form) {
      return null;
    }
    if (!form.get(startDateControlName) || !form.get(startDateControlName).value) {
      return null;
    }
    const startDate = moment(form.get(startDateControlName).value)
      .startOf('day')
      .toDate();
    const endDate = moment(control.value)
      .startOf('day')
      .toDate();
    if (endDate.getTime() === startDate.getTime()) {
      return { ensureEndDateNotEqualsToStartDate: true };
    }
    return null;
  };
};

export const ensureStartDateLessThanEndDateValidator = (
  endDateControlName: string
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || !control.value) {
      return null;
    }

    const form = control.parent;

    if (!form) {
      return null;
    }
    const endDateControl = form.get(endDateControlName);
    if (endDateControl == null || endDateControl.value == null) {
      return null;
    }

    const endDate = moment(form.get(endDateControlName).value)
      .startOf('day')
      .toDate();
    const startDate = moment(control.value)
      .startOf('day')
      .toDate();
    if (endDate < startDate) {
      return { ensureStartDateLessThanEndDate: true };
    }
    return null;
  };
};

export const dateCompare = (startDate, endDate) => {
  const sDate = moment(startDate).startOf('day').toDate();
  const eDate = moment(endDate).startOf('day').toDate();
  if (eDate < sDate) {
    return true;
  } else {
    return false;
  }
};

