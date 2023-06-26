import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation, ElementRef, Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { Subscription } from 'rxjs';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';

import { User } from '../../../../shared/models/user.model';
import { AdminService } from '../../../../shared/services/admin.service';
import { accessibilityFix, columnVisibleAccessbility } from 'src/app/shared/utilities';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
  WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { AuthService } from 'src/app/shared/services/auth.service';
declare var jQuery: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.template.html',
  styleUrls: ['./admin-dashboard.styles.scss'],
  providers: [AdminService],
  encapsulation: ViewEncapsulation.None
})

export class AdminDashboardComponent extends BasePageComponent implements OnInit, OnDestroy {

  @ComponentForm(true)
  public mappingForm: FormGroup;

  router: Router;
  userData: any[];
  totalUserCount: number;
  usersId: number;
  userObj: User;
  editedData: boolean;
  public itAdmin = false;
  public roles = null;

  public colDefs = [];
  userSubscription: Subscription;
  public gridOptions: GridOptions;

  dropdownData = [];
  public activeId =  1;
  public securityTab: any;
  public fieldMappingTab: any;


  constructor(
    private _adminService: AdminService, router: Router,
    public fb: FormBuilder,
    authService: AuthService,
    humanCapitalService: HumanCapitalService,
    public toaster: ToasterService,

    modalService: BsModalService,
    el: ElementRef) {
    super(authService, toaster, humanCapitalService, modalService, el);
    this.router = router;
    this.gridOptions = {
      context: {
        componentParent: this
      },
      rowHeight: 40,
      defaultColDef: {
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      }, frameworkComponents: {
        deleteUserRenderer: DeleteUserCellRendererComponent,
      },
      onColumnVisible: (params) => {
        columnVisibleAccessbility(params, this.el);
      },

    } as GridOptions;

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  //  params.api.sizeColumnsToFit();
  }

  ngOnInit() {
    this.roles = this.authService.jwt_getRole();
    if (this.roles === 'IT_Admin') {
      this.itAdmin = true;
    }
    this.loadUsers();
    this.getColDef();
    accessibilityFix(this.el);
    this.mappingForm = this.fb.group({});
  }

  test() {

  }

  getColDef() {
    this.colDefs = [
      {
        headerName: 'First Name',
        field: 'firstName',
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
      },
      {
        headerName: 'User Name',
        field: 'email',
      },
      {
        headerName: 'Email',
        field: 'emailAddress',
      },
      {
        headerName: 'Roles',
        field: 'nativeUser',
      },
      {
        headerName: 'Actions',
        cellRenderer: 'deleteUserRenderer',
        cellRendererParams: {
          onClick: this.updateordeleteUser.bind(this),
        }

      }

    ];
  }


  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadUsers() {
    this.userSubscription = this._adminService.getUsers().subscribe(data => {
      if (data) {
        this.userData = data;
        this.totalUserCount = this.userData.length;
        accessibilityFix(this.el);
      }
    });
  }

  reloadUsers(reload: boolean) {
    if (reload) {
      this.loadUsers();
    }
  }


  formUpdated(event: boolean) {
    if (event) {
      this.mappingForm.markAsDirty();
      this.editedData = true;
    } else {
      this.mappingForm.markAsPristine();
      this.editedData = false;
    }

  }

  userUpdated(event: boolean) {
    if (event) { this.toaster.pop('success', 'User updated', 'User Updated Successfully'); }
  }

  userCreated(event: boolean) {
    if (event) { this.toaster.pop('success', 'User created', 'User Created Successfully'); }
  }

  userDeleted(event: boolean) {
    if (event) {
      this.toaster.pop('success', 'User Deleted', 'User Deleted Successfully');
    }
  }

  updateordeleteUser(obj: any) {
    if (typeof obj === 'object') {
      this.userObj = obj;
    } else { this.usersId = obj; }
  }

  onSelectionChanged(e) {
  }

  tabChanged(evt: any) {
    if (this.editedData) {
      evt.preventDefault();
      this.activeId = 2;
      this.bsModalRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
      this.bsModalRef.content.okSave.subscribe((response) => {
      this.mappingForm.markAsPristine();
      this.editedData = false;
      this.activeId = 1;
      });
      this.bsModalRef.content.onCancel.subscribe((response) => {
      });
    }
  }

}
