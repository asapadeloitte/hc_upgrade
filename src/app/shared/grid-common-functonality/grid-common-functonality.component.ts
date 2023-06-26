import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-grid-common-functonality',
  templateUrl: './grid-common-functonality.component.html',
  styleUrls: ['./grid-common-functonality.component.scss']
})
export class GridCommonFunctonalityComponent implements OnInit {
  @Input() gridApi;
  @Input() form: FormGroup;
  constructor() { }

  ngOnInit() {
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.form.controls.search.value);
  }

}
