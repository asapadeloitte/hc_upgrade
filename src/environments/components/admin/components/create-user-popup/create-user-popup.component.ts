/*
@author : Deloitte
this is Component for creating user
*/
import {
  Component, EventEmitter, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../shared/models/user.model';
import { AdminService } from '../../../../shared/services/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { HttpResponse } from '@angular/common/http';


declare var jQuery: any;

@Component({
  selector: 'app-create-user-popup',
  templateUrl: './create-user-popup.template.html',
  styleUrls: ['./create-user-popup.styles.scss'],
  encapsulation: ViewEncapsulation.None
})


export class CreateUserPopupComponent implements OnInit {

  public createUserForm: FormGroup;

  router: Router;
  isUpdate = false;
  showErrorFlag: boolean;
  user = new User();
  selectedNativeUser: string;
  @Output() reloadUsers = new EventEmitter<boolean>();
  @Output() userCreated = new EventEmitter<boolean>();
  @Output() userUpdated = new EventEmitter<boolean>();

  userNativeGroups = [];

  ngOnInit(): void {
    this.getUserGroups();
  }

  constructor(
    router: Router,
    private _adminService: AdminService) {
    this.router = router;
    this.showErrorFlag = false;
  }

  trackChanges($event) {
    this.user.nativeUser = [];
    this.user.nativeUser.push($event);
  }
  createUser(user: User) {

    const role = user.nativeUser.toString();
    user.nativeUser = [];
    user.nativeUser.push(role);

    this._adminService.createUser(user).subscribe((response: HttpResponse<any>) => {
      if (response.status === 201) {
        jQuery('#create-user').modal('hide');
        this.reset();
        this.reloadUsers.emit(true);
        this.userCreated.emit(true);
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
          /*this.userNativeGroups.push({ smartListValue: desc.nativeDescription });*/
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
    jQuery('#create-user').modal('hide');
    jQuery('#create-user').find('input').val('');
    this.user.nativeUser = null;
    this.showErrorFlag = false;
  }

}

