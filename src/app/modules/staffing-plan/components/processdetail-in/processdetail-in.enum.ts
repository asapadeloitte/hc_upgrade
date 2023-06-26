import { Validators } from '@angular/forms';
import { ensureEndDateGreaterThanStartDateValidator, ensureStartDateLessThanEndDateValidator } from 'src/app/shared/components/date-input/ensure-end-date-greater-than-start-date.validator';

export class FormValues {
    static formControls = [
        {
            type: 'dropdown',
            name: 'status',
            label: 'Status',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'status',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'detailType',
            label: 'Detail Type',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'detailType',
            options: [
            ]
        },
        {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            value: null,
            required: true,
            validators: [Validators.required]
        },
        {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            value: null,
            required: true,
            validators: [Validators.required]
        },
        {
            type: 'text',
            name: 'middleInitial',
            label: 'Middle Initial',
            value: null,
            required: false
        },
        {
            type: 'text',
            name: 'nonCtpHomeOfficeCenter',
            label: 'Non-CTP Home Office/Center',
            value: null,
            required: true,
            validators: [Validators.required]
        },
        {
            type: 'text',
            name: 'nonCtpHomeOrgLevel',
            label: 'Non-CTP Home Organizational Level',
            value: null,
            required: false,
        },
        {
            type: 'text',
            name: 'nonCtpHomeOfficeSupFullName',
            label: 'Non-CTP Home Office/Center Supervisor Full Name',
            value: null,
            required: false,
        },
        {
            type: 'dropdown',
            name: 'ctpDetailOffice',
            label: 'CTP Detail Office',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'ctpDetailOffice',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'ctpDetailOrgLevel',
            label: 'CTP Detail Organizational Level',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'ctpDetailOrgLevel',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'ctpDetailSupFullName',
            label: 'CTP Detail Supervisor Full Name',
            value: null,
            required: false,
            smartListName: 'ctpDetailSupFullName',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'ctpDetailJobTitle',
            label: 'CTP Detail Job Title',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'jobTitle',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'ctpDetailSeries',
            label: 'CTP Detail Series or Equivalent',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'series',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'ctpDetailPayPlan',
            label: 'CTP Detail Pay Plan',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'payPlan',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'ctpDetailGrade',
            label: 'CTP Detail Grade',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'grade',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'bargainingUnit',
            label: 'Detail Bargaining Unit',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'bargainingUnit',
            options: [
            ]
        },
        {
            type: 'date',
            name: 'detailEffectiveDate',
            label: 'Detail - Effective Date',
            value: null,
            required: true,
            validators: [Validators.required, ensureStartDateLessThanEndDateValidator('detailNteDate')],
          },
        {
            type: 'date',
            name: 'detailNteDate',
            label: 'Detail - NTE Date',
            value: null,
            required: true,
            validators: [Validators.required, ensureEndDateGreaterThanStartDateValidator('detailEffectiveDate')],
           },
       {
            type: 'textarea',
            name: 'detailLogComments',
            label: 'Detail Log Comments',
            value: null,
            required: false
        },
       ];

}
