import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SplashDialogComponent } from './components/login/splash-dialogue.component';
import { LoggedInUserGuard } from './shared/services/login-in-user-guard.service';
import { AuthService } from './shared/services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UserLoggedInService } from './shared/services/user-logged-in.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { AppConfigService } from './app-config.service';
import { AppConfig } from './app.config';
import { ApiEndpointsConfig } from './app-api-endpoints.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminService } from './shared/services/admin.service';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { AgGridModule } from 'ag-grid-angular';
import { HumanCapitalService } from './shared/services/humanCapital.service';
import { SmartListConversionService } from './shared/services/smartListConversion.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NewHeaderComponent } from './shared/components/new-header/new-header.component';
import { CBASSelectComponent, CBASMultiSelectComponent } from './shared/components/dropdown/dropdown.component';

import { MultiSelectSearchFilter } from './shared/components/dropdown/search-filter.pipe';
import { LayoutService } from './shared/services/layout.service';
import { LayoutItemDirective } from './shared/directives/layout-item.directive';
import { CellHistoryDialogComponent } from './shared/components/cell-history-dialog/cell-history-dialog.component';
import { FilterDailogComponent } from './shared/components/filter-dailog/filter-dailog.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import {
  CellRendererComponent, StartDtValCellRenderrComponent,
  AppDropdownSmartList, DropdownText,
  DropdownTextWithGroup, RegExValidationComponent,
  GridTextAreaComponent, DetailDiscComponent,
  CurrencyEditorComponent, EndDateCellRendererComponent, AppGradeDdValcellRendererComponent, AppSmDdValcellRendererComponent
} from './shared/components/cell-renderer/cell-renderer.component';
import { ExportModalComponent } from './shared/components/export-modal/export-modal.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { StrictNumberOnlyDirective } from './shared/directives/StrictNumberOnlyDirective';
import { FdaCurrencyPipe } from './shared/pipes/fda-currency.pipe';
import { AngularDraggableModule } from 'angular2-draggable';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DeleteUserCellRendererComponent } from './shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { ProgressComponent } from './components/progress/progress.component';
import { DndDirective } from './components/direcitves/dnd.directive';

import { FilterlistPipe } from './shared/pipes/filter-list.pipe';
import { FileupdateDialogComponent } from './shared/components/fileupdate-dialog/fileupdate-dialog.component';
import { FiledeleteDialogComponent } from './shared/components/filedelete-dialog/filedelete-dialog.component';
import { GridCommonFunctonalityComponent } from './shared/components/grid-common-functonality/grid-common-functonality.component';
import {
  HyperlinkComponent
} from './shared/components/cell-renderer/ctp-hyperlink-cell-renderer.component';
import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';
import { PendingChangesGuard } from './shared/pending-changes.guard';
import {
  WarningUnsavedChangesDialogComponent
} from './shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ErrorDialogComponent } from './shared/components/error-dialog/error-dialog.component';
import { BasePageComponent } from './shared/base-page/base-page.component';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgBusyModule } from 'ng-busy';
import { AdminModule } from './components/admin/admin.module';
import { FieldMappingService } from './shared/services/fieldMapping.service';
import { AddRecruitmentLogisticsComponent } from './shared/components/add-recruitment-logistics/add-recruitment-logistics.component';
import { SaveConfirmationDialogComponent } from './shared/components/save-confirmation-dialog/save-confirmation-dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StaffingsummaryComponent } from './components/dashboard/staffingsummary/staffingsummary.component';
import { HiringStatusComponent } from './components/dashboard/hiring-status/hiring-status.component';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { PdfConfirmationDialogComponent } from './shared/components/pdf-confirmation-dialog/pdf-confirmation-dialog.component';
import { VcaddtoselectionComponent } from './modules/hiring-plan/components/selections/vcaddtoselection/vcaddtoselection.component';
import { SelectedvacanciesComponent } from './modules/hiring-plan/components/selections/selectedvacancies/selectedvacancies.component';
import { BatchCellRendererComponent } from './components/admin/components/batch-jobs/batch-cell-renderer.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    ModalModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    NgBusyModule,
    BrowserAnimationsModule,
    NgxFileDropModule,
    NgbModule,
    AngularDraggableModule,
    NgxExtendedPdfViewerModule,
    AgChartsAngularModule,
    AgGridModule.withComponents([
      CellRendererComponent,
      DeleteUserCellRendererComponent,
      BatchCellRendererComponent,
      StartDtValCellRenderrComponent,
      EndDateCellRendererComponent,
      AppDropdownSmartList,
      DropdownText,
      AppGradeDdValcellRendererComponent,
      AppSmDdValcellRendererComponent,
      DropdownTextWithGroup,
      RegExValidationComponent,
      HyperlinkComponent,
      GridTextAreaComponent,
      DetailDiscComponent,
      CurrencyEditorComponent,
    ]),
    ToasterModule.forRoot(),
    TabsModule.forRoot(),
    CurrencyMaskModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorPageComponent,
    FooterComponent,
    NewHeaderComponent,
    LayoutItemDirective,
    DndDirective,
    CBASSelectComponent,
    CBASMultiSelectComponent,
    MultiSelectSearchFilter,
    FilterDailogComponent,
    CellHistoryDialogComponent,
    FileUploadComponent,
    FilterDailogComponent,
    WarningUnsavedChangesDialogComponent,
    CellRendererComponent,
    StartDtValCellRenderrComponent,
    EndDateCellRendererComponent,
    AppDropdownSmartList,
    GridTextAreaComponent,
    DropdownText,
    AppGradeDdValcellRendererComponent,
    AppSmDdValcellRendererComponent,
    DropdownTextWithGroup,
    HyperlinkComponent,
    RegExValidationComponent,
    StrictNumberOnlyDirective,
    FdaCurrencyPipe,
    FilterlistPipe,
    ExportModalComponent,
    DeleteUserCellRendererComponent,
    BatchCellRendererComponent,
    LogoutComponent,
    SplashDialogComponent,
    ProgressComponent,
    FileupdateDialogComponent,
    FiledeleteDialogComponent,
    GridCommonFunctonalityComponent,
    DetailDiscComponent,
    CurrencyEditorComponent,
    ErrorDialogComponent,
    BasePageComponent,
    AddRecruitmentLogisticsComponent,
    SaveConfirmationDialogComponent,
    DashboardComponent,
    StaffingsummaryComponent,
    HiringStatusComponent,
    PdfConfirmationDialogComponent,
    VcaddtoselectionComponent,
    SelectedvacanciesComponent
  ],

  providers: [
    LoggedInUserGuard, AuthService, UserLoggedInService, AppConfigService, AppConfig, ApiEndpointsConfig, AdminService, HumanCapitalService,
    SmartListConversionService, FieldMappingService, LayoutService, PendingChangesGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: MY_MOMENT_FORMATS
    },
    {
      provide: LOCALE_ID,
      useValue: 'en-US'
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorDialogComponent, PdfConfirmationDialogComponent, AddRecruitmentLogisticsComponent,
    SaveConfirmationDialogComponent, FileUploadComponent, WarningUnsavedChangesDialogComponent,
    FilterDailogComponent, CellHistoryDialogComponent, FileupdateDialogComponent, FiledeleteDialogComponent, FileUploadComponent,
    ExportModalComponent, VcaddtoselectionComponent, SelectedvacanciesComponent]

})
export class AppModule { }
