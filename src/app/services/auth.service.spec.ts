import { TestBed } from '@angular/core/testing';

import { AppModule } from 'src/app/app.module';
import { AuthService } from './auth.service';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';

describe('AdminService', () => {
    let service: AuthService;
    let appEndPoints: ApiEndpointsConfig;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [],
        });
        service = TestBed.get(AuthService);
        appEndPoints = TestBed.get(ApiEndpointsConfig);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login', () => {
        const spy = spyOn(appEndPoints, 'getLoginUrl').and.returnValue('http://localhost:8822/cbas/api/auth/login');
        const credentials = { username: '', password: '' };
        service.jwt_login(credentials);
        expect(spy).toHaveBeenCalled();
    });

    it('should get the auth token', () => {
        const spy = spyOn(appEndPoints, 'getAuthTokenUrl').and.returnValue('http://localhost:8822/cbas/api/auth/token');
        service.jwt_authToken();
        expect(spy).toHaveBeenCalled();
    });

    it('should set access token in local storage', () => {
        const spy = spyOn(localStorage, 'setItem');
        const accesToken = `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcml0aS51cGFkaHlheWEiLCJzY29wZXMiOlsiTU9TLk9NLkNUUE
        NlbnRyYWwiXSwiZXhwV2FyblRpbWUiOiIyIiwiZnVsbG5hbWUiOiJwcml0aSB1cGFkaHlheWEiLCJlbWFpbEFkZHJlc3MiOiJhZG1pbk
        B0ZXN0LmNvbSIsImlzcyI6Imh0dHA6Ly90ZGxwcm8uY29tIiwiaWF0IjoxNjA1MDM5NzA0LCJleHAiOjE2MDUwNDY5MDR9.- AVGho
        EdgEljGZzi35X8v4xO6qsOqMdIyMxrm3mqAav0e9ehmlZxpJNHzWmCRSk3JmmZw2zAfqGiPkbZ95FDDQ`;
        service.jwt_setAccessToken(accesToken);
        expect(spy).toHaveBeenCalled();
    });

    it('should get access token in local storage', () => {
        const spy = spyOn(localStorage, 'getItem');
        service.jwt_getAccessToken();
        expect(spy).toHaveBeenCalled();
    });

    it('should get token validity', () => {
        const token = `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcml0aS51cGFkaHlheWEiLCJzY29wZXMiOlsiTU9TLk9NLkNUUENlbnRyYW
        wiXSwiZXhwV2FyblRpbWUiOiIyIiwiZnVsbG5hbWUiOiJwcml0aSB1cGFkaHlheWEiLCJlbWFpbEFkZHJlc3MiOiJhZG1pbkB0ZXN0LmNvb
        SIsImlzcyI6Imh0dHA6Ly90ZGxwcm8uY29tIiwiaWF0IjoxNjA1MDM5NzA0LCJleHAiOjE2MDUwNDY5MDR9.- AVGhoEdgEljGZzi35X8v4xO
        6qsOqMdIyMxrm3mqAav0e9ehmlZxpJNHzWmCRSk3JmmZw2zAfqGiPkbZ95FDDQ`;
        service.jwt_tokenValidity(token);
        expect(service.jwt_tokenValidity(token)).toBeTruthy();
    });

    it('should get refresh token', () => {
        const spy = spyOn(appEndPoints, 'getAuthTokenUrl').and.returnValue('http://localhost:8822/cbas/api/auth/login');
        service.refreshToken();
        expect(spy).toHaveBeenCalled();
    });

    it('should remove access token in local storage', () => {
        const spy = spyOn(localStorage, 'removeItem');
        service.jwt_removeAccessToken();
        expect(spy).toHaveBeenCalled();
    });

    it('should set refresh token in local storage', () => {
        const spy = spyOn(localStorage, 'setItem');
        const refreshToken = `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwcml0aS51cGFkaHlheWEiLCJzY29wZXMiOlsiTU9TLk9NL
        kNUUENlbnRyYWwiXSwiZXhwV2FyblRpbWUiOiIyIiwiZnVsbG5hbWUiOiJwcml0aSB1cGFkaHlheWEiLCJlbWFpbEFkZHJlc3MiOiJhZ
        G1pbkB0ZXN0LmNvbSIsImlzcyI6Imh0dHA6Ly90ZGxwcm8uY29tIiwiaWF0IjoxNjA1MDM5NzA0LCJleHAiOjE2MDUwNDY5MDR9.- AVGhoEd
        gEljGZzi35X8v4xO6qsOqMdIyMxrm3mqAav0e9ehmlZxpJNHzWmCRSk3JmmZw2zAfqGiPkbZ95FDDQ`;
        service.jwt_setRefreshToken(refreshToken);
        expect(spy).toHaveBeenCalled();
    });

    it('should get refresh token in local storage', () => {
        const spy = spyOn(localStorage, 'getItem');
        service.jwt_getRefreshToken();
        expect(spy).toHaveBeenCalled();
    });

    it('should has role', () => {
        const spy = spyOn(service, 'jwt_getScopes');
        service.jwt_hasRole('MOS_OCD');
        expect(service.jwt_hasRole('MOS_OCD')).toBeFalsy();
        expect(spy).toHaveBeenCalled();
    });

    xit('should has role and get scopes', () => {
        const spy = spyOn(localStorage, 'getItem');
        service.jwt_getScopes();
        expect(service.jwt_getScopes()).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('should remove refresh token in local storage', () => {
        const spy = spyOn(localStorage, 'removeItem');
        service.jwt_removeRefreshToken();
        expect(spy).toHaveBeenCalled();
    });

    it('should logout the user', () => {
        const spy = spyOn(service, 'clearStorage');
        service.jwt_logout();
        expect(spy).toHaveBeenCalled();
    });

    it('should clear the local storage', () => {
        const spy = spyOn(service, 'jwt_removeAccessToken');
        const spyRemoveRefresh = spyOn(service, 'jwt_removeRefreshToken');
        service.clearStorage();
        expect(spy).toHaveBeenCalled();
        expect(spyRemoveRefresh).toHaveBeenCalled();
    });

    it('should get role in local storage', () => {
        const spy = spyOn(localStorage, 'getItem');
        service.jwt_getRole();
        expect(spy).toHaveBeenCalled();
    });

    it('should get headeraccess in local storage', () => {
        const spy = spyOn(localStorage, 'getItem');
        service.jwt_headerAccess();
        expect(spy).toHaveBeenCalled();
    });

    it('should set role in local storage', () => {
        const spy = spyOn(localStorage, 'setItem');
        const role = 'MOS_OCD';
        service.jwt_setRole(role);
        expect(spy).toHaveBeenCalled();
    });

});
