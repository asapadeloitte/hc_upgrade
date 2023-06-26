import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
    HiringMechanismAnnouncementComponent,
} from 'src/app/modules/hiring-plan/components/hiring-mechanisms/hiring-mechanism-announcement.component';

import {
    EmpvacHyperlinkComponent,
} from '../../../modules/staffing-plan/components/empvac-hyperlink/empvac-hyperlink.component';
import { SmartListConversionService } from '../../services/smartListConversion.service';

@Component({
    selector: 'app-hyperlink',
    template: `<span><a href="javascript:void(0)" class='advanceSearch' (click)='onClick()'>{{params.value}}</a></span>`,
    styles: []
})

// tslint:disable-next-line:component-class-suffix
export class HyperlinkComponent implements ICellRendererAngularComp {

    public params: any;
    public smartListFieldNameValues = [];
    public searchableDropdown: any;
    public ddValue: [];
    public selectedOption: any;
    public spcacquisitionType: string;
    public displayPopup;
    public modalLength;
    public component;
    bsModalRef: BsModalRef;

    constructor(
        private smartListService: SmartListConversionService,
        private modalService: BsModalService) {
    }
    selectedValue(e) {
        this.selectedOption = e;
    }
    getValue(): any {
        return this.selectedOption;
    }
    agInit(params: any): void {
        this.params = params;
        if (params.value) {
            if (params.value.includes('ANCMT')) {
                this.displayPopup = 'hiring-mechanism';
            }
        }
    }
    onClick() {
        let initialState;
        if (this.displayPopup === 'hiring-mechanism') {
            initialState = {
                screenName: 'Hiring Mechanism',
                title: 'Modal with hyperlink',
                displayName: this.params.value,
                // tabActive: 'Edit Staff/ Vacancy Information',
                vacancyFormData: this.params.data,
                // selectedTabName: 'Edit Staff/ Vacancy Information',
                year: this.params.year,
                // orgLevel: this.params.data.orgLevel,
                office: this.params.office

            };
        } else {
            initialState = {
                title: 'Modal with hyperlink',
                displayName: this.params.value,
                tabActive: 'Edit Staff/ Vacancy Information',
                vacancyFormData: this.params.data,
                selectedTabName: 'Edit Staff/ Vacancy Information',
                year: this.params.data.year,
                orgLevel: this.params.data.orgLevel,
                office: this.params.office,
                employeeId: this.params.data.employee,
                employees: this.params.employees
            };
        }
        this.modalLength = '';

        if (this.displayPopup === 'hiring-mechanism') {

            this.component = HiringMechanismAnnouncementComponent;
            this.modalLength = 'modal-xl';

        } else {
            this.component = EmpvacHyperlinkComponent;
        }

        this.bsModalRef = this.modalService.show(this.component, {
            initialState, backdrop: true,
            class: this.modalLength,
            ignoreBackdropClick: true
        });
        this.bsModalRef.content.closeBtnName = 'Close';
        this.bsModalRef.content.submitBtnName = 'Submit';


    }
    isPopup() {
        return false;
    }

    refresh(): boolean {
        return false;
    }

}






