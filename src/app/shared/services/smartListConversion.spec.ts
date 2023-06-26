import { TestBed } from '@angular/core/testing';

import { SmartListConversionService } from './smartListConversion.service';
import { CellHistoryDialogComponent } from '../components/cell-history-dialog/cell-history-dialog.component';
import { AppModule } from 'src/app/app.module';

describe('SmartListConversionService', () => {
    let service: SmartListConversionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
        service = TestBed.get(SmartListConversionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('setDDVals function', () => {
        const e = {value: 0};
        it('setDDVals should be defined', () => {
          service.setDDVals(e);
        });
    });

    describe('getDDVals function', () => {
        it('getDDVals should be defined', () => {
          service.getDDVals();
        });
    });
});
