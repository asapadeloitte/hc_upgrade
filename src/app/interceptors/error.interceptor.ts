import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const errorMessage = err.error.message || err.statusText;
            if (err.status === 0) {
                // A client-side or network error occurred. Handle it accordingly.
                console.error('A client-side error occurred:', err.error);
            } else if (err.status === 401) {
                console.error(`Authentication/Authorization Error. Backend returned code ${err.status}, ` +
                    `message was: ${errorMessage}.` + ` Body was: ${err.error}`);
                // auto logout if 401 response returned from api
                this.auth.jwt_logout();
            } else if (err.status === 500) {
                console.error(`Internal Server Error. Backend returned code ${err.status}, ` +
                    `message was: ${errorMessage}.` + ` Body was: ${err.error}`);
                // Redirect to global error page, if required
                // this.redirectToGlobalErrorPage();
            } else if (err.status === 400) {
                console.error(`Bad Request. Returned code ${err.status}, ` +
                    `message was: ${errorMessage}.` + ` Body was: ${err.error}`);
            } else {
                console.error(`Generic Error. Returned code ${err.status}, ` + ` body was: ${err.error}`);
                // window.alert('Unable to complete the action. Please try again.');
            }
            return throwError(err);
        }));
    }
}
