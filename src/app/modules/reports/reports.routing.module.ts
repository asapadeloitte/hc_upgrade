import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from 'src/app/shared/pending-changes.guard';
import { LoggedInUserGuard } from 'src/app/shared/services/login-in-user-guard.service';

import { AttritionReportComponent } from './components/attrition-report/attrition-report.component';
import { DepartureLogComponent } from './components/departure-log/departure-log.component';
import {
    DetailTemporaryPromotionLogComponent,
} from './components/detail-temporary-promotion-log/detail-temporary-promotion-log.component';
import { FteTotalReportsComponent } from './components/fte-total-reports/fte-total-reports.component';
import {
    RecruitmentLogisticsLogComponent,
} from './components/recruitment-logistics-log/recruitment-logistics-log.component';
import { SummaryCapacityReportComponent } from './components/summary-capacity-report/summary-capacity-report.component';
import {
    GainsandLossesReportByPayPeriodComponent,
} from './gainsand-losses-report-by-pay-period/gainsand-losses-report-by-pay-period.component';
import { QuartelyHiringPlanMainComponent } from './qhp/quartely-hiring-plan-main/quartely-hiring-plan-main.component';

const routes: Routes = [
    {
        path: 'departure-log', component: DepartureLogComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'detail-temporary-promotion-log', component: DetailTemporaryPromotionLogComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'recruitment-logistics-log', component: RecruitmentLogisticsLogComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'quarterly-hiring-plan', component: QuartelyHiringPlanMainComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },

    {
        path: 'fte-total-reports', component: FteTotalReportsComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },

    {
        path: 'gains-losses-pay-period', component: GainsandLossesReportByPayPeriodComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'capacity-report', component: SummaryCapacityReportComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'attrition-report', component: AttritionReportComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    ];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class ReportingRoutingModule { }
