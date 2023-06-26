import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { AdminService } from 'src/app/shared/services/admin.service';

declare var jQuery: any;

@Component({
  selector: 'app-batchjobbutton-cell-renderer',
  template: `
   <div class="row-action-buttons">
      <button
      type="button" class="btn btnSecondaryGrid" title="Execute Manually"
      data-backdrop="static" (click)="onButtonClick($event)" data-keyboard="false" style="white-space: nowrap;">
      <i class="fa fa-save"></i><span class="label-sr-only d-none">edit</span> </button>&nbsp;
     </div>
   `,
  styles: [],
  providers: [AdminService]

})
  export class BatchCellRendererComponent implements ICellRendererAngularComp {

  public params: any;
  constructor(private _adminService: AdminService) {

  }

    agInit(params: any): void {
       this.params = params;
    }

  onButtonClick($event) {

    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data.id
        };
      this.params.onClick(params.rowData);
}
  }

refresh(): boolean {
    return false;
  }
}
