import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingChangesGuard } from 'src/app/shared/pending-changes.guard';
import { LoggedInUserGuard } from 'src/app/shared/services/login-in-user-guard.service';

import { AssociateAnnouncementsComponent } from './components/associate-announcements/associate-announcements.component';
import { ClassificationsComponent } from './components/classifications/classifications.component';
import {
    CopyOverHrepsDataToHiringPlanComponent,
} from './components/copy-over-hreps-data-to-hiring-plan/copy-over-hreps-data-to-hiring-plan.component';
import { HiringMechanismsComponent } from './components/hiring-mechanisms/hiring-mechanisms.component';
import { PushVacanciesComponent } from './components/push-vacancies/push-vacancies.component';
import { SelectionsComponent } from './components/selections/selections.component';

const routes: Routes = [
    {
        path: 'push-vacancies', component: PushVacanciesComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'hiring-mechanisms', component: HiringMechanismsComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
   {
        path: 'classifications', component: ClassificationsComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },

    {
        path: 'selections', component: SelectionsComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'associate-announcements-with-HREPS',
        component: AssociateAnnouncementsComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    },
    {
        path: 'copy-over-hreps-data-to-hiring-plan',
        component: CopyOverHrepsDataToHiringPlanComponent,
        canActivate: [LoggedInUserGuard],
        canDeactivate: [PendingChangesGuard],
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class HiringPlanRoutingModule { }
