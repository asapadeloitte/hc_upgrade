export class Announcement {
    announcementDisplayId: string;
    announcementId: number;
    associatedVacancyInfo: VacancyInfo[] = [];
    office: string;
    orgLevel: string;
    year: string;
    sharedCertificate: boolean;
    nonCompetitiveSelection: boolean;
}
export class Classfication {
    id: number = null;
    officePriority: number = null;
    ctpPriority: number = null;
    office: string = null;
    year: string = null;
    orgLevel: string = null;
    jobTitle: string = null;
    series: string = null;
    payPlan: string = null;
    grade: string = null;
    reasonForAction: string = null;
    classPkgsubmittedToHr: string = null;
    classificationJobReq: string = null;
    pdClassifiedDt: string = null;
    hcLiaison: string = null;
    status: string = null;
    hiringManager: string = null;
    complete: string = null;
    createdBy: string = null;
    createdDate: string = null;
    modifiedBy: string = null;
    modifiedDate: string = null;

    // public constructor(init?: Partial<Classfication>) {
    //     Object.assign(this, init);
    // }
}
export class VacancyInfo {
    year: string;
    office: string;
    orgLevel: string;
    vacancyId: string;
}

