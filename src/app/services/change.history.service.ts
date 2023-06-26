import { Injectable } from '@angular/core';
import { HumanCapitalService } from './humanCapital.service';
import { CellHistoryDialogComponent } from '../components/cell-history-dialog/cell-history-dialog.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangeHistoryModel } from '../models/acquisition.model';


@Injectable({ providedIn: 'root' })
export class ChangeHistoryService {
    constructor(private _humanCapitalService: HumanCapitalService,
                private modalService: BsModalService) { }

    bsModalRef: BsModalRef;
    changeHistoryData: ChangeHistoryModel[];

    getCellHistory(e: any, office: string, year: string, threshold: string, officeEqual: string, page: string) {
        // this._humanCapitalService.changeHistorySPC(
        //     office, e.column.userProvidedColDef.field, year, threshold, officeEqual, page, e.node.data.ctpLineItem)
        //     .subscribe(args => {
        //         if (args !== null) {
        //             this.changeHistoryData = args;
        //             const initialState = {
        //                 fieldTitle: e.column.userProvidedColDef.field,
        //                 list: this.changeHistoryData,
        //                 title: 'Change History',
        //                 colName: e.column.userProvidedColDef.headerName,
        //             };
        //             this.bsModalRef = this.modalService.show(CellHistoryDialogComponent, { initialState, class: 'modal-lg' });
        //             this.bsModalRef.content.closeBtnName = 'Close';
        //             this.bsModalRef.content.submitBtnName = 'Submit';
        //         }
        //     });
    }

}





