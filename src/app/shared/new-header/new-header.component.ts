import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AuthService } from '../../services/auth.service';
import { HeaderMenu, HeaderMenuItems } from './new-header.enum';

@Component({
  selector: 'app-new-header',
  templateUrl: './new-header.component.html',
  styleUrls: ['./new-header.component.scss']
})
export class NewHeaderComponent implements OnInit {

  public menu;
  public menuItems;
  public roleList;
  public labelsData;
  public showCreateLineItem = false;
  public enableDashboard = true;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const header: string = this.authService.jwt_headerAccess();
    this.roleList = this.authService.jwt_getRole();

    this.menu = HeaderMenu.getItems;
    const headerMenuItems = new HeaderMenuItems();
    this.menuItems = headerMenuItems.getMenuItems;
    this.labelsData = [...this.menuItems];



    if (this.roleList === 'CTPHC_DepLog_User' ||
      this.roleList === 'CTPHC_DepLog_DetLog_User' ||
      this.roleList === 'CTPHC_DepLog_DetLog_RLLog_User' ||
      this.roleList === 'CTPHC_DepLog_RLLog_User' ||
      this.roleList === 'CTPHC_DetLog_User' ||
      this.roleList === 'CTPHC_DetLog_RLLog_User' ||
      this.roleList === 'CTPHC_RLLog_User') {
      this.enableDashboard = false;
      this.menuItems = this.menuItems.filter(e => e.title !== 'STAFFING PLAN'
        && e.title !== 'HIRING PLAN');
      this.menuItems.forEach((element) => {
        if (element.title === 'Human CAPITAL REPORTS') {
          const temp = ['Capacity Report', 'FTE Totals Report', 'Attrition Report', 'Quarterly Hiring Plan'];
          temp.forEach(i => {
            const innerIndex = element.menu_items.findIndex(e => e.label === i);
            if (innerIndex >= 0) {
              element.menu_items.splice(innerIndex, 1);
            }
          });
          this.removeSubMenusBasedofRole(element);
        }
      });

    }
    if (this.roleList === 'CTPHC_SRT_Analyst_User') {
      this.labelsData.forEach(element => {
        if (element.title === 'STAFFING PLAN') {
          const index = element.menu_items.findIndex(e => e.label === 'Delete a Vacancy');
          if (index > 0) {
            element.menu_items.splice(index, 1);
          }
        }
      });
    }
    if (this.roleList.includes('Hiring_Office_Analyst')) {
      this.enableDashboard = false;
      this.menuItems = this.menuItems.filter(e => e.title !== 'STAFFING PLAN' && e.title !== 'Human CAPITAL REPORTS');
      this.menuItems.forEach((element) => {
        if (element.title === 'HIRING PLAN') {
          const temp = ['Push Vacancies to Hiring Plan', 'Associate Announcements with HREPS Data', 'Copy over HREPS Data to Hiring Plan'];
          temp.forEach(i => {
            const innerIndex = element.menu_items.findIndex(e => e.label === i);
            if (innerIndex >= 0) {
              element.menu_items.splice(innerIndex, 1);
            }
          });
        }
      });
    }
    // newly added
    if (this.roleList.includes('HOA_Analyst_QHP_Analyst')) {
      this.enableDashboard = false;
      this.menuItems = this.menuItems.filter(e => e.title !== 'STAFFING PLAN');
      this.menuItems.forEach((element) => {
        if (element.title === 'HIRING PLAN') {
          const temp = ['Push Vacancies to Hiring Plan', 'Associate Announcements with HREPS Data', 'Copy over HREPS Data to Hiring Plan'];
          temp.forEach(i => {
            const innerIndex = element.menu_items.findIndex(e => e.label === i);
            if (innerIndex >= 0) {
              element.menu_items.splice(innerIndex, 1);
            }
          });
        }
        if (element.title === 'Human CAPITAL REPORTS') {
          const temp = ['Staffing Plan Logs', 'Recruitment and Logistics Log',
            'Departure Log', 'Detail/Temporary Promotion Log', 'Capacity Report',
            'FTE Totals Report', 'Attrition Report'];
          temp.forEach(i => {
              const innerIndex = element.menu_items.findIndex(e => e.label === i);
              if (innerIndex >= 0) {
                element.menu_items.splice(innerIndex, 1);
              }
            });
        }
      });
    }
    if (this.roleList.includes('CTPHC_QHP_Analyst')) {
      this.enableDashboard = false;
      this.menuItems = this.menuItems.filter(e => e.title === 'Human CAPITAL REPORTS');
      this.menuItems.forEach((element) => {
        if (element.title === 'Human CAPITAL REPORTS') {
          const temp = ['Staffing Plan Logs', 'Capacity Report', 'FTE Totals Report', 'Attrition Report'];
          temp.forEach(i => {
            const innerIndex = element.menu_items.findIndex(e => e.label === i);
            if (innerIndex >= 0) {
              element.menu_items.splice(innerIndex, 1);
            }
          });
        }
      });
    } else {
      return this.menuItems;
    }
  }
  onClickLogout() {
    this.router.navigate(['logout']);
  }

  createLineItem() {
    this.router.navigate(['create-line-item']);
  }

  goToDashboard() {
    this.router.navigate(['dashboard']);
  }

  removeSubMenusBasedofRole(element) {
    if (this.roleList === 'CTPHC_DepLog_User') {
          const temp = ['Recruitment and Logistics Log',
            'Detail/Temporary Promotion Log'];
          temp.forEach(i => {
              element.menu_items.forEach(e1 => {
                  e1.submenu.forEach(e2 => {
                    const innerIndex = e1.submenu.findIndex(x => x.label === i);
                    if (innerIndex >= 0) {
                      e1.submenu.splice(innerIndex, 1);
                    }
                  });
              });
          });
    }


    if (this.roleList === 'CTPHC_DetLog_User') {
      const temp = ['Departure Log',
        'Recruitment and Logistics Log'];
      temp.forEach(i => {
          element.menu_items.forEach(e1 => {
              e1.submenu.forEach(e2 => {
                const innerIndex = e1.submenu.findIndex(x => x.label === i);
                if (innerIndex >= 0) {
                  e1.submenu.splice(innerIndex, 1);
                }
              });
          });
      });
    }

    if (this.roleList === 'CTPHC_RLLog_User') {
      const temp = ['Departure Log',
        'Detail/Temporary Promotion Log'];
      temp.forEach(i => {
          element.menu_items.forEach(e1 => {
              e1.submenu.forEach(e2 => {
                const innerIndex = e1.submenu.findIndex(x => x.label === i);
                if (innerIndex >= 0) {
                  e1.submenu.splice(innerIndex, 1);
                }
              });
          });
      });
    }

    if (this.roleList === 'CTPHC_DepLog_DetLog_User') {
      const temp = 'Recruitment and Logistics Log';
      element.menu_items.forEach(e1 => {
              e1.submenu.forEach(e2 => {
                const innerIndex = e1.submenu.findIndex(x => x.label === temp);
                if (innerIndex >= 0) {
                  e1.submenu.splice(innerIndex, 1);
                }
              });
          });
    }

    if (this.roleList === 'CTPHC_DepLog_RLLog_User') {
      const temp = 'Detail/Temporary Promotion Log';
      element.menu_items.forEach(e1 => {
              e1.submenu.forEach(e2 => {
                const innerIndex = e1.submenu.findIndex(x => x.label === temp);
                if (innerIndex >= 0) {
                  e1.submenu.splice(innerIndex, 1);
                }
              });
          });
    }

    if (this.roleList === 'CTPHC_DetLog_RLLog_User') {
      const temp = 'Departure Log';
      element.menu_items.forEach(e1 => {
              e1.submenu.forEach(e2 => {
                const innerIndex = e1.submenu.findIndex(x => x.label === temp);
                if (innerIndex >= 0) {
                  e1.submenu.splice(innerIndex, 1);
                }
              });
          });
    }
  }
}
