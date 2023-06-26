import { Component, OnInit } from '@angular/core';
import { Menu } from './dashboard.constant';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { HumanCapitalService } from 'src/app/shared/services/humanCapital.service';
import { ReloadEvent } from 'src/app/shared/events/reloadEvent';
import * as htmlToImage from 'html-to-image';
import * as download from 'downloadjs';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';
import { changeYearDropDownVales } from 'src/app/shared/grid-utilities';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashBoardSearchForm: FormGroup;
  public busyTableSave: Subscription;
  public cards = [];
  public yearsList = [];
  public showStaffingSummary = false;
  public staffingSummaryData = [];
  public hiringStatus = {};
  public year: string;
  constructor(
    private humanCapitalService: HumanCapitalService,
    private fb: FormBuilder,
    private _smartListService: SmartListConversionService,
    private reloadevent: ReloadEvent) { }

  ngOnInit() {
    this.cards = Menu.getCards;
    // this.loadSearchForm();
    this.loadBusyTable();
  }
  public loadSearchForm() {
    this.dashBoardSearchForm = this.fb.group({
      year: new FormControl(null, Validators.required),
    });
  }
  public loadBusyTable() {
    this.busyTableSave = this.humanCapitalService.getDropdownValues().subscribe(args => {
      this.yearsList = args.years;
      this.yearsList = changeYearDropDownVales(this.yearsList);
      this.humanCapitalService.getSmartList().subscribe(smartLists => {
        this._smartListService.setDDVals(smartLists);
      });
    });
    this.loadSearchForm();
  }
  public onYearChangeEvent(event: any) {
  }

  onGoClick() {
    this.year = this.dashBoardSearchForm.controls.year.value;
    this.busyTableSave = this.humanCapitalService.getDashBoardData(this.year).subscribe(args => {
      this.staffingSummaryData = args.staffSummary;
      this.hiringStatus = args.hiringStatus;
      this.reloadevent.onGo(args);
      this.showStaffingSummary = true;
    });
  }
  generateImage() {
    htmlToImage.toPng(document.getElementById('image-section'))
      // tslint:disable-next-line: only-arrow-functions
      .then(function(dataUrl) {
        download(dataUrl, 'hiring-information.png');
      });
  }

}
