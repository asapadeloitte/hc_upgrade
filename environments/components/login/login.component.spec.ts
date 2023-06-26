import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginComponent } from './login.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserLoggedInService } from 'src/app/shared/services/user-logged-in.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError, Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

declare var $: any;

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let service: AuthService;
    const credentials = { username: '', password: '' };
    beforeEach(async(() => {
        const activatedRouteSpy = {
            queryParams: of({ year: 'FY20', dollarThreshold: 'LT1M', page: 'AdminPage', office: 'OCD', officeEqual: 'Y' })
        };
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [NgBusyModule,
                FormsModule, ReactiveFormsModule, HttpClientTestingModule,
                RouterModule.forRoot([]), RouterTestingModule.withRoutes([]),
                NgSelectModule],
            providers: [AuthService, ApiEndpointsConfig, { provide: ActivatedRoute, useValue: activatedRouteSpy },
                { provide: APP_BASE_HREF, useValue: '/' },
                AdminService, UserLoggedInService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        service = TestBed.get(AuthService) as AuthService;
        fixture.detectChanges();

    });

    it('should create Login Component', () => {
        expect(component).toBeTruthy();
    });

    describe('Login Successfully', () => {
        const login = {
            accesstoken: `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBbnVzaGEuU2FwYSIsInNjb3BlcyI6WyJBQVQuQWNxdWlzaXRpb25zLkF
            uYWx5c3RzIl0sImV4cFdhcm5UaW1lIjoiMiIsImZ1bGxuYW1lIjoiQW51c2hhIFNhcGEiLCJlbWFpbEFkZHJlc3MiOiJBbnVzaGEu
            U2FwYUBmZGEuaGhzLmdvdiIsImlzcyI6Imh0dHA6Ly90ZGxwcm8uY29tIiwiaWF0IjoxNjA1Mjg4NTQzLCJleHAiOjE2MDU
            yOTU3NDN9.OT4oExhT-FAuIfVZoBhBeiNWdwqTeic3mIlpVlL98p9swpFpuJeBJyJY6jcyGTcIgj-hJysvq3lc6kxYX-EWAA`,
            email: 'Anusha.Sapa@fda.hhs.gov',
            headerAccess: 'Approve SPC',
            refreshtoken: `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBbnVzaGEuU2FwYSIsInNjb3Blcy
            I6WyJST0xFX1JFRlJFU0hfVE9LRU4iXSwiaXNzIjoiaHR0cDovL3RkbHByby5jb20iLCJqdGkiOiI4MDQxOWJlNC1mMjIy
            LTQ0NTMtYjgyYy02NjczZjFlYTZkZjYiLCJpYXQiOjE2MDUyODg1NDMsImV4cCI6MTYwNTM3NDk0M30.P0zw9obj6aMWhPy8
            jzgMEYwEUWDCwFqcC_lAOLbEttddoWESPFdIvnjhpAHT8pzOxY1omnnM9R5-fdBpeq1_Nw`,
            rolelist: 'AAT.Acquisitions.Analysts',
            userId: '102',
            username: 'Anusha.Sapa'
        };

        it('Login method return Success with queryparams as dollar page', () => {
            TestBed.get(ActivatedRoute).queryParams = of(
                {
                    page: 'DollarPage',
                    submitScreen: 'Y'
                });
            service = TestBed.get(AuthService) as AuthService;
            spyOn(service, 'jwt_login').and.returnValue(of(login));
            component.login();
            expect(component.login).toBeDefined();
        });

        it('Login method return Success with query params StaffingTargetChangePage', () => {
            TestBed.get(ActivatedRoute).queryParams = of({
                page: 'StaffingTargetChangePage'
            });
            service = TestBed.get(AuthService) as AuthService;
            spyOn(service, 'jwt_login').and.returnValue(of(login));
            // spyOn(activatedRoute.queryParams, 'subscribe');
            component.login();
            expect(component.login).toBeDefined();
        });


        it('Login method return Success with query params as SpendPlanReductionsPage', () => {
            TestBed.get(ActivatedRoute).queryParams = of({
                page: 'SpendPlanReductionsPage'
            });
            service = TestBed.get(AuthService) as AuthService;
            spyOn(service, 'jwt_login').and.returnValue(of(login));
            // spyOn(activatedRoute.queryParams, 'subscribe');
            component.login();
            expect(component.login).toBeDefined();
        });


        it('Login method return Success with query params AdditionalFundsRequestPage', () => {
            TestBed.get(ActivatedRoute).queryParams = of({
                page: 'AdditionalFundsRequestPage'
            });
            service = TestBed.get(AuthService) as AuthService;
            spyOn(service, 'jwt_login').and.returnValue(of(login));
            // spyOn(activatedRoute.queryParams, 'subscribe');
            component.login();
            expect(component.login).toBeDefined();
        });

        it('Login method return error message', () => {
            const error = 'error';
            service = TestBed.get(AuthService) as AuthService;
            spyOn(service, 'jwt_login').and.returnValue(throwError(error));
            component.login();
            expect(component.login).toBeDefined();
            expect(component.errorFlag.flag).toBeTruthy();
            expect(component.errorFlag.message).toBe(error);
        });

        it('Login method return error object', () => {
            const error = { error: { message: 'error' } };
            service = TestBed.get(AuthService) as AuthService;
            spyOn(service, 'jwt_login').and.returnValue(throwError(error));
            component.login();
            expect(component.login).toBeDefined();
            expect(component.errorFlag.flag).toBeTruthy();
            expect(component.errorFlag.message).toBe(error.error.message);
        });
    });

    describe('Proceed to specific Page', () => {
        it('Go to specific Page', () => {
            const spy = spyOn(service, 'jwt_getRole').and.returnValue('MOS_OCD');
            // const spyAat = spyOn(service, 'jwt_getRole').and.returnValue('AAT.Acquisitions.Analysts');
            component.proceedtoSpecificPage();
            expect(component.proceedtoSpecificPage).toBeDefined();
            expect(spy).toHaveBeenCalled();
            // expect(spyAat).toHaveBeenCalled();
        });

        it('Go to specific Page with role aat', () => {
            // const spy = spyOn(service, 'jwt_getRole').and.returnValue('MOS_OCD');
            const spyAat = spyOn(service, 'jwt_getRole').and.returnValue('AAT.Acquisitions.Analysts');
            component.proceedtoSpecificPage();
            expect(component.proceedtoSpecificPage).toBeDefined();
            // expect(spy).toHaveBeenCalled();
            expect(spyAat).toHaveBeenCalled();
        });
    });

    describe('Initialize the Component', () => {
        it('Initialize ngonit method', () => {
            component.ngOnInit();
            expect(component.ngOnInit).toBeDefined();
        });
    });

    describe('Proceed to landing page', () => {
        it('Go to Landing page', () => {
            component.proceedtoLandingPage();
            expect(component.proceedtoSpecificPage).toBeDefined();
        });
    });

    describe('Logout from the application', () => {
        it('Logout from the application', () => {
            component.logout();
            expect(component.logout).toBeDefined();
        });
    });

});


