import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBusyModule } from 'ng-busy';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { CreateUserPopupComponent } from './components/create-user-popup/create-user-popup.component';
import { DeleteUserPopupComponent } from './components/delete-user-popup/delete-user-popup.component';
import { HumanCapitalFieldMappingsComponent } from './components/human-capital-field-mappings/human-capital-field-mappings.component';
import { UpdateUserPopupComponent } from './components/update-user-popup/update-user-popup.component';
import { BatchJobsComponent } from './components/batch-jobs/batch-jobs.component';

import { AdminService } from 'src/app/shared/services/admin.service';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminRoutingModule,
        NgBusyModule,
        NgSelectModule,
        AgGridModule,
        NgbModule
       ],
    declarations: [
        AdminDashboardComponent,
        CreateUserPopupComponent,
        DeleteUserPopupComponent,
        HumanCapitalFieldMappingsComponent,
        UpdateUserPopupComponent,
        BatchJobsComponent,
    ],
   // providers: [AdminService],
    exports: [CreateUserPopupComponent,
        DeleteUserPopupComponent]
})
export class AdminModule { }
