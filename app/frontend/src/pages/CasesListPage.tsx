import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function CasesListPage() {
  // type cases as array of any (or a proper Case type if you have one)
  const [cases, setCases] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);

  async function loadCases(nextCursor: string | null = null) {
    const res = await api.get("/cases", {
      params: { cursor: nextCursor },
    });

    // ensure res.data.data is an array
    setCases(res.data.data || []);
    setCursor(res.data.nextCursor || null);
  }

  useEffect(() => {
    loadCases();
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: "Case ID", field: "case_id" },
    { headerName: "Applicant", field: "applicant_name" },
    { headerName: "Category", field: "category" },
    { headerName: "Priority", field: "priority" },
    { headerName: "Status", field: "status" },
  ];

  const defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Cases</h1>

      <div className="ag-theme-alpine w-full h-[600px]">
        {/* columnDefs is the correct prop name */}
        <AgGridReact
          rowData={cases}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // optional:
          rowSelection="single"
          animateRows={true}
        />
      </div>

      <div className="mt-4 flex gap-4">
        {cursor && (
          <button
            onClick={() => loadCases(cursor)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Next Page
          </button>
        )}
      </div>
    </div>
  );
}
