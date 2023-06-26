import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-warning-unsaved-changes-dialog',
  templateUrl: './warning-unsaved-changes-dialog.component.html',
  styleUrls: ['./warning-unsaved-changes-dialog.component.css']
})
export class WarningUnsavedChangesDialogComponent implements OnInit {
  okSave: Subject<boolean> = new Subject<boolean>();
  onCancel: Subject<boolean> = new Subject<boolean>();
  public componentName: any;
  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit() {
  }
  onOknSavePendingChanges() {
    this.okSave.next(true);
    this.bsModalRef.hide();
  }

  close() {
    this.bsModalRef.hide();
    this.onCancel.next(true);
  }
}
