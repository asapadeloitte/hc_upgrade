import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.css']
})
export class ExportModalComponent implements OnInit {
  @Output() exportSubmit = new EventEmitter();
  exportOption: string;
  disableExportButton = true;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    setTimeout(() => {
      const exportOptionsInput = document.querySelector('[id="exportOptions"] input[role = "combobox"]');
      $(exportOptionsInput).attr('id', 'exportOptions');

    }, 500);
  }
  close() {
    this.bsModalRef.hide();
  }

  onexportOptionsChangeEvent(e) {
    this.exportOption = e;
    if (this.exportOption !== '') {
      this.disableExportButton = false;
    }
   }
  onExport() {
   this.exportSubmit.emit(this.exportOption);
  }

}
