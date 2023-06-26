import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { JwtHelperService } from '@auth0/angular-jwt';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


const httpLoginOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', oam_remote_user: 'Vani.Pentyala' })
};

@Injectable()
export class AuthService {

    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    public env = environment;
    public jwtHelper = new JwtHelperService();
    private refreshTokenTimeout;

    constructor(private http: HttpClient, private router: Router, private appEndPoints: ApiEndpointsConfig) {
        this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    publishChanges(user) {
        this.currentUserSubject.next(user);
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    public jwt_login(credentials): Observable<any> {
        const url = this.appEndPoints.getLoginUrl();
        return this.http.post(url, credentials, httpLoginOptions);
    }

    public jwt_authToken(): Observable<any> {
        const url = this.appEndPoints.getAuthTokenUrl();
        return this.http.get(url, httpLoginOptions);
    }

    public jwt_setAccessToken(accesstoken) {
        localStorage.setItem('access_token_id', accesstoken);
    }

    public jwt_getAccessToken() {
        return localStorage.getItem('access_token_id');
    }

    public jwt_tokenValidity(token) {
        return this.jwtHelper.isTokenExpired(token);
    }

    startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(localStorage.getItem('access_token_id').split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    refreshToken() {
        return this.http.get<any>(this.appEndPoints.getAuthTokenUrl())
            .pipe(map((user) => {
                this.jwt_setAccessToken(user.token);
                return user;
            }));
    }

    public jwt_removeAccessToken() {
        localStorage.removeItem('access_token_id');
    }

    public jwt_setRefreshToken(refreshtoken) {
        localStorage.setItem('refresh_token_id', refreshtoken);
    }

    public jwt_getRefreshToken() {
        return localStorage.getItem('refresh_token_id');
    }

    public jwt_hasRole(roleName): boolean {
        const scopes = this.jwt_getScopes();
        for (const i in scopes) {
            if (scopes[i] === roleName) {
                return true;
            }
        }
        return false;
    }

    public jwt_getScopes(): any[] {
        const token = localStorage.getItem('access_token_id');
        const scopes = this.jwtHelper.decodeToken(token).scopes;
        return scopes;
    }

    public jwt_removeRefreshToken() {
        localStorage.removeItem('refresh_token_id');
    }

    public jwt_logout() {
        this.clearStorage();
        this.router.navigate(['/logout']);
    }

    public clearStorage() {
        localStorage.removeItem('role_list');
        localStorage.removeItem('LoggedUser');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('UserID');
        this.currentUserSubject.next(null);
        this.jwt_removeAccessToken();
        this.jwt_removeRefreshToken();
    }
    public jwt_getRole() {
        return localStorage.getItem('role_list');
    }

    public jwt_headerAccess() {
        return localStorage.getItem('headerAccess');
    }

    public jwt_setRole(rolelist) {
        localStorage.setItem('role_list', rolelist);
    }
}
