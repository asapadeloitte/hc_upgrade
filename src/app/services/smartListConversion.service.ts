import { Injectable } from '@angular/core';

@Injectable()
export class SmartListConversionService {
    public ddvals;
    public mapping;
    constructor() { }

    setDDVals(d) {
        this.ddvals = d;
    }
    getDDVals() {
        return this.ddvals;
    }

    setTitleMapping(jobMap) {
        this.mapping = jobMap;
    }

    getTitleMapping() {
        return this.mapping;
    }

    getDateFieldList() {
        const dateList = ['ctpEod', 'departureDate', 'pdClassifiedDt', 'hrepsPreconsultConductedDate', 'preconsultConductedDate',
            'hrepsJobReqReleaseDate', 'jobReqReleaseDate', 'hrepsVacancyOpenDate', 'vacancyOpenDate', 'hrepsVacancyClosedDate',
            'vacancyCloseDate', 'hrepsCertsIssuedDate', 'certsIssuedDate', 'hrepsSelectionDate', 'selectionDate',
            'hrepsTentativeOfferDate', 'tentativeOfferDate', 'hrepsFinalOfferDate', 'finalOfferDate', 'hrepsEodDate', 'eodDate',
            'declinationDate', 'finalOfferDate', 'departureDate', 'detailEffectiveDate', 'detailNteDate', 'renewDate',
            'renewDate2', 'renewDate3', 'renewDate4', 'renewDate5', 'rlEffectiveDate', 'clpEligibilityDate', 'actingEffectiveDate',
            'atmEffectiveDate', 'csalEffectiveDate', 'crEffectiveDate', 'possibleEligibilityDate', 'irEffectiveDate', 'rlEffectiveDate'
        ];
        return dateList;
    }


}
