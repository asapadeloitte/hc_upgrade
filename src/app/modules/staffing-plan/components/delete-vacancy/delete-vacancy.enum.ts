import { Validators } from '@angular/forms';

export class DeleteVacancyFormValues {
    static formControls = [
        {
            type: 'dropdown',
            name: 'vacancyStatus',
            label: 'Vacancy Status',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'vacancyStatus'
        },
        {
            type: 'text',
            name: 'adminCode',
            label: 'Admin Code',
            value: null,
            required: false,
            disabled: true
        },
        {
            type: 'dropdown',
            name: 'jobTitle',
            label: 'Job Title',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'jobTitle'
        },
        {
            type: 'dropdown',
            name: 'series',
            label: 'Series',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'series'
        },
        {
            type: 'dropdown',
            name: 'payPlan',
            label: 'Pay Plan',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'payPlan'
        },
        {
            type: 'dropdown',
            name: 'grade',
            label: 'Grade',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'grade'
        },
        {
            type: 'dropdown',
            name: 'jobCode',
            label: 'Job Code',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'jobCode'
        },
        {
            type: 'dropdown',
            name: 'bargainingUnit',
            label: 'Bargaining Unit',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'bargainingUnit'
        },
        {
            type: 'dropdown',
            name: 'managerLevel',
            label: 'Manager Level',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'managerLevel'
        },
        {
            type: 'dropdown',
            name: 'flsa',
            label: 'FLSA',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'flsa'
        },
        {
            type: 'text',
            name: 'currentSupervisior',
            label: 'Current Supervisior',
            value: null,
            required: false,
            disabled: true
        },
        {
            type: 'dropdown',
            name: 'fpl',
            label: 'FPL',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'fpl'
        },
        {
            type: 'dropdown',
            name: 'ethicsFilter',
            label: 'Ethics Filer',
            value: null,
            required: false,
            disabled: true,
            smartListName: 'ethicsFilter'
        }
    ];
}
