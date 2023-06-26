import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SplashDialogComponent } from './splash-dialogue.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserLoggedInService } from 'src/app/shared/services/user-logged-in.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';

declare var $: any;

describe('SplashDialogComponent', () => {


    let splashComponent: SplashDialogComponent;
    let splashfixture: ComponentFixture<SplashDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SplashDialogComponent],
            imports: [NgBusyModule,
                FormsModule, ReactiveFormsModule, HttpClientTestingModule,
                RouterModule.forRoot([]),
                NgSelectModule],
            providers: [AuthService, ApiEndpointsConfig,
                { provide: APP_BASE_HREF, useValue: '/' },
                AdminService, UserLoggedInService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {

        splashfixture = TestBed.createComponent(SplashDialogComponent);
        splashComponent = splashfixture.componentInstance;
        splashfixture.detectChanges();

    });



    it('should create Login Component', () => {
        expect(splashComponent).toBeTruthy();
    });


    describe(' Spash Dialogue Component Cancel & Confirm Calls', () => {
        it('Cancel', () => {
            splashComponent.cancel();
            expect(splashComponent.cancel).toBeDefined();
        });

        it('Click on Confirm', () => {
            splashComponent.confirm();
            expect(splashComponent.confirm).toBeDefined();
        });

    });

});


