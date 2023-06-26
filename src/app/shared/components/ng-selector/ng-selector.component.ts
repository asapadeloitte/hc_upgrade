import {
    Component, Input, forwardRef, OnInit, ContentChildren, QueryList, Self, Optional, Output, EventEmitter, ElementRef, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ISelectOption } from '../dropdown/types';
import { ValidationMsg } from '../validation-msg/validation-msg.component';
import { hasRequiredValidator, getErrorTextFromValidationResult } from '../../utilities';


export const SELECTOR_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgSelectorComponent),
    multi: true
};

let nextUniqueId = 0;
let nextAriaDescribedById = 0;

@Component({
    selector: 'app-ngselector',
    templateUrl: './ng-selector.component.html',
    styleUrls: ['./ng-selector.component.scss']
})
export class NgSelectorComponent implements OnInit, ControlValueAccessor {
    private _uid = `app-ngselector-${nextUniqueId++}`;
    private _ariadesribedById = `app-aria-selector-${nextAriaDescribedById++}`;
    public errors: string[] = [];
    private _id: string;
    @ViewChild('focusNg', { static: false }) focusNg: ElementRef;
    @ContentChildren(ValidationMsg, { descendants: true })
    validationMessages: QueryList<ValidationMsg>;
    @Input() bgColorFlag = false;
    @Input() cbapsColor = false;
    @Input() label: string;
    @Input() isRequired: boolean;
    @Input() disabled = false;
    @Input() removeOptional: boolean;
    @Input() defaultText = 'Select One';
    @Input() iconHide = false;
    @Input() field: any = {};
    // tslint:disable-next-line:no-input-rename
    @Input('value') val;
    @Input() options: Array<ISelectOption>;
    @Input() focusOnLoad = false;
    @Output() emitHistory = new EventEmitter();
    public searchSpecialCharcters = false;
    onChange: any = () => { };
    onTouched: any = () => { };

    get value() {
        return this.val;
    }

    set value(val) {
        this.val = val === '' ? null : val;
    }

    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value || this._uid;
    }
    get ariaDescribedById(): string {
        return this._ariadesribedById;
    }

    constructor(
        @Self()
        @Optional()
        public ngControl: NgControl,
        private el: ElementRef
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
        this.id = this.id;
        setTimeout(() => {
            const chkboxElmnt: NodeList = this.el.nativeElement.querySelectorAll('input[role="combobox"]');
            if (chkboxElmnt.length > 0) {
                chkboxElmnt.forEach(p => p['id'] = this.id);
            }
        }, 500);
    }
    ngOnInit(): void {
        if (this.label === 'Reassignment Organizational Level' || this.label === 'New Organizational Level'
        || this.label === 'CTP Detail Organizational Level') {

            this.searchSpecialCharcters = true;
        } else {
            this.searchSpecialCharcters = false;
        }
        this.isRequired = this.isRequired || hasRequiredValidator(this.ngControl);
        if (this.ngControl) {
            this.ngControl.statusChanges.subscribe(x => this.validate());
        }
        if (this.isRequired) {
            this.removeOptional = true;
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
        if (this.cbapsColor && this.ngControl.value !== null) {
            this.bgColorFlag = false;
        }
    }

    onBlur(): void {
        this.onTouched();
    }

    valueChanged(e) {
        if (e === undefined || e === null) {
            e = '';
        }
        this.onChange(e);
    }

    registerOnChange(fn): void {
        this.onChange = fn;
    }

    registerOnTouched(fn): void {
        this.onTouched = fn;
    }

    writeValue(value): void {
        this.value = value;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
    onClickInfo(e) {
        this.emitHistory.emit(e);
    }
}
