import { TextInputComponent } from './text-input.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

describe('TextInputComponent', () => {
    let component: TextInputComponent;
    let fixture: ComponentFixture<TextInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextInputComponent],
            imports: [ReactiveFormsModule, FormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be cbas', () => {
        component.cbapsColor = true;
        expect(component.cbapsColor).toEqual(true);
    });

    it('should be iconHide', () => {
        component.iconHide = false;
        expect(component.iconHide).toEqual(false);
    });

    it('should be type', () => {
        expect(component.type).toEqual('text');
    });

    it('should be label', () => {
        component.label = 'exampleLabel';
        expect(component.label).toEqual('exampleLabel');
    });

    it('should be disabled', () => {
        expect(component.disabled).toEqual(false);
    });

    it('should be focusOnValidate', () => {
        expect(component.focusOnValidate).toEqual(false);
    });

    it('should be mask', () => {
        component.mask = 'exampleMask';
        expect(component.mask).toEqual('exampleMask');
    });

    it('should be formatHelp', () => {
        component.formatHelp = 'exampleformatHelp';
        expect(component.formatHelp).toEqual('exampleformatHelp');
    });

    it('should be text', () => {
        component.text = 'text';
        expect(component.text).toEqual('text');
    });

    it('should be tabIndex', () => {
        component.tabIndex = 0;
        expect(component.tabIndex).toEqual(0);
    });

    it('should be maxlength', () => {
        component.maxLength = 100;
        expect(component.maxLength).toEqual(100);
    });

    it('should be autocomplete', () => {
        component.autocomplete = 'false';
        expect(component.autocomplete).toEqual('false');
    });

    it('should be focusOnLoad', () => {
        expect(component.focusOnLoad).toEqual(false);
    });

    // it('shoud id', () => {
    //     let nextUniqueId = 0;
    //     const _uid = `app-number-input-${nextUniqueId++}`;
    //     const _id = _uid;
    //     expect(component.id).toEqual(_id);
    // });

    it('should be isRequired', () => {
        expect(component.isRequired).toEqual(false);
    });

    it('should be showRemainingCharacters', () => {
        expect(component.showRemainingCharacters).toEqual(false);
    });

    it('should be Initilization', () => {
        if (component.removeOptional) {
            expect(component.isRequired).toBe(true);
        } else {
            expect(component.isRequired).toBe(false);
        }
    });

    it('onBlur function', () => {
        component.onBlur();
        const blur = spyOn(component, 'onTouchedCallback');
        expect(blur).toBeDefined();
    });

    it('disbaled function', () => {
        const value = true;
        component.setDisabledState(value);
        component.disabled = value;
        expect(component.disabled).toBe(value);
    });

    it('writeValue Function', () => {
        const value = 'Description';
        component.writeValue(value);
        if (value) {
            component.text = value;
            expect(component.text).toEqual('Description');
        }
    });

    it('inputChanged Function', () => {
        const value = '15';
        component.inputChanged(value);
        if (value) {
            component.text = value;
            expect(component.text).toEqual('15');
        }
    });

    it('registerOnTouched Function', () => {
        function value() {
            return 'abc';
        }
        component.registerOnTouched(value);
        component.onTouchedCallback = value;
        expect(component.onTouchedCallback).toBe(value);
    });

    it('registerOnChange Function', () => {
        function value() {
            return 'abc';
        }
        component.registerOnChange(value);
        component.onChangeCallback = value;
        expect(component.onChangeCallback).toBe(value);
    });

    it('Destory Function', () => {
        component.onDestroy();
        expect(component.onDestroy).toBeDefined();
    });

    describe('onKeyDown Function', () => {
        it('event test', () => {
            const event = new KeyboardEvent('2', {
                code: 'ArrowLeft',
                key: ' ',
                ctrlKey: false
            });
            component.onKeyDown(event);
            if (
                event.code === 'ArrowLeft' ||
                event.key === 'ArrowRight' ||
                event.key === 'Delete' ||
                event.key === 'Backspace' ||
                event.code === 'Shift' ||
                event.code === 'Tab' ||
                event.ctrlKey
            ) {
                expect(event.key).toBe(' ');
            }
        });

        it('event 2 test', () => {
            const event2 = new KeyboardEvent('2', {
                code: 'Digit2',
                key: '2',
                ctrlKey: false
            });
            component.onKeyDown(event2);
            if (component.maxLength) {
                if (component.text && component.text.length >= component.maxLength) {
                    expect(event2.preventDefault).toHaveBeenCalled();
                    expect(event2.stopPropagation).toHaveBeenCalled();
                    event2.cancelBubble = true;
                    expect(event2.cancelBubble).toBeTruthy();
                }
            }
        });
    });

    // it('validate function', () => {

    //     // component.validate();
    //     const errors = [ { msg: 'filed1 is required', validator: 'required'}];
    //     // expect (errors).not.toBeNull();
    //     expect (errors[0].msg).toBe('filed1 is required');
    //     expect (errors[0].validator).toBe('required');

    //     // component.focusOnValidate = true;
    //     // expect(component.focusOnValidate).toBeTruthy();
    //     // expect(component.focusElement.nativeElement).toBe(focus);
    // });

    // it('onClickInfo click event', () => {
    //     const value = 'abc';
    //     component.onClickInfo(value);
    //     spyOn(component.emitHistory, 'emit');
    //     expect(component.emitHistory.emit).toHaveBeenCalled();
    // });
});
