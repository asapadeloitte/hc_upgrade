import {
  AbstractControl,
  AbstractControlDirective,
  FormGroup,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import * as $ from 'jquery';


export const hasRequiredValidator = (
  abstractControl: AbstractControl | AbstractControlDirective
): boolean => {
  if (abstractControl == null) {
    return false;
  }
  if (abstractControl instanceof AbstractControlDirective) {
    abstractControl = abstractControl.control;
  }
  if (abstractControl == null) {
    return false;
  }

  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }
  return false;
};


// date validation
// this is added for date validation need to be generic need to be test
export function dateLessThan({ dateField1, dateField2, validatorField }: {
  dateField1: string; dateField2: string; validatorField: {
    [key: string]: boolean;
  };
}): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    const date1 = c.get(dateField1).value;
    const date2 = c.get(dateField2).value;
    if ((date1 !== null && date2 !== null) && date1 > date2) {
      return validatorField;
    }
    return null;
  };
}

export const hasRequiredField = (
  abstractControl: AbstractControl | AbstractControlDirective
): boolean => {
  if (abstractControl == null) {
    return false;
  }
  if (abstractControl instanceof AbstractControlDirective) {
    abstractControl = abstractControl.control;
  }
  if (abstractControl == null) {
    return false;
  }

  if (abstractControl.validator) {
    const validator = abstractControl.validator({} as AbstractControl);
    if (validator && validator.required) {
      return true;
    }
  }
  if (abstractControl['controls']) {
    for (const controlName in abstractControl['controls']) {
      if (abstractControl['controls'][controlName]) {
        if (hasRequiredField(abstractControl['controls'][controlName])) {
          return true;
        }
      }
    }
  }
  return false;
};

export const triggerValidations = (formGroup: FormGroup, onlySelf: boolean = false) => {
  if (onlySelf) {
    formGroup.updateValueAndValidity();
    formGroup.markAsTouched();
    return;
  }
  if (formGroup.controls != null) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        triggerValidations(control, onlySelf);
      } else {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
    setTimeout(() => {
      if ($('.is-invalid')[0]) {
        $('.is-invalid')[0].focus();
      }
    }, 100);
    // TODO: Replace with Angular version.
  }
};

export interface IBusinessRuleViolation {
  errorCode: number;
  errorMessage: string;
}

export interface IBadRequestError {
  message: string;
  businessRuleViolations?: IBusinessRuleViolation[];
}


export const upperCaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getErrorTextFromValidationResult = (errorKey: string, error: any): string => {
  if (typeof error === 'string') {
    return error;
  } else if (errorKey === 'maxlength') {
    return `Input exceeds max length of ${error.requiredLength}`;
  } else if (errorKey === 'minlength') {
    return `Input is less than min required length ${error.requiredLength}`;
  } else if (errorKey === 'max') {
    return `Input must be max ${error.max}`;
  } else if (errorKey === 'min') {
    return `Input must be min ${error.min}`;
  } else {
    return upperCaseFirstChar(errorKey);
  }
};
// generic date validation
export class DateValidators {
  static dateLessThan(dateField1: string, dateField2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1 = c.get(dateField1).value;
      const date2 = c.get(dateField2).value;
      if ((date1 !== null && date2 !== null) && date1 > date2) {
        return validatorField;
      }
      return null;
    };
  }
}
export function dateComparator(date1, date2) {
  const date1Number = monthToComparableNumber(date1);
  const date2Number = monthToComparableNumber(date2);
  if (date1Number === null && date2Number === null) {
    return 0;
  }
  if (date1Number === null) {
    return -1;
  }
  if (date2Number === null) {
    return 1;
  }
  return date1Number - date2Number;
}

function monthToComparableNumber(date) {
  if (date === undefined || date === null || date.length !== 10) {
    return null;
  }
  const yearNumber = date.substring(6, 10);
  const dayNumber = date.substring(3, 5);
  const monthNumber = date.substring(0, 2);
  const result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
  return result;
}

export function numberSort(num1: number, num2: number) {
  return num1 - num2;
}

export function numberFormatter(params: any) {
  return params.value ? Math.round(params.value) : '';
}


export function accessibilityFix(el) {
  setTimeout(() => {

    const chkboxElmnt: NodeList = el.nativeElement.querySelectorAll('.ag-column-select-header-checkbox .ag-input-field-label');
    if (chkboxElmnt.length > 0) {
      chkboxElmnt.forEach(p => p['innerHTML'] = 'test');
    }

    const chkboxElmnts: NodeList = el.nativeElement.querySelectorAll('.ag-column-select-checkbox .ag-input-field-label');
    if (chkboxElmnts.length > 0) {
      chkboxElmnts.forEach(p => p['innerHTML'] = 'Tool panel checkbox');
    }

    const chkboxElm: NodeList = el.nativeElement.querySelectorAll('.ag-filter-toolpanel-search-input .ag-input-field-label');
    if (chkboxElm.length > 0) {
      chkboxElm.forEach(p => p['innerHTML'] = 'Tool panel checkbox');
    }

    const chkboxHeaderCell: NodeList = el.nativeElement.querySelectorAll('.ag-header-select-all .ag-input-field-label');
    if (chkboxHeaderCell.length > 0) {
      chkboxHeaderCell.forEach(p => p['innerHTML'] = 'Check All checkbox');
    }

    const chkboxfilter: NodeList =
      el.nativeElement.querySelectorAll('.ag-column-select-header-filter-wrapper .ag-input-field-label');
    if (chkboxfilter.length > 0) {
      chkboxfilter.forEach(p => p['innerHTML'] = 'Checkbox filter');
    }


    const chkbox: NodeList =
      el.nativeElement.querySelectorAll('.ag-selection-checkbox .ag-input-field-label');
    if (chkbox.length > 0) {
      chkbox.forEach(p => p['innerHTML'] = 'Checkbox');
    }

    const filterTypeInput = document.querySelector('[id="filter"] input[role = "combobox"]');
    $(filterTypeInput).attr('id', 'filter');
  }, 500);

}

export function columnVisibleAccessbility(params, el) {
  if (params.columns) {
    if (params.source === 'columnMenu' && params.type === 'columnVisible' && (params.visible === false || params.visible === true)) {
      const chkboxElmnt: NodeList =
        el.nativeElement.querySelectorAll('.ag-input-field-label.ag-label.ag-hidden.ag-checkbox-label');
      if (chkboxElmnt.length > 0) {
        chkboxElmnt.forEach(p => {
          if (p['innerHTML'] === '') {
            p['innerHTML'] = 'label';
          }
        });
      }
    }
  }
}

export function printSortStateToConsole(el) {
  const chkboxElmnt: NodeList =
    el.nativeElement.querySelectorAll('.ag-input-field-label.ag-label.ag-hidden.ag-checkbox-label');
  if (chkboxElmnt.length > 0) {
    chkboxElmnt.forEach(p => {
      if (p['innerHTML'] === '') {
        p['innerHTML'] = 'label';
      }
    });
  }
}

export function jobTitleMapping(smartListData, jobTitleMappings, formFields, e) {
  let dropdownOptions: any;
  dropdownOptions = smartListData.find(f => f.smartListName === 'jobTitle');
  if (e.formControl === 'jobTitle' || e.formControl === 'payPlan' || e.formControl === 'series'
    || e.formControl === 'grade' || e.formControl === 'jobCode' || e.formControl === 'fpl') {
    if (e.value) {
      let selectedJobTitle;
      if (e.hyperlinkPopup) {
        const id = smartListData.find(f => f.smartListName === 'jobTitle').smartListValues
        .find(el => el.value === e.formGroup.controls.jobTitle.value).id;
        selectedJobTitle = dropdownOptions.smartListValues.find(value => value.id === id);
      } else {
        selectedJobTitle = dropdownOptions.smartListValues.find(value => value.id === e.formGroup.controls.jobTitle.value);
      }
      const arr = [];
      if (e.formControl === 'jobTitle') {
        jobTitleMappings.forEach(jobTitle => {
          if (jobTitle.jobTitle === selectedJobTitle.value) {
            arr.push(jobTitle);
          }
        });
        jobTitleDDdrildown(arr, 'series', smartListData, formFields);
        jobTitleDDdrildown(arr, 'payPlan', smartListData, formFields);
        jobTitleDDdrildown(arr, 'grade', smartListData, formFields);
        jobTitleDDdrildown(arr, 'jobCode', smartListData, formFields);
        jobTitleDDdrildown(arr, 'fpl', smartListData, formFields);
      // }
      // else if (e.formControl === 'series') {
      //   const seriesOptions = smartListData.find(value => value.smartListName === e.formControl);
      //   const selectedSeries = seriesOptions.smartListValues.find(value => value.id === e.formGroup.controls.series.value);
      //   jobTitleMappings.forEach(jobTitle => {
      //     if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.occSeries === selectedSeries.value) {
      //       arr.push(jobTitle);
      //     }
      //   });
      //   jobTitleDDdrildown(arr, 'payPlan', smartListData, formFields);
      }  else if (e.formControl === 'payPlan') {
        const payPlanOptions = smartListData.find(value => value.smartListName === e.formControl);
        let selectedPayPlan;
        // newly added for Ppoup JobTitle onload function

        if (e.hyperlinkPopup) {
          const payPlanId = smartListData.find(f => f.smartListName === 'payPlan').smartListValues
            .find(el => el.value === e.formGroup.controls.payPlan.value).id;
          selectedPayPlan = payPlanOptions.smartListValues.find(value => value.id === payPlanId);
        } else {
          selectedPayPlan = payPlanOptions.smartListValues.find(value => value.id === e.formGroup.controls.payPlan.value);
        }
        jobTitleMappings.forEach(jobTitle => {
            if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.payPlan === selectedPayPlan.value) {
              arr.push(jobTitle);
            }
          });
        jobTitleDDdrildown(arr, 'grade', smartListData, formFields);
      } else if (e.formControl === 'grade') {
        let selectedGrade;
        const gradeOptions = smartListData.find(value => value.smartListName === e.formControl);
        if (e.hyperlinkPopup) {
          const gradeId = smartListData.find(f => f.smartListName === 'grade').smartListValues
            .find(el => el.value === e.formGroup.controls.grade.value).id;
          selectedGrade = gradeOptions.smartListValues.find(value => value.id === gradeId);
        } else {
           selectedGrade = gradeOptions.smartListValues.find(value => value.id === e.formGroup.controls.grade.value);
        }
        jobTitleMappings.forEach(jobTitle => {
          if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.grade === selectedGrade.value) {
            arr.push(jobTitle);
          }
        });
        jobTitleDDdrildown(arr, 'jobCode', smartListData, formFields);
      } else if (e.formControl === 'jobCode') {
        jobTitleMappings.forEach(jobTitle => {
          if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.jobCode === e.formGroup.controls.jobCode.value) {
            arr.push(jobTitle);
          }
        });
        jobTitleDDdrildown(arr, 'fpl', smartListData, formFields);
      }
    } else if (e.value === '' && e.formControl === 'jobTitle') {
      formFields.forEach(control => {
        if (control.name === 'payPlan' || control.name === 'series'
          || control.name === 'grade' || control.name === 'jobCode' || control.name === 'fpl') {
          control.options = [];
        }
      });
    }
  } else {
    if (e.value) {
      const selectedJobTitle = dropdownOptions.smartListValues.find(value => value.id === e.formGroup.controls.ctpDetailJobTitle.value);
      const arr = [];
      if (e.formControl === 'ctpDetailJobTitle') {
        jobTitleMappings.forEach(jobTitle => {
          if (jobTitle.jobTitle === selectedJobTitle.value) {
            arr.push(jobTitle);
          }
        });
        jobTitleDDdrildown(arr, 'ctpDetailSeries', smartListData, formFields);
        jobTitleDDdrildown(arr, 'ctpDetailPayPlan', smartListData, formFields);
        jobTitleDDdrildown(arr, 'ctpDetailGrade', smartListData, formFields);
        jobTitleDDdrildown(arr, 'jobCode', smartListData, formFields);
      } else if (e.formControl === 'ctpDetailPayPlan') {
        const payPlanOptions = smartListData.find(value => value.smartListName === e.smartList);
        const selectedPayPlan = payPlanOptions.smartListValues.find(value => value.id === e.formGroup.controls.ctpDetailPayPlan.value);
        jobTitleMappings.forEach(jobTitle => {
          if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.payPlan === selectedPayPlan.value) {
            arr.push(jobTitle);
          }
        });
        jobTitleDDdrildown(arr, 'ctpDetailGrade', smartListData, formFields);
      } else if (e.formControl === 'ctpDetailGrade') {
        const gradeOptions = smartListData.find(value => value.smartListName === e.smartList);
        const selectedGrade = gradeOptions.smartListValues.find(value => value.id === e.formGroup.controls.ctpDetailGrade.value);
        jobTitleMappings.forEach(jobTitle => {
          if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.grade === selectedGrade.value) {
            arr.push(jobTitle);
          }
        });
        jobTitleDDdrildown(arr, 'jobCode', smartListData, formFields);
      }
    } else if (e.value === '' && e.formControl === 'ctpDetailJobTitle') {
      formFields.forEach(control => {
        if (control.name === 'ctpDetailPayPlan' || control.name === 'ctpDetailSeries'
          || control.name === 'ctpDetailGrade' || control.name === 'jobCode' || control.name === 'fpl') {
          control.options = [];
        }
      });
    }

  }
}

export function jobTitleMappingForGrid(smartListData, jobTitleMappings, e, paramsData, cellName) {
  let selectedJobTitle;
  const dropdownOptions = smartListData.find(f => f.smartListName === e);
  if (paramsData.hasOwnProperty('ctpDetailJobTitle')) {
    selectedJobTitle =
      dropdownOptions.smartListValues.find(smartListValues => smartListValues.value === paramsData.ctpDetailJobTitle);
  } else {
    selectedJobTitle = dropdownOptions.smartListValues.find(smartListValues => smartListValues.value === paramsData.jobTitle);
  }
  const arr = [];
  if (selectedJobTitle && paramsData.hasOwnProperty('jobTitle')) {
    if (cellName === 'payPlan' || cellName === 'series' || cellName === 'ctpDetailSeries' || cellName === 'ctpDetailGrade') {
      jobTitleMappings.forEach(jobTitle => {
        if (jobTitle.jobTitle === selectedJobTitle.value) {
          arr.push(jobTitle);
        }
      });
      return jobTitleDDdrildownGrid(arr, e, smartListData, cellName);
    } else if (cellName === 'grade') {
      jobTitleMappings.forEach(jobTitle => {
        if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.payPlan === paramsData.payPlan) {
          arr.push(jobTitle);
        }
      });
      return jobTitleDDdrildownGrid(arr, e, smartListData, cellName);
    } else if (cellName === 'jobCode') {
      jobTitleMappings.forEach(jobTitle => {
        if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.grade === paramsData.grade) {
          arr.push(jobTitle);
        }
      });
      return jobTitleDDdrildownGrid(arr, e, smartListData, cellName);
    } else if (cellName === 'fpl') {
      jobTitleMappings.forEach(jobTitle => {
        if (jobTitle.jobTitle === selectedJobTitle.value && jobTitle.jobCode === paramsData.jobCode) {
          arr.push(jobTitle);
        }
      });
      return jobTitleDDdrildownGrid(arr, e, smartListData, cellName);
    }
  } else {
    if (cellName === 'ctpDetailSeries' || cellName === 'ctpDetailGrade') {
      jobTitleMappings.forEach(jobTitle => {
        if (jobTitle.jobTitle === selectedJobTitle.value) {
          arr.push(jobTitle);
        }
      });
      return jobTitleDDdrildownGrid(arr, e, smartListData, cellName);
    }
  }

}

export function onJobTitleChange(params) {
  if (params.colDef.field === 'jobTitle') {
    params.data.series = '';
    params.data.payPlan = '';
    params.data.jobCode = '';
    params.data.grade = '';
    params.data.fpl = '';
  } else if (params.colDef.field === 'series') {
  } else if (params.colDef.field === 'payPlan') {
    params.data.grade = '';
    params.data.jobCode = '';
    params.data.fpl = '';
  } else if (params.colDef.field === 'grade') {
    params.data.jobCode = '';
    params.data.fpl = '';
  } else if (params.colDef.field === 'jobCode') {
    params.data.fpl = '';
  }
}

export function jobTitleDDdrildownGrid(arr, cellName, smartListData, currentCellName) {
  let options = [];
  if (currentCellName !== 'jobCode') {
    const dropdownOptionsJobCode = smartListData.find(f => f.smartListName === currentCellName);
    arr.forEach(mapping => {
      dropdownOptionsJobCode.smartListValues.forEach(smartList => {
        if (currentCellName === 'series' || currentCellName === 'ctpDetailSeries') {
          if (mapping.occSeries === smartList.value || (currentCellName === 'ctpDetailSeries' && smartList.value === '0000')) {
            const tempIndex = options.findIndex(temp => temp.value === smartList.value);
            if (tempIndex < 0) {
              options.push(smartList);
            }
          }
        } else if (currentCellName === 'payPlan') {
          if (mapping.payPlan === smartList.value) {
            const tempIndex = options.findIndex(temp => temp.value === smartList.value);
            if (tempIndex < 0) {
              options.push(smartList);
            }
          }
        } else if (currentCellName === 'grade' || currentCellName === 'ctpDetailGrade') {
          if (mapping.grade === smartList.value) {
            const tempIndex = options.findIndex(temp => temp.value === smartList.value);
            if (tempIndex < 0) {
              options.push(smartList);
              options = trimObject(options);
              options.sort((a, b) => (+a.value > +b.value ? -1 : 1));
            }
          }
        } else if (currentCellName === 'fpl') {
          if (mapping.fpl === smartList.value) {
            const tempIndex = options.findIndex(temp => temp.value === smartList.value);
            if (tempIndex < 0) {
              options.push(smartList);
            }
          }
        }
      });

    });
  } else if (currentCellName === 'jobCode') {
    arr.forEach(mapping => {
      if (mapping.jobCode) {
        const tempIndex = options.findIndex(temp => temp.value === mapping.jobCode);
        if (tempIndex < 0) {
          const jobCode = {
            id: mapping.jobCode,
            smartListName: mapping.jobCode,
            value: mapping.jobCode
          };
          options.push(jobCode);
          options = trimObject(options);
          const numbers = options.filter(a => !isNaN(+a.value)).sort((a, b) => +a.value > +b.value ? -1 : 1);
          const alpaNumerics = options.filter(a => isNaN(+a.value)).sort((a, b) => a.value > b.value ? -1 : 1);
          options = [...numbers, ...alpaNumerics];
        }
      }
    });
  }
  return options;
}
export function jobTitleDDdrildown(arr, formControlName, smartListData, formFields) {
  let dropdownOptionsJobCode: any;
  if (formControlName !== 'jobCode') {
    if (formControlName === 'jobTitle' || formControlName === 'payPlan' || formControlName === 'series'
      || formControlName === 'grade' || formControlName === 'jobCode' || formControlName === 'fpl') {
      dropdownOptionsJobCode = smartListData.find(f => f.smartListName === formControlName);
    } else {
      if (formControlName === 'ctpDetailSeries') {
        dropdownOptionsJobCode = smartListData.find(f => f.smartListName === 'series');
      } else if (formControlName === 'ctpDetailPayPlan') {
        dropdownOptionsJobCode = smartListData.find(f => f.smartListName === 'payPlan');
      } else if (formControlName === 'ctpDetailGrade') {
        dropdownOptionsJobCode = smartListData.find(f => f.smartListName === 'grade');
      }
    }
    formFields.forEach(e => {
      if (e.name === formControlName) {
        e.options = [];
        arr.forEach(mapping => {
          dropdownOptionsJobCode.smartListValues.forEach(smartList => {
            if (formControlName === 'series' || formControlName === 'ctpDetailSeries') {
              if (mapping.occSeries === smartList.value || (formControlName === 'ctpDetailSeries' && smartList.value === '0000')) {
                const tempIndex = e.options.findIndex(temp => temp.value === smartList.value);
                if (tempIndex < 0) {
                  e.options.push(smartList);
                }
              }
              } else if (formControlName === 'payPlan' || formControlName === 'ctpDetailPayPlan') {
              if (mapping.payPlan === smartList.value) {
                const tempIndex = e.options.findIndex(temp => temp.value === smartList.value);
                if (tempIndex < 0) {
                  e.options.push(smartList);
                }
              }
            } else if (formControlName === 'grade' || formControlName === 'ctpDetailGrade') {
              if (mapping.grade === smartList.value) {
                // sorting for grades we need to display in descending order

                const tempIndex = e.options.findIndex(temp => temp.value === smartList.value);
                if (tempIndex < 0) {
                  e.options.push(smartList);
                  e.options = trimObject(e.options);
                  e.options.sort((a, b) => (+a.value > +b.value ? -1 : 1));
                }
              }
            } else if (formControlName === 'fpl') {
              if (mapping.fpl === smartList.value) {
                const tempIndex = e.options.findIndex(temp => temp.value === smartList.value);
                if (tempIndex < 0) {
                  e.options.push(smartList);
                }
              }
            }
          });

        });
      }
    });
  } else if (formControlName === 'jobCode') {
    formFields.forEach(e => {
      if (e.name === formControlName) {
        e.options = [];
        arr.forEach(mapping => {
          if (mapping.jobCode) {
            const tempIndex = e.options.findIndex(temp => temp.value === mapping.jobCode);
            if (tempIndex < 0) {
              const jobCode = {
                id: mapping.jobCode,
                smartListName: mapping.jobCode,
                value: mapping.jobCode
              };
              e.options.push(jobCode);
              e.options = trimObject(e.options);
              const numbers = e.options.filter(a => !isNaN(+a.value)).sort((a, b) => +a.value > +b.value ? -1 : 1);
              const alpaNumerics = e.options.filter(a => isNaN(+a.value)).sort((a, b) => a.value > b.value ? -1 : 1);
              e.options = [...numbers, ...alpaNumerics];
            }
          }
        });
      }
    });
  }
}
export function renderFieldValidity(selectedObject: any, tabControls: any, smartListData) {
  if (selectedObject) {
    tabControls.forEach(element => {
      if (selectedObject.formControl === 'detailType') {
        if (selectedObject.value === '1') {
          if (element.name === 'ctpDetailGrade') {
            element.disabled = true;
            element.type = 'text';
            element.required = true;
          }
          if (element.name === 'nonCtpDetailOfficeCenter') {
            element.label = 'CTP Detail Office';
            element.type = 'dropdown';
            element.name = 'ctpDetailOffice';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailOfficeCenter');
            selectedObject.formGroup.addControl('ctpDetailOffice', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailOrgLevel') {
            element.label = 'CTP Detail Organizational Level';
            element.type = 'dropdown';
            element.name = 'ctpDetailOrgLevel';
            element.smartListName = 'ctpDetailOrgLevel';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailOrgLevel');
            selectedObject.formGroup.addControl('ctpDetailOrgLevel', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailSupFullName') {
            element.label = 'CTP Detail Supervisor Full Name';
            element.type = 'dropdown';
            element.name = 'ctpDetailSupFullName';
            element.required = false;
            // element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailSupFullName');
            selectedObject.formGroup.addControl('ctpDetailSupFullName', new FormControl(''));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailJobTitle') {
            element.label = 'CTP Detail Job Title';
            element.type = 'dropdown';
            element.name = 'ctpDetailJobTitle';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailJobTitle');
            selectedObject.formGroup.addControl('ctpDetailJobTitle', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailSeries') {
            element.label = 'CTP Detail Series or Equivalent';
            element.type = 'text';
            element.name = 'ctpDetailSeries';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            element.smartListName = 'series';
            selectedObject.formGroup.removeControl('nonCtpDetailSeries');
            selectedObject.formGroup.addControl('ctpDetailSeries', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailPayPlan') {
            element.label = 'CTP Detail Pay Plan';
            element.type = 'text';
            element.name = 'ctpDetailPayPlan';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            element.smartListName = 'payPlan';
            selectedObject.formGroup.removeControl('nonCtpDetailPayPlan');
            selectedObject.formGroup.addControl('ctpDetailPayPlan', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailGrade') {
            element.label = 'CTP Detail Grade';
            element.type = 'text';
            element.name = 'ctpDetailGrade';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            element.disabled = false;
            element.smartListName = 'grade';
            selectedObject.formGroup.removeControl('nonCtpDetailGrade');
            selectedObject.formGroup.addControl('ctpDetailGrade', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'detailLogComments') {
            element.type = 'text';
          }
        } else if (selectedObject.value === '2') {
          if (element.name === 'ctpDetailGrade') {
            element.type = 'text';
            element.required = true;
            element.disabled = false;
          }
          if (element.name === 'nonCtpDetailOfficeCenter') {
            element.label = 'CTP Detail Office';
            element.type = 'dropdown';
            element.name = 'ctpDetailOffice';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailOfficeCenter');
            selectedObject.formGroup.addControl('ctpDetailOffice', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailOrgLevel') {
            element.label = 'CTP Detail Organizational Level';
            element.type = 'dropdown';
            element.name = 'ctpDetailOrgLevel';
            element.smartListName = 'ctpDetailOrgLevel';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailOrgLevel');
            selectedObject.formGroup.addControl('ctpDetailOrgLevel', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailSupFullName') {
            element.label = 'CTP Detail Supervisor Full Name';
            element.type = 'dropdown';
            element.name = 'ctpDetailSupFullName';
            element.required = false;
            // element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailSupFullName');
            selectedObject.formGroup.addControl('ctpDetailSupFullName', new FormControl(''));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailJobTitle') {
            element.label = 'CTP Detail Job Title';
            element.type = 'dropdown';
            element.name = 'ctpDetailJobTitle';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('nonCtpDetailJobTitle');
            selectedObject.formGroup.addControl('ctpDetailJobTitle', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailSeries') {
            element.label = 'CTP Detail Series or Equivalent';
            element.type = 'text';
            element.name = 'ctpDetailSeries';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            element.smartListName = 'series';
            selectedObject.formGroup.removeControl('nonCtpDetailSeries');
            selectedObject.formGroup.addControl('ctpDetailSeries', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailPayPlan') {
            element.label = 'CTP Detail Pay Plan';
            element.type = 'text';
            element.name = 'ctpDetailPayPlan';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            element.smartListName = 'payPlan';
            selectedObject.formGroup.removeControl('nonCtpDetailPayPlan');
            selectedObject.formGroup.addControl('ctpDetailPayPlan', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'nonCtpDetailGrade') {
            element.label = 'CTP Detail Grade';
            element.type = 'text';
            element.name = 'ctpDetailGrade';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            element.disabled = false;
            selectedObject.formGroup.removeControl('nonCtpDetailGrade');
            selectedObject.formGroup.addControl('ctpDetailGrade', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'detailLogComments') {
            element.type = 'text';
          }
        } else if (selectedObject.value === '5' || selectedObject.value === '6') {
          if (element.name === 'ctpDetailGrade') {
            element.type = 'dropdown';
            element.required = true;
            element.disabled = false;
          }
          if (element.name === 'ctpDetailOffice') {
            element.label = 'Non-CTP Detail Office/Center';
            element.type = 'text';
            element.name = 'nonCtpDetailOfficeCenter';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('ctpDetailOffice', new FormControl('', Validators.required));
            selectedObject.formGroup.addControl('nonCtpDetailOfficeCenter', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'ctpDetailOrgLevel') {
            element.label = 'Non-CTP Detail Organizational Level';
            element.type = 'text';
            element.name = 'nonCtpDetailOrgLevel';
            element.required = false;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('ctpDetailOrgLevel', new FormControl('', Validators.required));
            selectedObject.formGroup.addControl('nonCtpDetailOrgLevel', new FormControl(''));
            selectedObject.formGroup.updateValueAndValidity();
          }
          // Non -CTP Detail Supervisor Full Name
          // detailSupervisorName

          if (element.name === 'ctpDetailSupFullName') {
            element.label = 'Non-CTP Detail Supervisor Full Name';
            element.type = 'text';
            element.name = 'nonCtpDetailSupFullName';
            // element.required = true;
            // element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('ctpDetailSupFullName');
            selectedObject.formGroup.addControl('nonCtpDetailSupFullName', new FormControl(''));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'ctpDetailJobTitle') {
            element.label = 'Non-CTP Detail Job Title';
            element.type = 'text';
            element.name = 'nonCtpDetailJobTitle';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            selectedObject.formGroup.removeControl('ctpDetailJobTitle');
            selectedObject.formGroup.addControl('nonCtpDetailJobTitle', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'ctpDetailSeries') {
            element.label = 'Non-CTP Detail Series or Equivalent';
            element.type = 'text';
            element.name = 'nonCtpDetailSeries';
            element.required = true;
            // element.smartListName = 'nonCtpDetailSeries';
            element.validators = [Validators.required];
            element.value = '';
            element.options = element.options;
            selectedObject.formGroup.removeControl('ctpDetailSeries');
            selectedObject.formGroup.addControl('nonCtpDetailSeries', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'ctpDetailPayPlan') {
            element.label = 'Non-CTP Detail Pay Plan';
            element.type = 'text';
            element.name = 'nonCtpDetailPayPlan';
            element.required = true;
            element.validators = [Validators.required];
            element.value = '';
            element.smartListName = 'nonCtpDetailPayPlan';
            const dropdownOptions = smartListData.find(f => f.smartListName === 'payPlan');
            element.options = dropdownOptions.smartListValues;
            selectedObject.formGroup.removeControl('ctpDetailPayPlan');
            selectedObject.formGroup.updateValueAndValidity();
            selectedObject.formGroup.addControl('nonCtpDetailPayPlan', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'ctpDetailGrade') {
            element.label = 'Non-CTP Detail Grade';
            element.type = 'text';
            element.name = 'nonCtpDetailGrade';
            element.required = true;
            element.validators = [Validators.required];
            element.disabled = false;
            const dropdownOptions = smartListData.find(f => f.smartListName === 'grade');
            element.options = dropdownOptions.smartListValues;
            // element.smartListName = 'grade';
            selectedObject.formGroup.removeControl('ctpDetailGrade');
            selectedObject.formGroup.addControl('nonCtpDetailGrade', new FormControl('', Validators.required));
            selectedObject.formGroup.updateValueAndValidity();
          }
          if (element.name === 'detailLogComments') {
            element.type = 'hidden';
          }
        }
      }
    });
  }
  setTimeout(() => {
    triggerValidations(selectedObject.formGroup);
  }, 3000);
}
export function fieldsToShow(selectedObject, tabControls: any, smartListData) {
  tabControls.forEach(element => {
    if (selectedObject.value === '5' || selectedObject.value === '6') {
      if (element.name === 'nonCtpDetailPayPlan') {
        element.label = 'Non-CTP Detail Pay Plan';
        element.type = 'dropdown';
        element.name = 'nonCtpDetailPayPlan';
        element.required = true;
        element.validators = [Validators.required];
        element.value = [];
        element.smartListName = 'nonCtpDetailPayPlan';
        const dropdownOptions = smartListData.find(f => f.smartListName === 'payPlan');
        element.options = dropdownOptions.smartListValues;
        selectedObject.formGroup.updateValueAndValidity();
      }
      if (element.name === 'nonCtpDetailGrade') {
        element.label = 'Non-CTP Detail Grade';
        element.type = 'dropdown';
        element.name = 'nonCtpDetailGrade';
        element.required = true;
        element.validators = [Validators.required];
        element.disabled = false;
        selectedObject.formGroup.updateValueAndValidity();
      }
    } else if (selectedObject.value === '2') {
      if (element.name === 'ctpDetailSeries') {
        element.label = 'CTP Detail Series or Equivalent';
        element.type = 'dropdown';
        element.name = 'ctpDetailSeries';
        element.required = true;
        element.validators = [Validators.required];
        element.value = '';
        element.smartListName = 'series';
        selectedObject.formGroup.updateValueAndValidity();
      }
      if (element.name === 'ctpDetailPayPlan') {
        element.label = 'CTP Detail Pay Plan';
        element.type = 'dropdown';
        element.name = 'ctpDetailPayPlan';
        element.required = true;
        element.validators = [Validators.required];
        element.value = '';
        element.smartListName = 'payPlan';
        selectedObject.formGroup.updateValueAndValidity();
      }
      if (element.name === 'ctpDetailGrade') {
        element.label = 'CTP Detail Grade';
        element.type = 'dropdown';
        element.name = 'ctpDetailGrade';
        element.required = true;
        element.validators = [Validators.required];
        element.value = '';
        element.disabled = false;
        selectedObject.formGroup.updateValueAndValidity();
      }
    } else if (selectedObject.value === '1') {
      if (element.name === 'ctpDetailSeries') {
        element.label = 'CTP Detail Series or Equivalent';
        element.type = 'dropdown';
        element.name = 'ctpDetailSeries';
        element.required = true;
        element.validators = [Validators.required];
        element.value = '';
        element.smartListName = 'series';
        selectedObject.formGroup.updateValueAndValidity();
      }
      if (element.name === 'ctpDetailPayPlan') {
        element.label = 'CTP Detail Pay Plan';
        element.type = 'dropdown';
        element.name = 'ctpDetailPayPlan';
        element.required = true;
        element.validators = [Validators.required];
        element.value = '';
        element.smartListName = 'payPlan';
        selectedObject.formGroup.updateValueAndValidity();
      }
      if (element.name === 'ctpDetailGrade') {
        element.label = 'CTP Detail Grade';
        element.type = 'dropdown';
        element.name = 'ctpDetailGrade';
        element.required = true;
        element.validators = [Validators.required];
        element.value = '';
        element.disabled = true;
        element.smartListName = 'grade';
        selectedObject.formGroup.updateValueAndValidity();
      }
    }
  });
}
export function trimObject(obj) {
  const trimmed = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
  return JSON.parse(trimmed);
}
// common method for sorting
export function customStringSorting(startingValue: string, secondValue: string, customOrder) {
  const aIndex = customOrder.indexOf(startingValue);
  const bIndex = customOrder.indexOf(secondValue);
  if (aIndex < bIndex) {
    return -1;
  } else if (aIndex > bIndex) {
    return 1;
  } else {
    return 0;
  }
}
export function checkPayPeriodEffectiveDates(dateValue: string, payPeriodsDates: any) {
  let payPeriodEffectiveDates;

  let isStringPresent = payPeriodsDates.validEffectiveDates.indexOf(dateValue);
  if (isStringPresent >= 0) {
    payPeriodEffectiveDates = true;
  } else {
    payPeriodEffectiveDates = false;
  }

  return payPeriodEffectiveDates;
}
export function checkPayPeriodNteDates(dateValue: string, payPeriodsDates: any) {
  let payPeriodNteeDates;

  let isStringPresent = payPeriodsDates.validNteDates.indexOf(dateValue);
  if (isStringPresent >= 0) {
    payPeriodNteeDates = true;
  } else {
    payPeriodNteeDates = false;

  }
  return payPeriodNteeDates;
}
