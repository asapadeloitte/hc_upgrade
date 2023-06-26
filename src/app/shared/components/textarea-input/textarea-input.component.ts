import {
  Component,
  OnInit,
  Input,
  Optional,
  forwardRef,
  Attribute,
  Self,
  ContentChildren,
  QueryList,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  NgControl,
  NgForm,
  FormGroup
} from '@angular/forms';

import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import { ValidationMsg } from '../validation-msg/validation-msg.component';
import {
  hasRequiredValidator,
  getErrorTextFromValidationResult
} from '../../utilities';

export const TEXT_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaInputComponent),
  multi: true
};

let nextUniqueId = 0;
let nextAriaDescribedById = 0;

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss']
})
export class TextareaInputComponent implements ControlValueAccessor, OnInit  {

  private _uid = `app-textarea-input-${nextUniqueId++}`;
    private _ariadesribedById = `ai-aria-text-input-${nextAriaDescribedById++}`;

    @ViewChild('focusElement', { static: false }) focusElement: ElementRef;
    @Input() bgColorFlag = false;
    @Input() cbapsColor = false;
    @Input() iconHide = false;
    @Input() type = 'textarea';
    @Input() field: any = {};
    @Input() form: FormGroup;
    @Input() label: string;
    @Input() disabled = false;
    @Input() focusOnValidate = false;
    @Input() mask: string;
    @Input() formatHelp: string;
    @Input() text: string;
    @Input() tabIndex: number;
    @Input() maxLength;
    @Input() autocomplete: string;
    @Output() emitHistory = new EventEmitter();
    @Input()
    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value || this._uid;
    }
    @Input() focusOnLoad = false;

    get ariaDesribedById(): string {
        return this._ariadesribedById;
    }

    @ContentChildren(ValidationMsg, { descendants: true })
    validationMessages: QueryList<ValidationMsg>;

    public errors: string[] = [];
    get remainingChars() {
        return this.text != null
            ? this.maxLength - this.text.length
            : this.maxLength;
    }

    private _id: string;

    @Input() isRequired = false;
    @Input() showRemainingCharacters = false;
    @Input() removeOptional: boolean;

    public onTouchedCallback: () => void = () => { };
    public onChangeCallback: (_: any) => void = () => { };


    constructor(
        @Self()
        @Optional()
        public ngControl: NgControl,
        @Attribute('tabindex') tabIndex: string
    ) {
        if (this.ngControl) {
            // Note: we provide the value accessor through here, instead of
            // the `providers` to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }

        this.id = this.id;
        this.tabIndex = parseInt(tabIndex, 10) || 0;
    }

    ngOnInit() {
        this.isRequired = this.isRequired || hasRequiredValidator(this.ngControl);
        if (this.ngControl) {
            this.ngControl.statusChanges.subscribe(() => this.validate());
        }
        if (this.removeOptional === true) {
            this.isRequired = true;
        }

        if (this.cbapsColor && (this.ngControl.value === null || this.ngControl.value === '')) {
            this.bgColorFlag = true;
        }
    }

    validate(): void {
        this.errors = [];
        if (
           // this.ngControl.touched &&
            !this.ngControl.valid &&
            this.ngControl.errors != null
        ) {
            // tslint:disable-next-line:forin
            for (const d in this.ngControl.errors) {
                const valMsg = this.validationMessages.find(msg => msg.validator === d);
                if (valMsg != null) {
                    this.errors.push(valMsg.msg);
                    if (this.cbapsColor && (this.ngControl.value === null || this.ngControl.value === '')) {
                        this.bgColorFlag = true;
                    }
                } else {
                    this.errors.push(
                        getErrorTextFromValidationResult(d, this.ngControl.errors[d])
                    );
                }
            }
            if (this.focusOnValidate) {
                this.focusElement.nativeElement.focus();
            }
        }

    }

    onKeyDown($event: KeyboardEvent) {
        if (
            $event.code === 'ArrowLeft' ||
            $event.key === 'ArrowRight' ||
            $event.key === 'Delete' ||
            $event.key === 'Backspace' ||
            $event.code === 'Shift' ||
            $event.code === 'Tab' ||
            $event.ctrlKey
        ) {
            return;
        }
        if (this.maxLength) {
            if (this.text && this.text.length >= this.maxLength) {
                $event.preventDefault();
                $event.stopPropagation();
                $event.cancelBubble = true;
            }
        }
    }

    onDestroy(): void { }

    onBlur(): void {
        this.onTouchedCallback();
    }

    writeValue(obj: string): void {
        this.text = obj;
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

    inputChanged(t: string) {
        this.text = t;
        this.onChangeCallback(this.text);
        if (this.cbapsColor && this.ngControl.value != '') {
            this.bgColorFlag = false;
        } else if (this.cbapsColor && this.ngControl.value == '') {
            this.bgColorFlag = true;
        }
    }

    onClickInfo(e) {
        this.emitHistory.emit(e);
    }
}
