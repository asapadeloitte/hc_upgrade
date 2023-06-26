import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, throwError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { JwtInterceptor } from '../jwt.interceptor';

describe('jwt-interceptor', () => {
    const validJWTValue = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjZXJlbWEuZnIiLCJpYXQiOjE1MzIzNTA4MDAsImV4cCI6MjUzMjM1MDgwMCwic3ViIjoiQWxhaW4gQ0hBUkxFUyIsImFkbWluIjp0cnVlfQ.Rgkgb4KvxY2wp2niXIyLJNJeapFp9z3tCF-zK6Omc8c';
    const authHeader = 'Bearer ' + validJWTValue;
    let jwtInterceptor;
    let authService: AuthService;

    let http: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        jwtInterceptor = new JwtInterceptor(authService);
    });


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, RouterTestingModule],
            providers: [
            ],
        });
    });

    beforeEach(async(
        inject([HttpClient, HttpTestingController], (_httpClient, _httpMock) => {
            http = _httpClient;
            httpMock = _httpMock;
        }),
    ));

    describe('jwtInterceptor =>', () => {

        it('should create the jwt interceptor', () => {
            expect(JwtInterceptor).toBeTruthy();
        });

    });



    // it ('Url not filtered, isAuthenticatedOrRefresh called, authenticated, token added', () => {
    //   const spy = spyOn(authService, 'isAuthenticatedOrRefresh')
    //     .and.
    //     returnValue(observableOf(true));
    //   spyOn(authService, 'getToken')
    //     .and
    //     .returnValue(observableOf(validJWTToken));
    //   http.get('/notfiltered/url/').subscribe(res => {
    //     expect(spy).toHaveBeenCalled();
    //   });
    //   httpMock.expectOne(
    //     req => req.url === '/notfiltered/url/'
    //       && req.headers.get('Authorization') === authHeader,
    //   ).flush({});
    // });

    // it ('Url not filtered, isAuthenticatedOrRefresh called, not authenticated, token not added', () => {
    //   const spy = spyOn(authService, 'isAuthenticatedOrRefresh')
    //     .and.
    //     returnValue(observableOf(false));
    //   spyOn(authService, 'getToken')
    //     .and
    //     .returnValue(observableOf(expiredJWTToken));
    //   http.get('/notfiltered/url/').subscribe(res => {
    //     expect(spy).toHaveBeenCalled();
    //   });
    //   httpMock.expectOne(
    //     req => req.url === '/notfiltered/url/'
    //       && ! req.headers.get('Authorization'),
    //   ).flush({});
    // });

},
);
