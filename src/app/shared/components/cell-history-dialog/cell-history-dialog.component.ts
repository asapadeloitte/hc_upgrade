import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

import { HumanCapitalService } from '../../services/humanCapital.service';
import { SmartListConversionService } from '../../services/smartListConversion.service';

@Component({
  selector: 'app-cell-history-dialog',
  templateUrl: './cell-history-dialog.component.html',
  styleUrls: ['./cell-history-dialog.component.scss']
})
export class CellHistoryDialogComponent implements OnInit {
  @Input() colName: any;
  public smartListValues;
  public columnDefs: any[];
  public rowData: any[];
  public gridOptions: GridOptions;
  public busyTableSave: Subscription;

  pipe = new DatePipe('en-us');
  @Input() fieldType: any;
  @Input() fieldTitle: string;
  @Input() closeBtnName: string;
  @Input() submitBtnName: string;
  @Input() title: string;
  @Input() approveScreen: boolean;
  @Input() submitScreen: boolean;
  @Input() list: any;
  constructor(
    public bsModalRef: BsModalRef,
    private humanCapitalService: HumanCapitalService,
    private smartListService: SmartListConversionService) { }
  ngOnInit() {
    this.gridOptions = {
      context: {
        componentParent: this
      },
      defaultColDef: {
        singleClickEdit: true,
        resizable: true,
        filterParams: { newRowsAction: 'keep' },
        sortable: true,
        unSortIcon: true,
        filter: true
      },
    };
    this.smartListValues = this.smartListService.ddvals;
    if (this.list) {
      this.list.forEach(element => {
        if (this.smartListValues) {
          this.getSmartListValues(element);
        } else {
          this.busyTableSave = this.humanCapitalService.getSmartList().subscribe(args => {
            this.smartListService.setDDVals(args);
            this.smartListValues = this.smartListService.getDDVals();
            this.getSmartListValues(element);
          });
        }
      });
    }

    this.rowData = this.list;

    this.columnDefs = [
      {
        headerName: 'Ctp Line Item',
        field: 'ctpLineItem',
        hide: true
      },
      {
        headerName: 'Office',
        field: 'office',
        hide: true
      },
      {
        headerName: 'User Id',
        field: 'auditUserId',
        hide: true
      },
      {
        headerName: 'ColumnTitle',
        field: 'memberGridPosition',
        hide: true
      },
      {
        headerName: 'User',
        field: 'auditUserId',
        width: 180,
        autoHeight: true,
        sortable: true
      },
      {
        headerName: 'Date',
        field: 'auditDtDisplay',
        width: 163.2,
        autoHeight: true,
        sortable: true
      },
      {
        headerName: 'Old Value',
        field: 'auditedValue',
        width: 200,
        cellClass: (params) => {
          return ( !isNaN(params.value) ? 'text-right' : '');
        },
        cellRenderer: (params) => {
          const regex = RegExp('(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])');
          if (params.data.memberGridPosition === 'fundingAmount') {
            const inrFormat = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2
            });
            return inrFormat.format(params.value);
          } else if (regex.test(params.value)) {
            return params.value ? this.pipe.transform(params.value, 'MM/dd/yyyy') : '';
          } else {
            return params.value;
          }
        },
        autoHeight: true,
        sortable: true
      },
      {
        headerName: 'New Value',
        field: 'newValue',
        width: 221.5,
        autoHeight: true,
        cellClass: (params) => {
          return ( !isNaN(params.value) ? 'text-right' : '');
        },
        cellRenderer: (params) => {
          const regex = RegExp('(19[5-9][0-9]|20[0-4][0-9]|2050)[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])');
          if (params.data.memberGridPosition === 'fundingAmount') {
            const inrFormat = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2
            });
            return inrFormat.format(params.value);
          } else if (regex.test(params.value)) {
            return params.value ? this.pipe.transform(params.value, 'MM/dd/yyyy') : '';
          } else {
            return params.value;
          }
        },
        sortable: true
      }
    ];
  }

  getSmartListValues(element) {
    if (this.smartListValues.hasOwnProperty(this.fieldTitle)) {
      if (element.newValue) {
        const tempVal = this.smartListValues[this.fieldTitle].data.find(y => y.id === element.newValue);
        element.newValue = tempVal !== undefined ? tempVal.smartListValue : element.newValue;
      }
      if (element.auditedValue) {
        const tempVal = this.smartListValues[this.fieldTitle].data.find(y => y.id === element.auditedValue);
        element.auditedValue = tempVal !== undefined ? tempVal.smartListValue : element.auditedValue;
      }
    }
  }
  close() {
    this.bsModalRef.hide();
  }
}
