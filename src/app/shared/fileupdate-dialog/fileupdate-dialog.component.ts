import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-fileupdate-dialog',
  templateUrl: './fileupdate-dialog.component.html',
  styleUrls: ['./fileupdate-dialog.component.scss']
})
export class FileupdateDialogComponent implements OnInit {

  @Input() closeBtnName: string;
  @Input() submitBtnName: string;
  @Input() title: string;
  @Input() fileName: string;
  @Input() fileExtension: string;
  public emptymessage: string;
  public errorDisplay = false;
  @Output() save: EventEmitter<any> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }
  onfileupdateChange() {
    this.errorDisplay = false;
  }
  saveFileUpdate() {
  if (this.fileName !== undefined && this.fileName !== null && this.fileName.trim() !== '') {
      this.errorDisplay = false;
      this.save.emit(this.fileName);
    } else {
    this.errorDisplay = true;
    this.emptymessage = 'please enter Valid File Name';
    }
  }
  close() {
    this.bsModalRef.hide();
  }

}
