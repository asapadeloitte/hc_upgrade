import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DetailTemPromotionLogService {
    public hiringMechanismDDValues: any;
    public employees: any;
    public offices: any;
    public orgLevels: any;
    public fplSmartList: any;
    public nonCtpGradeSmartList: any;
    constructor() { }

    setSearchDDVals(hiringDD) {
        this.hiringMechanismDDValues = hiringDD;
    }
    getSearchDDVals() {
        return this.hiringMechanismDDValues;
    }

    getAdditionalSmartLists() {
        return this.offices;
    }

    getOrgLevelSmartLists() {
        return this.orgLevels;
    }

    getFplSmartLists() {
        this.fplSmartList.smartListValues = this.fplSmartList.smartListValues.sort((a, b) => a.id - b.id);
        return this.fplSmartList;
    }

    addAdditionalSmartLists(officeList, jobTitleMapping) {

        this.fplSmartList = {
            smartListId: 'fpl',
            smartListName: 'fpl',
            smartListValues: []
        };
        this.offices = {
            smartListId: 'office',
            smartListName: 'office',
            smartListValues: []
        };
        this.orgLevels = {
            smartListId: 'orgLevel',
            smartListName: 'orgLevel',
            smartListValues: []
        };
        this.offices.smartListValues = officeList.map(x => ({
            id: x.office,
            smartListName: x.office,
            value: x.office
        }
        ));
        const temp = [];
        officeList.forEach(element => {
            element.orgLevels.forEach(org => {
                org.id = element.office;
                org.smartListName = org.orgLevel;
                org.value = org.orgLevelAlias;
                temp.push(org);
            });
            this.orgLevels.smartListValues = temp;

        });

        const tempFpl = [];
        if (jobTitleMapping) {
            jobTitleMapping.forEach(element => {
                element.id = element.fpl;
                element.smartListName = 'fpl';
                element.value = element.fpl;
                tempFpl.push(element);
                if (this.fplSmartList.smartListValues.length > 0) {
                    const tempIndex = this.fplSmartList.smartListValues.findIndex(tempRec => tempRec.id === element.id);
                    if (tempIndex < 0) {
                        this.fplSmartList.smartListValues.push(element);
                    }
                } else {
                    this.fplSmartList.smartListValues.push(element);
                }
            });
        }
    }

    addMappingSmartLists(gradeSmartList) {
        this.nonCtpGradeSmartList = {
            smartListId: 'nonCtpDetailGrade',
            smartListName: 'nonCtpDetailGrade',
            smartListValues: []
        };
        this.nonCtpGradeSmartList.smartListValues = gradeSmartList.smartListValues;
    }
    getMappingSmartLists() {
        return this.nonCtpGradeSmartList;
    }
}
