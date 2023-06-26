import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, NgModel } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Classfication } from 'src/app/shared/models/hiring-plan.model';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-classification',
  templateUrl: './create-classification.component.html',
  styleUrls: ['./create-classification.component.scss']
})
export class CreateClassificationComponent implements OnInit {
  @Input() office: string;
  @Input() year: string;
  public busyTableSave: Subscription;
  @Input() orgLevelsBasedonOffice: any;
  public selectedOrgLevel;
  public createClassficationForm: FormGroup;
  public disablesubmitButton = true;
  public classifications: Classfication[] = [];
  public errorDetails: any = [];
  @Output() reloadClassificationOnSave = new EventEmitter<boolean>();
  constructor(
    private humanCapitalService: HumanCapitalService,
    public toaster: ToasterService) {
  }
  ngOnInit() {
    this.loadAddClassificationData();
    if (this.selectedOrgLevel === undefined || this.selectedOrgLevel === null) {
      this.selectedOrgLevel = null;
      this.disablesubmitButton = true;
    }
  }

  loadAddClassificationData() {
    this.createClassficationForm = new FormGroup({
      year: new FormControl(Validators.required),
      office: new FormControl(Validators.required),
      orgLevel: new FormControl(null, Validators.required),
    });
  }
  onOrgLevelSelection(event: any) {
    this.selectedOrgLevel = this.createClassficationForm.controls.orgLevel.value;
    if (this.selectedOrgLevel === null) {
      this.disablesubmitButton = true;
    } else {
      this.disablesubmitButton = false;
    }
  }

  // to add new classfication
  createClassfication() {
    const classification = new Classfication();
    classification.orgLevel = this.selectedOrgLevel;
    classification.year = this.year;
    classification.office = this.office;
    this.classifications.push(classification);
    this.busyTableSave = this.humanCapitalService.addClassifications(this.year, this.classifications).subscribe(data => {
      this.toaster.pop('success', 'Saved', 'Successfully saved the classification');
      this.reloadClassificationOnSave.emit(true);
      this.reset();
    }, error => {
      error.error.errorDetails.forEach(element => {
        this.errorDetails.push(element.message);
      });
      this.toaster.pop('error', 'Failed', this.errorDetails);
    });
  }
  reset() {
    this.classifications = [];
    this.selectedOrgLevel = this.createClassficationForm.controls.orgLevel.setValue(null);
    this.disablesubmitButton = true;
    }
}
