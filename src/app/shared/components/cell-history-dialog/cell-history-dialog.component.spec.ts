import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { CellHistoryDialogComponent } from './cell-history-dialog.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HumanCapitalService } from '../../services/humanCapital.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { SmartListConversionService } from '../../services/smartListConversion.service';

describe('CellHistoryDialogComponent', () => {
  let component: CellHistoryDialogComponent;
  let fixture: ComponentFixture<CellHistoryDialogComponent>;

  class MockSmartListService extends SmartListConversionService {

    /**
     * This method is implemented in the AuthService
     * we extend, but we overload it to make sure we
     * return a value we wish to test against
     */
    public ddvals =  {
          colorCode:
          {
            type: 'colorCode',
            data: [
              { smartListValue: 'Blue', name: 'Color Code', id: '1.0' },
              { smartListValue: 'Yellow', name: 'Color Code', id: '2.0' },
              { smartListValue: 'Red', name: 'Color Code', id: '5.0' },
              { smartListValue: 'Green', name: 'Color Code', id: '6.0' }
            ]
          }
        };
}


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CellHistoryDialogComponent],
      imports: [AgGridModule, HttpClientTestingModule],
      providers: [BsModalRef, HumanCapitalService, ApiEndpointsConfig,
        { provide: SmartListConversionService, useClass: MockSmartListService }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellHistoryDialogComponent);
    component = fixture.componentInstance;
    const service = fixture.debugElement.injector.get(SmartListConversionService);
    component.smartListValues = service.ddvals;
    component.fieldTitle = 'colorCode';
    component.list = [
      {
        auditId: 6755,
        ctpLineItem: 'CTP-21-G-1000',
        office: 'OCD',
        memberGridPosition: 'projectTitle',
        auditedValue: 'Dropdown clear cache 2222',
        newValue: 'Dropdown clear cache 2222',
        auditUserId: 'Prasanna.Balasundaram',
        auditDt: '2020-07-24T13:13:00.000+0000',
        auditDtDisplay: '07/24/20 13:13'
      },
      {
        auditId: 6482,
        ctpLineItem: 'CTP-21-G-1000',
        office: 'OCD',
        memberGridPosition: 'projectTitle',
        auditedValue: 'Dropdown clear cache 22',
        newValue: 'Dropdown clear cache 2222',
        auditUserId: 'Prasanna.Balasundaram',
        auditDt: '2020-07-24T10:10:00.000+0000',
        auditDtDisplay: '07/24/20 10:10'
      },
      {
        auditId: 6478,
        ctpLineItem: 'CTP-21-G-1000',
        office: 'OCD',
        memberGridPosition: 'projectTitle',
        auditedValue: 'Prassy2222_0626',
        newValue: 'Dropdown clear cache 22',
        auditUserId: 'Prasanna.Balasundaram',
        auditDt: '2020-07-24T10:09:00.000+0000',
        auditDtDisplay: '07/24/20 10:09'
      },
      {
        auditId: 6474,
        ctpLineItem: 'CTP-21-G-1000',
        office: 'OCD',
        memberGridPosition: 'projectTitle',
        auditedValue: 'Prasanna Test',
        newValue: 'Prassy2222_0626',
        auditUserId: 'Prasanna.Balasundaram',
        auditDt: '2020-07-24T10:08:00.000+0000',
        auditDtDisplay: '07/24/20 10:08'
      }];
    fixture.detectChanges();
  });

  it('should create', () => {
    component.list = [];
    expect(component).toBeTruthy();
  });

  it('should ngoninit', () => {
    const service = fixture.debugElement.injector.get(SmartListConversionService);
    component.smartListValues = service.ddvals;
    spyOn(component, 'getSmartListValues');
    component.ngOnInit();
    expect(component.getSmartListValues).toHaveBeenCalled();
  });

  describe('close function', () => {
    it('close should be defined', () => {
      component.close();
    });
  });

  describe('getSmartListValues function', () => {
    it('getSmartListValues should be defined', () => {
      const historyData = { oldValue: '100', newValue: '200', auditedValue: '201' };
      component.getSmartListValues(historyData);
      expect(historyData.newValue).toBe(historyData.newValue);
      expect(historyData.auditedValue).toBe(historyData.auditedValue);
    });

    it('getSmartListValues should be defined with a smartlist', () => {
      const historyData = { oldValue: '100', newValue: '1.0', auditedValue: '2.0' };
      const tempVal = 'Blue';
      const tempAuditedVal = 'Yellow';
      component.getSmartListValues(historyData);
      expect(historyData.newValue).toBe(tempVal);
      expect(historyData.auditedValue).toBe(tempAuditedVal);
    });
  });
});
