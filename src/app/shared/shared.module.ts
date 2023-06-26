import { TextInputComponent } from 'src/app/shared/components/text-input/text-input.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgBusyModule } from 'ng-busy';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ValidationMsg } from './components/validation-msg/validation-msg.component';
import { NgSelectorComponent } from './components/ng-selector/ng-selector.component';
import { DateInputComponent } from './components/date-input/date-input.component';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { CurrencyInputComponent } from './components/currency-input/currency-input.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AgGridModule } from 'ag-grid-angular';
import { TabComponent } from './components/tab/tab.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { EmpvacHyperlinkComponent } from '../modules/staffing-plan/components/empvac-hyperlink/empvac-hyperlink.component';
import { GroupByPipe } from './pipes/group-By.pipe';
import {
    SubmitPushVacaniestoHiringPlanDialogComponent
  } from 'src/app/shared/submit-push-vacaniesto-hiring-plan-dialog/submit-push-vacaniesto-hiring-plan-dialog.component';
import {
    HiringMechanismAnnouncementComponent
} from '../modules/hiring-plan/components/hiring-mechanisms/hiring-mechanism-announcement.component';
import { AdminModule } from '../components/admin/admin.module';
import { ClassificationsComponent } from '../modules/hiring-plan/components/classifications/classifications.component';
import {
    CreateClassificationComponent
} from '../modules/hiring-plan/components/classifications/create-classification/create-classification.component';

import { HiringMechanismsComponent } from '../modules/hiring-plan/components/hiring-mechanisms/hiring-mechanisms.component';
import { DecimalInputComponent } from './components/decimal-input/decimal-input.component';
import { TwoDigitDecimaNumberDirective } from './directives/two-digit-decima-number.directive';
import { DepartureLogComponent } from '../modules/reports/components/departure-log/departure-log.component';
import {
    RecruitmentLogisticsLogComponent
} from '../modules/reports/components/recruitment-logistics-log/recruitment-logistics-log.component';
import {
    DetailTemporaryPromotionLogComponent
} from '../modules/reports/components/detail-temporary-promotion-log/detail-temporary-promotion-log.component';
import { AddVacancyComponent } from '../modules/reports/qhp/vacancies/add-vacancy/add-vacancy.component';
import { FteTotalReportsComponent } from '../modules/reports/components/fte-total-reports/fte-total-reports.component';
import { CreateFTEReportComponent } from '../modules/reports/components/fte-total-reports/create-fte-report.component';
import { AttritionReportComponent } from '../modules/reports/components/attrition-report/attrition-report.component';
import { SummaryCapacityReportComponent } from '../modules/reports/components/summary-capacity-report/summary-capacity-report.component';
import { QuarterlyHiringPlanComponent } from '../modules/reports/qhp/quarterly-hiring-plan/quarterly-hiring-plan.component';
import {
    OnboardsFromStaffingPlanQHPComponent
} from '../modules/reports/qhp/onboards-from-staffing-plan-qhp/onboards-from-staffing-plan-qhp.component';
import { QuartelyHiringPlanMainComponent } from '../modules/reports/qhp/quartely-hiring-plan-main/quartely-hiring-plan-main.component';
import { VacanciesComponent } from '../modules/reports/qhp/vacancies/vacancies.component';
import { PreviousAttritionReportComponent } from '../modules/reports/components/attrition-report/previous-attrition-report.component';
import { TextareaInputComponent } from './components/textarea-input/textarea-input.component';


@NgModule({
    imports: [
        AdminModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgBusyModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
        NgSelectModule,
        HttpClientModule,
        CurrencyMaskModule,
        AgGridModule.withComponents([])
    ],
    declarations: [
        TextInputComponent,
        TextareaInputComponent,
        DecimalInputComponent,
        ValidationMsg,
        NgSelectorComponent,
        DateInputComponent,
        NumberInputComponent,
        CurrencyInputComponent,
        TabComponent,
        FormBuilderComponent,
        GroupByPipe,
        EmpvacHyperlinkComponent,
        SubmitPushVacaniestoHiringPlanDialogComponent,
        HiringMechanismAnnouncementComponent,
        ClassificationsComponent,
        DepartureLogComponent,
        RecruitmentLogisticsLogComponent,
        DetailTemporaryPromotionLogComponent,
        CreateClassificationComponent,
        CreateFTEReportComponent,
        HiringMechanismsComponent,
        TwoDigitDecimaNumberDirective,
        FteTotalReportsComponent,
        SummaryCapacityReportComponent,
        AttritionReportComponent,
        PreviousAttritionReportComponent,
        QuarterlyHiringPlanComponent,
        OnboardsFromStaffingPlanQHPComponent,
        AddVacancyComponent,
        QuartelyHiringPlanMainComponent,
        VacanciesComponent

    ],
    providers:
        [],
    exports: [
        TextInputComponent,
        TextareaInputComponent,
        DecimalInputComponent,
        ValidationMsg,
        NgSelectorComponent,
        DateInputComponent,
        NumberInputComponent,
        CurrencyInputComponent,
        TabComponent,
        FormBuilderComponent,
        GroupByPipe,
        EmpvacHyperlinkComponent,
        SubmitPushVacaniestoHiringPlanDialogComponent,
        CreateClassificationComponent,
        HiringMechanismAnnouncementComponent,
        HiringMechanismsComponent,
        ClassificationsComponent,
        CreateFTEReportComponent,
        DepartureLogComponent,
        AddVacancyComponent,
        RecruitmentLogisticsLogComponent,
        DetailTemporaryPromotionLogComponent,
        FteTotalReportsComponent,
        SummaryCapacityReportComponent,
        AttritionReportComponent

    ],
    entryComponents: [
        EmpvacHyperlinkComponent,
        SubmitPushVacaniestoHiringPlanDialogComponent,
        HiringMechanismAnnouncementComponent,
        AddVacancyComponent,
        CreateClassificationComponent,
        CreateFTEReportComponent,
        VacanciesComponent
    ]
})

export class SharedModule { }
