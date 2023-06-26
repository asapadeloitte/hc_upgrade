/*tslint:disable:no-inferrable-types*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserLoggedInService } from 'src/app/shared/services/user-logged-in.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public busy: Subscription;
  public appTitle: string = 'Human Capital';
  public returnUrl: string;
  public currentUser: User;
  public currentYear = new Date().getFullYear().toString();
  public errorFlag = { flag: false, message: '' };
  showErrorFlag: boolean;
  public credentials = { username: '', password: '' };
  loginData: any;


  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userLoggedInService: UserLoggedInService,
  ) {

  }

  ngOnInit() {

    this.authService.clearStorage();
    $('#splash-dialog').modal({ backdrop: 'static', keyboard: false });
    $('#splash-dialog').modal('show');
  }


  login() {
    this.authService.jwt_login(this.credentials)
      .subscribe(
        data => {
          if (data) {
            this.loginData = data;
            localStorage.setItem('currentUser', JSON.stringify(this.loginData));
            localStorage.setItem('UserID', this.loginData.userId);
            localStorage.setItem('UserName', this.loginData.username);
            localStorage.setItem('headerAccess', this.loginData.headerAccess);
            this.errorFlag.flag = false;
            this.errorFlag.message = '';
            this.authService.publishChanges(data);
            this.userLoggedInService.setUserLoggedIn(true);
            this.authService.jwt_setAccessToken(data.accesstoken);
            this.authService.jwt_setRefreshToken(data.refreshtoken);
            this.authService.jwt_setRole(data.rolelist);
            this.proceedtoSpecificPage();
            this.authService.startRefreshTokenTimer();
          }
        }, err => {
          if (typeof err === 'string') {
            this.errorFlag.flag = true;
            this.errorFlag.message = err;
          } else {
            if (err.hasOwnProperty('error')) {
              this.errorFlag.flag = true;
              this.errorFlag.message = err.error.message;
            } else {
              this.errorFlag.flag = true;
              this.errorFlag.message = 'Something went wrong, please contact admin';
            }
          }
        });
  }

  // Based on the incoming request source (whether through URL or through email link )
  proceedtoSpecificPage() {
    const roleList = this.authService.jwt_getRole();
    this.route.queryParams.subscribe(
      (params) => {
        if (roleList === 'CTPHC_SRT_Analyst_User' || roleList === 'admin') {
          if (params.returnUrl) {
            this.returnUrl = params.returnUrl.toString().replace('&amp;', '&').replace('/', '');
            this.router.navigate(['hc-reports/detail-temporary-promotion-log'],
              {
                queryParams: {
                  year: 'currentYear',
                }
            });
          } else {
            this.router.navigate(['dashboard']);
          }
        } else if (roleList.includes('CTPHC_QHP_Analyst')) {
          this.router.navigate(['hc-reports/quarterly-hiring-plan']);
        } else if (roleList.includes('CTPHC_DepLog_User') ||
          roleList.includes('CTPHC_DepLog_DetLog_User') ||
          roleList.includes('CTPHC_DepLog_DetLog_RLLog_User') ||
          roleList.includes('CTPHC_DepLog_RLLog_User')) {
          this.router.navigate(['hc-reports/departure-log']);
        } else if (roleList.includes('CTPHC_DetLog_RLLog_User') ||
          roleList.includes('CTPHC_DetLog_User')) {
          this.router.navigate(['hc-reports/detail-temporary-promotion-log']);
        } else if (roleList.includes('CTPHC_RLLog_User')) {
          this.router.navigate(['hc-reports/recruitment-logistics-log']);
        } else {
          this.router.navigate(['hiring-plan/hiring-mechanisms']);
        }
      }
    );

  }

  proceedtoLandingPage() {

    $('#splash-dialog').modal('hide');
    this.login();

  }

  logout() {
    this.router.navigate(['logout']);
    this.authService.jwt_removeAccessToken();

  }

}


