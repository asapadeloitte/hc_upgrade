import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ApiEndpointsConfig } from 'src/app/app-api-endpoints.config';
import {
    ChangeHistoryModel, DropdownModel, FileListModel, GridFilterModel, PostAcquisitionGridFilterModel
} from '../models/acquisition.model';
import { Classfication } from '../models/hiring-plan.model';
import {
    ISpDetailsModel,
    ISpAllPositionModel, IDropdownModel, ISmartListDataModel, IPushVacanciesModel
} from '../models/staffing-plan.model';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HumanCapitalService {
    constructor(
        private http: HttpClient,
        private appEndPoints: ApiEndpointsConfig
    ) { }

    private getAcquisitionurl =
        this.appEndPoints.getBaseUrl + '/api/v1/acquisition/essacquisition/';
    private getReportStateUrl = this.appEndPoints.getBaseUrl + '/api/useradmin/';
    private getFileUploadUrl =
        this.appEndPoints.getBaseUrl + '/api/userfileupload/';
    private hcFileUploadUrl = this.appEndPoints.getBaseUrl + '/api/admin/fieldmappings/jobcodes/import';
    private deleteViewsUrl =
        this.appEndPoints.getBaseUrl + '/api/useradmin/deleteFilter/';
    private getSmartListDataUrl =
        this.appEndPoints.getBaseUrl + '/api/smartlists';
    private getStaffingPlanUrl =
        this.appEndPoints.getBaseUrl + '/api/staffingplan';
    private getHiringPlanUrl =
        this.appEndPoints.getBaseUrl + '/api/hiringplan';

    public getAllStaff(office: string, year: string): Observable<ISpDetailsModel[]> {
        if (office === 'All Offices' && year === 'All Years') {
            return this.http.get<ISpDetailsModel[]>(this.appEndPoints.getBaseUrl + `/api/staffingplan/details`, httpOptions).pipe(retry(1));
        } else if (office === 'All Offices') {
            return this.http.get<ISpDetailsModel[]>
                (this.appEndPoints.getBaseUrl + `/api/staffingplan/details/?year=${year}`, httpOptions).pipe(retry(1));
        } else if (year === 'All Years') {
            return this.http.get<ISpDetailsModel[]>(this.appEndPoints.getBaseUrl +
                `/api/staffingplan/details/?office=${office}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<ISpDetailsModel[]>(this.getStaffingPlanUrl +
                `/details/?office=${office}&year=${year}`, httpOptions).pipe(retry(1));
        }
    }
    // need to check with Amit
    public saveAllStaff(year: string, payload) {
        if (year === 'All Years') {
            return this.http.post(this.getStaffingPlanUrl + `/details/save/`, payload, httpOptions);
        } else {
            return this.http.post(this.getStaffingPlanUrl + '/details/save/?year=' + year, payload, httpOptions);
        }
    }
    public getEmpployeeVacancies(office: string, orgLevel, positionType: string, year: string): Observable<ISpAllPositionModel[]> {
        let url;
        if (orgLevel) {
            url = this.getStaffingPlanUrl +
                `/allpositioninfo/?office=${office}&orgLevel=${encodeURIComponent(orgLevel)}&positionType=${positionType}&year=${year}`;
        } else {
            url = this.getStaffingPlanUrl +
                `/allpositioninfo/?office=${office}&positionType=${positionType}&year=${year}`;
        }
        return this.http.get<ISpAllPositionModel[]>(url, httpOptions).pipe(retry(1));

    }

    public getAvailableVacancies(office: string, orgLevel, positionType: string, year: string): Observable<any> {
        const url = this.getStaffingPlanUrl +
            `/reassignments/availablevacancies/?office=${office}&orgLevel=${encodeURIComponent(orgLevel)}&positionType=${positionType}&year=${year}`;
        return this.http.get(url, httpOptions).pipe(retry(1));
    }
    public getEmpployeeData(office: string, orgLevel, year: string, empVac): Observable<any> {
        let url;
        if (orgLevel) {
            url = this.getStaffingPlanUrl +
                `/details/?office=${office}&orgLevel=${encodeURIComponent(orgLevel)}&year=${year}`;
        } else {
            url = this.getStaffingPlanUrl +
                `/details/?office=${office}&year=${year}`;
        }
        return empVac ? this.http.get(url + '&id=' + empVac, httpOptions) : this.http.get(url, httpOptions);

    }

    public postOneStaffData(year: string, payload, title): Observable<any> {
        let url = this.getStaffingPlanUrl + `/`;
        if (title === 'Process a Detail/Temporary Promotion') {
            url = url + `detailout/save/?year=${year}`;
            return this.http.post(url, payload[0], httpOptions);
        } else if (title === 'Change Org. Level') {
            url = url + `changeorglevel`;
            return this.http.post(url, payload[0], httpOptions);
        } else if (title === 'Change Fiscal Year') {
            url = url + `changefiscalyear`;
            return this.http.post(url, payload[0], httpOptions);
        } else {
            url = url + `details/save/?year=${year}`;
            return this.http.post(url, payload, httpOptions);

        }
    }
    public getDropdownValues(): Observable<IDropdownModel> {
        return this.http.get<IDropdownModel>(this.appEndPoints.getBaseUrl + `/api/dropdowns`, httpOptions);
    }

    public createVacancy(payload, year: string): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl + `/api/vacancy/create/?year=${year}`, payload, httpOptions);
    }

    public deleteVacancy(payload, year: string): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl + `/api/vacancy/delete/?year=${year}`, payload, httpOptions);
    }

    public saveDetailIn(payload, year: string): Observable<any> {
        return this.http.post<any>(this.getStaffingPlanUrl + `/detailin/save/?year=${year}`, payload, httpOptions);
    }

    public getSupervisorData(office: string, positionType: string, year: string): Observable<ISpAllPositionModel[]> {
        if (office === 'All Offices') {
            return this.http.get<ISpAllPositionModel[]>(this.getStaffingPlanUrl +
                `/allpositioninfo/?positionType=${positionType}&year=${year}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<ISpAllPositionModel[]>(this.getStaffingPlanUrl +
                `/allpositioninfo/?office=${office}&positionType=${positionType}&year=${year}`,
                httpOptions).pipe(retry(1));
        }
    }
    public postCreateLineItem(payload): Observable<any> {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/v1/acquisition/createLineItem', payload, httpOptions);
    }

    public getAnnouncements(office: string, year: string, hiringMechanism: string): Observable<any> {
        if (office !== 'All Offices' && hiringMechanism !== 'All Hiring Mechanisms') {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/announcements/details/?office=${office}&year=${year}&hiringMechanism=${hiringMechanism}`
                , httpOptions).pipe(retry(1));
        } else if (office === 'All Offices' && hiringMechanism === 'All Hiring Mechanisms') {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/announcements/details/?year=${year}`, httpOptions).pipe(retry(1));
        } else if (office === 'All Offices' && hiringMechanism !== 'All Hiring Mechanisms') {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/announcements/details/?year=${year}&hiringMechanism=${hiringMechanism}`, httpOptions).pipe(retry(1));
        } else if (hiringMechanism === 'All Hiring Mechanisms' && office !== 'All Offices') {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/announcements/details/?year=${year}&office=${office}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/announcements/details/?year=${year}&hiringMechanism=${hiringMechanism}`, httpOptions).pipe(retry(1));
        }
    }

    public getAnnouncementsVacancies(announcmentId): Observable<any> {
        return this.http.get<any>(this.getHiringPlanUrl +
            `/announcements/vacancies/?announcmentId=${announcmentId}`, httpOptions).pipe(retry(1));
    }

    public postAnnouncements(payload): Observable<any> {
        return this.http.post(this.getHiringPlanUrl + '/announcements/save', payload, httpOptions);
    }

    public getAcquisitionGridFilter(userId): Observable<GridFilterModel[]> {
        return this.http.get<GridFilterModel[]>(
            this.getReportStateUrl + 'filter/list/?userid=' + userId,
            httpOptions
        );
    }

    public postAcquisitionGridFilter(payload): Observable<PostAcquisitionGridFilterModel[]> {
        return this.http.post<PostAcquisitionGridFilterModel[]>(
            this.getReportStateUrl + 'savefilter/', payload, httpOptions);
    }


    public updateAcquisitionGridFilter(payload): Observable<PostAcquisitionGridFilterModel[]> {
        return this.http.post<PostAcquisitionGridFilterModel[]>(
            this.getReportStateUrl + 'updateFilter/', payload, httpOptions);
    }

    public deleteViews(payload): Observable<any> {
        const url = this.deleteViewsUrl;
        return this.http.post<any>(url, payload, httpOptions);
    }


    // to get the list of uploaded files
    public getUploadedFileList(userGroup, ctpLineItem, screenName): Observable<FileListModel[]> {
        let url = this.getFileUploadUrl + 'getuserfileList/?userGroup=' + userGroup + '&ctpLineItem=' + ctpLineItem;
        if (screenName) {
            url = url + '&screenName=' + screenName;
        }
        return this.http.get<FileListModel[]>(url, httpOptions);
    }

    public hcUploadFieldMapping(file: File): Observable<any> {

        // Add file data to FormData object
        const formData = new FormData();
        formData.append('file', file, file.name);

        // Add any custom headers, as required
        const customHeaders = new HttpHeaders({
            'Accepted-Encoding': 'application/json'
        });

        // Define custom options, as required
        const customOptions = {
            headers: customHeaders,
            reportProgress: true,
            observe: 'events',
        };

        const req = new HttpRequest('POST', this.hcFileUploadUrl, formData, customOptions);
        return this.http.request(req);
    }

    public deleteFileupload(userId, userFileId, userGroup, screenName: string): Observable<any> {
        const url =
            this.getFileUploadUrl + 'deleteFile/?userFileId=' + userFileId + '&userGroup=' + userGroup + '&screenName=' + screenName;
        return this.http.post<any>(url, httpOptions);

    }

    public getSmartList(): Observable<ISmartListDataModel[]> {
        return this.http.get<ISmartListDataModel[]>(this.getSmartListDataUrl, httpOptions);
    }

    // hiring plan related URLS
    public getPushVacancies(office: string, year: string): Observable<IPushVacanciesModel[]> {
        if (office === 'All Offices') {
            return this.http.get<IPushVacanciesModel[]>(this.getHiringPlanUrl +
                `/unassociatedvacancies/?year=${year}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<IPushVacanciesModel[]>(this.getHiringPlanUrl +
                `/unassociatedvacancies/?office=${office}&year=${year}`, httpOptions).pipe(retry(1));
        }
    }
    public getAssociatedVacaniesData(year: string, payPlan, hiringMechanism: string): Observable<any> {
        return this.http.get(this.getHiringPlanUrl +
            `/announcements/info/?year=${year}&payPlan=${payPlan}&hiringMechanism=${hiringMechanism}`, httpOptions);
    }
    public associateVacancies(payload): Observable<any> {
        const url = this.getHiringPlanUrl + '/pushvacancies';
        return this.http.post<any>(url, payload, httpOptions);
    }

    public removeVacancies(payload): Observable<any> {
        const url = this.getHiringPlanUrl + '/announcements/removevacancies';
        return this.http.post<any>(url, payload, httpOptions);
    }

    public deleteAnnouncement(payload): Observable<any> {
        const url = this.getHiringPlanUrl + '/announcements/delete';
        return this.http.post<any>(url, payload, httpOptions);
    }

    public saveHMVacancy(year: string, payload): Observable<any> {
        const url = this.getHiringPlanUrl + `/announcements/vacancies/save/?year=${year}`;
        return this.http.post<any>(url, payload, httpOptions);
    }

    public getSelectionsData(office: string, year: string): Observable<any> {
        if (office === 'All Offices') {
            return this.http.get(this.getHiringPlanUrl + `/selections/details?year=${year}`, httpOptions);
        } else {
            return this.http.get(this.getHiringPlanUrl +
                `/selections/details?office=${office}&year=${year}`, httpOptions);
        }
    }

    public getAllEmployeesData(): Observable<any> {
        return this.http.get(this.getStaffingPlanUrl + `/allemployeeinfo`, httpOptions).pipe(retry(1));
    }
    // delete API for selection screen
    public deleteSelectedVacancy(vacancyId, announcementId) {
        return this.http.post<any>(this.getHiringPlanUrl +
            `/selections/cleardata?announcementId=${announcementId}&vacancyId=${vacancyId}`, httpOptions);
    }

    public getClassifications(office: string, year: string): Observable<any> {
        if (office !== 'All Offices') {
            return this.http.get<Classfication[]>(this.getHiringPlanUrl +
                `/classification?office=${office}&year=${year}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<Classfication[]>(this.getHiringPlanUrl +
                `/classification?year=${year}`, httpOptions).pipe(retry(1));
        }
    }

    public addClassifications(year: string, payload: Classfication[]) {
        return this.http.post(this.getHiringPlanUrl + '/classification/save/?year=' + year, payload, httpOptions);
    }
    public saveClassifications(year: string, payload: Classfication[]) {
        return this.http.post(this.getHiringPlanUrl + '/classification/save/?year=' + year, payload, httpOptions);
    }
    public removeClassification(id: number): Observable<any> {
        return this.http.post<any>(this.getHiringPlanUrl + '/classification/delete/?id=' + id, httpOptions);
    }

    public getdepartureLogData(office: string, year: string): Observable<any> {
        if (office === 'All Offices') {
            return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/reports/logs/departure?year=${year}`, httpOptions);
        } else {

            return this.http.get(this.appEndPoints.getBaseUrl + `/api/reports/logs/departure?office=${office}&year=${year}`, httpOptions);
        }
    }

    public savedepartureLogData(payload: Classfication[]) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/logs/departure/save', payload, httpOptions);
    }

    public deleteDepartureLog(id: number): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl + '/api/reports/logs/departure/delete/' + id, null, httpOptions);
    }

    public getPromotionLogData(year: string): Observable<any> {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/reports/logs/detailtemppromotion?year=${year}`, httpOptions);
    }

    public savePromotionLogData(payload: Classfication[]) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/logs/detailtemppromotion/save', payload, httpOptions);
    }

    public deletePromotionLog(id: number): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl + '/api/reports/logs/detailtemppromotion/delete/' + id, null, httpOptions);
    }
    public getRecruitmentLogisticLogData(office: string, year: string): Observable<any> {
        if (office === 'All Offices') {
            return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/reports/logs/recruitmentlogistics?year=${year}`, httpOptions);
        } else {
            return this.http.get(this.appEndPoints.getBaseUrl +
                `/api/reports/logs/recruitmentlogistics?office=${office}&year=${year}`, httpOptions);
        }
    }

    // saveRecruitmentLogisticsLogData
    public saveRecruitmentLogisticsLogData(payload) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/logs/recruitmentlogistics/save', payload, httpOptions);
    }
    // deleteRecruitmentLogisticsLog

    public deleteRecruitmentLogisticsLog(id: number): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl + '/api/reports/logs/recruitmentlogistics/delete/' + id, null, httpOptions);
    }
    public addRecruitmentLogistics(payload) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/logs/recruitmentlogistics/add', payload, httpOptions);
    }

    // HREPS Section

    public getunMappedHrepsData(office: string, year: string): Observable<any> {
        if (office === 'All Offices') {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/hrepsdata/unmapped/?year=${year}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/hrepsdata/unmapped/?office=${office}&year=${year}`, httpOptions).pipe(retry(1));
        }
    }

    public getunMappedAnnoucementData(office: string, year: string): Observable<any> {
        return this.http.get<any>(this.getHiringPlanUrl +
            `/announcements/details/hrepsunmapped/?office=${office}&year=${year}`, httpOptions).pipe(retry(1));

    }

    public getCopyOverHrepsData(office: string, year: string): Observable<any> {
        if (office === 'All Offices') {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/announcements/details/hrepsdatacopy/?year=${year}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<any>(this.getHiringPlanUrl +
                `/announcements/details/hrepsdatacopy/?office=${office}&year=${year}`, httpOptions).pipe(retry(1));
        }
    }


    public getCopyOverEHCMData(office: string, year: string): Observable<any> {
        if (office === 'All Offices') {
            return this.http.get<any>(this.getStaffingPlanUrl +
                `/details/ehcmdata/v2/?year=${year}`, httpOptions).pipe(retry(1));
        } else {
            return this.http.get<any>(this.getStaffingPlanUrl +
                `/details/ehcmdata/v2/?office=${office}&year=${year}`, httpOptions).pipe(retry(1));
        }
    }
    // EHCM SCREEN IN STAFFIG PLAN


    public getunMappedEHCMData(office: string, year: string): Observable<any> {
        return this.http.get<any>(this.getStaffingPlanUrl +
            `/ehcmdata/unmapped/?office=${office}&year=${year}`, httpOptions).pipe(retry(1));

    }

    public getunMappedVacanies(office: string, year: string): Observable<any> {
        return this.http.get<any>(this.getStaffingPlanUrl +
            `/details/vacancies/ehcmunmapped/?office=${office}&year=${year}`, httpOptions);

    }
    public postVacancies(year: string, payload): Observable<any> {
        return this.http.post(this.getStaffingPlanUrl + '/details/save/?year=' + year, payload, httpOptions);
    }


    // FTE Reports
    public getFTEReports(year: string, payPeriod: string): Observable<any> {

        return this.http.get<any>
            (
                this.appEndPoints.getBaseUrl + `/api/reports/ftetotals/?year=${year}&payPeriod=${payPeriod}`, httpOptions).pipe(retry(1));
    }

    public generateFTEReports(payload): Observable<any> {

        return this.http.post<any>(this.appEndPoints.getBaseUrl + `/api/reports/ftetotals/generate`, payload, httpOptions);

    }

    public saveFTEReport(payload) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/ftetotals/save/', payload, httpOptions);
    }

    public deleteFTEReport(id: number): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl + '/api/reports/ftetotals/delete/' + id, null, httpOptions);
    }
    public uploadFileEHCM(file: File, year: string) {
        const url = this.getStaffingPlanUrl + '/ehcmdata/import/?year=' + year;
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(url, formData,
            {
                reportProgress: true,
                observe: 'events',
            }
        );
    }
    // uploadFileHRCM
    public uploadFileHREPS(file: File, year: string) {
        const url = this.getHiringPlanUrl + '/hrepsdata/import/?year=' + year;
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(url, formData,
            {
                reportProgress: true,
                observe: 'events',
            }
        );
    }
    public getQHP() {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + '/api/reports/qhp/details', httpOptions);
    }
    public saveQHP(payload) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/qhp/details/save/', payload, httpOptions);
    }
    public getOnBoardsData(office: string) {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/reports/qhp/onboards/?office=${office}`, httpOptions);
    }
    public getQHPVacancies(office: string) {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/reports/qhp/vacancies/?office=${office}`, httpOptions);
    }
    public deleteQHPVacancy(id: number): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl + '/api/reports/qhp/vacancies/delete/' + id, httpOptions);
    }

    public qhpConsolidate() {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + '/api/reports/qhp/onboardandvacancies/?');
    }
    public saveVacancy(payload) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/qhp/vacancies/save/', payload, httpOptions);
    }
    public addVacancies(payload) {
        return this.http.post(this.appEndPoints.getBaseUrl + '/api/reports/qhp/vacancies/create/', payload, httpOptions);
    }

    public getcapacityReport(): Observable<any> {

        return this.http.get(this.appEndPoints.getBaseUrl + `/api/reports/capacity/summary`, httpOptions);
    }

    public getcapacityReportDetail(selectedOffice: string): Observable<any> {
        if (selectedOffice === 'All Offices') {
            return this.http.get(this.appEndPoints.getBaseUrl + `/api/reports/capacity?`, { responseType: 'arraybuffer' }).pipe(retry(1));
        } else {
            return this.http.get(this.appEndPoints.getBaseUrl +
                `/api/reports/capacity?office=${selectedOffice}`, { responseType: 'arraybuffer' }).pipe(retry(1));
        }
    }
    public getDashBoardData(year: string) {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/dashboard/?year=${year}`, httpOptions).pipe(retry(1));
    }
    // Dashboard Data for Top RemainingVacancies
    public getDashBoardTopRemainingVacancies(year: string) {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/dashboard/topRemainingVacancies?year=${year}`, httpOptions).pipe(retry(1));
    }
    // second API
    public getDashBoardHiringMechanism(year: string) {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/dashboard/hiresByMechanism?year=${year}`, httpOptions).pipe(retry(1));
    }

    public getAttritionReport(year: string): Observable<any> {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/reports/attrition/?year=${year}`, httpOptions);
    }
    public getfteTotalReportTotalPDF(year: string, payPeriod): Observable<any> {

        return this.http.get(this.appEndPoints.getBaseUrl +
            `/api/reports/ftetotals/pdf/?year=${year}&payPeriod=${payPeriod}`, { responseType: 'arraybuffer' }).pipe(retry(1));
    }
    public clearDepartureRow(year: string, orgLevel: string, employeeId: string): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl +
            `/api/staffingplan/departure/clear?year=${year}&orgLevel=${orgLevel}&employeeId=${employeeId}`, httpOptions);
    }

    public clearReassignmentRow(year: string, orgLevel: string, employeeId: string): Observable<any> {
        return this.http.post<any>(this.appEndPoints.getBaseUrl +
            `/api/staffingplan/reassignment/clear?year=${year}&orgLevel=${orgLevel}&employeeId=${employeeId}`, httpOptions);
    }
    //  /api/staffingplan/reassignment/clear
    public executeBatchJobs(id: number): Observable<any> {
        if (id === 1) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/metadata/addNewJobTitles`, httpOptions);
        } else if (id === 2) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/admin/sendEodProcessEmail`, httpOptions);
        } else if (id === 3) {
            return this.http.get(this.appEndPoints.getBaseUrl + `/api/admin/logs`, { responseType: 'text' }).pipe(retry(1));
        } else if (id === 4) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/announcement/statusupdates`, httpOptions);
        } else if (id === 5) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/selections/statusupdates`, httpOptions);
            // return this.http.get(this.appEndPoints.getBaseUrl + `/api/admin/logs`, httpOptions);
        } else if (id === 6) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/selections/processcancelledoffers`, httpOptions);
        } else if (id === 7) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/classification/statusupdates`, httpOptions);
        } else if (id === 8) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/hrepsassociation/statusupdates`, httpOptions);
        } else if (id === 9) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/selections/copySelecteeNamesToStaffingPlan`, httpOptions);
        } else if (id === 10) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/selections/addccemployeeids`, httpOptions);
        } else if (id === 11) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/refreshentityhierarchy`, httpOptions);
        } else if (id === 12) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/detaillog/statusupdates`, httpOptions);
        } else if (id === 13) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/batch/departureLog/updateDepartureComplete`, httpOptions);
        } else if (id === 14) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/reports/sharepointextract`, httpOptions);
        } else if (id === 15) {
            return this.http.post<any>(this.appEndPoints.getBaseUrl +
                `/api/reports/logs/detailtemppromotion/changeNotifications`, httpOptions);
        }
    }
    // get the payperiod dateList
    public getPayPeriodDatesList(): Observable<any> {
        return this.http.get<any>(this.appEndPoints.getBaseUrl + `/api/reports/logs/detailtemppromotion/validDetailDates`, httpOptions);
    }
}
