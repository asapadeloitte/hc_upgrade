import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ICellEditorAngularComp, ICellRendererAngularComp } from 'ag-grid-angular';
import { AllStaffService } from 'src/app/modules/staffing-plan/components/edit-existing-staffmember/all-staff.service';

import { SmartListConversionService } from '../../services/smartListConversion.service';
import { jobTitleMappingForGrid, trimObject } from '../../utilities';
import { dateCompare } from '../date-input/ensure-end-date-greater-than-start-date.validator';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as moment from 'moment';
import { ICellEditorComp, ICellEditorParams } from 'ag-grid-community';
declare var $: any;
@Component({
  selector: 'app-cell-renderer',
  template: `
    <input [id]="id" type="date" [(ngModel)]='cellValue'
           class="form-control" (ngModelChange)="onclick($event)"
           (click) ="onclick($event)" placeholder ='mm/dd/yyyy'>
  `,
  styles: []
})
export class CellRendererComponent implements ICellRendererAngularComp {
  public params: any;
  public date;
  pipe = new DatePipe('en-US');
  cellValue;
  public id: string;
  agInit(params: any): void {
    // this.id = Math.random().toString();
    // setTimeout(() => { // this will make the execution after the above boolean has changed
    //   const a = document.getElementById(this.id);
    //   a.focus();
    // }, 0);
    this.params = params;
    this.cellValue = this.pipe.transform(params.value, 'yyyy-MM-dd');
  }

  onclick(date: Date) {
    const dateInputs = document.querySelectorAll('[type="date"]');
    dateInputs.forEach(el => {
      // register double click event to change date input to text input and select the value
      el.addEventListener('click', () => {
        el.setAttribute('type', 'text');
        // After changing input type with JS .select() wont work as usual
        // Needs timeout fn() to make it work
        setTimeout(() => {
          console.log(el);
          // el.select();
        });
      });
      el.addEventListener('focusout', () => {
        el.setAttribute('type', 'date');
      });
    });
  }
  getValue(): any {
    // to handle invalid date
    const d = moment(this.cellValue);

    const isValid = d.isValid();
    if (isValid === false) {
      this.cellValue = '';
      return '';
    }
    this.cellValue = moment(this.cellValue).format('MM/DD/YYYY');
    // added for converting the date format  09-12-0020 to 09/12/20
    let formattedDate = moment(this.cellValue).format('MM/DD/YYYY');
    if (this.cellValue !== null) {
      const inputDate = this.cellValue.split('-', 3);
      if (inputDate.length > 1) {
        const year = parseInt(inputDate[0], 10);
        let yearStr = year.toString();
        if (year >= 50 && year < 100) {
          yearStr = '20' + year;
        } else if (year >= 100 && year < 1000) {
          yearStr = '2' + year;
        }
        formattedDate = [inputDate[1], inputDate[2], yearStr].join('/');
      }
    }
    // let getDate = this.pipe.transform(formattedDate, 'MM/dd/yyyy');
    let getDate = new Date(formattedDate).toISOString();
    if (getDate === null) {
      getDate = '';
      return getDate;
    } else {
      return getDate;
    }
  }

  refresh(params: any): boolean {
    return true;
  }
}


// Planned POP Start date
@Component({
  selector: 'app-date-validator',
  template: ` <div *ngIf="showValidationEndDate" class="infoIncon">
                <span class="text-red">
                  <i class="fa fa-exclamation-circle avInfo-circle"
                  placement="auto" ngbTooltip={{validationMsg}} container="body">
                  </i>
                </span>
                <span class="textRight">{{params.value | date: 'MM/dd/yyyy'}}</span>
            </div>
            <div *ngIf="showValidationCTP" class="infoIncon">
                <span class="text-red">
                  <i class="fa fa-exclamation-circle avInfo-circle"
                  placement="auto" ngbTooltip={{validationMsg}} container="body">
                  </i>
                </span>
                <span class="textRight">{{params.value | date: 'MM/dd/yyyy'}}</span>
            </div>
            <div *ngIf="!showValidation" class="textRight">
            {{params.value | date: 'MM/dd/yyyy'}}
            </div>`,
  styles: []
})
// added for Detail-temporary promotion log detailNteDate and detailEffectiveDate
// check for empty and before and after dates
export class StartDtValCellRenderrComponent implements ICellEditorAngularComp {

  public params: any;
  public date;
  public showValidationEndDate = false;
  public validationMsg;
  public showValidationCTP = false;
  public showValidation = false;
  public endDate;
  cellValue;

  agInit(params: any): void {
    this.params = params;
    this.cellValue = params.value;
    if (!params.node.group) {
      if (params.data.detailEffectiveDate && params.data.detailNteDate) {
        const enddateValid = dateCompare(params.data.detailEffectiveDate, params.data.detailNteDate);
        if (enddateValid) {
          this.showValidationEndDate = true;
          this.validationMsg = 'Detail - Effective Date cannot be after Detail - NTE Date.';
          this.showValidationCTP = false;
        } else {
          this.showValidationEndDate = false;
          this.showValidationCTP = false;
        }
      } else if (params.data.detailNteDate && !params.data.detailEffectiveDate) {
        this.showValidationEndDate = true;
        this.validationMsg = 'Detail Effective Date cannot be empty';
      } else if (params.data.detailNteDate === '' && params.data.detailEffectiveDate === '') {
        this.showValidationEndDate = true;
        if (params.data.detailEffectiveDate === '') {
          this.validationMsg = 'Detail Effective Date cannot be empty';
        } else {
          this.validationMsg = 'Detail - NTE Date cannot be empty';
        }
      }
    }
  }

  onclick(date: Date) {
  }
  getValue(): any {
    return this.cellValue;
  }

  isPopup() {
    return true;
  }

  refresh(params: any): boolean {
    return true;
  }

}

@Component({
  selector: 'app-enddate-components',
  template: ` <div *ngIf="showValidation" class="infoIncon">
                <span class="text-red">
                  <i class="fa fa-exclamation-circle avInfo-circle"
                  placement="auto" ngbTooltip={{validationMsg}} container="body">
                  </i>
                </span>
                <span class="textRight">{{params.value | date: 'MM/dd/yyyy'}}</span>
            </div>
            <div *ngIf="!showValidation" class="textRight">
            {{params.value | date: 'MM/dd/yyyy'}}
            </div>`,
  styles: []
})

export class EndDateCellRendererComponent implements ICellRendererAngularComp {

  public params: any;
  public date;
  public showValidation = false;
  public endDate;
  public validationMsg;
  // cellValue;

  agInit(params: any): void {
    this.params = params;
    if (!params.node.group) {
      if (params.data.detailEffectiveDate && params.data.detailNteDate) {
        const dateValid = dateCompare(params.data.detailEffectiveDate, params.data.detailNteDate);
        if (dateValid) {
          this.showValidation = true;
          this.validationMsg = 'Detail - NTE Date cannot be prior to the Detail - Effective Date.';
        }
      } else if (params.data.detailEffectiveDate && !params.data.detailNteDate) {
        this.showValidation = true;
        this.validationMsg = 'Detail - NTE Date cannot be empty';
      } else if (params.data.detailNteDate === '' && params.data.detailEffectiveDate === '') {
        this.showValidation = true;
        if (params.data.detailNteDate === '') {
          this.validationMsg = 'Detail - NTE Date cannot be empty';
        } else {
          this.validationMsg = 'Detail Effective Date cannot be empty';
        }
      }
    } else {
      this.showValidation = false;
    }
  }

  isPopup() {
    return true;
  }

  refresh(params: any): boolean {
    return true;
  }

}
@Component({
  selector: 'app-dropdown-smartlist',
  template: `
 <ng-select #testselect [id]="id" (close) ="onClose()" class="select-drpdwn-panel select-dropdown-wrapper" (clear) ="onClear()"
 [(ngModel)]="selectedValues" [clearAllText] ="clearValue">
  <ng-option *ngFor="let dropdownValues of ddSmartListValues"
   title="{{dropdownValues.value}}" [value]="dropdownValues.value">
   <span [title]="dropdownValues.value">{{dropdownValues.value}}</span>
   </ng-option>
  </ng-select>
 `,
  // styles: ['.select-drpdwn-panel{::ng-deep ng-dropdown-panel.ng-dropdown-panel{ position: relative !important;}' ]
})

// tslint:disable-next-line:component-class-suffix
export class AppDropdownSmartList implements ICellRendererAngularComp {
  public params: any;
  public ddSmartListValues = [];
  public searchableDropdown: any;
  public ddValues;
  public selectedValues: any;
  public smartListFieldNameValues = [];
  public fieldName: any;
  public actionValues = [];
  public id;
  public clearValue = 'Clear all';
  updateValue = false;
  @ViewChild('testselect', { static: true }) private myselect: NgSelectComponent;
  constructor(
    private smartListService: SmartListConversionService,
    private allStaffservice: AllStaffService) {
  }
  onClear() {
    this.selectedValues = '';
    // this.params.stopEditing();
  }
  onClose() {
    this.params.stopEditing();
  }

  getCellData(params, testSmart) {
    this.searchableDropdown = this.smartListService.getDDVals();
    this.ddValues = this.searchableDropdown.find(e => e.smartListName === testSmart);
    if (testSmart === 'office') {
      params.data.orgLevelAlias = '';
      params.data.orgLevel = '';
      params.data.adminCode = '';
    }
    if (testSmart === 'action') {
      this.actionValues = this.searchableDropdown.find(e => e.smartListName === 'action').smartListValues;
      const index = this.actionValues.findIndex(d => d.value === 'Reassignment');
      if (index > 0) {
        this.actionValues.splice(index, 1);
      }
      const index1 = this.actionValues.findIndex(d => d.value === 'Reassignment (Prev. on Detail to CTP)');
      if (index1 > 0) {
        this.actionValues.splice(index1, 1);
      }
      // sorting on action in r&l log
      this.ddValues = trimObject(this.actionValues);
      this.ddValues.sort((a, b) => (a.value < b.value ? -1 : 1));
      this.ddSmartListValues = this.ddValues;
      // this.ddSmartListValues = this.actionValues;
    } else if (testSmart === 'hiringMechanism') {
      this.ddValues = this.searchableDropdown.find(e => e.smartListName === 'hiringMechanism').smartListValues;
      this.ddSmartListValues =
        this.ddValues.filter(e => e.value === 'DE' || e.value === 'DH' || e.value === 'Pathways' || e.value === 'MP');
    } else if (testSmart === 'ctpHomeOffice' || testSmart === 'ctpDetailOffice') {
      this.ddValues = this.searchableDropdown.find(e => e.smartListName === 'office');
      this.ddSmartListValues = this.ddValues.smartListValues;
    } else if (testSmart === 'ctpDetailOrgLevel' || testSmart === 'ctpHomeOrgLevel' || testSmart === 'orgLevelAlias') {
      this.ddValues = this.searchableDropdown.find(e => e.smartListName === 'orgLevel');
      this.ddSmartListValues = this.ddValues.smartListValues;
      if (params.data.ctpDetailOffice && testSmart === 'ctpDetailOrgLevel') {
        this.ddSmartListValues = this.ddSmartListValues.filter(e => e.id === params.data.ctpDetailOffice);
      }
      if (params.data.ctpHomeOffice && testSmart === 'ctpHomeOrgLevel') {
        this.ddSmartListValues = this.ddSmartListValues.filter(e => e.id === params.data.ctpHomeOffice);
      }
      if (params.data.office && testSmart === 'orgLevelAlias') {
        this.ddSmartListValues = this.ddSmartListValues.filter(e => e.id === params.data.office);
        this.ddSmartListValues.sort((a, b) => (a.value < b.value ? -1 : 1));
      }
    } else if (testSmart === 'recruitJobReqNbr') {
      this.ddValues = this.params.values.map(x => ({
        id: x,
        smartListName: x,
        value: x
      }));
      // for sortinfg the HREPS Recruit Job Req#
      this.ddValues = trimObject(this.ddValues);
      this.ddValues.sort((a, b) => (a.value < b.value ? -1 : 1));
      this.ddSmartListValues = this.ddValues;
    } else if (testSmart === 'ehcmId') {
      this.ddValues = this.params.values.map(x => ({
        id: x,
        smartListName: x,
        value: x
      }));
      this.ddValues = trimObject(this.ddValues);
      this.ddValues.sort((a, b) => (a.value < b.value ? -1 : 1));
      this.ddSmartListValues = this.ddValues;
    } else if (testSmart === 'civilianOrCc') {
      this.ddValues = this.params.values.map(x => ({
        id: x,
        smartListName: x,
        value: x
      }));
      this.ddSmartListValues = this.ddValues;
    } else if (testSmart === 'year') {
      this.ddValues = this.params.values.map(x => ({
        id: x,
        smartListName: x,
        value: x
      }));
      this.ddSmartListValues = this.ddValues;
    } else if (testSmart === 'quarter') {
      this.ddValues = this.params.values.map(x => ({
        id: x,
        smartListName: x,
        value: x
      }));
      this.ddSmartListValues = this.ddValues;
    } else {
      // not equal to jobcode
      if (testSmart !== 'jobTitle' && testSmart !== 'jobCode' && testSmart !== 'series' &&
        testSmart !== 'grade' && testSmart !== 'payPlan' && testSmart !== 'fpl'
        && testSmart !== 'actingCtpStaffName' && testSmart !== 'ctpDetailSeries'
        && testSmart !== 'ctpDetailGrade' && testSmart !== 'ctpHomeOfficeSupFullName' &&
        testSmart !== 'currentSupervisor' && testSmart !== 'hiringManager' && testSmart !== 'hiringManagerLevel'
        && testSmart !== 'ctpDetailSupFullName' && testSmart !== 'associateExistingEmployee') {
        this.ddSmartListValues = this.ddValues.smartListValues;
      }
      if (testSmart === 'jobTitle') {
        let mapping = this.smartListService.getTitleMapping();
        if (this.params.screenName === 'selections') {
          mapping = mapping.filter(e => e.payPlan === params.data.payPlan);
        }
        this.ddSmartListValues = this.ddValues.smartListValues.filter(x => mapping.some(y => y.jobTitle.includes(x.value)));
        this.ddSmartListValues = trimObject(this.ddSmartListValues);
        this.ddSmartListValues.sort((a, b) => (a.value < b.value ? -1 : 1));
      }
      if (testSmart === 'jobCode' ||
        testSmart === 'series' || testSmart === 'grade' || testSmart === 'payPlan' || testSmart === 'fpl') {
        const mapping = this.smartListService.getTitleMapping();
        this.ddSmartListValues = jobTitleMappingForGrid(this.searchableDropdown, mapping, 'jobTitle', params.data, testSmart);
        if (testSmart === 'jobCode') {
          this.ddValues = this.ddSmartListValues;
        }
      }
      if (testSmart === 'ctpDetailSeries' || testSmart === 'ctpDetailGrade') {
        const mapping = this.smartListService.getTitleMapping();
        this.ddSmartListValues =
          jobTitleMappingForGrid(this.searchableDropdown, mapping, 'ctpDetailJobTitle', params.data, testSmart);
      }
      if (testSmart === 'actingCtpStaffName' || testSmart === 'ctpHomeOfficeSupFullName'
        || testSmart === 'currentSupervisor'
        || testSmart === 'hiringManager' || testSmart === 'hiringManagerLevel' || testSmart === 'ctpDetailSupFullName') {
        const ctpStaffList = this.allStaffservice.getEmployees();
        if (testSmart === 'currentSupervisor'
          || testSmart === 'hiringManager' || testSmart === 'hiringManagerLevel') {
          this.ddValues = ctpStaffList.filter(emp => emp.supervisor).map(x => ({
            id: x.id,
            smartListName: x.office,
            value: x.fullName
          }));
          // sorting for currentSupervisior and remaining fields
          this.ddValues = trimObject(this.ddValues);
          this.ddValues.sort((a, b) => (a.value < b.value ? -1 : 1));
          this.ddSmartListValues = this.ddValues;
        } else if (testSmart === 'ctpHomeOfficeSupFullName') {
          let ddVals;
          ddVals = ctpStaffList.filter(emp => emp.office === params.data.ctpHomeOffice && emp.supervisor);
          this.ddValues = ddVals.map(x => ({
            id: x.id,
            smartListName: x.office,
            value: x.fullName
          }));
          // sorting for currentSupervisior and remaining fields
          this.ddValues = trimObject(this.ddValues);
          this.ddValues.sort((a, b) => (a.value < b.value ? -1 : 1));
          this.ddSmartListValues = this.ddValues;
        } else if (testSmart === 'ctpDetailSupFullName') {
          let ddVals;
          ddVals = ctpStaffList.filter(emp => emp.office === params.data.ctpDetailOffice && emp.supervisor);
          this.ddValues = ddVals.map(x => ({
            id: x.id,
            smartListName: x.office,
            value: x.fullName
          }));
          // sorting for currentSupervisior and remaining fields
          this.ddValues = trimObject(this.ddValues);
          this.ddValues.sort((a, b) => (a.value < b.value ? -1 : 1));
          this.ddSmartListValues = this.ddValues;
        } else if (testSmart === 'actingCtpStaffName') {
          this.ddValues = ctpStaffList.map(x => ({
            id: x.id,
            smartListName: x.office,
            value: x.fullName
          }));
          // sorting for actingCtp StaffName
          this.ddValues = trimObject(this.ddValues);
          this.ddValues.sort((a, b) => (a.value < b.value ? -1 : 1));
          this.ddSmartListValues = this.ddValues;
        }
      }
      if (testSmart === 'associateExistingEmployee') {
        const spStaffList = this.allStaffservice.getAllSpEmployees();
        spStaffList.sort((a, b) => (a.fullName < b.fullName ? -1 : 1));
        this.ddValues = spStaffList.map(x => ({
          id: x.employeeId,
          smartListName: 'displaySummary',
          value: x.displaySummary
        }));
        // sorting for currentSupervisior and remaining fields
        this.ddValues = trimObject(this.ddValues);
        this.ddSmartListValues = this.ddValues;
      }
    }
    if (params.value) {
      this.smartListFieldNameValues = this.ddSmartListValues.find(y => y.id === params.value);
      this.selectedValues = this.params.value;
    }
  }
  getValue(): any {
    return this.selectedValues;
  }
  agInit(params: any): void {
    // setTimeout(() => { // this will make the execution after the above boolean has changed
    //   const a = document.getElementById(this.id);
    //   a.focus();
    // }, 0);
    this.myselect.isOpen = true;
    this.updateValue = true;
    this.params = params;
    this.fieldName = params.colDef.field === 'hiringPlanGrade' ? 'grade' : params.colDef.field;
    this.getCellData(this.params, this.fieldName);
    // clear the values(below fields) if associateExistingEmployee is empty
    if (this.params.screenName === 'selectionTemplate') {
      if (this.params.data.associateExistingEmployee !== '' || this.params.data.associateExistingEmployee === null) {
        this.params.data.selecteeFirstName = '';
        this.params.data.selecteeLastName = '';
        this.params.data.selecteeMiddleInitial = '';
        this.params.data.fullName = '';
      }
    }
  }

  isPopup() {
    return true;
  }

  refresh(): boolean {
    return false;
  }

}

// adding for Grade
@Component({
  selector: 'app-grade',
  template: `<div *ngIf="showValidation" class="infoIncon">
                   <span class="text-red">
                    <i class="fa fa-exclamation-circle avInfo-circle"
                     placement="auto" ngbTooltip="{{validationMessage}}" container="body">
                     </i>
                   </span>
                   <span class="textRight">{{params.value}}</span>
               </div>
               <div *ngIf="!showValidation" class="textRight">
               {{params.value}}
              </div>`,
  styles: []
})
export class AppGradeDdValcellRendererComponent implements ICellRendererAngularComp {

  public params: any;
  public showValidation = false;
  public validationMessage;
  public jobTtleMappings;
  constructor(private smartListService: SmartListConversionService) {
  }
  agInit(params: any): void {
    let ids = [];
    this.params = params;
    this.jobTtleMappings = this.smartListService.getTitleMapping();
    ids = this.jobTtleMappings.filter(e => e.jobTitle === params.data.jobTitle && e.payPlan === params.data.payPlan);
    ids = Array.from(new Set(ids.map((item: any) => item.grade)));
    if (ids.indexOf(this.params.value) !== -1) {
      this.showValidation = false;
    } else {
      this.showValidation = true;
      this.validationMessage = 'Please select a valid Grade from the dropdown.';
    }
  }
  isPopup() {
    return true;
  }

  refresh(params: any): boolean {
    return true;
  }
}

@Component({
  selector: 'app-sm-error',
  template: `<div *ngIf="showValidation" class="infoIncon">
                   <span class="text-red">
                    <i class="fa fa-exclamation-circle avInfo-circle"
                     placement="auto" ngbTooltip="{{validationMessage}}" container="body">
                     </i>
                   </span>
                   <span class="textLeft">{{params.value}}</span>
               </div>
               <div *ngIf="!showValidation" class="textLeft">
               {{params.value}}
              </div>`,
  styles: []
})

export class AppSmDdValcellRendererComponent implements ICellRendererAngularComp {

  public params: any;
  public showValidation = false;
  public validationMessage;
  public jobTtleMappings;
  constructor(private smartListService: SmartListConversionService) {
  }
  agInit(params: any): void {
    const ids = [];
    this.params = params;
    if (params.colDef.field === 'office') {
      this.showValidation = this.params.value ? false : true;
      this.validationMessage = 'Office cannot be empty.';
    }
    if (params.colDef.field === 'orgLevelAlias') {
      this.showValidation = this.params.value ? false : true;
      this.validationMessage = 'Organizaton Level cannot be empty.';
    }
    if (params.colDef.field === 'nonCompetitiveSelection') {
      this.showValidation = this.params.value ? false : true;
      this.validationMessage = 'Non-Competitive Selection? Cannot be empty.';
    }
    if (params.colDef.field === 'hiringMechanism') {
      this.showValidation = this.params.value ? false : true;
      this.validationMessage = 'Hiring Mechanism Cannot be empty.';
    }
  }
  isPopup() {
    return true;
  }

  refresh(params: any): boolean {
    return true;
  }
}
@Component({
  selector: 'app-dropdown-value',
  template: `{{selectedOption}}`,
  styles: []
})


export class DropdownText implements ICellRendererAngularComp {

  public params: any;
  public smartListFieldNameValues = [];
  public searchableDropdown: any;
  public ddValue: [];
  public selectedOption: any;

  constructor(
    private smartListService: SmartListConversionService) {
  }

  selectedValue(e) {
    this.selectedOption = e;
  }
  getValue(): any {
    return this.selectedOption;
  }
  agInit(params: any): void {
    this.params = params;
    this.selectedOption = this.params.value;
    if (params.data) {
      if (params.colDef.field === 'orgLevelAlias' && params.data.orgLevelAlias) {
        const options = params.context.componentParent.smartList.find(a => a.smartListName === 'orgLevel').smartListValues;
        const tempAdminCodeObj = options.find(e => e.id === params.data.office && e.orgLevelAlias === params.data.orgLevelAlias);
        if (tempAdminCodeObj) {
          params.data.adminCode = tempAdminCodeObj.adminCode;
        }
      }
      if (params.colDef.field === 'orgLevelAlias' && params.data.orgLevelAlias === '') {
        params.data.adminCode = '';
      }
    }
  }

  isPopup() {
    return true;
  }

  refresh(): boolean {
    return false;
  }

}

@Component({
  selector: 'app-dropdown-group',
  template: `{{selectedOption}}`,
  styles: []
})

// tslint:disable-next-line:component-class-suffix
export class DropdownTextWithGroup implements ICellRendererAngularComp {

  public params: any;
  public smartListFieldNameValues = [];
  public searchableDropdown: any;
  public ddValue: [];
  public selectedOption: any;

  constructor(
    private smartListService: SmartListConversionService) {
  }

  selectedValue(e) {
    this.selectedOption = e;
  }
  getValue(): any {
    return this.selectedOption;
  }
  agInit(params: any): void {
    this.params = params;
    this.selectedOption = params.value;
  }

  isPopup() {
    return true;
  }

  refresh(): boolean {
    return false;
  }
}



// Regex Validation for currentRequisitionNumber
@Component({
  selector: 'app-regex-component',
  template: ` <div *ngIf="showValidation" class="validationColor">
                <span class="text-red">
                  <i class="fa fa-exclamation-circle avInfo-circle"
                  placement="auto" ngbTooltip="Requisition numbers cannot contain special characters (ex. &$@!%)" container="body">
                  </i>
                </span>
                <span class="textRight">{{params.value}}</span>
            </div>
            <div *ngIf="!showValidation" class="textRight">
            {{params.value}}
            </div>`,
  styles: []
})
// tslint:disable-next-line:component-class-suffix
export class RegExValidationComponent implements ICellRendererAngularComp {

  public params: any;
  public showValidation = false;
  cellValue;

  agInit(params: any): void {
    this.params = params;
    this.cellValue = params.value;
    const regex = RegExp('[^A-Za-z0-9. *]');
    if (params.value && regex.test(params.value)) {
      this.showValidation = true;
      // params.colDef.cellStyle = { backgroundColor: '#fdb1b1' };
    } else {
      this.showValidation = false;
    }
  }

  getValue(): any {
    return this.cellValue;
  }

  isPopup() {
    return true;
  }

  refresh(params: any): boolean {
    return true;
  }

}

// Text Area

@Component({
  selector: 'app-gridtextarea-component',
  template: `
  <textarea [id]="id" class="gridTextareaClass" disabled>{{params.value.split(";  ").join(";\n\n").split("; ").join(";\n")}}</textarea>
  `,
  styles: []
})
export class GridTextAreaComponent implements ICellRendererAngularComp {
  public params: any;
  cellValue;
  public id: string;
  agInit(params: any): void {
    this.id = Math.random().toString();
    // setTimeout(() => { // this will make the execution after the above boolean has changed
    //   const a = document.getElementById(this.id);
    //   a.focus();
    // }, 0);
    this.params = params;
    this.cellValue = params.value;
  }
  getValue(): any {
    return this.cellValue;
  }
  setValue(): any {
    return this.cellValue;
  }
  public onClickHistory() {
    this.params.context.componentParent.methodFromParent(
      this.params.data.ctpLineItem, this.params.colDef.field, this.params.data.projectTitle
    );
  }
  isPopup() {
    return true;
  }

  refresh(params: any): boolean {
    return true;
  }
}


// detailDiscComponent

@Component({
  selector: 'app-detaildisc-component',
  template: `<div>
      <textarea class="gridTextareaClass" *ngIf="showTextArea" [(ngModel)]='cellValue'></textarea>
      <input [id]="id" type="text" class="gridTextBox" *ngIf="!showTextArea" [(ngModel)]='cellValue'/>
      </div>
  `,
  styles: []
})
export class DetailDiscComponent implements ICellRendererAngularComp {
  public params: any;
  public cellValue;
  public showTextArea;
  public id: string;

  agInit(params: any): void {
    // this.id = Math.random().toString();
    // setTimeout(() => { // this will make the execution after the above boolean has changed
    //   const a = document.getElementById(this.id);
    //   a.focus();
    // }, 0);
    this.params = params;
    this.cellValue = params.value;
    if (params.value.length > 100) {
      this.showTextArea = true;
    } else {
      this.showTextArea = false;
    }
  }

  getValue(): any {
    return this.cellValue;
  }
  setValue(): any {
    return this.cellValue;
  }
  public onClickHistory() {
    this.params.context.componentParent.methodFromParent(
      this.params.data.ctpLineItem, this.params.colDef.field, this.params.data.projectTitle
    );
  }
  isPopup() {
    if (this.showTextArea) {
      return true;
    } else {
      return false;
    }
  }

  refresh(params: any): boolean {
    return true;
  }
}


// Currency Component

@Component({
  selector: 'app-currency-editor',
  template: `
              <div>
              <input [id]="id" class="form-control numberfield-font"   [(ngModel)]='cellValue' (keypress)="isNumber($event)">
              </div>
            `,
  styles: []
})
export class CurrencyEditorComponent implements ICellEditorAngularComp {
  public params: any;
  public cellValue;
  public showTextArea;
  public id: string;

  agInit(params: any): void {
    this.params = params;
    this.cellValue = params.value;
    this.id = Math.random().toString();
    // enabled for tab functionality
    setTimeout(() => { // this will make the execution after the above boolean has changed
      const a = document.getElementById(this.id);
      a.focus();
    }, 0);
  }

  getValue(): any {
    return this.cellValue;
  }

  public onClickHistory() {
    this.params.context.componentParent.methodFromParent(
      this.params.data.ctpLineItem, this.params.colDef.field, this.params.data.projectTitle
    );
  }

  isNumber(evt: any) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57 || charCode === 101 || charCode === 46)) {
      return false;
    }
    return true;
  }

  isPopup() {
    return false;
  }

  refresh(params: any): boolean {
    return true;
  }

}
// Jquerydatepicker
export class DatePicker implements ICellEditorComp {
  // $j = jQuery.noConflict();
  eInput: HTMLInputElement;
  params;
  // gets called once before the renderer is used
  init(params: ICellEditorParams) {
    // create the cell
    this.params = params;
    this.eInput = document.createElement('input');
    // this.eInput.id = params.value;
    this.eInput.id = 'dateInputId';
    this.eInput.value =
      params.value !== null && params.value !== '' && params.value !== undefined ? moment(params.value).format('MM/DD/YYYY') : params.value;
    this.eInput.classList.add('ag-input');
    this.eInput.style.height = '100%';
    this.eInput.style.width = '100%';
    this.eInput.addEventListener('input', (event) => {
      console.log('***', event);
    });
    $(this.eInput).datepicker({
      dateFormat: 'mm/dd/yy',
      beforeShow: () => {
        $('#ui-datepicker-div').appendTo($('#selectedVacancies'));
      },
      onSelect: () => {
        this.eInput.focus();
        params.stopEditing();
      }
    });
  }


  // gets called once when grid ready to insert the element
  getGui() {
    this.eInput.focus();
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    $(this.eInput).datepicker({
      dateFormat: 'mm/dd/yy',
      beforeShow: () => {
        $('#ui-datepicker-div').appendTo($('#selectedVacancies'));
      },
      onSelect: () => {
        this.eInput.focus();
        // params.stopEditing();
      }
    });
    if (this.params.cellStartedEdit === true) {
      if (this.params.charPress !== null) {
        this.eInput.focus();
      }
      if (event.type === 'click') {
        $(this.eInput).focus();
        this.eInput.select();
      }
    }
  }

  // returns the new value after editing
  getValue() {
    if (this.params.value === null && this.eInput.value === '') {
      this.eInput.value = null;
      return null;
    } else if (this.params.value !== null &&
      this.eInput.value !== '' &&
      !moment(moment(this.eInput.value).format('MM/DD/YYYY'), 'MM/DD/YYYY', true).isValid()) {
      return '';
    } else if (this.params.value === null &&
      this.eInput.value !== null && this.eInput.value !== '' &&
      !moment(moment(this.eInput.value).format('MM/DD/YYYY'), 'MM/DD/YYYY', true).isValid()) {
      return '';
    } else {
      return this.eInput.value;
    }
  }

  // any cleanup we need to be done here
  destroy() {
    this.eInput.blur();
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}

// Jquerydatepicker for PopUps
export class PopUpDatePicker implements ICellEditorComp {
  // $j = jQuery.noConflict();
  eInput: HTMLInputElement;
  params;
  // gets called once before the renderer is used
  init(params: ICellEditorParams) {
    // create the cell
    this.params = params;
    this.eInput = document.createElement('input');
    // this.eInput.id = params.value;
    this.eInput.id = 'dateInputId';
    this.eInput.value =
      params.value !== null && params.value !== '' && params.value !== undefined ? moment(params.value).format('MM/DD/YYYY') : params.value;
    this.eInput.classList.add('ag-input');
    this.eInput.style.height = '100%';
    this.eInput.style.width = '100%';
    this.eInput.addEventListener('input', (event) => {
      console.log('***', event);
    });
    var topPosition = this.params.node.rowTop + 250;
    $(this.eInput).datepicker({
      dateFormat: 'mm/dd/yy',
      beforeShow: () => {
        $('#ui-datepicker-div').appendTo($('#selectedVacancies'));
        //$("#ui-datepicker-div").css({ "visibility": "hidden", "display": "none" });

        window.setTimeout(function() {           
          $("#ui-datepicker-div").css({ "position": "fixed", "top": topPosition});
          $("#ui-datepicker-div").css({ "visibility": "visible"});
      }, 10);
      },
      onSelect: () => {
        this.eInput.focus();
        params.stopEditing();
      }
    });
  }


  // gets called once when grid ready to insert the element
  getGui() {
    this.eInput.focus();
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    $(this.eInput).datepicker({
      dateFormat: 'mm/dd/yy',
      beforeShow: () => {
        $('#ui-datepicker-div').appendTo($('#selectedVacancies'));
      },
      onSelect: () => {
        this.eInput.focus();
        // params.stopEditing();
      }
    });
    if (this.params.cellStartedEdit === true) {
      if (this.params.charPress !== null) {
        this.eInput.focus();
      }
      if (event.type === 'click') {
        $(this.eInput).focus();
        this.eInput.select();
      }
    }
  }

  // returns the new value after editing
  getValue() {
    if (this.params.value === null && this.eInput.value === '') {
      this.eInput.value = null;
      return null;
    } else if (this.params.value !== null &&
      this.eInput.value !== '' &&
      !moment(moment(this.eInput.value).format('MM/DD/YYYY'), 'MM/DD/YYYY', true).isValid()) {
      return '';
    } else if (this.params.value === null &&
      this.eInput.value !== null && this.eInput.value !== '' &&
      !moment(moment(this.eInput.value).format('MM/DD/YYYY'), 'MM/DD/YYYY', true).isValid()) {
      return '';
    } else {
      return this.eInput.value;
    }
  }

  // any cleanup we need to be done here
  destroy() {
    this.eInput.blur();
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }
}
