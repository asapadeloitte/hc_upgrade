import { Validators } from '@angular/forms';
import { ensureEndDateGreaterThanStartDateValidator, ensureStartDateLessThanEndDateValidator } from 'src/app/shared/components/date-input/ensure-end-date-greater-than-start-date.validator';

export class FormValues {
    static getTabs = [
        {
            title: 'Edit Staff/ Vacancy Information', content: 'Edit Staff/ Vacancy Information', active: true, key: 'tab1',
            formControls: [
                {
                    type: 'dropdown',
                    name: 'vacancyStatus',
                    label: 'Vacancy Status',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'vacancyStatus',
                    options: []
                },
                {
                    type: 'text',
                    name: 'employeeId',
                    label: 'Employee ID',
                    value: null,
                    required: false,
                    disabled: true,
                    group: 'Position and Staff Information'
                },
                {
                    type: 'text',
                    name: 'adminCode',
                    label: 'Admin Code',
                    value: null,
                    disabled: true,
                    required: false,
                    group: 'Position and Staff Information'
                },
                {
                    type: 'date',
                    name: 'ctpEod',
                    label: 'CTP EOD',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information'
                },
                {
                    type: 'dropdown',
                    name: 'staffMemberType',
                    label: 'Staff Member Type',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'staffMemberType',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'jobTitle',
                    label: 'Job Title',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'jobTitle',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'series',
                    label: 'Series',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'series',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'payPlan',
                    label: 'Pay Plan',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'payPlan',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'grade',
                    label: 'Grade',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'grade',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'jobCode',
                    label: 'Job Code',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'jobCode',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'step',
                    label: 'Step',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'step',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'fpl',
                    label: 'FPL',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'fpl',
                    options: []
                },
                {
                    type: 'date',
                    name: 'clpEligibilityDate',
                    label: 'CLP Eligibility Date',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information'
                },
                {
                    type: 'dropdown',
                    name: 'bargainingUnit',
                    label: 'Bargaining Unit',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'bargainingUnit',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'flsa',
                    label: 'FLSA',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'flsa',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'managerLevel',
                    label: 'Manager Level',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'managerLevel',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'hiringMechanism',
                    label: 'Hiring Mechanism',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'hiringMechanism',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'currentSupervisor',
                    label: 'Current Supervisor',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'currentSupervisor',
                    options: [
                    ]
                },
                {
                    type: 'text',
                    name: 'previousEmployer',
                    label: 'Previous Employer',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                },
                {
                    type: 'dropdown',
                    name: 'remoteEmployee',
                    label: 'Remote Employee',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'remoteEmployee',
                    options: [
                    ]
                },
                {
                    type: 'text',
                    name: 'remoteEmployeeLocation',
                    label: 'Remote Employee Location (City, State)',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information'
                },
                {
                    type: 'text',
                    name: 'locationId',
                    label: 'Location ID',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                },
                {
                    type: 'dropdown',
                    name: 'ethicsFilter',
                    label: 'Ethics Filer',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'ethicsFilter',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'acting',
                    label: 'Acting',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'acting',
                    options: []
                },
                {
                    type: 'date',
                    name: 'actingEffectiveDate',
                    label: 'Acting Effective',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information'
                },
                {
                    type: 'dropdown',
                    name: 'actingCtpStaffName',
                    label: 'Acting CTP Staff Name',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'actingCtpStaffName',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'veteran',
                    label: 'Veteran',
                    value: null,
                    required: false,
                    group: 'Position and Staff Information',
                    smartListName: 'veteran',
                    options: []
                },
                {
                    type: 'date',
                    name: 'departureDate',
                    label: 'Departure Date',
                    value: null,
                    required: false,
                    disabled: true,
                    group: 'Position and Staff Information'
                },
                {
                    type: 'date',
                    name: 'atmEffectiveDate',
                    label: 'ATM  Effective Date',
                    value: null,
                    required: false,
                    group: 'Incentive Information'
                },
                {
                    type: 'date',
                    name: 'csalEffectiveDate',
                    label: 'CSAL - Effective Date',
                    value: null,
                    required: false,
                    group: 'Incentive Information'
                },
                {
                    type: 'dropdown',
                    name: 'categoricalRetention',
                    label: 'Categorical Retention',
                    value: null,
                    required: false,
                    group: 'Incentive Information',
                    smartListName: 'categoricalRetention',
                    options: []
                },
                {
                    type: 'decimal',
                    name: 'crPercentage',
                    label: 'Categorical Retention - Percentage',
                    value: null,
                    required: false,
                    group: 'Incentive Information'
                },
                {
                    type: 'date',
                    name: 'crEffectiveDate',
                    label: 'Categorical Retention - Effective Date',
                    value: null,
                    required: false,
                    group: 'Incentive Information',
                },
                {
                    type: 'dropdown',
                    name: 'individualRetention',
                    label: 'Individual Retention',
                    value: null,
                    required: false,
                    group: 'Incentive Information',
                    smartListName: 'individualRetention',
                    options: []
                },
                {
                    type: 'decimal',
                    name: 'irPercentage',
                    label: 'Individual Retention - Percentage',
                    value: null,
                    required: false,
                    group: 'Incentive Information'
                },
                {
                    type: 'date',
                    name: 'irEffectiveDate',
                    label: 'Individual Retention - Effective Date',
                    value: null,
                    required: false,
                    group: 'Incentive Information'
                },
                {
                    type: 'date',
                    name: 'possibleEligibilityDate',
                    label: 'Possible Eligibility Date',
                    value: null,
                    required: false,
                    group: 'Incentive Information'
                },
                {
                    type: 'date',
                    name: 'rlEffectiveDate',
                    label: 'Effective Date',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information'
                },
                {
                    type: 'dropdown',
                    name: 'newHireToFda',
                    label: 'New Hire to FDA/Set up eARRIVE Completed',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information',
                    smartListName: 'newHireToFda',
                    options: []
                },
                {
                    type: 'text',
                    name: 'laptopRequestTicketNo',
                    label: 'Laptop Request Ticket #',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information'
                },
                {
                    type: 'number',
                    name: 'laptopSetupPropertyCodeNo',
                    label: 'Laptop setup - Property Code #',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information',
                },
                {
                    type: 'dropdown',
                    name: 'action',
                    label: 'Action',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information',
                    smartListName: 'action',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'previousFdaCenter',
                    label: 'Previous FDA Center',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information',
                    smartListName: 'previousFdaCenter',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'hcLiaison',
                    label: 'HC Liaison',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information',
                    smartListName: 'hcLiaison',
                    options: []
                },
                {
                    type: 'textarea',
                    name: 'comments',
                    label: 'Comments',
                    value: null,
                    required: false,
                    group: 'Recruitment & Logistics Information'
                },
            ]
        },
        {
            title: 'Process a Reassignment', content: 'Process a Reassignment', active: false, key: 'tab2',
            formControls: [
                {
                    type: 'dropdown',
                    name: 'jobTitle',
                    label: 'Job Title',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'jobTitle'
                },
                {
                    type: 'dropdown',
                    name: 'series',
                    label: 'Series',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'series'
                },
                {
                    type: 'dropdown',
                    name: 'payPlan',
                    label: 'Pay Plan',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'payPlan'
                },
                {
                    type: 'dropdown',
                    name: 'grade',
                    label: 'Grade',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'grade'
                },
                {
                    type: 'dropdown',
                    name: 'jobCode',
                    label: 'Job Code',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'jobCode'
                },
                {
                    type: 'dropdown',
                    name: 'step',
                    label: 'Step',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'step'
                },
                {
                    type: 'dropdown',
                    name: 'action',
                    label: 'Action',
                    value: '',
                    required: true,
                    group: 'Enter Information to Reassign Employee',
                    validators: [Validators.required],
                    smartListName: 'action',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'reassignmentOffice',
                    label: 'Reassignment Office',
                    value: '',
                    required: true,
                    group: 'Enter Information to Reassign Employee',
                    validators: [Validators.required],
                    smartListName: 'reassignmentOffice',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'reassignmentOrgLevel',
                    label: 'Reassignment Organizational Level',
                    value: '',
                    required: true,
                    group: 'Enter Information to Reassign Employee',
                    validators: [Validators.required],
                    smartListName: 'reassignmentOrgLevel',
                    options: []
                },
                {
                    type: 'date',
                    name: 'reassignmentEffectiveDate',
                    label: 'Effective Date',
                    value: '',
                    required: true,
                    validators: [Validators.required],
                    group: 'Enter Information to Reassign Employee'
                },
                {
                    type: 'dropdown',
                    name: 'vacancy',
                    label: 'Vacancy',
                    value: '',
                    required: true,
                    group: 'Enter Information to Reassign Employee',
                    validators: [Validators.required],
                    smartListName: 'displaySummary',
                    options: []
                },
                // adding new fields
                {
                    type: 'dropdown',
                    name: 'reassignmentjobTitle',
                    label: 'Reassignment Job Title',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'jobTitle'
                },
                {
                    type: 'dropdown',
                    name: 'reassignmentSeries',
                    label: 'Reassignment Series',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'series'
                },
                {
                    type: 'dropdown',
                    name: 'reassignmentpayPlan',
                    label: 'Reassignment Pay Plan',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'payPlan'
                },
                {
                    type: 'dropdown',
                    name: 'reassignmentGrade',
                    label: 'Reassignment Grade',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'grade'
                },
                {
                    type: 'dropdown',
                    name: 'reassignmentjobCode',
                    label: 'Reassignment Job Code',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'jobCode'
                },
                {
                    type: 'dropdown',
                    name: 'reassignmentStep',
                    label: 'Reassignment Step',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    disabled: true,
                    smartListName: 'step'
                },
                {
                    type: 'textarea',
                    name: 'reassignmentComments',
                    label: 'Reassignment Comments',
                    value: '',
                    required: false,
                    group: 'Enter Information to Reassign Employee',
                    validators: [Validators.required]
                },
            ]
        },
        {
            title: 'Process a Departure', content: 'Process a Departure', active: false, key: 'tab3',
            formControls: [
                {
                    type: 'dropdown',
                    name: 'jobTitle',
                    label: 'Job Title',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true,
                    smartListName: 'jobTitle'
                },
                {
                    type: 'dropdown',
                    name: 'series',
                    label: 'Series',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true,
                    smartListName: 'series'
                },
                {
                    type: 'dropdown',
                    name: 'payPlan',
                    label: 'Pay Plan',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true,
                    smartListName: 'payPlan'
                },
                {
                    type: 'dropdown',
                    name: 'grade',
                    label: 'Grade',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true,
                    smartListName: 'grade'
                },
                {
                    type: 'dropdown',
                    name: 'jobCode',
                    label: 'Job Code',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true,
                    smartListName: 'jobCode'
                },
                {
                    type: 'dropdown',
                    name: 'step',
                    label: 'Step',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true,
                    smartListName: 'step'
                },
                {
                    type: 'text',
                    name: 'currentSupervisor',
                    label: 'Current Supervisor',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true
                },
                {
                    type: 'text',
                    name: 'ctpEod',
                    label: 'Start Date',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true
                },
                {
                    type: 'dropdown',
                    name: 'bargainingUnit',
                    label: 'Bargaining Unit',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee',
                    disabled: true,
                    smartListName: 'bargainingUnit'
                },
                {
                    type: 'dropdown',
                    name: 'reasonForDeparting',
                    label: 'Reason for Departing',
                    value: '',
                    required: true,
                    group: 'Enter Information to Departure Employee',
                    validators: [Validators.required],
                    smartListName: 'reasonForDeparting',
                    options: []
                },
                {
                    type: 'date',
                    name: 'departureDate',
                    label: 'Departure Date',
                    value: '',
                    required: true,
                    group: 'Enter Information to Departure Employee',
                    validators: [Validators.required]
                },
                {
                    type: 'text',
                    name: 'futureEmployer',
                    label: 'Future Employer',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee'
                },
                {
                    type: 'textarea',
                    name: 'departureComments',
                    label: 'Departure Comments',
                    value: '',
                    required: false,
                    group: 'Enter Information to Departure Employee'
                }
            ]
        },
        {
            title: 'Process a Detail/Temporary Promotion', content: 'Process a Details/ Temporary Promotion', active: false, key: 'tab4',
            formControls: [
                {
                    type: 'dropdown',
                    name: 'jobTitle',
                    label: 'Job Title',
                    value: '',
                    required: false,
                    group: 'Detail/Temporary Promotion Information',
                    disabled: true,
                    smartListName: 'jobTitle'
                },
                {
                    type: 'dropdown',
                    name: 'series',
                    label: 'Series',
                    value: '',
                    required: false,
                    group: 'Detail/Temporary Promotion Information',
                    disabled: true,
                    smartListName: 'series'
                },
                {
                    type: 'dropdown',
                    name: 'payPlan',
                    label: 'Pay Plan',
                    value: '',
                    required: false,
                    group: 'Detail/Temporary Promotion Information',
                    disabled: true,
                    smartListName: 'payPlan'
                },
                {
                    type: 'dropdown',
                    name: 'grade',
                    label: 'Grade',
                    value: '',
                    required: false,
                    group: 'Detail/Temporary Promotion Information',
                    disabled: true,
                    smartListName: 'grade'
                },
                {
                    type: 'dropdown',
                    name: 'status',
                    label: 'Status',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required],
                    smartListName: 'status',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'detailType',
                    label: 'Detail Type',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required],
                    smartListName: 'detailType',
                    options: []
                },
                {
                    type: 'text',
                    name: 'homeOfficeSupervisorFullName',
                    label: 'CTP Home Supervisor Full Name',
                    value: '',
                    required: false,
                    disabled: true,
                    group: 'Detail/Temporary Promotion Information',
                },
                {
                    type: 'dropdown',
                    name: 'ctpDetailOffice',
                    label: 'CTP Detail Office',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required],
                    smartListName: 'ctpDetailOffice',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'ctpDetailOrgLevel',
                    label: 'CTP Detail Organizational Level',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required],
                    smartListName: 'ctpDetailOrgLevel',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'ctpDetailSupFullName',
                    label: 'CTP Detail Supervisor Full Name',
                    value: '',
                    required: false,
                    group: 'Detail/Temporary Promotion Information',
                    smartListName: 'ctpDetailSupFullName',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'ctpDetailJobTitle',
                    label: 'CTP Detail Job Title',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required],
                    smartListName: 'jobTitle',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'ctpDetailSeries',
                    label: 'CTP Detail Series or Equivalent',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required],
                    smartListName: 'series',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'ctpDetailPayPlan',
                    label: 'CTP Detail Pay Plan',
                    value: '',
                    required: true,
                    validators: [Validators.required],
                    group: 'Detail/Temporary Promotion Information',
                    smartListName: 'payPlan',
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'ctpDetailGrade',
                    label: 'CTP Detail Grade',
                    value: '',
                    required: true,
                    disabled: true,
                    group: 'Detail/Temporary Promotion Information',
                    smartListName: 'grade',
                    validators: [Validators.required],
                    options: []
                },
                {
                    type: 'dropdown',
                    name: 'detailBargainingUnit',
                    label: 'Detail Bargaining Unit',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required],
                    smartListName: 'bargainingUnit',
                    options: []
                },
                {
                    type: 'date',
                    name: 'detailEffectiveDate',
                    label: 'Detail - Effective Date',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required, ensureStartDateLessThanEndDateValidator('detailNteDate')],
                 },
                {
                    type: 'date',
                    name: 'detailNteDate',
                    label: 'Detail - NTE Date',
                    value: '',
                    required: true,
                    group: 'Detail/Temporary Promotion Information',
                    validators: [Validators.required, ensureEndDateGreaterThanStartDateValidator('detailEffectiveDate')],
                },
               {
                    type: 'textarea',
                    name: 'detailLogComments',
                    label: 'Detail Log Comments',
                    value: '',
                    required: false,
                    group: 'Detail/Temporary Promotion Information',
                },
            ]
        },
        {
            title: 'Change Fiscal Year', content: 'Change Fiscal Year', active: false, key: 'tab5',
            formControls: [
                {
                    type: 'text',
                    name: 'office',
                    label: 'Office',
                    value: '',
                    required: false,
                    group: 'Change Fiscal Year Information',
                    disabled: true,
                },
                {
                    type: 'text',
                    name: 'orgLevelAlias',
                    label: 'Organizational Level',
                    value: '',
                    required: false,
                    group: 'Change Fiscal Year Information',
                    disabled: true,
                },
                {
                    type: 'text',
                    name: 'year',
                    label: 'From Fiscal Year',
                    value: '',
                    required: false,
                    group: 'Change Fiscal Year Information',
                    disabled: true,
                },
                {
                    type: 'dropdown',
                    name: 'newYear',
                    label: 'To Fiscal Year',
                    value: '',
                    required: true,
                    group: 'Change Fiscal Year Information',
                    disabled: false,
                    validators: [Validators.required],

                }
            ]
        },
        {
            title: 'Change Org. Level', content: 'Change Org. Level', active: false, key: 'tab6',
            formControls: [
                {
                    type: 'text',
                    name: 'office',
                    label: 'Current Office',
                    value: '',
                    required: false,
                    group: 'Change Org. Level Information',
                    disabled: true,
                },
                {
                    type: 'text',
                    name: 'orgLevelAlias',
                    label: 'Current Organizational Level',
                    value: '',
                    required: false,
                    group: 'Change Org. Level Information',
                    disabled: true,
                },
                {
                    type: 'dropdown',
                    name: 'newOffice',
                    label: 'New Office',
                    value: '',
                    required: true,
                    group: 'Change Org. Level Information',
                    disabled: false,
                    validators: [Validators.required],

                },
                {
                    type: 'dropdown',
                    name: 'newOrgLevel',
                    label: 'New Organizational Level',
                    value: '',
                    required: true,
                    group: 'Change Org. Level Information',
                    disabled: false,
                    validators: [Validators.required],

                }]
        }
    ];

}

