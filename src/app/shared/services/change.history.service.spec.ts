import { HumanCapitalService } from './humanCapital.service';
import { TestBed, async } from '@angular/core/testing';
import { ChangeHistoryService } from './change.history.service';
import { AppModule } from 'src/app/app.module';
import { of } from 'rxjs';


describe('ChangeHistoryService', () => {
    let service: ChangeHistoryService;
    let aqservice: HumanCapitalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [HumanCapitalService],
        });
        service = TestBed.get(ChangeHistoryService);
        aqservice = TestBed.get(HumanCapitalService) as HumanCapitalService;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Cell History method', () => {
        const event = {
            column: { userProvidedColDef: { field: 'changeAmount', headerName: 'Change Amount' } },
            node: {
                data: { ctpLineItem: 'CTP-20-C-001' }
            }
        };
        const args = [{
            auditDt: '2020-10-28T16:02:53.600+0000',
            auditDtDisplay: '10/28/20 16:02',
            auditId: 4694,
            auditUserId: 'Vani.Pentyala',
            auditedValue: null,
            ctpLineItem: 'CTP-21-C-0065',
            memberGridPosition: '11',
            newValue: '-222',
            office: 'OM',
            spAuditKey: 'ADMIN_PY_LT1M_Y_OM_'
        }];
        // spyOn(aqservice, 'changeHistorySPC').and.returnValue(of(args));
        service.getCellHistory(event, 'OCD', 'FY20', 'LT1M', 'N', 'DOLLARCHANGE');
        expect(service.getCellHistory).toBeDefined();

    });

});
