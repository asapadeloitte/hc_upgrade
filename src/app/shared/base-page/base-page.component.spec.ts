import { Component, OnDestroy, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { GridApi, GridOptions, ColumnApi } from 'ag-grid-community';

import { ToasterService, ToasterModule } from 'angular2-toaster';
import * as _ from 'lodash';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Subscription, Observable, of } from 'rxjs';
import { FilterDailogComponent } from 'src/app/shared/components/filter-dailog/filter-dailog.component';
import { GridFilterModel } from 'src/app/shared/models/acquisition.model';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { ExportModalComponent } from '../components/export-modal/export-modal.component';
import { gridExport } from '../grid-utilities';
import { AuthService } from '../services/auth.service';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { BasePageComponent } from './base-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { NgBusyModule } from 'ng-busy';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SmartListConversionService } from '../services/smartListConversion.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
    imports: [CommonModule, BrowserModule, FormsModule ],
    declarations: [ErrorDialogComponent, FilterDailogComponent, ExportModalComponent],
    entryComponents: [
        ErrorDialogComponent, FilterDailogComponent, ExportModalComponent,
    ]
})
export class TestModule {
    public userId: string;
}
describe('BasePage: Default', () => {
    let component: BasePageComponent;
    let fixture: ComponentFixture<BasePageComponent>;
    let mockModalRef: ExportModalComponent;
    const formBuilder: FormBuilder = new FormBuilder();
    const form = new FormGroup({
        filter: new FormControl(),
        last: new FormControl()
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BasePageComponent],
            imports: [TestModule, CommonModule , FormsModule, RouterTestingModule,
                AgGridModule.withComponents([]),
                ReactiveFormsModule, NgBusyModule, HttpClientTestingModule,
                RouterModule.forRoot([]), ToasterModule.forRoot(),
                ModalModule.forRoot(), NgSelectModule],
            providers: [AuthService, ApiEndpointsConfig,
                HumanCapitalService, BsModalRef,
                BsModalService,
                { provide: FormBuilder, useValue: formBuilder },
            ],
        })
            .compileComponents();
    }));


    beforeEach(() => {

        fixture = TestBed.createComponent(BasePageComponent);
        component = fixture.componentInstance;
        // component = new BasePageComponent(authService,
        //     toaster, humanCapitalService, modalService);
        mockModalRef = new ExportModalComponent(component.bsModalRef);
        component.customFilterNames = [{
            filterCategory: null,
            filterName: 'spc view',
            screenName: 'Submit SPC View',
            userFilterId: 205,
            userId: 102
        }];
        fixture.detectChanges();

    }

    );
    describe('Call Grid Ready', () => {
        it('should create', () => {
            const service = TestBed.get(AuthService) as AuthService;
            spyOn(service, 'jwt_getRole').and.returnValue('Admin');
            // component.ngOnInit();
            expect(component).toBeTruthy();
        });
        it('should unsubscribe on destroy', () => {
            component['busyTableSave'] = of(true).subscribe();
            component.ngOnDestroy();
            expect(component['busyTableSave'].closed).toBeTruthy();
        });
    });

    describe('on Grid Ready', () => {
        xit('onGridReady called', () => {
            const params = {
                api: component.gridOptions.api,
                columnApi: component.gridOptions.columnApi
            };
            fixture.detectChanges();
            expect(component.onGridReady).toBeTruthy();
            component.onGridReady(params);
        });

    });

    describe('is useradmin method', () => {
        it('it should be true if role list is admin', () => {
            const userAdmin = component.isUserAdmin();

            expect(userAdmin).toBeDefined();
        });
        it('it should be true if user is admin', () => {
            const userAdmin = 'admin';
            expect(userAdmin).toBeTruthy();
        });
        it('it should be return  false if user is  not admin', () => {
            const userAdmin = component.isUserAdmin();
            expect(userAdmin).toBeFalsy();
        });
    });

    describe('bringFocusBack', () => {
        xit('it should be get tab focus', () => {
            component.bringFocusBack();
            expect(component.bringFocusBack()).toBeDefined();
        });
    });


    describe('openFilterDialogView', () => {
        it('openFilterDialogView', () => {
            component.openFilterDialogView(form, 'test');
            expect(component.openFilterDialogView).toBeDefined();
        });
    });
    describe('getuser Id', () => {
        it('get the user Id', () => {
            const userId = component.getUserId();
            // tslint:disable-next-line: no-unused-expression
            expect(userId).toContain;
        });
    });

    describe('Export Grid data', () => {
        it('Export Modal', () => {
            component.ExportGridData();
            expect(component.ExportGridData).toBeDefined();

        });
    });
    describe('onRowselected', () => {
        it('row selected', () => {
            component.onRowSelected(true);
            expect(component.onRowSelected).toBeDefined();
        });
    });

    describe('', () => {
        xit('rowsSelectionChanged', () => {
            const params = {
                api: component.gridApi,
                ColumnApi: component.gridColumnApi
            };
            component.selectedRows = this.gridApi.getSelectedRows();
            component.rowsSelectionChanged(params);
            expect(component.rowsSelectionChanged).toBeDefined();
        });
    });

    describe('getCustomFilterNames', () => {
        it('get Filter Names', () => {
            const screenObject = {screenName: 'test'};
            const args = [
                {
                  filterCategory: null,
                  filterJson: '',
                  filterName: 'Custom Viewupdated',
                  screenName: 'test',
                  userFilterId: 813,
                  userId: 303
                }
              ];
            const service = TestBed.get(HumanCapitalService) as HumanCapitalService;
            spyOn(service, 'getAcquisitionGridFilter').and.returnValue(of(args));
            component.getCustomFilterNames(screenObject);
            expect(component.getCustomFilterNames).toBeDefined();
        });
    });

    describe('GridSearch ', () => {
        xit('Grid Search', () => {
            component.gridOptions =  {} as GridOptions;
            const columnDefs = [];
            const rowData = [];

            component.gridOptions.columnDefs = columnDefs;
            component.gridOptions.rowData = rowData;
            component.gridApi.setFilterModel([]);
            // all the gridOptions has right now is columnDefs and rowData attributes

            // component.gridOptions.api.sizeColumnsToFit();
            fixture.detectChanges();
            component.onGridSearch('Test');
            expect(component.onGridSearch).toBeDefined();

        });
        xit('it should return value', () => {
            const filterstring = 'test';
            expect(component.gridApi.setQuickFilter('test')).toContain(filterstring);
        });
    });
    describe('deleteFilterView', () => {
        it('remove filterview', () => {
            component.deleteFilterView();
            expect(component.deleteFilterView).toBeDefined();
        });
        it('it should remove the filter view', () => {
            const args = {
                code: 'DELETED',
                value: 'Deleted Filter Successfully!'
            };
            const model = new GridFilterModel();
            model.userId = 123;
            model.userFilterId = 345;
            const service = TestBed.get(HumanCapitalService) as HumanCapitalService;
            spyOn(service, 'deleteViews').and.returnValue(of(args));
            // tslint:disable-next-line: no-shadowed-variable
            service.deleteViews(model).subscribe((args) => {
                expect(component.deleteFilterView).toBeDefined();
            });
        });
    });

    describe('updateFilterView', () => {
        xit('update filterview', () => {
            component.updateFilterView('test', Object);
            expect(component.updateFilterView).toBeDefined();
        });
        xit('it should update the filter view', () => {
            const args = { code: 'UPDATED', Value: 'Updated Filter Successfully' };
            const model = new GridFilterModel();
            model.userId = 123;
            model.userFilterId = 33;
            model.screenName = 'test';
            model.filterName = 'filtername';
            const service = TestBed.get(HumanCapitalService) as HumanCapitalService;
            spyOn(service, 'updateAcquisitionGridFilter').and.returnValue(of());
            component.updateFilterView('test', Object);
        });
    });
    describe('resetFilterViewData', () => {
        xit('resetFilterViewData', () => {
            fixture.detectChanges();
            component.resetFilterViewData(form);
            expect(component.resetFilterViewData).toBeTruthy();
        });
    });

});
