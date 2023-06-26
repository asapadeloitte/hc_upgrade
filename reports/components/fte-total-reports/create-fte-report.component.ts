import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Classfication } from 'src/app/shared/models/hiring-plan.model';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-create-fte-report',
    templateUrl: './create-fte-report.component.html',
})
export class CreateFTEReportComponent implements OnInit, OnChanges {
    public officeList: any;
    @Input() selectedPayPeriod: string;
    @Input() payPeriod;
    @Input() year;
    public orgLevelsBasedonOffice: any;
    public actionList: any = [];
    public createFTERrportForm: FormGroup;
    public disablesubmitButton = true;
    public classifications: Classfication[] = [];
    public errorDetails: any = [];
    public selectedActionName: string;
    public name: string;
    public seledtedOfficeName: string;
    public selectedOrgLevel: string;
    public adminCode: string;
    public orgLevelsAdminCode: any;
    public busyTableSave: Subscription;

    @Output() reloadFTEOnSave = new EventEmitter<boolean>();
    constructor(
        private humanCapitalService: HumanCapitalService,
        public toaster: ToasterService) {
    }
    ngOnInit() {
        this.loadFTEEntry();
    }


    ngOnChanges(changes: SimpleChanges) {
        // tslint:disable-next-line: forin
        for (const propName in changes) {
            if (propName === 'selectedPayPeriod') {
                const chg = changes[propName];
                if (chg.currentValue) {
                    this.selectedPayPeriod = chg.currentValue;
                }
            }
            if (propName === 'year') {
                const chg = changes[propName];
                if (chg.currentValue) {
                    this.year = chg.currentValue;
                }
            }
            if (propName === 'payPeriod') {
                const chg = changes[propName];
                if (chg.currentValue) {
                    this.payPeriod = chg.currentValue;
                }
            }
        }
    }
    loadFTEEntry() {
        this.createFTERrportForm = new FormGroup({
            selectedPayPeriod: new FormControl(Validators.required),
            office: new FormControl(null, Validators.required),
            name: new FormControl(null, Validators.required),
            action: new FormControl(null, Validators.required),
            orgLevel: new FormControl(null, Validators.required),
            adminCode: new FormControl(Validators.required),
        });

        const list = ['New', 'Departed'];
        this.actionList = list;
        this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
            this.officeList = args.officeOrgLevelMapping;
        });
    }
    onOrgLevelSelection(event: any) {
        this.createFTERrportForm.controls.adminCode.setValue(null);
        this.selectedOrgLevel = this.createFTERrportForm.controls.orgLevel.value;
        if (this.selectedOrgLevel) {
            const tempAdmin = this.orgLevelsAdminCode.find(e => e.orgLevel === this.selectedOrgLevel);
            this.createFTERrportForm.controls.adminCode.setValue(tempAdmin.adminCode);
        }
    }

    onOfficeChangeEvent(event: any) {
        this.seledtedOfficeName = this.createFTERrportForm.controls.office.value;
        this.officeList.forEach(element => {
            if (element.office === this.seledtedOfficeName) {
                this.orgLevelsBasedonOffice = element.orgLevels;
                this.orgLevelsAdminCode = element.orgLevels;
                this.adminCode = element.adminCode;
            }
        });
        if (this.seledtedOfficeName === null) {
            this.orgLevelsBasedonOffice = null;
        }
        this.createFTERrportForm.controls.orgLevel.setValue(null);
        this.createFTERrportForm.controls.adminCode.setValue(null);
    }

    onActionChangeEvent(event: any) {
        this.selectedActionName = this.createFTERrportForm.controls.action.value;
    }
    onNameEvent(event: any) {
        this.name = this.createFTERrportForm.controls.name.value;
    }

    // to add new classfication
    saveEntry() {

        const payload = [{
            year: this.year,
            payPeriod: this.payPeriod,
            name: this.createFTERrportForm.controls.name.value,
            adminCode: this.createFTERrportForm.controls.adminCode.value,
            action: this.createFTERrportForm.controls.action.value,
            orgLevel: this.selectedOrgLevel,
            office: this.seledtedOfficeName,
        }];
        this.busyTableSave = this.humanCapitalService.saveFTEReport(payload).subscribe(data => {
            this.toaster.pop('success', 'Saved', 'Entry saved successfully');
            this.reloadFTEOnSave.emit(true);
            this.reset();
        }, error => {
            this.toaster.pop('error', 'Failed', this.errorDetails);
        });
    }
    reset() {
        this.orgLevelsBasedonOffice = [];
        this.createFTERrportForm.controls.orgLevel.setValue(null);
        this.createFTERrportForm.controls.name.setValue(null);
        this.createFTERrportForm.controls.action.setValue(null);
        this.createFTERrportForm.controls.office.setValue(null);
        this.createFTERrportForm.controls.adminCode.setValue(null);
        this.disablesubmitButton = true;
    }
}
