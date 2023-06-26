import { CurrencyInputComponent } from './currency-input.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule,
    NgForm,
    NgControl, } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';

describe('CurrencyInputComponent', () => {
    let component: CurrencyInputComponent;
    let fixture: ComponentFixture<CurrencyInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CurrencyInputComponent],
            imports: [ReactiveFormsModule, FormsModule, CurrencyMaskModule ,
                ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CurrencyInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.removeOptional = true;
        expect(component).toBeTruthy();
    });

    it('ngonit', () => {
        component.removeOptional = true;
        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();
    });
    it('destroy component', () => {
        component.onDestroy();
        expect(component.onDestroy).toBeDefined();
    });

    xit('Validate', () => {
        component.validate();
        expect(component.validate).toBeDefined();
    });

    it('Key Down', () => {
        const event = new KeyboardEvent('keydown', {
            key: 'ArrowRight' , code: 'ArrowLeft'
        });
        component.maxLength = true;
        component.onKeyDown(event);
        expect(component.onKeyDown).toBeDefined();
    });

    it('on Blur', () => {
        component.onBlur();
        expect(component.onBlur).toBeDefined();
    });

    it('Write Value', () => {
        component.writeValue('');
        expect(component.writeValue).toBeDefined();
    });

    it('On Click Info', () => {
        component.onClickInfo('');
        expect(component.onClickInfo).toBeDefined();
    });

    it('Register on change', () => {
        component.registerOnChange('');
        expect(component.registerOnChange).toBeDefined();
    });

    it('Register on touched', () => {
        component.registerOnTouched('');
        expect(component.registerOnTouched).toBeDefined();
    });

    it('Set Disabled state', () => {
        component.setDisabledState(true);
        expect(component.setDisabledState).toBeDefined();
    });

    it('Change the input', () => {
        component.inputChanged(null);
        expect(component.inputChanged).toBeDefined();
    });
    it('bgColorFlag', () => {
        expect(component.bgColorFlag).toBeFalsy();
    });

    it('cbapsColor', () => {
        expect(component.cbapsColor).toBeFalsy();
    });

    it('iconHide', () => {
        expect(component.iconHide).toBeFalsy();
    });

    it('type', () => {
        expect(component.type).toEqual('text');
    });

    it('label', () => {
        component.label = 'label';
        expect(component.label).toEqual('label');
    });

    it('disabled', () => {
        expect(component.disabled).toEqual(false);
    });

    it('focusOnValidate', () => {
        expect(component.focusOnValidate).toEqual(false);
    });

    it('mask', () => {
        component.mask = 'mask';
        expect(component.mask).toEqual('mask');
    });

    it('formatHelp', () => {
        component.formatHelp = 'help';
        expect(component.formatHelp).toEqual('help');
    });

    it('text', () => {
        component.text = 'text';
        expect(component.text).toEqual('text');
    });

    it('tabIndex', () => {
        component.tabIndex = 1;
        expect(component.tabIndex).toEqual(1);
    });

    it('maxLength', () => {
        component.maxLength = 10;
        expect(component.maxLength).toEqual(10);
    });

    it('autocomplete', () => {
        component.autocomplete = 'true';
        expect(component.autocomplete).toEqual('true');
    });

});
