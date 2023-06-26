import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { AdminService } from './../../services/admin.service';


declare var jQuery: any;

@Component({
  selector: 'deleteuser-cell-renderer',
  template: `
   <div class="row-action-buttons" *ngIf ="!noIcon">
      <button *ngIf="params.data && !onlyDelete"
      type="button" class="btn btnSecondaryGrid" data-toggle="modal" data-target="#update-user" focusOn="#create-popup"
      data-backdrop="static" (click)="onEditClick($event)" data-keyboard="false" style="white-space: nowrap;">
      <i class="fa fa-edit"></i><span class="label-sr-only d-none">edit</span> </button>&nbsp;
     <button  *ngIf="params.data"
     type="button" class="btn btnDangerGrid ml-2" data-toggle="modal" data-target="#delete-popup" focusOn="#delete-popup"
      data-backdrop="static" (click)="onDeleteClick($event)" data-keyboard="false" style="white-space: nowrap;">
      <i class="fa fa-trash"></i><span class="label-sr-only d-none">Delete</span> </button>
  </div>
   `,
  styles: [],
  providers: [AdminService]

})
export class DeleteUserCellRendererComponent implements ICellRendererAngularComp {

  public params: any;
  public screenName;
  onlyDelete: boolean;
  noIcon: boolean;
  constructor(private _adminService: AdminService) {

  }

  agInit(params: any): void {
    this.params = params;
    this.screenName = params.screenName;
    if (this.screenName === 'fieldMapping' ||
      this.screenName === 'hiringMechanism' ||
      this.screenName === 'classification' ||
      this.screenName === 'editVacancies' ||
      this.screenName === 'departureLog' ||
      this.screenName === 'recruitmentLogisticsLog' ||
      this.screenName === 'promotionLog' ||
      this.screenName === 'FTE Reports' ||
      this.screenName === 'Selection' ||
      this.screenName === 'QHPVacancy') {
      // added for only selection screen no delete and edit for based on cancelled param
      if (this.screenName === 'Selection') {
        if (params.data.cancelled === true) {
          this.noIcon = true;
        }
      }
      //
      this.onlyDelete = true;
    } else {
      this.onlyDelete = false;
    }
  }

  onDeleteClick($event) {

    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      };
      if (this.screenName === 'fieldMapping' ||
        this.screenName === 'classification' ||
        this.screenName === 'departureLog' ||
        this.screenName === 'recruitmentLogisticsLog' ||
        this.screenName === 'promotionLog' ||
        this.screenName === 'FTE Reports' ||
        this.screenName === 'QHPVacancy') {
        this.params.onClick(params.rowData.id);
       } else if (this.screenName === 'editVacancies' || this.screenName === 'Selection') {
        this.params.onClick(params.rowData);
      } else if (this.screenName === 'hiringMechanism') {
        this.params.onClick(params.rowData.announcementId);
      } else {
        this.params.onClick(params.rowData.userId);
      }
    }
  }

  onEditClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
      };
      this.params.onClick(params.rowData);
    }
  }


  refresh(): boolean {
    return false;
  }
}
