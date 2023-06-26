import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';

describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterComponent],
            imports: [HttpClientTestingModule, RouterModule.forRoot([])],
            providers: [AuthService, ApiEndpointsConfig]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        authService = TestBed.get(AuthService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onClickLogout function', () => {
        it('onClickLogout should be defined', () => {
            const spy = spyOn(authService, 'jwt_logout').and.callThrough();
            component.onClickLogout();
            expect(authService.jwt_logout).toHaveBeenCalled();
        });
    });
});
