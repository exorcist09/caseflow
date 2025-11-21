// src/components/grid/CSVGrid.tsx
import React, { useMemo, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

type Props = {
  rows: any[];
  errors?: Record<number, Record<string, string[]>>;
  onRowsChange?: (rows: any[]) => void;
  onCellSelect?: (rowIndex: number, field: string, value: any) => void;
  onSelectionChange?: (selectedIndices: number[]) => void; // NEW: emits indices of selected rows
};

export default function CSVGrid({ rows, errors = {}, onRowsChange, onCellSelect, onSelectionChange }: Props) {
  const gridRef = useRef<any>(null);

  useEffect(() => {
    if (gridRef.current?.api) gridRef.current.api.refreshCells();
  }, [errors, rows]);

  const columnDefs: ColDef[] = useMemo(() => {
    if (!rows || rows.length === 0) return [];
    return Object.keys(rows[0]).map((k) => ({
      field: k,
      headerName: (k || '').replace(/_/g, ' '),
      editable: true,
      filter: true,
      sortable: true,
      resizable: true,
      minWidth: 160,
      cellRenderer: (params: any) => {
        const rowIndex = params.rowIndex;
        const val = params.value;
        const hasError = !!(errors[rowIndex] && errors[rowIndex][params.colDef.field]);
        return (
          <div className={`w-full h-full flex items-center ${hasError ? 'ring-2 ring-red-300 bg-red-50' : ''}`}>
            <div className="px-2 truncate" title={String(val ?? '')}>{String(val ?? '')}</div>
            {hasError && <div className="ml-auto mr-2 text-xs text-red-700">!</div>}
          </div>
        );
      }
    }));
  }, [rows, errors]);

  function handleCellChanged(e: any) {
    if (!onRowsChange) return;
    const updated = [...rows];
    updated[e.rowIndex] = e.data;
    onRowsChange(updated);
  }

  function onSelection(e: SelectionChangedEvent) {
    const selected = gridRef.current?.api.getSelectedNodes()?.map((n: any) => n.rowIndex) ?? [];
    onSelectionChange && onSelectionChange(selected);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Rows: {rows?.length ?? 0}</div>
      </div>

      <div className="ag-theme-alpine" style={{ height: 520, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: true,
            filter: true,
            sortable: true,
            resizable: true,
          }}
          rowSelection="multiple"
          onCellValueChanged={handleCellChanged}
          onCellClicked={(params) => onCellSelect && onCellSelect(params.rowIndex, params.colDef.field as string, params.value)}
          onSelectionChanged={onSelection}
          suppressRowClickSelection
          animateRows
          enableCellTextSelection
          rowBuffer={200}
        />
      </div>
    </div>
  );
}
