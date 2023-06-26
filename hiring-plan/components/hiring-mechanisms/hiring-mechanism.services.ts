import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HiringMechanismService {
    public hiringMechanismDDValues: any;
    private closeListener = new Subject<any>();
    public employees: any;
    constructor() { }

    setSearchDDVals(hiringDD) {
        this.hiringMechanismDDValues = hiringDD;
    }
    getSearchDDVals() {
        return this.hiringMechanismDDValues;
    }

    getAdditionalSmartLists() {
        const i = [{
            smartListId: '22',
            smartListName: 'classificationNeeded',
            smartListValues: [
                {
                    smartListName: 'classificationNeeded',
                    id: 'Yes',
                    value: 'Yes'
                },
                {
                    smartListName: 'classificationNeeded',
                    id: 'No',
                    value: 'No'
                }
            ]
        },
        {
            smartListId: '22',
            smartListName: 'recruitPackageSubmittedToHr',
            smartListValues: [
                {
                    smartListName: 'recruitPackageSubmittedToHr',
                    id: 'Yes',
                    value: 'Yes'
                },
                {
                    smartListName: 'recruitPackageSubmittedToHr',
                    id: 'No',
                    value: 'No'
                }
            ]
        }];
        return i;
    }

    listen(): Observable<any> {
        return this.closeListener.asObservable();
    }

    onClose(value) {
        this.closeListener.next(value);
    }

}
