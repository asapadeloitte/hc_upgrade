import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-val-msg',
  template: ''
})
// tslint:disable-next-line:component-class-suffix
export class ValidationMsg implements OnInit {
  @Input() validator: string;
  @Input() msg: string;
  constructor() {}

  ngOnInit() {}
}
