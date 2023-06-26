import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { NgBusyModule } from 'ng-busy';
import { SharedModule } from 'src/app/shared/shared.module';

import { AssociateAnnouncementsComponent } from './components/associate-announcements/associate-announcements.component';
import { UnmappedAnnouncementsComponent } from './components/associate-announcements/unmapped-announcements.component';
import {
  CopyOverHrepsDataToHiringPlanComponent,
} from './components/copy-over-hreps-data-to-hiring-plan/copy-over-hreps-data-to-hiring-plan.component';
import { PushVacanciesComponent } from './components/push-vacancies/push-vacancies.component';
import { SelectionsComponent } from './components/selections/selections.component';
import { HiringPlanRoutingModule } from './hiring-plan-routing.module';
import { HiringPlanComponent } from './hiring-plan.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HiringPlanRoutingModule,
    NgBusyModule,
    NgSelectModule,
    AgGridModule
  ],
  declarations: [
    HiringPlanComponent,
    PushVacanciesComponent,
    SelectionsComponent,
    AssociateAnnouncementsComponent,
    UnmappedAnnouncementsComponent,
    CopyOverHrepsDataToHiringPlanComponent,

  ],
  entryComponents: [],
  exports: [ ]
})
export class HiringPlanModule { }
