import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class AllStaffService {
    public allStaffDDValues: any;
    public employees: any;
    public allSpEmployees: any;
    constructor() { }

    setSearchDDVals(allStaffDD) {
        this.allStaffDDValues = allStaffDD;
    }
    getSearchDDVals() {
        return this.allStaffDDValues;
    }

    setEmployees(empList) {
        this.employees = empList;
    }

    getEmployees() {
        return this.employees;
    }

    setAllSpEmployees(emps) {
        this.allSpEmployees = emps;
    }

    getAllSpEmployees() {
        return this.allSpEmployees;
    }
}
