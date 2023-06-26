import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpParams } from '@angular/common/http';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable()

export class ApiEndpointsConfig {

    constructor() { }

    public get getBaseUrl(): string {
        return 'http://cbaspps.dev.fda.gov/ctphc';
    }

    public getLoginUrl(): string {
        return this.getBaseUrl + '/api/auth/login';
    }

    public getAuthTokenUrl(): string {
        return this.getBaseUrl + '/api/auth/token';
    }

    public getUserByEmailUrl(): string {
        return this.getBaseUrl + '/api/admin';
    }
}
