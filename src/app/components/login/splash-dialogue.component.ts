import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

declare var jQuery: any;

@Component({
  selector: 'app-splash-dialogue',
  templateUrl: './splash-dialogue.template.html'
})

export class SplashDialogComponent {
  busy: Subscription;

  @Output() callBack = new EventEmitter<boolean>();
  @Output() hideModal = new EventEmitter<boolean>();

  constructor() {

  }

  cancel() {
    jQuery('#splash-dialog').modal('hide');
    this.hideModal.emit(true);
  }

  confirm() {
    this.callBack.emit();
  }

}
