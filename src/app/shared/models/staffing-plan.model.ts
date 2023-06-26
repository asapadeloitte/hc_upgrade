export class ISmartListDataModel {
    smartListId: string;
    smartListName?: string;
    smartListValues: ISmartListValueModel[];
}

export class ISmartListValueModel {
    smartListName: string;
    id: string;
    value: string;
}

export class IDropdownModel {
    officeOrgLevelMapping: IOfficeOrgLevelMappingModel[];
    years: string[];
    positionTypes: string[];
    payPeriods: IPayPeriodLevelMappingModel[];
    currentPayPeriod: IcurrentPayPeriodMappingModel;
    currentYear: string;
}

export class IOfficeOrgLevelMappingModel {
    office: string;
    orgLevels: IOrgLevelModel[];
}

export class IPayPeriodLevelMappingModel {
    year: string;
    payPeriod: string;
    beginningDate: string;
    endDate: string;
}
export class IcurrentPayPeriodMappingModel {
    year: string;
    payPeriod: string;
    beginningDate: string;
    endDate: string;
}
export class IOrgLevelModel {
    orgLevel: string;
    orgLevelAlias: string;
    adminCode?: string | string;
}


export class ISpDetailsModel {
    year: string;
    office: string;
    orgLevel: string;
    orgLevelAlias: string;
    employee: string;
    employeeAlias?: string;
    employeeId?: string;
    managerLevel?: string;
    fpl?: string;
    previousEmployer?: string;
    ethicsFilter?: string;
    step?: string;
    departureDate?: string;
    remoteEmployeeLocation?: string;
    firstName?: string;
    middleInitial?: string;
    lastName?: string;
    fullName?: string;
    locationId?: string;
    remoteEmployee?: string;
    actingEffectiveDate?: string;
    payPlan?: string;
    bargainingUnit?: string;
    hiringMechanism?: string;
    veteran?: string;
    adminCode?: string;
    currentSupervisor?: string;
    acting?: string;
    staffMemberType?: string;
    grade?: string;
    jobTitle?: string;
    vacancyStatus?: string;
    jobCode?: string;
    actingCtpStaffName?: string;
    series?: string;
    flsa?: string;
    ctpEod?: string;
    viceLastName?: any;
    clpEligibilityDate?: string;
    sort?: string;
    atmEffectiveDate?: string;
    csalEffectiveDate?: string;
    categoricalRetention?: string;
    crPercentage?: string;
    crEffectiveDate?: string;
    possibleEligibilityDate?: string;
    individualRetention?: string;
    irPercentage?: string;
    irEffectiveDate?: string;
    rlEffectiveDate?: string;
    hcLiaison?: string;
    laptopRequestTicketNo?: string;
    action?: string;
    newHireToFda?: string;
    laptopSetupPropertyCodeNo?: any;
    roomNo?: any;
    previousFdaCenter?: string;
    comments?: string;
    reasonForDeparting?: string;
    departureComments?: string;
    futureEmployer?: string;
    reassignmentOffice?: string;
    reassignmentOrgLevel?: string;
    vacancy?: string;
    reassignmentEffectiveDate?: string;
    reassignmentComments?: string;
    status?: any;
    detailType?: any;
}

export class ISpAllPositionModel {
    office: string;
    orgLevel: string;
    positionType: string;
    id: string;
    alias?: any;
    displaySummary?: any;
    fullName?: string;
    vacancyStatus?: string;
    typeOfHire?: any;
    supervisor: boolean;
}

export class IPushVacanciesModel {
    year?: any;
    office: string;
    orgLevel: string;
    orgLevelAlias: string;
    vacancyStatus: string;
    adminCode?: any;
    jobTitle: string;
    jobCode?: any;
    payPlan: string;
    series: string;
    grade: string;
    bargainingUnit?: any;
    managerLevel?: any;
    currentSupervisor?: any;
    fpl?: any;
    flsa?: any;
    ethicsFilter?: any;
    vacancyId: string;
    hiringMechanism?: any;
}
