import { useMemo, useRef, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  CellValueChangedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

type ErrorMap = Record<number, Record<string, string[]>>;

interface CSVGridProps {
  rows: any[];
  errors?: ErrorMap;
  onRowsChange?: (rows: any[]) => void;
  onCellSelect?: (rowIndex: number, field: string, value: any) => void;
  onSelectionChange?: (selectedIndices: number[]) => void;
}

export default function CSVGrid({
  rows,
  errors = {},
  onRowsChange,
  onCellSelect,
  onSelectionChange,
}: CSVGridProps) {
  const gridRef = useRef<AgGridReact<any>>(null);

  useEffect(() => {
    gridRef.current?.api?.refreshCells({ force: false });
  }, [errors]);

  const columnDefs: ColDef[] = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    return Object.keys(rows[0]).map((field) => ({
      field,
      headerName: field.replace(/_/g, " ").toUpperCase(),
      editable: true,
      minWidth: 160,
      sortable: true,
      filter: true,
      resizable: true,

      cellRenderer: (params: any) => {
        const rowIndex = params.rowIndex ?? -1;
        const value = params.value;

        const hasError =
          errors[rowIndex] && errors[rowIndex][params.colDef.field];

        return (
          <div
            className={`w-full h-full flex items-center px-2 truncate ${
              hasError ? "bg-red-50 ring-2 ring-red-300" : ""
            }`}
            title={String(value ?? "")}
          >
            {String(value ?? "")}
            {hasError && (
              <span className="ml-auto text-xs text-red-700 font-bold">!</span>
            )}
          </div>
        );
      },
    }));
  }, [rows, errors]);

  /** Handle edits safely */
  const handleCellValueChanged = useCallback(
    (e: CellValueChangedEvent) => {
      if (e.rowIndex == null || !onRowsChange) return;

      const updated = [...rows];
      updated[e.rowIndex] = e.data;
      onRowsChange(updated);
    },
    [rows, onRowsChange]
  );

  /** Handle row selection safely */
  const handleSelectionChanged = useCallback(
    (e: SelectionChangedEvent) => {
      if (!onSelectionChange) return;

      const selected = (gridRef.current?.api
        ?.getSelectedNodes()
        .map((n) => n.rowIndex)
        .filter((i): i is number => i != null)) ?? [];

      onSelectionChange(selected);
    },
    [onSelectionChange]
  );

  return (
    <div>
      <div className="mb-3 text-sm text-gray-600">
        Rows Loaded: {rows?.length ?? 0}
      </div>

      <div className="ag-theme-alpine" style={{ height: 520, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={{
            editable: true,
            sortable: true,
            filter: true,
            resizable: true,
          }}
          rowSelection="multiple"
          suppressRowClickSelection
          enableCellTextSelection
          animateRows={false}
          rowBuffer={40}
          cacheQuickFilter={true}
          onCellValueChanged={handleCellValueChanged}
          onCellClicked={(params) =>
            params.rowIndex != null &&
            onCellSelect?.(
              params.rowIndex,
              params.colDef.field as string,
              params.value
            )
          }
          onSelectionChanged={handleSelectionChanged}
        />
      </div>
    </div>
  );
}
