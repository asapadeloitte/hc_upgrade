
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SelectionsService {
    public selectionsDDValues: any;
    public selectedVacancyListener = new Subject<boolean>();
    public vacancyId: any;
    constructor() { }

    setSearchDDVals(selectionsDDValues) {
        this.selectionsDDValues = selectionsDDValues;
    }
    getSearchDDVals() {
        return this.selectionsDDValues;
    }

    setVacancyId(vacancyId) {
        this.vacancyId = vacancyId;
    }
    getVacancyId() {
        return this.getVacancyId;
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
        },
        {
            smartListId: '30',
            smartListName: 'nonCompetitiveSelection',
            smartListValues: [
                {
                    smartListName: 'nonCompetitiveSelection',
                    id: true,
                    value: 'Yes'
                },
                {
                    smartListName: 'nonCompetitiveSelection',
                    id: false,
                    value: 'No'
                }
            ]
        }];
        return i;
    }
    // communicate between two different classes
    selectedVacancyListen(): Observable<any> {
        return this.selectedVacancyListener.asObservable();
    }

    onReloadVacancy(value) {
        this.selectedVacancyListener.next(value);
    }
}
