import {StartDtValCellRenderrComponent } from './cell-renderer.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('StartDtValCellRenderrComponent', () => {
    let component: StartDtValCellRenderrComponent;
    let fixture: ComponentFixture<StartDtValCellRenderrComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StartDtValCellRenderrComponent],
            imports: [ReactiveFormsModule, FormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StartDtValCellRenderrComponent);
        component = fixture.componentInstance;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            component.params = { value : '10/12/2012', node: { group: false } };
          });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init', () => {
        const params = { value : '10/12/2012',
                         node: { group: false },
                         data: { ctpPlannedAwardDate: '10/14/2012', plannedPOPStartDate : '10/15/2012', plannedPOPEndDate: '10/16/2012' }};
        component.agInit(params);
        expect(component.cellValue).toBe('10/12/2012');
        expect(component.showValidationEndDate).toBe(false);
        expect(component.showValidationCTP).toBe(false);
    });

    it('should init when ctp planned award date is greater than pop start date', () => {
        const params = { value : '10/12/2012',
                         node: { group: false },
                         data: { ctpPlannedAwardDate: '10/14/2012', plannedPOPStartDate : '10/12/2012', plannedPOPEndDate: '10/13/2012' }};
        component.agInit(params);

        expect(component.cellValue).toBe('10/12/2012');
        expect(component.showValidationEndDate).toBe(false);
        expect(component.showValidationCTP).toBe(true);
    });

    it('should init when pop end date less than start date', () => {
        const params = { value : '10/12/2012',
                         node: { group: false },
                         data: { ctpPlannedAwardDate: '10/09/2012', plannedPOPStartDate : '10/12/2012', plannedPOPEndDate: '10/10/2012' }};
        component.agInit(params);
        expect(component.cellValue).toBe('10/12/2012');
        expect(component.showValidationEndDate).toBe(true);
        expect(component.showValidationCTP).toBe(false);
    });

    it('should getValue', () => {
        component.getValue();
        expect(component.getValue()).toBe(component.cellValue);
    });

    it('should popUp', () => {
        component.isPopup();
        expect(component.isPopup()).toBe(true);
    });

    it('should onclick', () => {
        const params = new Date();
        component.onclick(params);
        expect(component.onclick).toBeDefined();
    });

    it('should refresh', () => {
        const params = {value : '10/12/2012'};
        expect(component.refresh(params)).toBe(true);
    });
});
