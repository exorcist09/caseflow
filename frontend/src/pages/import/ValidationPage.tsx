import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CSVGrid from "../../components/grid/CSVGrid";
import CellActionsModal from "../../components/validation/CellActionsModal";
import ErrorBadge from "../../components/validation/ErrorBadge";
import { useUploadStore } from "../../state/uploadStore";
import { useValidationStore } from "../../state/validationStore";
import ColumnTools from "../../components/validation/ColumnTools";
import { useTranslation } from "react-i18next";

export default function ValidationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { file, rawRows, mappedRows, setMappedRows } = useUploadStore();
  const { validateAll, errors, columnErrorCounts, fixAll } = useValidationStore();

  const [modalState, setModalState] = useState({
    open: false,
    rowIndex: null as number | null,
    field: null as string | null,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to upload if no file
  useEffect(() => {
    if (!file || (!rawRows.length && !mappedRows.length)) {
      navigate("/import");
    }
  }, [file, rawRows, mappedRows, navigate]);

  // Initial validation on mount
  useEffect(() => {
    if (mappedRows && mappedRows.length) {
      validateAll(mappedRows);
    }
  }, [mappedRows, validateAll]);

  function handleValidateAll() {
    validateAll(mappedRows);
  }

  function handleFixAll() {
    const fixed = fixAll(mappedRows);
    setMappedRows(fixed);
  }

  function handleCellSelect(rowIndex: number, field: string) {
    if (errors[rowIndex] && errors[rowIndex][field]) {
      setModalState({ open: true, rowIndex, field });
    }
  }

  function handleApply(rows: any[]) {
    setMappedRows(rows);
  }

  function downloadErrors() {
    const csv = useValidationStore.getState().exportErrorCSV(mappedRows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "validation-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky top action bar */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {t("validation.title")}
            </h1>
            <p className="text-sm text-gray-600">{t("validation.subtitle")}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ErrorBadge
              count={Object.keys(errors).length}
              label={t("validation.rows_with_errors")}
            />

            <button
              onClick={handleValidateAll}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 active:scale-95 transition"
            >
              {t("validation.validate")}
            </button>

            <button
              onClick={handleFixAll}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 active:scale-95 transition"
            >
              {t("validation.fix_all")}
            </button>

            <button
              onClick={downloadErrors}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 active:scale-95 transition"
            >
              {t("validation.download_errors")}
            </button>

            <button
              onClick={() => navigate("/import/submit")}
              className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-900 active:scale-95 transition"
            >
              {t("validation.submit")}
            </button>

            {/* Mobile sidebar toggle */}
            <button
              className="px-3 py-2 bg-gray-50 rounded-lg md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? "Hide Tools" : "Show Tools"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">

        {/* Sidebar */}
        <aside
          className={`bg-white rounded-xl shadow p-5 space-y-6 border border-gray-200 transform transition-all duration-300
          ${sidebarOpen ? "block" : "hidden"} md:block`}
        >
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">
              Errors
            </h3>

            <ul className="space-y-2">
              {Object.keys(columnErrorCounts).length === 0 && (
                <li className="text-sm text-gray-500">No column errors yet.</li>
              )}

              {Object.entries(columnErrorCounts).map(([col, cnt]) => (
                <li
                  key={col}
                  className="flex justify-between text-sm bg-red-50 border border-red-200 rounded px-2 py-1"
                >
                  <span className="capitalize text-gray-800">
                    {col.replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold text-red-700">{cnt}</span>
                </li>
              ))}
            </ul>
          </div>

          <ColumnTools
            columns={Object.keys(mappedRows[0] || {})}
            onApply={(updateFn) => setMappedRows(updateFn(mappedRows))}
          />
        </aside>

        {/* CSV Grid Section */}
        <section className="md:col-span-3 bg-white rounded-xl shadow border border-gray-200 p-4">
          <CSVGrid
            rows={mappedRows}
            errors={errors}
            onRowsChange={setMappedRows}
            onCellSelect={handleCellSelect}
          />
        </section>
      </div>

      {/* Modal */}
      <CellActionsModal
        open={modalState.open}
        onClose={() => setModalState({ open: false, rowIndex: null, field: null })}
        rowIndex={modalState.rowIndex}
        field={modalState.field}
        rows={mappedRows}
        onApply={handleApply}
      />
    </div>
  );
}
