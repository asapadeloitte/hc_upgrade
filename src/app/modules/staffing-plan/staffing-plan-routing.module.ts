import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingChangesGuard } from './../../shared/pending-changes.guard';
import { LoggedInUserGuard } from './../../shared/services/login-in-user-guard.service';
import {
  AssociateVacaniceswithEHCMDataComponent,
} from './components/associate-vacaniceswith-ehcmdata/associate-vacaniceswith-ehcmdata.component';
import {
  CopyEHCMDataToStaffingPalnComponent,
} from './components/copy-ehcmdata-to-staffing-paln/copy-ehcmdata-to-staffing-paln.component';
import { CreatevacancyComponent } from './components/createvacancy/createvacancy.component';
import { DeleteVacancyComponent } from './components/delete-vacancy/delete-vacancy.component';
import {
  EditExistingStaffmemberComponent,
} from './components/edit-existing-staffmember/edit-existing-staffmember.component';
import {
  EditExistingMemberVacancyOneStaffComponent,
} from './components/edit-member-vacancy-one-staff/edit-existing-member-vacancy-one-staff.component';
import { ProcessdetailInComponent } from './components/processdetail-in/processdetail-in.component';

const routes: Routes = [
  {
    path: 'one-staff',
    component: EditExistingMemberVacancyOneStaffComponent,
    canActivate: [LoggedInUserGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'edit-existingstaffmembers',
    component: EditExistingStaffmemberComponent,
    canActivate: [LoggedInUserGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'processadetail-In',
    component: ProcessdetailInComponent,
    canActivate: [LoggedInUserGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'create-vacancy',
    component: CreatevacancyComponent,
    canActivate: [LoggedInUserGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'delete-vacancy',
    component: DeleteVacancyComponent,
    canActivate: [LoggedInUserGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'associate-vacancieswith-EHCMData',
    component: AssociateVacaniceswithEHCMDataComponent,
    canActivate: [LoggedInUserGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'copy-EHCMData-StaffingPlan',
    component: CopyEHCMDataToStaffingPalnComponent,
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
  ],
  declarations: [
  ],
  providers: [
    LoggedInUserGuard,
    PendingChangesGuard
  ]
})

export class StaffingPlanRoutingModule { }
