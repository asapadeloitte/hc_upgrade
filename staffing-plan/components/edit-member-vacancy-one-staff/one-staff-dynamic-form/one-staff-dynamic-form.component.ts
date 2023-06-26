import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-one-staff-dynamic-form',
  templateUrl: './one-staff-dynamic-form.component.html',
  styleUrls: ['./one-staff-dynamic-form.component.scss']
})
export class OneStaffDynamicFormComponent implements OnInit {

  @Input() selectedTab: any[] = [];
  @Input() fields: any[];
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
