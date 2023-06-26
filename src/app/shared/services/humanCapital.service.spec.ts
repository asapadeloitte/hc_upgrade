import { TestBed } from '@angular/core/testing';

import { HumanCapitalService } from './humanCapital.service';
import { AppModule } from 'src/app/app.module';

describe('HumanCapitalService', () => {
    let service: HumanCapitalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
        });
        service = TestBed.get(HumanCapitalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAcquisitionGridFilter function', () => {
        it('getAcquisitionGridFilter should be defined', () => {
            service.getAcquisitionGridFilter('ADMIN');
        });
    });

    describe('postAcquisitionGridFilter function', () => {
        it('postAcquisitionGridFilter should be defined', () => {
            service.postAcquisitionGridFilter('ADMIN');
        });
    });

    describe('updateAcquisitionGridFilter function', () => {
        it('updateAcquisitionGridFilter should be defined', () => {
            service.updateAcquisitionGridFilter('ADMIN');
        });
    });

    describe('deleteViews function', () => {
        it('deleteViews should be defined', () => {
            service.deleteViews('ADMIN');
        });
    });

    describe('getUploadedFileList function', () => {
        it('getUploadedFileList should be defined', () => {
            service.getUploadedFileList('admin', 'CTP-21-C-0009', 'Submit');
        });
    });

    describe('deleteFileupload function', () => {
        it('deleteFileupload should be defined', () => {
            service.deleteFileupload('121', '501', 'admin', 'SPC View');
        });
    });

    describe('getSearchableDropdownData function', () => {
        it('getSearchableDropdownData should be defined', () => {
            service.getSmartList();
        });
    });


});
