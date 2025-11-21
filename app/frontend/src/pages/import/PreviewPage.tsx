// app/frontend/src/pages/import/PreviewPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnMapper } from "../../components/mapping/ColumnMapper";
import SelectionToolbar from "../../components/bulk/SelectionToolbar";
import BulkEditDrawer from "../../components/bulk/BulkEditDrawer";
import { useBulkStore } from "../../state/bulkEditStore";

import CSVGrid from "../../components/grid/CSVGrid";
import { useUploadStore } from "../../state/uploadStore";
import { useValidationStore } from "../../state/validationStore";
import ErrorBadge from "../../components/validation/ErrorBadge";
import CellActionsModal from "../../components/validation/CellActionsModal";

export default function PreviewPage() {
  const navigate = useNavigate();
  const { file, rawRows, mappedRows, setMappedRows, applyMapping } =
    useUploadStore();
  const { validateAll, errors, columnErrorCounts, fixAll, exportErrorCSV } =
    useValidationStore();
  const [modal, setModal] = useState<{
    open: boolean;
    rowIndex: number | null;
    field: string | null;
  }>({ open: false, rowIndex: null, field: null });

  useEffect(() => {
    if (!file || rawRows.length === 0) navigate("/upload");
  }, [file, rawRows, navigate]);

  function onValidateAll() {
    validateAll(mappedRows);
  }

  function onFixAllClick() {
    const newRows = fixAll(mappedRows);
    setMappedRows(newRows);
  }

  function onCellSelect(rowIndex: number, field: string) {
    // open modal only if errors exist for that cell
    if (errors[rowIndex] && errors[rowIndex][field]) {
      setModal({ open: true, rowIndex, field });
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
    a.download = "errors.csv";
    a.click();
  }

  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "f"
      ) {
        e.preventDefault();
        setDrawerOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Preview & Validate</h1>
          <p className="text-sm text-gray-600">
            Validate rows client-side before submitting to backend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ErrorBadge
            count={Object.keys(errors).length}
            label="rows with errors"
          />
          <button
            onClick={onValidateAll}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            Validate
          </button>
          <button
            onClick={onFixAllClick}
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
        <aside className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-3">Column error counts</h3>
          <ul className="space-y-2">
            {Object.keys(columnErrorCounts).length === 0 && (
              <li className="text-sm text-gray-500">
                No column errors yet. Run validation.
              </li>
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
        </aside>

        <section className="md:col-span-3 bg-white rounded-lg shadow p-3">
          <CSVGrid
            rows={mappedRows}
            errors={errors}
            onRowsChange={(r) => setMappedRows(r)}
            onCellSelect={onCellSelect}
            onSelectionChange={(indices) =>
              useBulkStore.getState().setSelected(indices)
            }
          />
        </section>
      </div>

      <CellActionsModal
        open={modal.open}
        onClose={() => setModal({ open: false, rowIndex: null, field: null })}
        rowIndex={modal.rowIndex}
        field={modal.field}
        rows={mappedRows}
        onApply={handleApply}
      />
      <SelectionToolbar onOpenDrawer={() => setDrawerOpen(true)} />
      <BulkEditDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </div>
  );
}
