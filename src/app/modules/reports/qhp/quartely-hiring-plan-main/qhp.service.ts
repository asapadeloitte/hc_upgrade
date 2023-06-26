import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QhpService {
    private parentGoListener = new Subject<any>();
    private maingridRelaodListner = new Subject<any>();
    listen(): Observable<any> {
        return this.parentGoListener.asObservable();
    }

    onGo(value: boolean) {
        this.parentGoListener.next(value);
    }
    onVacancies(value: boolean) {
        this.maingridRelaodListner.next(value);
    }
    onVacanciesListen(): Observable<any> {
        return this.maingridRelaodListner.asObservable();
    }
}
