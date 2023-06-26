export class HeaderMenu {
  static getItems = [
    {
      title: 'Dashboard',
      link: '/dashboard',
      icon: 'fa-tachometer'
    },
    {
      title: 'Dashboard',
      link: '',
      icon: 'fa-laptop'
    },
    {
      title: 'Email',
      link: '',
      icon: 'fa-envelope'
    },
    {
      title: 'User',
      link: '/admin',
      icon: 'fa-user-circle'
    },
    {
      title: 'Search',
      link: '',
      icon: 'fa-search'
    }
  ];
}

export class HeaderMenuItems {
  getMenuItems = [
    {
      title: 'STAFFING PLAN',
      id: 'staffingPlan',
      icon: 'fa-money',
      link: '',
      isActive: false,
      subMenu: true,
      menu_items: [
        {
          label: 'Edit an Existing Staff Member/Vacancy - All Staff',
          icon: '',
          link: 'staffing-plan/edit-existingstaffmembers',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Edit an Existing Staff Member/Vacancy & Process Actions - One Staff',
          icon: '',
          link: 'staffing-plan/one-staff',
          isActive: false,
          submenu: []
        },
        {
          label: 'Process a Detail In',
          icon: '',
          link: 'staffing-plan/processadetail-In',
          isActive: false,
          submenu: []
        },
        {
          label: 'Create a Vacancy',
          icon: '',
          link: 'staffing-plan/create-vacancy',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Delete a Vacancy',
          icon: '',
          link: 'staffing-plan/delete-vacancy',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Associate Vacancies with EHCM Data',
          icon: '',
          link: 'staffing-plan/associate-vacancieswith-EHCMData',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Copy Over EHCM Data To Staffing Plan',
          icon: '',
          link: 'staffing-plan/copy-EHCMData-StaffingPlan',
          isActive: false,
          submenu: [
          ]
        }

      ]
    },
    {
      title: 'HIRING PLAN',
      icon: 'fa-money',
      id: 'hiringPlan',
      link: '',
      isActive: false,
      subMenu: true,
      menu_items: [
        {
          label: 'Push Vacancies to Hiring Plan',
          icon: '',
          link: 'hiring-plan/push-vacancies',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Hiring Mechanisms',
          icon: '',
          link: 'hiring-plan/hiring-mechanisms',
          isActive: false,
          submenu: []
        },
        {
          label: 'Selections',
          icon: '',
          link: 'hiring-plan/selections',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Classifications',
          icon: '',
          link: 'hiring-plan/classifications',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Associate Announcements with HREPS Data',
          icon: '',
          link: 'hiring-plan/associate-announcements-with-HREPS',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Copy over HREPS Data to Hiring Plan',
          icon: '',
          link: 'hiring-plan/copy-over-hreps-data-to-hiring-plan',
          isActive: false,
          submenu: [
          ]
        },
      ]

    },
    {
      title: 'Human CAPITAL REPORTS',
      id: 'hcReports',
      icon: 'fa-money',
      link: '',
      isActive: false,
      subMenu: true,
      menu_items: [
        {
          label: 'Staffing Plan Logs',
          icon: '',
          link: '',
          isActive: false,
          submenu: [
            {
              label: 'Recruitment and Logistics Log',
              icon: '',
              link: '/hc-reports/recruitment-logistics-log',
              isActive: false,
              subSubmenu: [],
              params: 'FY21'
            },
            {
              label: 'Departure Log',
              icon: '',
              link: '/hc-reports/departure-log',
              isActive: false,
              subSubmenu: [],
            },
            {
              label: 'Detail/Temporary Promotion Log',
              icon: '',
              link: '/hc-reports/detail-temporary-promotion-log',
              isActive: false,
              subSubmenu: [],
            },
          ]
        },
        {
          label: 'Capacity Report',
          icon: '',
          link: '/hc-reports/capacity-report',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Quarterly Hiring Plan',
          icon: '',
          link: '/hc-reports/quarterly-hiring-plan',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'FTE Totals Report',
          icon: '',
          link: '/hc-reports/fte-total-reports',
          isActive: false,
          submenu: [
          ]
        },
        {
          label: 'Attrition Report',
          icon: '',
          link: '/hc-reports/attrition-report',
          isActive: false,
          submenu: [
          ]
        }
      ]
    },
  ];
}
