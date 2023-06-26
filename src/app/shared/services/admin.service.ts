import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import { User, FieldMapping } from './../../shared/models/user.model';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AdminService {
    constructor(private http: HttpClient, private apiEndpoints: ApiEndpointsConfig) { }

    getUserByEmail(email: string): Observable<any> {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/retrieve';
        return this.http.post(url, email, httpOptions);
    }


    getUsers(): Observable<any> {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/users';
        return this.http.get(url, httpOptions);
    }

    getUserGroups(): Observable<any> {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/nativegroups';
        return this.http.get(url, httpOptions);
    }

    createUser(user: User): Observable<any> {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/user/create';
        return this.http.post(url, user, { observe: 'response' });
    }

    updateUser(user: User): Observable<any> {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/user/update/' + user.userId;
        return this.http.post(url, user, { observe: 'response' });
    }

    getUser(id) {
        return this.http.get(this.apiEndpoints.getUserByEmailUrl() + '/' + id, httpOptions);
    }

    deleteUser(user: User, id) {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/user/delete/' + id;
        return this.http.post(url, user, { observe: 'response' });

    }

    createFieldMapping(fieldMapping: FieldMapping) {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/fieldmappings/jobcodes/create';
        return this.http.post(url, fieldMapping, httpOptions);
    }

    updateFieldMappings(fieldMappings: FieldMapping[]) {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/fieldmappings/jobcodes/save/';
        return this.http.post(url, fieldMappings, httpOptions);
    }

    getFieldMappings(): Observable<FieldMapping[]> {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/fieldmappings/jobcodes';
        return this.http.get<FieldMapping[]>(url, httpOptions);
    }
    deleteFieldMapping(fieldMapping: FieldMapping, id) {
        const url = this.apiEndpoints.getUserByEmailUrl() + '/fieldmappings/jobcodes/delete/' + id;
        return this.http.post(url, fieldMapping, { observe: 'response' });
    }

}
