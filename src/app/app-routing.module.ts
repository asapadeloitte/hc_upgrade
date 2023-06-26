// tslint:disable: indent
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoggedInUserGuard } from './shared/services/login-in-user-guard.service';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PendingChangesGuard } from './shared/pending-changes.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: LoginComponent,
		canActivate: [LoggedInUserGuard],
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canDeactivate: [PendingChangesGuard],
		data: {
			page_header: 'Home Dashboard'
		}
	},
	{
		path: 'login',
		component: LoginComponent,
		data: {
			page_header: 'Login'
		}
	},
	{
		path: 'logout',
		component: LogoutComponent,
		canDeactivate: [PendingChangesGuard],
		data: {
			page_header: 'Logout'
		}
	},
	{
		path: 'admin',
		loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
	},
	{
		path: 'staffing-plan',
		loadChildren: () => import('./modules/staffing-plan/staffing-plan.module').then(m => m.StaffingPlanModule)
	},
	{
		path: 'hiring-plan',
		loadChildren: () => import('./modules/hiring-plan/hiring-plan.module').then(m => m.HiringPlanModule)
	},
	{
		path: 'hc-reports',
		loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
	},
	{
		path: '**',
		component: ErrorPageComponent,
		canActivate: [LoggedInUserGuard],
		data: {
			page_header: 'Page Not Found',
			errors:
				'The page you are trying to reach was not found. Please check your URL or link and try again.'
		}
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {useHash: true })
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
