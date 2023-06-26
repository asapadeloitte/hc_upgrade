import { ErrorInterceptor } from '../error.interceptor';

import { throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

describe('ErrorInterceptor', () => {
    let errorInterceptor;
    // tslint:disable-next-line: prefer-const
    let authService: AuthService;

    beforeEach(() => {
        errorInterceptor = new ErrorInterceptor(authService);
    });

    describe('Interceptor =>', () => {
        it('should create the http interceptor', () => {
            expect(errorInterceptor).toBeTruthy();
        });
    });

    describe('Actions =>', () => {
        let httpRequestSpy;
        let httpHandlerSpy;

        xit('should return a server side error with status code 401', () => {
            const error = { status: 401, message: 'test-error' };

            httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
            httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
            httpHandlerSpy.handle.and.returnValue(throwError(error));

            errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
                result => console.log('good', result),
                err => {
                    expect(authService.jwt_logout()).toHaveBeenCalled();
                });
        });

        it('should return a server side error with status code 400', () => {
            const error = { status: 400, path: '/cbas/api/v1/acquisition/essacquisition/updatecontract/', message: 'test-error' };
            spyOn(window, 'alert');
            httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
            httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
            httpHandlerSpy.handle.and.returnValue(throwError(error));

            errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
                result => console.log('good', result),
                err => {
                    expect(window.alert).toHaveBeenCalledWith('Unable to complete the action. Please try again.');
                });
        });

        it('should return a server side error with status code 500', () => {
            const error = { status: 500, path: '/cbas/api/v1/acquisition/essacquisition/updatecontract/', message: 'test-error' };
            spyOn(window, 'alert');
            httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
            httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
            httpHandlerSpy.handle.and.returnValue(throwError(error));

            errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
                result => console.log('good', result),
                err => {
                    expect(window.alert).toHaveBeenCalledWith('Please verify the updated data and try again.');
                });
        });

        it('should return a server side error with status code 500 with update grant path', () => {
            const error = { status: 500, path: '/cbas/api/v1/acquisition/essacquisition/updategrant/', message: 'test-error' };
            spyOn(window, 'alert');
            httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
            httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
            httpHandlerSpy.handle.and.returnValue(throwError(error));

            errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
                result => console.log('good', result),
                err => {
                    expect(window.alert).toHaveBeenCalledWith('Please verify the updated data and try again.');
                });
        });

        it('should return a server side error with status code 500 with update iaa path', () => {
            const error = { status: 500, path: '/cbas/api/v1/acquisition/essacquisition/updateiaa/', message: 'test-error' };
            spyOn(window, 'alert');
            httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
            httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
            httpHandlerSpy.handle.and.returnValue(throwError(error));

            errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
                result => console.log('good', result),
                err => {
                    expect(window.alert).toHaveBeenCalledWith('Please verify the updated data and try again.');
                });
        });
    });
});
