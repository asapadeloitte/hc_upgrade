import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GridService {
    constructor() { }

    private gridApi;
    private gridColumnApi;
    autoSizeCols(skipHeader) {
        const allColumnIds = [];
        this.gridColumnApi.getAllColumns().forEach((column) => {
          allColumnIds.push(column.colId);
        });
        this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
      }

      onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
      }
}
