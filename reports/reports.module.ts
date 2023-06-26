import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { NgBusyModule } from 'ng-busy';
import { SharedModule } from 'src/app/shared/shared.module';

import {
  GainsandLossesReportByPayPeriodComponent,
} from './gainsand-losses-report-by-pay-period/gainsand-losses-report-by-pay-period.component';
import { ReportsComponent } from './reports.component';
import { ReportingRoutingModule } from './reports.routing.module';




@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBusyModule,
    NgSelectModule,
    ReportingRoutingModule,
    AgGridModule,
  ],
  declarations: [ReportsComponent,
   GainsandLossesReportByPayPeriodComponent],
  entryComponents: [],
  exports: [ ]
})
export class ReportsModule { }

