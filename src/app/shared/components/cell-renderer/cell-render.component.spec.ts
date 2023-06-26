import { CellRendererComponent } from './cell-renderer.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl, NgControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

describe('CellRendererComponent', () => {
    let component: CellRendererComponent;
    let fixture: ComponentFixture<CellRendererComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CellRendererComponent],
            imports: [ReactiveFormsModule, FormsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CellRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init', () => {
        const params = { value: '10/12/2012' };
        component.agInit(params);
        expect(component.cellValue).toBe('2012-10-12');
    });

    it('should getValue', () => {
        component.cellValue = '10/12/2012';
        component.getValue();
        // const pipe = new DatePipe('en-US');
        // component.cellValue = pipe.transform(params.value, 'yyyy-MM-dd');
        expect(component.getValue()).not.toBeNull();
        expect(component.cellValue).toBe('10/12/2012');
    });

    it('should getValue', () => {
        component.cellValue = '';
        component.getValue();
        expect(component.getValue()).toBe('');
    });

    it('should onclick', () => {
        const params = new Date();
        component.onclick(params);
        expect(component.onclick).toBeDefined();
    });

    xit('should refresh', () => {
        const params = { value: '10/12/2012' };
        expect(component.refresh(params)).toBe(true);
    });
});





