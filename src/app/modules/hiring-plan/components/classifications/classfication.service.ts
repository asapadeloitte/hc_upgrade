import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ClassficationService {
    public hiringMechanismDDValues: any;
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
            smartListName: 'classPkgsubmittedToHr',
            smartListValues: [
                {
                    smartListName: 'classPkgsubmittedToHr',
                    id: 'Yes',
                    value: 'Yes'
                },
                {
                    smartListName: 'classPkgsubmittedToHr',
                    id: 'No',
                    value: 'No'
                }
            ]
        }];
        return i;
    }

}
