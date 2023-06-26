
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PushVacancyService {
    public pushVacancyDDValues: any;
    public vacancyId: any;
    private vacancyPushListner = new Subject<any>();
    constructor() { }

    setSearchDDVals(pushVacancyDDValues) {
        this.pushVacancyDDValues = pushVacancyDDValues;
    }
    getSearchDDVals() {
        return this.pushVacancyDDValues;
    }

    setVacancyId(vacancyId) {
        this.vacancyId = vacancyId;
    }
    getVacancyId() {
        return this.getVacancyId;
    }
    listen(): Observable<any> {
        return this.vacancyPushListner.asObservable();
    }
    onSave(success: boolean) {
        this.vacancyPushListner.next(success);
    }
}
