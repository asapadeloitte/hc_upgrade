import { TestBed, async } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { of } from 'rxjs';
import { AdminService } from './admin.service';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';


describe('AdminService', () => {
    let service: AdminService;
    let appEndPoints: ApiEndpointsConfig;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [],
        });
        service = TestBed.get(AdminService);
        appEndPoints = TestBed.get(ApiEndpointsConfig);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Cell Get User by Email method', () => {
        const spy = spyOn(appEndPoints, 'getUserByEmailUrl').and.returnValue('http://localhost:8822/cbas/api/useradmin');
        service.getUserByEmail('anusha.sapa@test.com');
        expect(service.getUserByEmail).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('Cell create User by Id method', () => {
        const spy = spyOn(appEndPoints, 'getUserByEmailUrl').and.returnValue('http://localhost:8822/cbas/api/useradmin');
        const user = {
            userId: 101,
            email: 'test@fda.hhs.gov',
            password: 'password',
            firstName: 'firstname',
            lastName: 'lastname',
            nativeUser: ['MOS_OCD'],
            emailAddress: 'test@fda.hhs.gov',
            lastLoginDt: '12/12/2020',
            endDt: '12/13/2020',
            enabled: 'Y'
        };
        service.createUser(user);
        expect(service.createUser).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('Cell Get User by Id method', () => {
        const spy = spyOn(appEndPoints, 'getUserByEmailUrl').and.returnValue('http://localhost:8822/cbas/api/useradmin');
        service.getUser('101');
        expect(service.getUser).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('Cell update User by Id method', () => {
        const user = {
            userId: 101,
            email: 'test@fda.hhs.gov',
            password: 'password',
            firstName: 'firstname',
            lastName: 'lastname',
            nativeUser: ['MOS_OCD'],
            emailAddress: 'test@fda.hhs.gov',
            lastLoginDt: '12/12/2020',
            endDt: '12/13/2020',
            enabled: 'Y'
        };
        const spy = spyOn(appEndPoints, 'getUserByEmailUrl').and.returnValue('http://localhost:8822/cbas/api/useradmin');
        service.updateUser(user);
        expect(service.updateUser).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('Cell Get Users by Id method', () => {
        const spy = spyOn(appEndPoints, 'getUserByEmailUrl').and.returnValue('http://localhost:8822/cbas/api/useradmin');
        expect(service.getUsers()).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('Cell Get User groups', () => {
        const spy = spyOn(appEndPoints, 'getUserByEmailUrl').and.returnValue('http://localhost:8822/cbas/api/useradmin');
        expect(service.getUserGroups()).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('should delete User', () => {
        const user = {
            userId: 101,
            email: 'test@fda.hhs.gov',
            password: 'password',
            firstName: 'firstname',
            lastName: 'lastname',
            nativeUser: ['MOS_OCD'],
            emailAddress: 'test@fda.hhs.gov',
            lastLoginDt: '12/12/2020',
            endDt: '12/13/2020',
            enabled: 'Y'
        };
        const spy = spyOn(appEndPoints, 'getUserByEmailUrl').and.returnValue('http://localhost:8822/cbas/api/useradmin');
        service.deleteUser(user, '426');
        expect(spy).toHaveBeenCalled();
    });

});
