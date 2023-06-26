import { Validators } from '@angular/forms';

export class CreateVacancyFormValues {
    static formControls = [
        {
            type: 'dropdown',
            name: 'vacancyStatus',
            label: 'Vacancy Status',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'vacancyStatus',
            options: [
            ]
        },
        {
            type: 'text',
            name: 'adminCode',
            label: 'Admin Code',
            value: null,
            required: true,
            disabled: true,
            validators: [Validators.required]
        },
        {
            type: 'dropdown',
            name: 'jobTitle',
            label: 'Job Title',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'jobTitle',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'series',
            label: 'Series',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'series',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'payPlan',
            label: 'Pay Plan',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'payPlan',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'grade',
            label: 'Grade',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'grade',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'jobCode',
            label: 'Job Code',
            value: null,
            required: false,
            smartListName: 'jobCode',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'bargainingUnit',
            label: 'Bargaining Unit',
            value: null,
            required: true,
            validators: [Validators.required],
            smartListName: 'bargainingUnit',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'managerLevel',
            label: 'Manager Level',
            value: null,
            required: false,
            smartListName: 'managerLevel',
            options: []
        },
        {
            type: 'dropdown',
            name: 'flsa',
            label: 'FLSA',
            value: null,
            required: false,
            smartListName: 'flsa',
            options: []
        },
        {
            type: 'dropdown',
            name: 'currentSupervisor',
            label: 'Current Supervisior',
            value: null,
            required: false,
            smartListName: 'currentSupervisor',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'fpl',
            label: 'FPL',
            value: null,
            required: false,
            smartListName: 'fpl',
            options: [
            ]
        },
        {
            type: 'dropdown',
            name: 'ethicsFilter',
            label: 'Ethics Filer',
            value: null,
            required: false,
            smartListName: 'ethicsFilter',
            options: [
            ]
        }
    ];
}
