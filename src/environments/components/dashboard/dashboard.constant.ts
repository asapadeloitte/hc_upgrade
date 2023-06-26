export class Menu {
    static getCards = [
        {
            title: 'Edit Existing Staff Member/Vacancy & Process Actions',
            route: '/staffing-plan/edit-existingstaffmembers',
            btn: 'Edit Existing Staff Member', btnColor: 'primary', icon: 'fa-pencil-square-o'
        },
        {
            title: 'Human Capital Reports',
            route: '/hc-reports/recruitment-logistics-log', btn: 'Recruitment and Logistics Log', btnColor: 'success',
            icon: 'fa-file-text-o'
        },
        {
            title: 'Hiring Plan',
            route: '/hiring-plan/hiring-mechanisms', btn: 'Hiring Mechanisms', btnColor: 'info', icon: ''
        }
    ];
}
