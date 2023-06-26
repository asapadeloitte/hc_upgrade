/*
@author : Deloitte
this is Component for creating user
*/
import {
  Component, EventEmitter,
  OnInit, Output, ViewEncapsulation, Input, SimpleChanges, ChangeDetectorRef, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../shared/models/user.model';
import { AdminService } from '../../../../shared/services/admin.service';
import { ToasterModule, ToasterService, ToasterConfig, Toast } from 'angular2-toaster';
import * as _ from 'lodash';
import { HttpResponse } from '@angular/common/http';

declare var jQuery: any;

@Component({
  selector: 'app-update-user-popup',
  templateUrl: './update-user-popup.template.html',
  styleUrls: ['./update-user-popup.styles.scss'],
})

export class UpdateUserPopupComponent implements OnInit, OnChanges {

  router: Router;
  showErrorFlag: boolean;
  user = new User();

  @Output() reloadUsers = new EventEmitter<boolean>();
  @Output() userUpdated = new EventEmitter<boolean>();
  @Input() userObj = new User();

  selectedNativeUser: string;
  userNativeGroups = [];


  ngOnInit(): void {
    this.showErrorFlag = false;
    this.getUserGroups();

  }

  constructor(
    router: Router,
    private _adminService: AdminService,
    private toaster: ToasterService,
    private cd: ChangeDetectorRef) {
    this.router = router;
    this.showErrorFlag = false;
  }


  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === 'userObj') {
        const chg = changes[propName];
        if (chg.currentValue) {
          this.user = chg.currentValue;
          this.user.userId = chg.currentValue.userId;
          this.user.firstName = chg.currentValue.firstName;
          this.user.lastName = chg.currentValue.lastName;
          this.user.email = chg.currentValue.email;
          this.user.emailAddress = chg.currentValue.emailAddress;
          this.user.nativeUser = chg.currentValue.nativeUser[0];
          this.selectedNativeUser = this.user.nativeUser.toString();
        }
      }
    }
  }

  updateUser(user: User) {

    user.nativeUser = [];
    user.nativeUser.push(this.selectedNativeUser);

    this._adminService.updateUser(user).subscribe((response: HttpResponse<any>) => {
      if (response.status === 200) {
        this.userUpdated.emit(true);
        this.reloadUsers.emit(true);
        this.reset();
      }
    }, error => {
      if (error) {
        if (error.indexOf('USER_EMAIL_UK') > -1) {
          error = 'User already exists';
        }
        this.showErrorFlag = true;
      }
    });

  }


  getUserGroups() {
    this._adminService.getUserGroups().subscribe(data => {
      if (data) {
        data = _.orderBy(data, ['nativeDescription'], ['asc']);

        for (const desc of data) {
          this.userNativeGroups.push(desc.nativeDescription);
        }
      }
    }, error => {
      if (error) {
        this.userNativeGroups = [];
      }
    });

  }

  reset() {

    jQuery('#update-user').modal('hide');
    this.showErrorFlag = false;

  }

  trackChanges($event) {

    this.user.nativeUser = [];
    this.user.nativeUser.push($event);
    this.selectedNativeUser = this.user.nativeUser[0];

  }



}
