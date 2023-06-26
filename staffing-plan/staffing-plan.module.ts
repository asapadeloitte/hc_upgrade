import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { NgBusyModule } from 'ng-busy';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import {
  AssociateUnmappedvacancieswithEhcmdataComponent,
} from './components/associate-unmappedvacancieswith-ehcmdata/associate-unmappedvacancieswith-ehcmdata.component';
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
import {
  OneStaffDynamicFormComponent,
} from './components/edit-member-vacancy-one-staff/one-staff-dynamic-form/one-staff-dynamic-form.component';
import { ProcessdetailInComponent } from './components/processdetail-in/processdetail-in.component';
import { StaffingPlanRoutingModule } from './staffing-plan-routing.module';
import { StaffingPlanComponent } from './staffing-plan.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBusyModule,
    NgSelectModule,
    StaffingPlanRoutingModule,
    SharedModule,
    TabsModule.forRoot(),
    NgBusyModule,
    NgSelectModule,
    AgGridModule
  ],
  declarations: [
    StaffingPlanComponent,
    EditExistingMemberVacancyOneStaffComponent,
    EditExistingStaffmemberComponent,
    ProcessdetailInComponent,
    CreatevacancyComponent,
    DeleteVacancyComponent,
    AssociateVacaniceswithEHCMDataComponent,
    CopyEHCMDataToStaffingPalnComponent,
    OneStaffDynamicFormComponent,
    AssociateUnmappedvacancieswithEhcmdataComponent

  ],
  entryComponents: [
  ],
})
export class StaffingPlanModule { }
