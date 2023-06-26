import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-filedelete-dialog',
  templateUrl: './filedelete-dialog.component.html',
  styleUrls: ['./filedelete-dialog.component.scss']
})
export class FiledeleteDialogComponent implements OnInit {
  @Input() closeBtnName: string;
  @Input() submitBtnName: string;
  @Input() title: string;
  @Input() fileName: string;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }
  close() {
    this.bsModalRef.hide();
  }
  onConfirmDelete() {
    this.delete.emit();
  }

}
