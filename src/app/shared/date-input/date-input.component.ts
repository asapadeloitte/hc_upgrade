import {
  Component,
  OnInit,
  Input,
  InjectionToken,
  Inject,
  Optional,
  Self,
  Attribute,
  ContentChildren,
  QueryList,
  Output,
  EventEmitter
} from '@angular/core';
import { DatePickerOptions } from './date-picker-options';
import {
  ControlValueAccessor,
  NgControl,
  NgForm,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
  AsyncValidatorFn,
  Validator,
  RequiredValidator,
  ValidatorFn
} from '@angular/forms';
import * as moment from 'moment';
import { hasRequiredField, hasRequiredValidator, upperCaseFirstChar, getErrorTextFromValidationResult } from '../../utilities';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from '../date-input/moment.date-time-adapter.class';
import { ValidationMsg } from '../validation-msg/validation-msg.component';
import { DatePipe } from '@angular/common';


export const NG_DATE_PICKER_OPTIONS = new InjectionToken<DatePickerOptions>('DatePickerOptions');

let nextUniqueId = 0;
let nextAriaDescribedById = 0;

export const MY_CUSTOM_FORMATS = {
  parseInput: 'YYYY-MM-DD',
  fullPickerInput: 'MM/DD/YYYY',
  datePickerInput: 'MM/DD/YYYY',
  timePickerInput: 'MM/DD/YYYY',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[attr.aria-label]': '_ariaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby'
  },
  providers: [
    DatePipe,
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE]
    },

    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ]
})
export class DateInputComponent implements ControlValueAccessor, OnInit {
  private _uid = `app-date-input-${nextUniqueId++}`;
  private _ariadesribedById = `app-date-input-${nextAriaDescribedById++}`;

  @Input() bgColorFlag = false;
  @Input() cbapsColor = false;
  @Input() label: string;
  @Input() format: string;
  @Input() helpText: string;
  @Input() datePickerOptions: DatePickerOptions;
  @Input() date: Date | string;
  @Input() disabled = false;
  @Input() min: Date;
  @Input() max: Date;
  @Input() startView: Date;
  @Input() tabIndex: number;
  @Input() placeholder = 'mm/dd/yyyy';
  // @Input() placeholder = '';
  @Input() isBorderColorBlue: Boolean = false;
  @Input() iconHide = false;
  @Input() gridDate = false;
  @Output() emitHistory = new EventEmitter();

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }

  get ariaDesribedById(): string {
    return this._ariadesribedById;
  }

  @ContentChildren(ValidationMsg, { descendants: true })
  validationMessages: QueryList<ValidationMsg>;

  private _id: string;

  @Input() isRequired = false;

  public errors: string[] = [];

  protected onTouchedCallback: () => void = () => { };
  protected onChangeCallback: (_: any) => void = t => { };

  constructor(
    @Optional() private _parentForm: NgForm,
    @Self()
    @Optional()
    public ngControl: NgControl,
    @Optional()
    @Inject(NG_DATE_PICKER_OPTIONS)
    datePickerOptions,
    @Attribute('tabindex') tabIndex: string,
    @Optional()
    @Inject(NG_VALIDATORS)
    private validators: Array<any>,
    @Optional()
    @Inject(NG_ASYNC_VALIDATORS)
    private asyncValidators: Array<any>
  ) {
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
    this.datePickerOptions =
      datePickerOptions != null ? datePickerOptions : new DatePickerOptions();

    // Force setter to be called in case id was not specified.
    this.id = this.id;
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngOnInit() {
    // debugger;
    this.isRequired = this.isRequired || hasRequiredValidator(this.ngControl);

    if (this.ngControl) {
      this.ngControl.statusChanges.subscribe(x => {
        this.validate();
      });
    }

    if (this.cbapsColor && this.ngControl.value === null) {
        this.bgColorFlag = true;
    }
  }
  validate(): void {
    this.errors = [];
    if (!this.ngControl.valid && this.ngControl.errors != null) {
      // tslint:disable-next-line:forin
      for (const d in this.ngControl.errors) {
        if (this.ngControl.errors[d]) {
          const valMsg = this.validationMessages.find(msg => msg.validator === d);
          if (valMsg != null) {
            this.errors.push(valMsg.msg);
            if (this.cbapsColor && this.ngControl.value === null) {
              this.bgColorFlag = true;
            }
          } else {
            this.errors.push(getErrorTextFromValidationResult(d, this.ngControl.errors[d]));
          }
        }
      }
    }
    if (this.cbapsColor && this.ngControl.value !== null) {
      this.bgColorFlag = false;
    }
  }

  onDestroy(): void { }

  getHelpText(t) {
    return t;
  }

  onBlur(): void {
    this.onTouchedCallback();
   // this.validate();
    if (this.cbapsColor && this.ngControl.value === null) {
      this.bgColorFlag = true;
    } else {
      this.bgColorFlag = false;
    }
  }

  writeValue(obj: Date | string): void {
    const datePipe = new DatePipe('en-US');
    if (typeof obj === 'string') {
      this.date = datePipe.transform(obj, 'yyyy-MM-dd');
    } else {
      if (obj === null) {
        this.date = '';
      } else {
        this.date = datePipe.transform(obj, 'yyyy-MM-dd');
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  dateUpdated(d: string): void {
    this.onTouchedCallback();
    this.writeValue(d);
    this.onChangeCallback(this.date);
    setTimeout(() => { // this will make the execution after the above boolean has changed
      const a = document.getElementById(this.id);
      a.focus();
    }, 0);
  }

  isBorderBlue(): boolean {
    if (this.isBorderColorBlue) {
      return true;
    }
  }
  onClickInfo(e) {
    this.emitHistory.emit(e);
}
}
