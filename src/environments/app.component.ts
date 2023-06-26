import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { UserLoggedInService } from './shared/services/user-logged-in.service';

import { LicenseManager } from 'ag-grid-enterprise';
import { ToasterConfig } from 'angular2-toaster';
import { HumanCapitalService } from './shared/services/humanCapital.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'human capital';
  currentUser: any = null;

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  modalRef: BsModalRef;
  toasterConfig: ToasterConfig;
  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private authService: AuthService,
    public router: Router,
    private modalService: BsModalService,
    private userLoggedInService: UserLoggedInService,
   ) {
    // sets an idle timeout of 15 min.
    idle.setIdle(900);

    // sets a timeout period of 5 min. after 300 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(300);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.childModal.hide();
      this.idleState = 'Timed out!';
      this.timedOut = true;

      this.authService.jwt_logout();
      this.router.navigate(['/login']);
      if (this.modalService.getModalsCount() > 0) {
        for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
          this.modalService.hide(i);
        }
      }
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
      this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      const minutes: number = Math.floor(countdown / 60);
      const str = minutes + ' minutes ' + (countdown - minutes * 60);
      this.idleState = 'You will time out in ' + str + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.userLoggedInService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
     }
    });

    LicenseManager.setLicenseKey(
      // tslint:disable-next-line: max-line-length
      'CompanyName=SHI International Corp_on_behalf_of_U.S. Food and Drug Administration,LicensedApplication=TRLM NG,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=4,LicensedProductionInstancesCount=0,AssetReference=AG-011932,ExpiryDate=22_June_2022_[v2]_MTY1NTg1MjQwMDAwMA==540dacceb30141a292926bcea8e916d9'
    );

    this.toasterConfig = new ToasterConfig({
      showCloseButton: false,
      timeout: 4000,
      tapToDismiss: true
    });

    // this.reset();
  }

  reset() {
    this.idle.watch();
    // this.idleState = 'Started.';
    this.timedOut = false;
  }


  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  logout() {
    this.childModal.hide();
    this.userLoggedInService.setUserLoggedIn(false);
    this.authService.jwt_logout();
   // didn't work this code (so commented out)
   // this.currentUser = null;
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }
}
