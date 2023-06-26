export class GridFilterModel {
    userFilterId: number;
    filterCategory?: string;
    filterName?: string;
    filterJson: string;
    userId: number;
    screenName: string;
}

export class FileListModel {
    id: number;
    fileName: string;
    uploadedBy: string;
    dateUploaded: any;
    }

export class DropdownModel {
    officeList: Array<string>;
    acquisitionTypeList: Array<string>;
    versionList: Array<string>;
    projectTitleList: Array<string>;
    yearsList?: Array<{yearType: string, yearValue: string }>;
}

export class PostAcquisitionModel {
    ctpLineItem: string;
    acquisitions: any;
}
export class PostAcquisitionGridFilterModel {
    filterName: string;
    filterJson: string;
    filterCategory: string;
    userId: string;
}

export class ChangeHistoryModel {
    ctpLineItem: string;
    office: string;
    memberGridPosition: string;
    auditedValue: string;
    newValue: string;
    auditUserId: string;
    auditDt: string;
    auditDtDisplay: string;
}

export class DropDownDataModel {
    acquisitionTypeList: string[];
    yearsList: string[];
    officeList: string[];
    versionList?: any;
    dropdownList: DropdownList[];
}

export class DropdownList {
    ctpLineItem: string;
    projectTitle: string;
    office: string;
    detailedDescription: string;
    acquisitionType: string;
    curRequisitionNumber?: string;
    requisitionNumber2?: any;
    requisitionNumber3?: any;
    requisitionNumber4?: any;
    requisitionNumber5?: any;
    grantFAIN?: any;
    contractAwardNumber?: any;
    iaaAwardNumber?: any;
    accountDetails: string;
    fyYearDetails: string;
  }
