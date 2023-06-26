import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReloadEvent {
    private dashBoardGoListener = new Subject<any>();
    listen(): Observable<any> {
        return this.dashBoardGoListener.asObservable();
    }

    onGo(value) {
        this.dashBoardGoListener.next(value);
    }
}
