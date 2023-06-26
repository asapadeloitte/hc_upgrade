import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ChangeHistoryModel } from '../../models/acquisition.model';
import { HumanCapitalService } from '../../services/humanCapital.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  public busyTableSave: Subscription;
  public notesTab = false;
  public preCommitment = false;
  public postCommitment = false;
  public award = false;
  bsModalRef: BsModalRef;
  public changeHistoryData: ChangeHistoryModel[];
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNotesSelected = new EventEmitter<boolean>();
  @Output() onTabSelected = new EventEmitter<string>();
  @Input() tabs: Array<any>;
  @Input() tabActive;


  constructor(
    private humanCapitalService: HumanCapitalService,
    private modalService: BsModalService) { }

  ngOnInit() {
    if (this.tabActive === 'Notes') {
      this.tabs.forEach(args => {
        if (args.title === 'Notes') {
          args.active = true;
        } else {
          args.active = false;
        }
      });
    }
    if (this.tabActive === 'Pre-Commitment') {
      this.tabs.forEach(args => {
        if (args.title === 'Pre-Commitment') {
          args.active = true;
        } else {
          args.active = false;
        }
      });
    }
    if (this.tabActive === 'Post-Commitment') {
      this.tabs.forEach(args => {
        if (args.title === 'Post-Commitment') {
          args.active = true;
        } else {
          args.active = false;
        }
      });
    }
    if (this.tabActive === 'Award') {
      this.tabs.forEach(args => {
        if (args.title === 'Award') {
          args.active = true;
        } else {
          args.active = false;
        }
      });
    }
  }

  onTabSelect(e) {
    if (e.heading === 'Pre-Commitment') {
      this.preCommitment = true;
      this.postCommitment = false;
      this.award = false;
      this.notesTab = false;
    } else if (e.heading === 'Post-Commitment') {
      this.preCommitment = false;
      this.postCommitment = true;
      this.award = false;
      this.notesTab = false;
    } else if (e.heading === 'Award') {
      this.preCommitment = false;
      this.postCommitment = false;
      this.award = true;
      this.notesTab = false;
    } else if (e.heading === 'Notes') {
      this.preCommitment = false;
      this.postCommitment = false;
      this.award = false;
      this.notesTab = true;
    }
    this.onNotesSelected.emit(this.notesTab);

    this.onTabSelected.emit(e.heading);
  }

}
