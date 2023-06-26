import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-filter-dailog',
  templateUrl: './filter-dailog.component.html',
  styleUrls: ['./filter-dailog.component.scss']
})
export class FilterDailogComponent implements OnInit {
  public deleteState = false;

  @Input() closeBtnName: string;
  @Input() submitBtnName: string;
  @Input() title: string;
  @Input() gridView: string;
  @Input() stateSave: string;
  @Input() id: any;
  @Input() filterList: any;
  @Input() updatedfilterList: any;
  public busyTableSave: Subscription;
  public duplicateView: string;
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  onDelete() {
    this.duplicateView = null;
    this.deleteState = true;
  }

  onConfirmDelete() {
    this.delete.emit();
  }

  close() {
    this.bsModalRef.hide();
  }

  onfilternameChange() {
    this.duplicateView = null;
  }
  saveState() {
    this.duplicateView = null;
    if (this.gridView.replace(/\s/g, '').length) {
      if (this.gridView) {
        if (this.filterList) {
          const a = this.filterList.findIndex(e => e.filterName === this.gridView);
          let b = 0;
          if (this.updatedfilterList !== undefined) {
            b = this.filterList.findIndex(e => JSON.stringify(e.filterJson) === JSON.stringify(this.updatedfilterList));
          } else {
            b = 0;
          }
          if ((b > 0 || b === 0) && (a > 0 || a === 0)) {
            this.duplicateView = 'A View with this Name Already Exists';
          } else {
            this.save.emit(this.gridView);
          }
        } else {
          this.save.emit(this.gridView);

        }
      }
    }
  }
}
