/*tslint:disable:indent*/

import { isNil } from 'ramda';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	sessionToken: string;
	constructor(public auth: AuthService) { }
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		if (request.url.includes('api/auth/token')) {
			this.sessionToken = this.auth.jwt_getRefreshToken();
		} else {
			this.sessionToken = this.auth.jwt_getAccessToken();
		}
		let headers = request.headers
			.set('Cache-control', 'no-cache')
			.set('Cache-control', 'no-store')
			.set('Pragma', 'no-cache')
			.set('Expires', '0');

		if (!isNil(this.sessionToken)) {
			headers = headers
				.set('X-Authorization', `Bearer ${this.sessionToken}`)
				.set('X-Requested-With', 'XMLHttpRequest');
		}
		request = request.clone({ headers });
		return next.handle(request);
	}
}
