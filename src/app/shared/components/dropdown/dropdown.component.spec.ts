import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule,
    NgForm,
    NgControl,
    FormControl,
    FormControlDirective,
    AbstractControl, } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, SimpleChange, SimpleChanges } from '@angular/core';
import { CBASSelectComponent } from './dropdown.component';
import { ISelectOption } from './types';
import { CommonModule } from '@angular/common';

describe('CBASSelectComponent', () => {
    let component: CBASSelectComponent;
    let fixture: ComponentFixture<CBASSelectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CBASSelectComponent],
            imports: [ReactiveFormsModule, FormsModule ,
                ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CBASSelectComponent);
        component = fixture.componentInstance;
        component.options = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        component.removeOptional = true;
        expect(component).toBeTruthy();
    });

    it('onClick', () => {
        const target = document.createElement('button');
        component.isVisible = false;
        component.onClick(target);
        expect(component.onClick).toBeTruthy();
    });

    it('ngonit', () => {
        component.removeOptional = true;
        component.ngOnInit();
        expect(component.ngOnInit).toBeTruthy();
    });
    it('on Blur', () => {

        component.ngControl = new FormControlDirective([], [], null, null);
        component.onBlur();
        expect(component.onBlur).toBeDefined();
    });

    xit('validateDropDown', () => {
        component.ngControl = new FormControlDirective([], [], null, null);
        component.validateDropDown();
        expect(component.validateDropDown).toBeDefined();
    });

    it('updateTitle', () => {
        component.model = [{}];
        component.updateTitle();
        expect(component.updateTitle).toBeDefined();
    });

    it('updateNumSelected', () => {
        component.updateNumSelected();
        expect(component.updateNumSelected).toBeDefined();
    });

    it('Register on change', () => {
        // tslint:disable-next-line: ban-types
        const fn: Function = () => {};
        component.registerOnChange(fn);
        expect(component.registerOnChange).toBeDefined();
    });

    it('setSelected', () => {
        spyOn(component, 'validateDropDown').and.returnValue(null);
        component.model = [{ id: 3, name: 'test', isLabel: false }];
        component.disabledSelection = false;
        const option: ISelectOption = { id: 3, name: 'test', isLabel: false, value : 'test' };
        component.setSelected(new MouseEvent('Click'), option);
        expect(component.setSelected).toBeDefined();
    });

    it('setSelected isLabel as true', () => {
        const option: ISelectOption = { id: 3, name: 'test', isLabel: true , value : 'test'};
        component.setSelected(new MouseEvent('Click'), option);
        expect(component.setSelected).toBeDefined();
    });

    it('searchFilterApplied', () => {
        component.filterControl.setValue('test');
        component.searchFilterApplied();
        expect(component.searchFilterApplied).toBeDefined();
    });

    it('ngOnChanges', () => {
       const  options = 'options';
       component.ngOnChanges({
           options: new SimpleChange(null, 'testing', false),
           texts: new SimpleChange(null, 'testing', true),
       });
       component.loadedValueIds = [{}];
       component.settings.selectAddedValues = true;
       fixture.detectChanges();
       expect(component.ngOnChanges).toBeDefined();
    });

    it('Register on touched', () => {
        // tslint:disable-next-line: ban-types
        const fn: Function = () => {};
        component.registerOnTouched(fn);
        expect(component.registerOnTouched).toBeDefined();
    });

    it('getItemStyleSelectionDisabled', () => {
        component.disabledSelection = true;
        component.getItemStyleSelectionDisabled();
        expect(component.getItemStyleSelectionDisabled).toBeDefined();
    });
    it('getItemStyle', () => {
        const options: Array<ISelectOption> = [{id: 3, name: 'test', value : 'test'}];
        component.getItemStyle(options[0]);
        expect(component.getItemStyle).toBeDefined();
    });

    // it('updateRenderItems', () => {
    //     component.filterControl = 'test';
    //     component.updateRenderItems();
    //     expect(component.updateRenderItems).toBeDefined();
    // });

    it('applyFilters', () => {
        component.applyFilters('', '');
        expect(component.applyFilters).toBeDefined();
    });


    it('toggleDropdown', () => {
        component.toggleDropdown();
        expect(component.toggleDropdown).toBeDefined();
    });
    it('isSelected', () => {
        component.renderFilteredOptions = [{ name: 'test', id: 1, value : 'test'}];
        component.model = [{ name: 'test', id: 1 }];
        const options: Array<ISelectOption> = [{id: 3, name: 'test', value : 'test'}];
        component.isSelected(options[0]);
        expect(component.isSelected).toBeDefined();
    });

    it('Write Value', () => {
        component.writeValue('');
        expect(component.writeValue).toBeDefined();
    });

    it('clearSelectionButtonVisible', () => {
        const event = '';
        component.clearSelectionButtonVisible(event);
        expect(component.clearSelectionButtonVisible).toBeDefined();
    });

    it('load', () => {
        component.options = [];
        component.load();
        expect(component.load).toBeDefined();
    });

    it('isCheckboxDisabled', () => {
        component.isCheckboxDisabled();
        expect(component.isCheckboxDisabled).toBeDefined();
    });
    it('preventCheckboxCheck', () => {
        const option: ISelectOption = { id: 3, name: 'test', isLabel: true, value : 'test' };
        component.preventCheckboxCheck(new MouseEvent('Click'), option);
        expect(component.preventCheckboxCheck).toBeDefined();
    });
    it('uncheckAll', () => {
        component.options = [];
        component.disabledSelection = false;
        component.settings.selectAddedValues = true;
        spyOn(component, 'searchFilterApplied').and.returnValue(true);
        component.uncheckAll();
        expect(component.uncheckAll).toBeDefined();
    });

    it('uncheckAll with disabled selection ', () => {
        component.disabledSelection = true;
        component.settings.selectAddedValues = false;
        spyOn(component, 'searchFilterApplied').and.returnValue(true);
        component.uncheckAll();
        expect(component.uncheckAll).toBeDefined();
    });

    it('checkAll ', () => {
        component.options = [];
        component.disabledSelection = false;
        component.settings.selectAddedValues = true;
        spyOn(component, 'searchFilterApplied').and.returnValue(true);
        component.checkAllStatus = false;
        component.checkAll();
        expect(component.checkAll).toBeDefined();
    });

    it('checkAll with disabledSelection ', () => {
        component.options = [];
        component.disabledSelection = false;
        component.settings.selectAddedValues = true;
        spyOn(component, 'searchFilterApplied').and.returnValue(false);
        component.checkAllStatus = true;
        component.checkAll();
        expect(component.checkAll).toBeDefined();
    });

    it('checkAll with disabledSelection', () => {
        component.disabledSelection = true;
        component.checkAll();
        expect(component.checkAll).toBeDefined();
    });

    it('checkedSelect', () => {
        component.checkedYear = false;
        component.checkedSelect();
        expect(component.checkedSelect).toBeDefined();
    });

    it('checkScrollPosition', () => {
        const event = { target: 'scrollTop' };
        component.checkScrollPosition(event);
        expect(component.checkScrollPosition).toBeDefined();
    });
    it('checkScrollPosition', () => {
        const event = { target: 'scrollTop' };
        component.checkScrollPropagation(event, event);
        expect(component.checkScrollPosition).toBeDefined();
    });


    it('Clear Search', () => {
        component.clearSearch(new Event('click'));
        expect(component.clearSearch).toBeDefined();
    });


    it('Set Disabled state', () => {
        component.setDisabledState(true);
        expect(component.setDisabledState).toBeDefined();
    });

    it('Clear Selection', () => {
        component.ngControl = new FormControlDirective([], [], null, null);
        component.clearSelection(new MouseEvent('Click'));
        expect(component.clearSelection).toBeDefined();
    });

    it('key down function', () => {
        const options: Array<ISelectOption> = [{ id: 3, name: 'test', value : 'test' }];
        const event = new KeyboardEvent('Click');
        const e = new KeyboardEvent('keyup', { code: '13' , key: 'a' });
        component.keyDownFunction(e, options[0]);
        expect(component.keyDownFunction).toBeDefined();
    });
});

