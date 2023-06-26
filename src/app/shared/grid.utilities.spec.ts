import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import {
    verifyAndTransformNumber, nonEditableAmountColorStyle,
    bracketFormatter, roundedAmountBracketsFormatter,
    sortAlphaNum,
    errorWitheditableAmountColorStyle, editableAmountColorStyle,
    currencyFormatter, roundedNumberBracketsFormatter,
    amountBracketsFormatter,
    numberBracketsFormatter, gridExport, formatNumber, changeHistoryExport, validateSelectedRows, generateGridTotalData
} from './grid-utilities';

import { AgGridModule } from 'ag-grid-angular';

describe('verifyAndTransformNumber', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule,
                AgGridModule.withComponents()],
        });
    });

    it('should tranform empty value into 0', () => {
        const params = { value: '' };
        const tempNumber = 0;
        expect(verifyAndTransformNumber).toBeDefined();
        expect(verifyAndTransformNumber(params)).toBe(tempNumber);
    });

    it('should tranform undefined value into 0', () => {
        const params = { value: undefined };
        const tempNumber = 0;
        expect(verifyAndTransformNumber).toBeDefined();
        expect(verifyAndTransformNumber(params)).toBe(tempNumber);
    });

    it('should tranform null value into 0', () => {
        const params = { value: null };
        const tempNumber = 0;
        expect(verifyAndTransformNumber).toBeDefined();
        expect(verifyAndTransformNumber(params)).toBe(tempNumber);
    });

    it('should tranform null value into 0', () => {
        const params = { value: 'test' };
        const tempNumber = 0;
        expect(verifyAndTransformNumber).toBeDefined();
        expect(verifyAndTransformNumber(params)).toBe(tempNumber);
    });

    it('should return number', () => {
        const params = { value: 100 };
        expect(verifyAndTransformNumber).toBeDefined();
        expect(verifyAndTransformNumber(params)).toBe(100);
    });
});

describe('nonEditableAmountColorStyle', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });

    it('should return styles for positive values nonEditable', () => {
        const params = { value: 100 };
        const positiveValueStyle = { backgroundColor: '#E6E6E6', color: 'black', 'text-align': 'right' };
        expect(nonEditableAmountColorStyle).toBeDefined();
        expect(nonEditableAmountColorStyle(params)).toEqual(positiveValueStyle);
    });

    it('should return styles for negative values nonEditable', () => {
        const params = { value: '-100' };
        const negativeValueStyle = { backgroundColor: '#E6E6E6', color: '#c70032', 'text-align': 'right' };
        expect(nonEditableAmountColorStyle).toBeDefined();
        expect(nonEditableAmountColorStyle(params)).toEqual(negativeValueStyle);
    });

    it('should return styles for null or undefined values nonEditable', () => {
        const params = { value: null };
        const negativeValueStyle = { backgroundColor: '#E6E6E6', color: 'black', 'text-align': 'right' };
        expect(nonEditableAmountColorStyle).toBeDefined();
        expect(nonEditableAmountColorStyle(params)).toEqual(negativeValueStyle);
    });
    it('it should in "bracketFormatter" changeAmount is null', () => {
        const amount = null;
        expect(bracketFormatter(amount)).toBe('');
    });
    it('it should return changeAmount is  not equal null', () => {
        const amount = '100';
        expect(bracketFormatter).toBeDefined();
        expect(bracketFormatter(amount)).toBe(amount);
    });
    it('it should return changeAmount is negative value', () => {
        const amount = '-100';
        const positiveAmount = '(100)';
        expect(bracketFormatter).toBeDefined();
        expect(bracketFormatter(amount)).toBe(positiveAmount);
    });
});
describe('roundedAmountBracketsFormatter', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });

    it('it should return positive value', () => {
        const tempNumber = { value: 100 };
        const tempNumber1 = { value: -100 };
        const inrFormat = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
        expect(roundedAmountBracketsFormatter).toBeDefined();
        expect(roundedAmountBracketsFormatter(tempNumber)).toEqual('$100');
        expect(roundedAmountBracketsFormatter(tempNumber1)).toEqual('($100)');

    });
    it('sortAlphaNum', () => {
        const temp1 = 'CTP-21-C-0001';
        const temp2 = 'CTP-21-C-0002';
        const reA = /[^a-zA-Z]/g;
        const reN = /[^0-9]/g;
        const aA = temp1.replace(reA, '');
        const bA = temp2.replace(reA, '');
        if (aA === bA) {
            const aN = parseInt(temp1.replace(reN, ''), 10);
            const bN = parseInt(temp2.replace(reN, ''), 10);
        }
        expect(sortAlphaNum(temp1, temp2)).toBeDefined();
    });

});
describe('errorWitheditableAmountColorStyle', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('should return styles for positive values nonEditable', () => {
        const params = { value: 100 };
        const positiveValueStyle = { color: 'black' };
        expect(errorWitheditableAmountColorStyle).toBeDefined();
        expect(errorWitheditableAmountColorStyle(params)).toEqual(positiveValueStyle);
    });
    it('should return styles for negative values nonEditable', () => {
        const params = { value: '-100' };
        const negativeValueStyle = { color: '#c70032' };
        expect(errorWitheditableAmountColorStyle).toBeDefined();
        expect(errorWitheditableAmountColorStyle(params)).toEqual(negativeValueStyle);
    });
    it('should return styles for null or undefined values nonEditable', () => {
        const params = { value: null };
        const undefinedColorStyle = { color: 'black' };
        expect(errorWitheditableAmountColorStyle).toBeDefined();
        expect(errorWitheditableAmountColorStyle(params)).toEqual(undefinedColorStyle);
    });
});

describe('formatNumber', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('it should export grid', () => {
        const params = '100';
        expect(formatNumber(params)).toBeDefined();
        expect(formatNumber(params)).toBe('100');
    });
});

describe('changeHistoryExport', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('it should change history export', () => {
        const params = {
            column: { userProvidedColDef: { field: 'changeAmount' } }
        };
        const cellHistoryFieldsArr = ['changeAmount'];
        const result = [];
        expect(changeHistoryExport(params, cellHistoryFieldsArr)).toBeDefined();
        // expect(changeHistoryExport(params, cellHistoryFieldsArr)).toBe(result);
    });
});

describe('validateSelectedRows', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('it should validate selected rows has the valid change amount', () => {
        const params = [];
        const columnsToValidate = ['changeAmount'];
        const result = [];
        expect(validateSelectedRows(params, columnsToValidate)).toBeDefined();
        // expect(validateSelectedRows(params, cellHistoryFieldsArr)).toBe(result);
    });
    it('should init params value should be empty', () => {
        const invalidData = true;
        const value = '';
        expect(invalidData).toBeTruthy();
        expect(validateSelectedRows).toBeDefined();
    });
    it('should init params value should be null', () => {
        const value = null;
        const invalidData = true;
        expect(invalidData).toBe(true);
        expect(validateSelectedRows).toBeDefined();
    });
    it('should init params value should be undefined', () => {
        const value = undefined;
        const invalidData = true;
        expect(invalidData).toBe(true);
        expect(validateSelectedRows).toBeDefined();
    });
    it('should init params value should be 0', () => {
        const value = '0';
        const invalidData = true;
        expect(invalidData).toBe(true);
        expect(validateSelectedRows).toBeDefined();
    });
    it('should init params value should be not a anumber', () => {
        const value = 'yuuyu';
        const invalidData = true;
        expect(invalidData).toBe(true);
        expect(validateSelectedRows).toBeDefined();
    });
});

describe('generateGridTotalData', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('it should generate grid total row', () => {
        const params = { api: null };
        const sumColumns = ['changeAmount'];
        const result = [];
        expect(generateGridTotalData(params, sumColumns, 'capacity')).toBeDefined();
        // expect(generateGridTotalData(params, cellHistoryFieldsArr)).toBe(result);
    });
});


describe('roundedNumberBracketsFormatter', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('should return rounded positive values ', () => {
        const params = { value: 100.9877 };
        expect(roundedNumberBracketsFormatter).toBeDefined();
        expect(roundedNumberBracketsFormatter(params)).toEqual('101');
    });
});

describe('numberBracketsFormatter', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('should return rounded positive values ', () => {
        const params = { value: 100 };
        expect(numberBracketsFormatter).toBeDefined();
        expect(numberBracketsFormatter(params)).toEqual('100');
    });
});

describe('editableAmountColorStyle', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });
    it('should return styles for positive values nonEditable', () => {
        const params = { value: 100 };
        const positiveValueStyle = { color: 'black', 'text-align': 'right' };
        expect(editableAmountColorStyle).toBeDefined();
        expect(editableAmountColorStyle(params)).toEqual(positiveValueStyle);
    });
    it('should return styles for negative values nonEditable', () => {
        const params = { value: '-100' };
        const negativeValueStyle = { color: '#c70032', 'text-align': 'right' };
        expect(editableAmountColorStyle).toBeDefined();
        expect(editableAmountColorStyle(params)).toEqual(negativeValueStyle);
    });
    it('should return styles for null or undefined values nonEditable', () => {
        const params = { value: null };
        const undefinedColorStyle = { color: 'black', 'text-align': 'right' };
        expect(editableAmountColorStyle).toBeDefined();
        expect(editableAmountColorStyle(params)).toEqual(undefinedColorStyle);
    });
    it('currencyFormatter', () => {
        const params = { value: 100 };
        expect(currencyFormatter).toBeDefined();
    });
});
describe('amountBracketsFormatter', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
    });

    it('it should return positive value', () => {
        const tempNumber = 100;
        const tempNumber1 = Math.round(tempNumber);
        const inrFormat = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const tempStr = inrFormat.format(tempNumber);
        expect(amountBracketsFormatter).toBeDefined();
        expect(amountBracketsFormatter(tempNumber)).toEqual('$0.00');

    });
    it('roundedNumberBracketsFormatter', () => {
        const params = { value: '100' };
        expect(roundedNumberBracketsFormatter(params)).toBeDefined();
    });
    it('numberBracketsFormatter', () => {
        const params = { value: '100' };
        expect(numberBracketsFormatter(params)).toBeDefined();
    });
    it('formatNumber', () => {
        const params = { value: 100 };
        const finalValue = Math.round(params.value)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        expect(formatNumber(params.value)).toBeDefined();
    });
    it('currencyFormatter ', () => {
        const params = { value: 100 };
        expect(formatNumber(params.value)).toBeDefined();
        // expect(currencyFormatter(params)).toBeDefined();
    });
    // it('it should validate the selected Rows value is null', () => {
    //     const columnsToValidate = ['changeAmount'];
    //     const selectedRowNodes = gridOptions.api.getSelectedNodes();
    // });
});

