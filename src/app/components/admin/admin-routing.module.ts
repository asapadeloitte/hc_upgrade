import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { PendingChangesGuard } from 'src/app/shared/pending-changes.guard';
import { LoggedInUserGuard } from 'src/app/shared/services/login-in-user-guard.service';



const routes: Routes = [
    {
        path: 'admin',
        component: AdminDashboardComponent,
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
    ],
   })

export class AdminRoutingModule { }
