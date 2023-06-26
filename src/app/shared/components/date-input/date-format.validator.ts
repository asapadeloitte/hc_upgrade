import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const checkingFormatDateValidator = (
  dateControlName: string
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || !control.value) {
      return null;
    }
    const form = control.parent;
    // date format MM/DD/YYYY checking leap year as well
    // tslint:disable-next-line:max-line-length
    const dateRegexPattern = /^(((0[13578]|1[02])\/(0[1-9]|[12]\d|3[01])\/((19|[2-9]\d)\d{2}))|((0[13456789]|1[012])\/(0[1-9]|[12]\d|30)\/((19|[2-9]\d)\d{2}))|(02\/(0[1-9]|1\d|2[0-8])\/((19|[2-9]\d)\d{2}))|(02\/29\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/i;

    if (!form) {
      return null;
    }

    const dateControl = form.get(dateControlName);
    const datestring = control.value;
    if (dateControl === null) {
      return null;
    }
    const myPattern = new RegExp(dateRegexPattern);
    if (typeof datestring === 'string') {

      if (!myPattern.test(datestring)) {
        return { checkingFormatDate: true };
      }
    }
    return null;
  };
};
