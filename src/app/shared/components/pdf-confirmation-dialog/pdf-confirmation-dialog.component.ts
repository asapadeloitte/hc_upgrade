import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { HumanCapitalService } from '../../services/humanCapital.service';


@Component({
  selector: 'app-pdf-confirmation-dialog',
  templateUrl: './pdf-confirmation-dialog.component.html',
  styleUrls: ['./pdf-confirmation-dialog.component.scss']
})
export class PdfConfirmationDialogComponent implements OnInit {
  public downloadForm: FormGroup;
  public busyTableSave: Subscription;
  public disabledownloadButton = true;
  public officeName: string;
  public officeList = [];
  @Output() officeEvent = new EventEmitter();
  constructor(public bsModalRef: BsModalRef, public humanCapitalService: HumanCapitalService) { }
   loadOfficeData() {
    this.downloadForm = new FormGroup({
    office: new FormControl(),
     });
  }
  ngOnInit() {
    this.loadOfficeData();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.officeList = args.officeOrgLevelMapping;
      this.officeList.unshift({ office: 'All Offices', orgLevels: [] });
    });
  }
  public onOfficeChangeEvent(event: any) {
    this.officeName = this.downloadForm.controls.office.value;
    if (this.officeName === null) {
      this.disabledownloadButton = true;
    } else {
      this.disabledownloadButton = false;
    }
  }
  public onSubmit() {
    const selectedValue = this.downloadForm.controls.office.value;
    this.officeEvent.emit(selectedValue);
   }
    close() {
    this.bsModalRef.hide();
  }

}
