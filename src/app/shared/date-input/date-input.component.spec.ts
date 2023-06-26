import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule,
    NgForm,
    NgControl, } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { DateInputComponent } from './date-input.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

describe('CurrencyInputComponent', () => {
    let component: DateInputComponent;
    let fixture: ComponentFixture<DateInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DateInputComponent,
                ],
            imports: [ReactiveFormsModule, FormsModule,
                OwlDateTimeModule, OwlNativeDateTimeModule
                ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DateInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngonit', () => {
        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();
    });
    it('destroy component', () => {
        component.onDestroy();
        expect(component.onDestroy).toBeDefined();
    });

    // xit('Validate', () => {
    //     component.validate();
    //     expect(component.validate).toBeDefined();
    // });

    it('Get Help Text', () => {
        component.getHelpText('');
        expect(component.getHelpText).toBeDefined();
    });

    it('Date updated', () => {
        component.dateUpdated('');
        expect(component.dateUpdated).toBeDefined();
    });

    it('Is border blue', () => {
        component.isBorderBlue();
        component.isBorderColorBlue = true;
        expect(component.isBorderBlue).toBeDefined();
    });

    xit('on Blur', () => {
        component.onBlur();
        expect(component.onBlur).toBeDefined();
    });

    it('Write Value', () => {
        component.writeValue('');
        expect(component.writeValue).toBeDefined();
    });

    it('Write Value null', () => {
        const obj = null;
        component.writeValue(obj);
        expect(obj).toBeNull();
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

    it('bgColorFlag', () => {
        expect(component.bgColorFlag).toBeFalsy();
    });

    it('cbapsColor', () => {
        expect(component.cbapsColor).toBeFalsy();
    });

    it('iconHide', () => {
        expect(component.iconHide).toBeFalsy();
    });
    it('label', () => {
        component.label = 'label';
        expect(component.label).toEqual('label');
    });

    it('disabled', () => {
        expect(component.disabled).toEqual(false);
    });

    it('tabIndex', () => {
        component.tabIndex = 1;
        expect(component.tabIndex).toEqual(1);
    });

});
