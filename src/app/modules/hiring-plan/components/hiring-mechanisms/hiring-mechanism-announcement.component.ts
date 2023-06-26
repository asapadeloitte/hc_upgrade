import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ToasterService } from 'angular2-toaster';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BasePageComponent } from 'src/app/shared/base-page/base-page.component';
import { ComponentForm } from 'src/app/shared/component-form.decorator';
import {
    StartDtValCellRenderrComponent,
    AppDropdownSmartList,
    CellRendererComponent,
    CurrencyEditorComponent,
    DropdownText,
} from 'src/app/shared/components/cell-renderer/cell-renderer.component';
import { DeleteUserCellRendererComponent } from 'src/app/shared/components/cell-renderer/deleteuser-cell-renderer.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangeHistoryService } from 'src/app/shared/services/change.history.service';
import { SmartListConversionService } from 'src/app/shared/services/smartListConversion.service';

import {
    accessibilityFix, columnVisibleAccessbility, printSortStateToConsole, onJobTitleChange, numberSort
} from '../../../../shared/utilities';
import { HumanCapitalService } from './../../../../shared/services/humanCapital.service';
import { HiringMechanismService } from './hiring-mechanism.services';
import {
    WarningUnsavedChangesDialogComponent
} from 'src/app/shared/components/warning-unsaved-changes-dialog/warning-unsaved-changes-dialog.component';
import { SelectionsService } from '../selections/selections.service';
import { VacancyInfo } from './../../../../shared/models/hiring-plan.model';

@Component({
    selector: 'app-edit-vacancies',
    templateUrl: './hiring-mechanism-announcement.component.html',
    styles: []
})

export class HiringMechanismAnnouncementComponent extends BasePageComponent implements OnInit {

    @ComponentForm(true)
    public hiringMechanismVacancieForm: FormGroup;
    public changeForm: FormGroup;
    public busyTableSave: Subscription;
    public yearsList = [];
    public officeList = [];
    public tempEditedRows: any = [];
    public editedData: any = [];
    public officeName: any;
    @Input() year: any;
    public deleteObj;
    public showSearch = false;
    public vacancyList = [];
    public frameworkComponents;
    public headerHeight;
    public rowHeight;
    public originalData: string;
    private defaultColDef: ColDef;
    public colDefs = [];
    public gridOptions: GridOptions;
    public statusBar;
    public errorDetails: any = [];
    @Input() vacancyFormData;
    private screenObject = {
        screenName: 'editVacancies'
    };
    public deleteClicked = false;

    public jobTitleMapping: any;
    constructor(
        private fb: FormBuilder,
        public bsModalUnsavedRef: BsModalRef,
        public localBsModalRef: BsModalRef,
        private router: Router,
        humanCapitalService: HumanCapitalService,
        private smartListService: SmartListConversionService,
        authService: AuthService,
        toaster: ToasterService,
        modalService: BsModalService,
        private hiringService: HiringMechanismService,
        public changeHistoryService: ChangeHistoryService,
        el: ElementRef,
        public selectionService: SelectionsService,
        public _adminService: AdminService
    ) {
        super(authService, toaster, humanCapitalService, modalService, el);
        this.headerHeight = 45;
        this.rowHeight = 40;
    }
    ngOnInit() {
        this._adminService.getFieldMappings().subscribe(data => {
            if (data) {
                this.jobTitleMapping = data;
                this.smartListService.setTitleMapping(this.jobTitleMapping);
            }
        });
        this.hiringMechanismVacancieForm = this.fb.group({});
        this.loadGridOptions();

        this.loadSearchForm();

        this.loadBusyTable();

    }
    loadBusyTable() {
        this.getVacanciesforAnnouncement();
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy() {
        if (this.busyTableSave) {
            this.busyTableSave.unsubscribe();
        }
    }

    public loadSearchForm() {
        this.changeForm = this.fb.group({
            search: [null],
            filter: [null],
        });

        this.getCustomFilterNames(this.screenObject);
    }

    public loadGridOptions() {
        this.frameworkComponents = {
            cellRendererComponent: CellRendererComponent,
            ddSmartList: AppDropdownSmartList,
            dropdownText: DropdownText,
            currencyEditor: CurrencyEditorComponent,
            deleteUserRenderer: DeleteUserCellRendererComponent,
        },
            this.headerHeight = 45;
        this.rowHeight = 40;
        this.statusBar = {
            statusPanels: [
                {
                    statusPanel: 'agTotalAndFilteredRowCountComponent',
                    align: 'left',
                },
                {
                    statusPanel: 'agTotalRowCountComponent',
                    align: 'center',
                },
                { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSelectedRowCountComponent' },
                { statusPanel: 'agAggregationComponent' },
            ],
        };
        this.sideBar = {
            toolPanels: ['columns', 'filters']
        };

        this.gridOptions = {
            context: {
                componentParent: this,
            },
            defaultColDef: {
                singleClickEdit: true,
                resizable: true,
                filterParams: { newRowsAction: 'keep' },
                sortable: true,
                unSortIcon: true,
                filter: true,
            },
            // redarw rows
            onCellValueChanged: params => {
                if (params.oldValue !== params.newValue && params.newValue !== undefined) {
                    this.hiringMechanismVacancieForm.markAsDirty();
                    const office = params.data.office;
                    const orgLevel = params.data.orgLevel;
                    const employee = params.data.employee;
                    const employeeId = params.data.employeeId;
                    // Collect all the changed rows within the grid
                    if (params.colDef.field === 'jobTitle' || params.colDef.field === 'grade' || params.colDef.field === 'jobCode'
                        || params.colDef.field === 'series' || params.colDef.field === 'payPlan' || params.colDef.field === 'fpl') {
                        onJobTitleChange(params);
                    }
                    if (this.editedData.length > 0) {
                        const rowIndex = this.editedData.findIndex(temp => temp.vacancyId === params.data.vacancyId);
                        if (rowIndex >= 0) {
                            this.editedData.splice(rowIndex, 1);
                        }
                    }
                    this.editedData.push(params.data);
                    if (this.editedData.length > 0) {
                        this.hiringMechanismVacancieForm.markAsDirty();
                    } else {
                        this.hiringMechanismVacancieForm.markAsPristine();
                    }

                    // Bring back focus and redraw the updated row with new data
                    const row = this.gridApi.getDisplayedRowAtIndex(params.rowIndex);
                    this.gridApi.redrawRows({ rowNodes: [row] });
                    this.bringFocusBack();
                }
                accessibilityFix(this.el);
            },
            onColumnVisible: (params) => {
                columnVisibleAccessbility(params, this.el);
            },
            stopEditingWhenGridLosesFocus: true
        } as GridOptions;
    }

    getJSONdifference(sourceJSON: JSON, targetJSON: JSON) {

        const diffJSON = {};
        for (const i in targetJSON) {
            if (!sourceJSON.hasOwnProperty(i) || targetJSON[i] !== sourceJSON[i]) {
                if (targetJSON[i] !== undefined) {
                    diffJSON[i] = targetJSON[i];
                }
            }
        }
        return diffJSON;
    }
    public getVacanciesforAnnouncement() {

        this.showSearch = true;
        this.colDefs = [];
        this.editedData = [];
        this.changeForm.controls.filter.setValue(null);
        // this.hiringService.setSearchDDVals(this.changeForm.value);
        this.busyTableSave = this.humanCapitalService.getAnnouncementsVacancies(
            this.vacancyFormData.announcementId
        ).subscribe(args => {
            if ((args != null) && (args.length > 0)) {
                this.getColDefs();
                this.roleList = this.authService.jwt_getRole();
                if (this.roleList.includes('Hiring_Office_Analyst') || this.roleList.includes('HOA_Analyst_QHP_Analyst')) {
                    this.colDefs.forEach(col => {
                        if (col.field === 'rmVacancy') {
                            this.colDefs = this.colDefs.filter(el => el.field !== 'rmVacancy');
                            this.gridOptions.api.setColumnDefs(this.colDefs);
                        }
                    });
                }
                let a = [];
                const smartListValues = this.smartListService.getDDVals();
                a = args;
                a.forEach(el => {
                    Object.keys(el).forEach(key => {
                        if (smartListValues) {
                            const tempVal = smartListValues.find(f => f.smartListName === key);
                            if (tempVal) {
                                const tempVal1 = tempVal.smartListValues.find(f => f.id === el[key]);
                                el[key] = tempVal1 !== undefined ? tempVal1.value : el[key];
                            }
                        }
                    });

                });
                this.originalData = JSON.stringify(a);
                this.vacancyList = a;
            }
        });
    }

    //
    // Validating selected rows in grid before push vacanies to Hiring plan
    public sameorDifferntVacancies(): any {
        let differntVacanies = false;
        let count = 0;
        const firstRow = this.vacancyList[0];
        this.vacancyList.forEach(element => {
            if (element.payPlan === firstRow.payPlan) {
                differntVacanies = false;
            } else {
                count++;
                differntVacanies = true;
            }
        });
        return count;
    }
    public ValidateSelectedRows() {
        let rowValidation = false;
        this.vacancyList.forEach(element => {
            const jobTitle = element.jobTitle;
            const payPlan = element.payPlan;
            const series = element.series;
            const grade = element.hiringPlanGrade;
            if ((jobTitle === null || jobTitle === undefined || jobTitle === '') ||
                (payPlan === null || payPlan === undefined || payPlan === '') ||
                (series === null || series === undefined || series === '') ||
                (grade === null || grade === undefined || grade === '')) {
                rowValidation = true;
            }
        });
        return rowValidation;
    }

    saveAnnouncementVacancy() {
        const validateselectedRowVacany = this.ValidateSelectedRows();
        if (this.editedData.length > 0) {
            const count = this.sameorDifferntVacancies();
            if (count > 0) {
                const initialState = {
                    vacancyChangesforAnnouncement: true
                };
                this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
                this.bsModalRef.content.closeBtnName = 'Close';
                this.bsModalRef.content.submitBtnName = 'Submit';
            } else if (validateselectedRowVacany === true) {
                const initialState = {
                    validateselectedRowVacany
                };
                this.bsModalRef = this.modalService.show(ErrorDialogComponent, { initialState });
                this.bsModalRef.content.closeBtnName = 'Close';
                this.bsModalRef.content.submitBtnName = 'Submit';
            } else {
                const smartListGlobal = this.smartListService.getDDVals();
                this.editedData.forEach(obj => {
                    Object.keys(obj).forEach(key => {
                        const smartListObject = smartListGlobal.find(element => element.smartListName === key);
                        if (smartListObject && smartListObject.smartListValues.length > 0) {
                            smartListObject.smartListValues.forEach(element => {
                                if (obj[key] === element.value) {
                                    obj[key] = element.id;
                                }
                            });
                        }
                    });
                });
                this.busyTableSave = this.humanCapitalService.saveHMVacancy(this.year, this.editedData).subscribe(data => {
                    if (data.success === true) {
                        this.toaster.pop('success', 'Saved', 'Successfully saved the vacancy details');
                        this.selectionService.onReloadVacancy(true);
                    }
                    this.getVacanciesforAnnouncement();
                    this.editedData = [];
                    this.hiringMechanismVacancieForm.markAsPristine();
                }, error => {
                    error.error.errorDetails.forEach(element => {
                        this.errorDetails.push(element.message);
                    });
                    this.toaster.pop('error', 'Failed', this.errorDetails);
                });
            }
        }
    }
    close() {
        if (this.hiringMechanismVacancieForm.dirty) {
            this.bsModalUnsavedRef = this.modalService.show(WarningUnsavedChangesDialogComponent);
            this.bsModalUnsavedRef.content.okSave.subscribe((response) => {
                this.bsModalUnsavedRef.hide();
                this.localBsModalRef.hide();
            });
        } else {
            // this.hiringService.onClose(true);
            this.localBsModalRef.hide();
        }
    }

    public onFilterTextBoxChanged() {
        this.onGridSearch(this.changeForm.controls.search.value);
        printSortStateToConsole(this.el);
    }

    public onGridSearch(filterString: string) {
        if (this.gridApi.isAnyFilterPresent()) {
            this.gridApi.onFilterChanged();
        }
        this.gridApi.setQuickFilter(filterString);
    }

    public onFilterChangeEvent(event: any) {
        this.filterChangeEvent(event);
    }

    public resetFilterView() {
        this.resetFilterViewData(this.changeForm);
    }

    public openFilterDialog() {
        const filterValue = this.changeForm.get('filter').value;
        const filterGridValue = this.changeForm.controls.filter.value;
        const screenObject = {
            screenName: 'editVacancies',
        };
        this.openFilterDialogView(this.changeForm, screenObject);
    }

    public autoSizeCols(skipHeader) {
        this.autoSizeColumns(skipHeader);
        printSortStateToConsole(this.el);
    }

    public openExportModal() {
        this.ExportGridData();
    }

    public onSortChange(e) {
        printSortStateToConsole(this.el);
    }
    public isColumnEditable(params) {
        if (this.roleList === 'CTPHC_SRT_Analyst_User'
            || this.roleList === 'admin') {
            return true;
        }
        return false;
    }
    getCellStyle(params) {
        if (this.roleList === 'CTPHC_SRT_Analyst_User'
            || this.roleList === 'admin') {
            return { 'text-align': 'right' };
        } else {
            return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
        }
    }

    public getColDefs() {
        this.colDefs = [
            {
                headerName: 'Announcement ID',
                field: 'announcementDisplayId',
                cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
                editable: false,
            },
            {
                headerName: 'Office',
                field: 'office',
                cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
                editable: false
            },
            {
                headerName: 'Organizational Level',
                field: 'orgLevelAlias',
                cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
                editable: false
            },
            {
                headerName: 'Vacancy',
                field: 'vacancyDisplayId',
                cellStyle: { backgroundColor: '#E6E6E6', 'text-align': 'left' },
                editable: false
            },
            {
                headerName: 'Job Title',
                field: 'jobTitle',
                cellEditor: 'ddSmartList',
                cellRenderer: 'dropdownText',
                editable: this.isColumnEditable.bind(this),
                cellStyle: this.getCellStyle.bind(this),
            },
            {
                headerName: 'Series',
                field: 'series',
                cellClass: 'textFormat',
                cellEditor: 'ddSmartList',
                cellRenderer: 'dropdownText',
                editable: this.isColumnEditable.bind(this),
                cellStyle: this.getCellStyle.bind(this),
            },
            {
                headerName: 'Pay Plan',
                field: 'payPlan',
                cellEditor: 'ddSmartList',
                cellRenderer: 'dropdownText',
                editable: this.isColumnEditable.bind(this),
                cellStyle: this.getCellStyle.bind(this),
            },
            // {
            //     headerName: 'Staffing Plan Grade',
            //     field: 'grade',
            //     cellClass: 'textFormat',
            //     comparator: numberSort,
            //     cellEditor: 'ddSmartList',
            //     cellRenderer: 'dropdownText',
            //     editable: this.isColumnEditable.bind(this),
            //     cellStyle: this.getCellStyle.bind(this),
            // },
            {
                headerName: 'Grade',
                field: 'hiringPlanGrade',
                editable: this.isColumnEditable.bind(this),
                cellStyle: this.getCellStyle.bind(this),
            },
            {
                headerName: 'Remove Vacancy',
                field: 'rmVacancy',
                cellRenderer: 'deleteUserRenderer',
                cellRendererParams: {
                    screenName: 'editVacancies',
                    onClick: this.removeVacancy.bind(this),
                }
            }
        ];
    }

    removeVacancy(params: any) { // CBAS-6257
        const associatedVacancyInfo: VacancyInfo[] = [];
        const vacancyInfo = new VacancyInfo();
        vacancyInfo.office = params.office;
        vacancyInfo.orgLevel = params.orgLevel;
        vacancyInfo.vacancyId = params.vacancyId;
        vacancyInfo.year = this.year;
        associatedVacancyInfo.push(vacancyInfo);

        this.deleteClicked = true;
        this.deleteObj = {
            announcementId: params.announcementId,
            year: this.year,
            office: params.office,
            orgLevel: params.orgLevel,
            associatedVacancyInfo: associatedVacancyInfo
        };
    }

    reloadVacancies(reload: boolean) {
        if (reload) {
            this.getVacanciesforAnnouncement();
        }
    }
    vacancyDeleted(event: boolean) {
        if (event) {
            this.toaster.pop('success', 'Vacancy Removed', 'Vacancy has been Removed Successfully');
            this.selectionService.onReloadVacancy(true);
        }
    }

    createVacancy() {
        this.close();
        this.router.navigate(['staffing-plan/create-vacancy']);
    }

    resetDeleteClicked(event: boolean) {
        if (event) {
            this.deleteClicked = false;
        }
    }

}
