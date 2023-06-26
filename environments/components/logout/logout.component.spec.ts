import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogoutComponent } from './logout.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserLoggedInService } from 'src/app/shared/services/user-logged-in.service';
import {  Router, ActivatedRoute, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';

declare var $: any;

describe('LoginComponent', () => {
    let component: LogoutComponent;
    let fixture: ComponentFixture<LogoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LogoutComponent],
            imports: [NgBusyModule,
                FormsModule, ReactiveFormsModule, HttpClientTestingModule,
                RouterModule.forRoot([]),
             NgSelectModule ],
            providers: [AuthService, ApiEndpointsConfig,
                { provide: APP_BASE_HREF, useValue: '/' },
                AdminService, UserLoggedInService,
                ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LogoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });


    it('should create Logout Component', () => {
        expect(component).toBeTruthy();
    });

    describe('Initialize the Component', () => {
        it('Initialize ngonit method', () => {
            component.ngOnInit();
            fixture.whenStable().then(() => {
                expect(component.ngOnInit).toHaveBeenCalled();
            });

        });
    });

});


