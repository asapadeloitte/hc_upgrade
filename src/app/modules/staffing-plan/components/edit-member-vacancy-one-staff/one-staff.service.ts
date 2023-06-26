import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OneStaffService {
  public oneStaffChangeDDForm: any;
  public empVacancies: any;
  public tabForm: string;
  public event: Event;
  public saveListners = new Subject<any>();
  constructor() { }

  setOneStaffSearchDDVals(acqChangeForm) {
    return this.oneStaffChangeDDForm = JSON.parse(JSON.stringify(acqChangeForm));
  }

  getOneStaffSearchDDVals() {
    return this.oneStaffChangeDDForm;
  }

  setAllEmpVacancies(e) {
    this.empVacancies = e;
  }

  getAllEmpVacancies() {
    return this.empVacancies;
  }

  setTabForm(form) {
    this.tabForm = form;
  }

  getTabFormName() {
    return this.tabForm;
  }
  listen(): Observable<any> {
    return this.saveListners.asObservable();
}

onSave(filterBy) {
    this.saveListners.next(filterBy);
  }
 }
