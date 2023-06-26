import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { Vacancy } from 'src/app/shared/models/reports.model';

@Component({
  selector: 'app-add-vacancy',
  templateUrl: './add-vacancy.component.html',
  styleUrls: ['./add-vacancy.component.scss']
})
export class AddVacancyComponent implements OnInit {
  public addVacancyForm: FormGroup;
  @Input() office;
  public busyTableSave: Subscription;
  public quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  public quarterSelectedValue;
  public grade;
  public numberofVacanices;
  public vacanciesData = {};
  public yearsList = [];
  public year: any;
  public errorDetails: any = [];
  public disabledSubmit = false;
  @Output() reloadVacancyOnSave = new EventEmitter<boolean>();
  constructor(
    private humanCapitalService: HumanCapitalService,
    public toaster: ToasterService,
    private smartListService: SmartListConversionService,
    private bsModalRef: BsModalRef) {
  }
  ngOnInit() {
    this.loadAddVacancyData();
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
    });
  }

  onVacancyGradeSelection(event: any) {
    this.grade = this.addVacancyForm.controls.grade.value;
  }
  loadAddVacancyData() {
    this.addVacancyForm = new FormGroup({
      office: new FormControl(Validators.required),
      year: new FormControl(null, Validators.required),
      quarter: new FormControl(null, Validators.required),
      grade: new FormControl(null, Validators.required),
      noOfVacancies: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
      comments: new FormControl(),
    });
    const smartListValues = this.smartListService.getDDVals();
    smartListValues.forEach(element => {
      if (element.smartListName === 'vacancyGrade') {
        this.grade = element.smartListValues;
      }
    });
  }
  // to add vacancy
  AddVacancy(e) {
    const addVacancy = new Vacancy();
    addVacancy.office = this.office;
    addVacancy.year = this.addVacancyForm.controls.year.value;
    addVacancy.quarter = this.addVacancyForm.controls.quarter.value;
    addVacancy.noOfVacancies = this.addVacancyForm.controls.noOfVacancies.value;
    addVacancy.comments = this.addVacancyForm.controls.comments.value;
    addVacancy.vacancyGrade = this.addVacancyForm.controls.grade.value.value;
    this.vacanciesData = {
      office: this.office,
      year: addVacancy.year,
      quarter: addVacancy.quarter,
      vacancyGrade: addVacancy.vacancyGrade,
      nbrOfVacancies: addVacancy.noOfVacancies,
      comments: addVacancy.comments
    };
    this.busyTableSave = this.humanCapitalService.addVacancies(this.vacanciesData).subscribe(data => {
      this.disabledSubmit = true;
      this.toaster.pop('success', 'Saved', 'Successfully saved the Vacancies');
      this.reloadVacancyOnSave.emit(true);
      this.reset();
    }, error => {
      error.error.errorDetails.forEach(element => {
        this.errorDetails.push(element.message);
      });
      this.toaster.pop('error', 'Failed', this.errorDetails);
    });
  }
  reset() {
    this.vacanciesData = {};
  }
  close() {
    this.bsModalRef.hide();
  }
}

