import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewHeaderComponent } from './new-header.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';

describe('NewHeaderComponent', () => {
    let component: NewHeaderComponent;
    let fixture: ComponentFixture<NewHeaderComponent>;
    let authService: AuthService;

    class MockAuthService extends AuthService {

        /**
         * This method is implemented in the AuthService
         * we extend, but we overload it to make sure we
         * return a value we wish to test against
         */
        jwt_getRole() {
            return 'AAT';
        }

        jwt_headerAccess() {
            return 'Submit SPC';
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewHeaderComponent],
            imports: [HttpClientTestingModule, RouterModule.forRoot([])],
            providers: [{ provide: AuthService, useClass: MockAuthService }, ApiEndpointsConfig]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewHeaderComponent);
        authService = TestBed.get(AuthService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('new header oninit', () => {
        const service = fixture.debugElement.injector.get(AuthService);
        spyOn(service, 'jwt_getRole').and.returnValue('MOS_OCD');
        spyOn(service, 'jwt_headerAccess').and.returnValue('Submit SPC');
        component.ngOnInit();
    });

    it('new header oninit with header as Approve', () => {
        const service = fixture.debugElement.injector.get(AuthService);
        spyOn(service, 'jwt_getRole').and.returnValue('DFMBEL');
        spyOn(service, 'jwt_headerAccess').and.returnValue('Approve SPC');
        component.ngOnInit();
    });

    describe('onClickLogout function', () => {
        it('onClickLogout should be defined', () => {
            const spy = spyOn(authService, 'jwt_logout').and.callThrough();
            component.onClickLogout();
            expect(authService.jwt_logout).toHaveBeenCalled();
        });
    });
});
