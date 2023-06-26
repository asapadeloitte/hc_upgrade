
export class RecruitmentLogistics {
    year: string;
    office: string;
    orgLevel: string;
    orgLevelAlias: string;
    lastName: string;
    firstName: string;
    middleInitial: string;
    jobTitle: string;
    jobCode: string;
    payPlan: string;
    series: string;
    grade: string;
    action: string;
    rlEffectiveDate: string;
    roomNbr: string;
    previouslyFromFda: string;
    newHireToFda: string;
    previousFdaCenter: string;
    currentSupervisor: string;
    bargainingUnit: string;
    laptopRequestTicketNbr: string;
    laptopPropertyCodeNbr: string;
    recruitmentComments: string;
    previousEmployer: string;
    hcLiaison: string;
    clpEligibilityDate: string;
    ctpEod: string;
    hasDiscrepency: boolean;
    isNameValid: boolean;
    isJobTitleValid: boolean;
    isPayPlanValid: boolean;
    isGradeValid: boolean;
    isJobCodeValid: boolean;
    isStepValid: boolean;
    isLocationIdValid: boolean;
    isLocationDescriptionValid: boolean;
    isVeteranValid: boolean;
}

export class Vacancy {
    office: string;
    year: string;
    quarter: string;
    vacancyGrade: string;
    noOfVacancies: number;
    comments: string;
}
export class copyOverEHCMDataObject {
    employee: string;
    orgLevel: string;
    employeeId: string;
    office: string;
    orgLevelAlias: string;
    ehcmDeptId: string;
    adminCode: string;
    ehcmName: string;
    fullName: string;
    lastName: string;
    firstName: string;
    middleInitial: string;
    ehcmId: string;

    ehcmJobTitle: string;
    jobTitle: string;
    ehcmOccSeries: string;
    series: string;
    ehcmPayPlan: string;
    payPlan: string;
    ehcmGrade: string;
    grade: string;
    ehcmJobCode: string;
    jobCode: string;
    ehcmStep: string;
    step: string;
    ehcmFlsaStat: string;
    flsa: string;
    ehcmBargUnit: string;
    bargainingUnit: string;
    ehcmMgrLevel: string;
    managerLevel: string;
    ehcmMilStatus: string;
    veteran: string;
    ehcmLocation: string;
    locationId: string;
    ehcmLocationDescr: string;
    remoteEmployeeLocation: string;
}
