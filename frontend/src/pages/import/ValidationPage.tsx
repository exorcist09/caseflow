import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CSVGrid from "../../components/grid/CSVGrid";
import CellActionsModal from "../../components/validation/CellActionsModal";
import ErrorBadge from "../../components/validation/ErrorBadge";
import { useUploadStore } from "../../state/uploadStore";
import { useValidationStore } from "../../state/validationStore";
import ColumnTools from "../../components/validation/ColumnTools";


export default function ValidationPage() {
  const navigate = useNavigate();
  const { file, rawRows, mappedRows, setMappedRows } = useUploadStore();
  const { validateAll, errors, columnErrorCounts, fixAll, exportErrorCSV } =
    useValidationStore();

  const [modalState, setModalState] = useState<{
    open: boolean;
    rowIndex: number | null;
    field: string | null;
  }>({
    open: false,
    rowIndex: null,
    field: null,
  });

  useEffect(() => {
    // Redirect back to upload if nothing to validate
    if (!file || (!rawRows.length && !mappedRows.length)) {
      navigate("/import");
    }
  }, [file, rawRows, mappedRows, navigate]);

  // Run initial validation when page mounts (light touch)
  useEffect(() => {
    if (mappedRows && mappedRows.length) {
      validateAll(mappedRows);
    }
  }, [mappedRows]);

  function handleValidateAll() {
    validateAll(mappedRows);
  }

  function handleFixAll() {
    const fixed = fixAll(mappedRows);
    setMappedRows(fixed);
  }

  function handleCellSelect(rowIndex: number, field: string) {
    // Only open modal for cells that have errors
    if (errors[rowIndex] && errors[rowIndex][field]) {
      setModalState({ open: true, rowIndex, field });
    }
  }

  function handleApply(rows: any[]) {
    setMappedRows(rows);
  }

  function downloadErrors() {
    const csv = exportErrorCSV(mappedRows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "validation-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Validate Import</h1>
          <p className="text-sm text-gray-600">
            Run client-side validation, fix errors inline, and prepare to submit
            the import.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ErrorBadge
            count={Object.keys(errors).length}
            label="rows with errors"
          />
          <button
            onClick={handleValidateAll}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            Validate
          </button>
          <button
            onClick={handleFixAll}
            className="px-3 py-2 bg-emerald-600 text-white rounded"
          >
            Fix All
          </button>
          <button
            onClick={downloadErrors}
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Download Errors
          </button>
          <button
            onClick={() => navigate("/import/submit")}
            className="px-3 py-2 bg-black text-white rounded"
          >
            Submit →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white rounded-lg shadow p-4 space-y-6">
          {/* Error Counts */}
          <div>
            <h3 className="font-medium mb-3">Column error counts</h3>
            <ul className="space-y-2">
              {Object.keys(columnErrorCounts).length === 0 && (
                <li className="text-sm text-gray-500">No column errors yet.</li>
              )}
              {Object.entries(columnErrorCounts).map(([col, cnt]) => (
                <li key={col} className="flex justify-between">
                  <span className="text-sm">{col.replace(/_/g, " ")}</span>
                  <span className="text-sm font-semibold text-red-700">
                    {cnt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column Bulk Tools */}
          <ColumnTools
            columns={Object.keys(mappedRows[0] || {})}
            onApply={(updateFn) => setMappedRows(updateFn(mappedRows))}
          />
        </aside>

        <section className="md:col-span-3 bg-white rounded-lg shadow p-3">
          <CSVGrid
            rows={mappedRows}
            errors={errors}
            onRowsChange={(r) => setMappedRows(r)}
            onCellSelect={handleCellSelect}
          />
        </section>
      </div>

      <CellActionsModal
        open={modalState.open}
        onClose={() =>
          setModalState({ open: false, rowIndex: null, field: null })
        }
        rowIndex={modalState.rowIndex}
        field={modalState.field}
        rows={mappedRows}
        onApply={handleApply}
      />
    </div>
  );
}
