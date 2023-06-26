import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { AgGridModule } from 'ag-grid-angular';
import { getErrorTextFromValidationResult, dateComparator, numberSort, numberFormatter, upperCaseFirstChar } from './utilities';

describe('verifyAndTransformNumber', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule,
                AgGridModule.withComponents()],
        });
    });

    it('should return Error text message for getErrorTextFromValidationResult', () => {
        const error = { requiredLength: 12, max: 12, min: 12 };
        expect(getErrorTextFromValidationResult).toBeDefined();
        expect(getErrorTextFromValidationResult('maxlength', error)).toBe('Input exceeds max length of 12');
        expect(getErrorTextFromValidationResult('minlength', error)).toBe('Input is less than min required length 12');
        expect(getErrorTextFromValidationResult('max', error)).toBe('Input must be max 12');
        expect(getErrorTextFromValidationResult('min', error)).toBe('Input must be min 12');
        expect(getErrorTextFromValidationResult('error', 12)).toBe('Error');
        expect(getErrorTextFromValidationResult('error', 'string')).toBe('string');
    });

    it('dateComparator should be defined', () => {
        expect(dateComparator).toBeDefined();
        expect(dateComparator('12/12/2020', '13/12/2020')).toBe(-10000);
        expect(getErrorTextFromValidationResult(null, '12/12/2020')).toBe('12/12/2020');
    });

    it('numberSort should be defined', () => {
        expect(numberSort).toBeDefined();
        expect(numberSort(100, 120)).toBe(-20);
    });

    it('numberFormatter should be defined', () => {
        const params = { value: '100.90' };
        expect(numberFormatter).toBeDefined();
        expect(numberFormatter(params)).toBe(101);
    });

    it('upperCaseFirstChar should be defined', () => {
        expect(upperCaseFirstChar).toBeDefined();
        expect(upperCaseFirstChar('params')).toBe('Params');
    });
});
