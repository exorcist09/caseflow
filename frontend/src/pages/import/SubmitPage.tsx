import { useState } from "react";
import { useUploadStore } from "../../state/uploadStore";
import { chunkArray } from "../../utils/chunk";
import {
  createImportFromCSV,
  sendChunkWithRetry,
} from "../../services/submitService";
import { useSubmitStore } from "../../state/submitStore";
import ProgressBar from "../../components/import/ProgressBar";
import ImportReport from "../../components/import/ImportReport";
import Papa from "papaparse";
import { useTranslation } from "react-i18next";

type FailureRow = { row: any; error: string };

export default function SubmitPage() {
  const { t } = useTranslation();

  const { mappedRows, setImportId } = useUploadStore();
  const {
    init,
    markInProgress,
    markSuccess,
    markFailed,
    setRunning,
    reset,
    successes,
    failures,
    chunks,
  } = useSubmitStore();

  const [percent, setPercent] = useState(0);
  const [failedRowsCSV, setFailedRowsCSV] = useState<string | null>(null);
  const [runningLocal, setRunningLocal] = useState(false);

  const CHUNK_SIZE = 500;

  async function startImport() {
    if (!mappedRows?.length) {
      alert(t("submit.noRows"));
      return;
    }

    try {
      setRunningLocal(true);
      setRunning(true);
      setPercent(0);

      const csvText = Papa.unparse(mappedRows);
      const { importId } = await createImportFromCSV(csvText);
      setImportId(importId);

      const chunked = chunkArray(mappedRows, CHUNK_SIZE);
      init(mappedRows.length, chunked.length);

      const aggregatedErrors: FailureRow[] = [];

      for (let i = 0; i < chunked.length; i++) {
        const chunk = chunked[i];
        markInProgress(i);

        setPercent(Math.round((i / chunked.length) * 100));

        const res = await sendChunkWithRetry(importId, chunk, 3);

        if (!res.ok) {
          // Entire chunk failed
          const failedRows: FailureRow[] = chunk.map((row) => ({
            row,
            error: String(res.error),
          }));
          markFailed(i, { failedRows, error: String(res.error) });
          aggregatedErrors.push(...failedRows);
        } else {
          // Chunk partially or fully succeeded
          const failuresList: FailureRow[] = res.data.failures ?? [];
          const successesList: string[] = res.data.successes ?? [];

          markSuccess(i, {
            processed: chunk.length,
            successes: successesList,
            failures: failuresList,
          });

          if (failuresList.length > 0) {
            aggregatedErrors.push(...failuresList);
          }
        }
      }

      setPercent(100);
      setRunning(false);
      setRunningLocal(false);

      // Prepare CSV for failed rows
      if (aggregatedErrors.length > 0) {
        const rows = aggregatedErrors.map((f) => ({
          ...(f.row ?? {}),
          __error: f.error,
        }));
        setFailedRowsCSV(Papa.unparse(rows));
      } else {
        setFailedRowsCSV(null);
      }
    } catch (err: any) {
      setRunning(false);
      setRunningLocal(false);
      alert(t("submit.importFailed") + ": " + err?.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">{t("submit.title")}</h1>
        <p className="text-gray-600">{t("submit.description")}</p>
      </div>

      <div className="bg-white border p-6 rounded-2xl shadow-sm space-y-6">
        {/* Row info */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">{t("submit.rowsToSend")}:</span>
          <span className="text-lg font-semibold text-indigo-600">
            {mappedRows?.length ?? 0}
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar percent={percent} />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={startImport}
            disabled={runningLocal}
            className={`px-5 py-2.5 rounded-lg font-medium transition ${
              runningLocal
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {runningLocal ? t("submit.importing") : t("submit.startImport")}
          </button>

          <button
            onClick={() => {
              reset();
              setPercent(0);
              setFailedRowsCSV(null);
            }}
            className="px-5 py-2.5 rounded-lg border font-medium hover:bg-gray-100"
          >
            {t("submit.reset")}
          </button>
        </div>

        {/* Chunk Status */}
        <div className="pt-4">
          <h4 className="font-medium text-lg">{t("submit.chunkStatuses")}</h4>
          <div className="flex flex-wrap gap-3 mt-3">
            {chunks.map((c) => (
              <div
                key={c.index}
                className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm border transition ${
                  c.status === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : c.status === "in-progress"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : c.status === "failed"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {t(`submit.status.${c.status}`)}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <ImportReport
          successes={successes}
          failures={failures}
          failedRowsCSV={failedRowsCSV}
        />
      </div>
    </div>
  );
}
