import { RowNode, GridOptions, ExcelExportParams, ICellEditorComp, ICellEditorParams } from 'ag-grid-community';
import * as moment from 'moment';

export function verifyAndTransformNumber(params: any) {
  let tempNumber = 0;
  if (params.value === undefined || params.value === null
    || params.value === '' || isNaN(params.value)) {
    tempNumber = 0;
  } else {
    tempNumber = params.value;
  }
  return tempNumber;
}

export function bracketFormatter(amountString: string) {
  if (amountString !== null && amountString[0] === '-') {
    return amountString[0] !== '-' ? this.formatNumber(Number(amountString)) : '(' + amountString.substr(1) + ')';
  } else {
    return amountString === null ? '' : amountString;
  }
}
// created for Rounding the numbers in staffing target change
export function roundedAmountBracketsFormatter(params: any) {
  let tempNumber = verifyAndTransformNumber(params);
  if (tempNumber >= 0) {
    tempNumber = Math.round(tempNumber);
  } else {
    tempNumber = Math.round(Math.abs(tempNumber)) * -1;
  }
  const inrFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  });
  const tempStr = inrFormat.format(tempNumber);
  return bracketFormatter(tempStr);
}
// created for  brackets on  Amount negative values
export function amountBracketsFormatter(params: any) {
  const tempNumber = verifyAndTransformNumber(params);
  const inrFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
  const tempStr = inrFormat.format(tempNumber);
  return bracketFormatter(tempStr);
}

export function roundedNumberBracketsFormatter(params: any) {
  const tempNumber = verifyAndTransformNumber(params);
  return bracketFormatter(Math.round(tempNumber).toString());
}

export function numberBracketsFormatter(params: any) {
  const tempNumber = verifyAndTransformNumber(params);
  return bracketFormatter(tempNumber.toString());
}

export function currencyFormatter(params: any) {
  return '\x24' + this.formatNumber(params.value);
}
export function formatNumber(params) {
  return Math.round(params)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
// created for color styles based on condition
export function nonEditableAmountColorStyle(params: any) {
  if (params.value !== null && params.value !== undefined) {
    // tslint:disable-next-line: max-line-length
    return params.value[0] === '-' ? { backgroundColor: '#E6E6E6', color: '#c70032', 'text-align': 'right' } : { backgroundColor: '#E6E6E6', color: 'black', 'text-align': 'right' };
  } else {
    return { backgroundColor: '#E6E6E6', color: 'black', 'text-align': 'right' };
  }
}
export function editableAmountColorStyle(params: any) {
  if (params.value !== null && params.value !== undefined) {
    return params.value[0] === '-' ? { color: '#c70032', 'text-align': 'right' } : { color: 'black', 'text-align': 'right' };
  } else {
    return { color: 'black', 'text-align': 'right' };
  }
}

export function errorWitheditableAmountColorStyle(params: any) {
  if (params.value !== null && params.value !== undefined) {
    return params.value[0] === '-' ? { color: '#c70032' } : { color: 'black' };
  } else {
    return { color: 'black' };
  }
}
export function errorWithNoneditableAmountColorStyle(params: any) {
  if (params.value !== null && params.value !== undefined) {
    return params.value[0] === '-' ? { color: '#c70032' } : { backgroundColor: '#E6E6E6', color: 'black' };
  } else {
    return { backgroundColor: '#E6E6E6', color: 'black', 'text-align': 'right' };
  }
}
export function generateGridTotalData(gridOptions: GridOptions, sumColumns: string[], screen) {
  if (screen === 'dashboardStaffingSummary') {
    return generateGridTotalDataWithPrecision(gridOptions, sumColumns, 0, screen);
  } else if (screen === 'capacity') {
    return generateGridTotalDataWithPrecision(gridOptions, sumColumns, 0, screen);
  } else {
    return generateGridTotalDataWithPrecision(gridOptions, sumColumns, 2, screen);
  }
}
// created for total row
export function generateGridTotalDataWithPrecision(gridOptions: GridOptions, sumColumns: string[], precisionDigits: number, screen) {
  // generate a row-data with null values
  const result = {};
  if (gridOptions.columnApi) {
    gridOptions.columnApi.getAllColumns().forEach(item => {
      result[item.getId()] = null;
    });
  }

  sumColumns.forEach(element => {
    if (gridOptions.columnApi) {
      gridOptions.api.forEachNode((rowNode: RowNode) => {
        if (screen === 'capacity') {
          if (rowNode.data[element] && !isNaN(rowNode.data[element]) && rowNode.data.orgLevel !== 'Office Total') {
            result[element] += Number((rowNode.data[element]).replace(/[$,]/g, ''));
          }
        } else if (rowNode.data[element] && !isNaN(rowNode.data[element])) {
          result[element] += Number((rowNode.data[element]).replace(/[$,]/g, ''));
        }
      });
    }
    if (result[element]) {
      if (!isNaN(result[element])) {
        result[element] = parseFloat(result[element]).toFixed(precisionDigits);
      }
      result[element] = `${result[element]}`;
    }
  });
  if (result['capacityPercentage']) {
    result['capacityPercentage'] = ((result['currentlyOnboard'] * 100) / result['totalPositions']).toFixed(1);
  }
  return result;
}

export function generateGridTotalDataQHP(gridOptions: GridOptions, sumColumns: string[], screen) {
  // generate a row-data with null values
  const result = {};
  if (gridOptions.columnApi) {
    gridOptions.columnApi.getAllColumns().forEach(item => {
      result[item.getId()] = null;
    });
  }

  sumColumns.forEach(element => {
    if (gridOptions.columnApi) {
      gridOptions.api.forEachNode((rowNode: RowNode) => {
        if (rowNode.data[element] && !isNaN(rowNode.data[element])) {
          result[element] += Number((rowNode.data[element]).replace(/[$,]/g, ''));
        }
      });
    }
    // this.dynamicPrecision(result[element]);
    if (element !== 'attritionRate') {
      if (result[element]) {
        if (!isNaN(result[element])) {
          result[element] = parseFloat(result[element]).toFixed(0);
        }
        result[element] = `${result[element]}`;

      }
    } else {
      if (element === 'attritionRate') {
        result['attritionRate'] = Number(screen.value).toFixed(1);
      }
    }
  });
  return result;
}

function rowGroupCallback(params) {
  return params.node.key;
}
// created for gridExport Functionality - NEW FUNCTION
export function gridExportToFile(fileName: string, exportType: string, gridOptions: GridOptions, columnsToExport: string[]) {
  let columnKeys = [];
  if (columnsToExport === null || columnsToExport.length === 0) {
    gridOptions.columnApi.getAllDisplayedColumns().forEach((column) => {
      if (!column.getId().includes('delete')) {
        columnKeys.push(column);
      }
    });
  } else {
    columnKeys = columnsToExport;
  }
  const exportExcelParams: ExcelExportParams = {
    sheetName: fileName,
    exportMode: 'xlsx',
    columnKeys,
    processRowGroupCallback: rowGroupCallback,
  };

  const exportXMLParams: ExcelExportParams = {
    sheetName: fileName,
    exportMode: 'xml',
    columnKeys,
    processRowGroupCallback: rowGroupCallback,
  };

  if (exportType === 'excel') {
    gridOptions.api.exportDataAsExcel(exportExcelParams);
  } else if (exportType === 'csv') {
    gridOptions.api.exportDataAsCsv(exportExcelParams);
  } else if (exportType === 'xml') {
    gridOptions.api.exportDataAsExcel(exportXMLParams);
  }
}



// created for gridExport Functionality
export function gridExport(e: string, gridOptions: GridOptions) {
  const includeColumns = [];
  gridOptions.columnApi.getAllDisplayedColumns().forEach((column) => {
    if (column.getId() !== 'hrAction' && column.getId() !== 'rmVacancy'
      && !column.getId().includes('delete')) {
      includeColumns.push(column);
    }
  });
  function formattingFunction(params) {
    if ((params.column.getColId().includes('AttritionRate') ||
      params.column.getColId().includes('attritionRateQuarterlyDelta')) && (params.value || params.value === 0)) {
      return params.value + '%';
    } else {
      return params.value;
    }
  }
  const excelCols = {
    columnKeys: includeColumns,
    columnGroups: true,
    skipGroups: true,
    processCellCallback: formattingFunction,

  };

  if (e === 'excel') {
    gridOptions.api.exportDataAsExcel(excelCols);
  } else if (e === 'csv') {
    gridOptions.api.exportDataAsCsv(excelCols);
  } else if (e === 'xml') {
    gridOptions.api.exportDataAsExcel({ exportMode: 'xml', columnKeys: includeColumns });
  }
}

// created for CTP Number (Alphanumeric) Sorting
export function sortAlphaNum(a: string, b: string) {


  if (a === b) {          // identical? return 0
    return 0;
  } else if (a === null) {  // a is null? last
    return 1;
  } else if (b === null) {  // b is null? last
    return -1;
  }
  const reA = /[^a-zA-Z]/g;
  const reN = /[^0-9]/g;
  const aA = a.replace(reA, '');
  const bA = b.replace(reA, '');
  if (aA === bA) {
    const aN = parseInt(a.replace(reN, ''), 10);
    const bN = parseInt(b.replace(reN, ''), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  } else {
    return aA > bA ? 1 : -1;
  }
}

// validate seleted row content
export function validateSelectedRows(selectedRowNodes: RowNode[], columnsToValidate: string[]) {
  let invalidData = false;
  if (columnsToValidate) {
    columnsToValidate.forEach(element => {
      if (selectedRowNodes) {
        selectedRowNodes.forEach((rowNode: RowNode) => {
          const value = rowNode.data[element];
          if (value === undefined || value === null || isNaN(value) || Number(value) === 0) {
            return invalidData = true;
          }
        });
      }
    });
  }
  return invalidData;
}

// change history for all the screens
export function changeHistoryExport(params, cellHistoryFieldsArr: string[]) {
  if (cellHistoryFieldsArr.includes(params.column.userProvidedColDef.field)) {
    const result = [
      'copy',
      'copyWithHeaders',
      'export',
    ];
    return result;
  }
}

export function noneditableRowColor(params: any) {
  if (params.node.data.cancelled === true) {
    return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
  } else {
    return { 'text-align': 'right' };
  }
}
// firstname,lastname,middleinitial


export function cellStyleBasedonSelectionType(params: any) {

  // need to check with Amit
  if (params.node.data.cancelled === true) {
    return { backgroundColor: '#E6E6E6', 'text-align': 'right' };
  } else {
    if (params.node.data.selectionType === 'Internal to CTP') {
      return { backgroundColor: '#E6E6E6', 'text-align': 'right' };

    } else {
      return { 'text-align': 'right' };
    }
  }
}
export function editableBasedonSelectionType(params: any) {
  if (params.node.data.cancelled === true) {
    return false;
  } else {
    if (params.node.data.selectionType === 'Internal to CTP') {
      return false;

    } else {
      return true;
    }
  }
}
export function editableBasedonCondition(params: any) {
  return params.node.data.cancelled === false;
}
export function editableBasedonSelType(params: any) {
  return params.node.data.selectionType === 'Internal to CTP';
}
export function nonEditableTotalRow(params: any, value) {
  if (params.node.data.office === 'CTP') {
    return false;
  } else {
    return true;
  }
}
export function departureDataCheck(oneStaffData) {
  let disableDepartureLog = true;
  const reasonforDeparturing = oneStaffData[0].reasonForDeparting;
  const departureDate = oneStaffData[0].departureDate;
  const futureEmployer = oneStaffData[0].futureEmployer;
  const departureComments = oneStaffData[0].departureComments;
  if (reasonforDeparturing !== null || departureDate !== null
    || futureEmployer !== null || departureComments !== null) {
    disableDepartureLog = false;
  } else {
    disableDepartureLog = true;
  }
  return disableDepartureLog;
}
export function processReassignmentDataCheck(oneStaffData) {
  // Action
  let disableReassignClearButton = true;

  const action = oneStaffData[0].action;
  const reassignmentOffice = oneStaffData[0].reassignmentOffice;
  const reassignmentOrgLevel = oneStaffData[0].reassignmentOrgLevel;
  const effectiveDate = oneStaffData[0].reassignmentEffectiveDate;
  const vacancy = oneStaffData[0].vacancy;
  if (action !== null || reassignmentOffice !== null
    || reassignmentOrgLevel !== null || effectiveDate !== null || vacancy !== null) {
    return disableReassignClearButton = false;
  } else {
    return disableReassignClearButton = true;
  }
}
// jquery valueFormatter and date
export function dateValueFormatter(params) {
  if (params.value !== null && params.value !== '') {
    const date = new Date(params.value);
    return moment(date).format('MM/DD/YYYY');
  }
}
export function disabledVacancyDDOptions(args, tabControls) {
  if (args) {
    let testArray = [];
    tabControls.forEach(element => {
      if (element.name === 'vacancy') {
        testArray = args.map(x => ({
          id: x.id,
          smartListName: x.office,
          value: x.displaySummary,
          disabled: x.availableForReassignment
        }));
        element.options = testArray;
        element.options.forEach(element1 => {
          if (element1.disabled === true) {
            element1.disabled = false;
          } else {
            element1.disabled = true;
          }
        });
      }
    });
  }
}
// related to year dropdown  ( remove FY24 and add FY22)
export function changeYearDropDownVales(dropdownOriginalValues) {
  const startIndex = dropdownOriginalValues.indexOf('FY24');
  if (startIndex !== -1) {
    dropdownOriginalValues.splice(startIndex, 1);
    dropdownOriginalValues.push('FY22');
  }
  return dropdownOriginalValues;
}

