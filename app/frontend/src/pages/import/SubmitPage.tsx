// src/pages/import/SubmitPage.tsx
import React, { useState } from 'react';
import { useUploadStore } from '../../state/uploadStore';
import { chunkArray } from '../../utils/chunk';
import { createImportFromCSV, sendChunkWithRetry } from '../../services/submitService';
import { useSubmitStore } from '../../state/submitStore';
import ProgressBar from '../../components/import/ProgressBar';
import ImportReport from '../../components/import/ImportReport';
import { useValidationStore } from '../../state/validationStore';
import Papa from 'papaparse';

export default function SubmitPage() {
  const { mappedRows, file, setImportId } = useUploadStore();
  const { init, markInProgress, markSuccess, markFailed, setRunning, reset, successes, failures, chunks } = useSubmitStore();
  const [percent, setPercent] = useState(0);
  const [failedRowsCSV, setFailedRowsCSV] = useState<string | null>(null);
  const [runningLocal, setRunningLocal] = useState(false);
  const { exportErrorCSV } = useValidationStore();

  const CHUNK_SIZE = 500;

  async function startImport() {
    if (!mappedRows || mappedRows.length === 0) {
      alert('No rows to import.');
      return;
    }

    try {
      setRunningLocal(true);
      setRunning(true);

      // 1) Create CSV text from mappedRows (so backend gets same rows)
      const csvText = Papa.unparse(mappedRows);

      // 2) Create import on backend (returns importId)
      const { importId, totalRows } = await createImportFromCSV(csvText);
      setImportId(importId);

      // 3) Chunk client-side and init progress
      const chunksArr = chunkArray(mappedRows, CHUNK_SIZE);
      init(mappedRows.length, chunksArr.length);

      // 4) Upload chunks sequentially (can be parallelized later)
      const aggregatedFailures: any[] = [];
      for (let i = 0; i < chunksArr.length; i++) {
        const chunk = chunksArr[i];
        markInProgress(i);
        setPercent(Math.round(((i) / chunksArr.length) * 100));

        const res = await sendChunkWithRetry(importId, chunk, 3);
        if (!res.ok) {
          markFailed(i, res.error);
          // capture chunk-level failure
          aggregatedFailures.push({ chunkIndex: i, error: String(res.error) });
        } else {
          markSuccess(i, res.data);
          if (res.data.failures && res.data.failures.length) {
            // append failures returned by backend
            res.data.failures.forEach((f: any) => aggregatedFailures.push({ chunkIndex: i, row: f.row, error: f.error }));
          }
        }
      }

      // final percent 100
      setPercent(100);
      setRunning(false);
      setRunningLocal(false);

      // build failed CSV if any (if your validationStore can produce error CSV use that; else generate)
      if (aggregatedFailures.length > 0) {
        // build simple CSV with original row + error column
        const rowsWithErrors = aggregatedFailures.map((f) => ({
          ...f.row,
          __error: f.error || 'chunk_failed'
        }));
        const csv = Papa.unparse(rowsWithErrors);
        setFailedRowsCSV(csv);
      } else {
        setFailedRowsCSV(null);
      }
    } catch (err: any) {
      setRunning(false);
      setRunningLocal(false);
      alert('Import failed: ' + (err.message || String(err)));
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Submit Import</h1>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <p className="text-sm text-gray-600">Rows to send: <strong>{mappedRows?.length ?? 0}</strong></p>

        <div className="space-y-2">
          <ProgressBar percent={percent} />
          <div className="flex gap-2 items-center">
            <button
              onClick={startImport}
              disabled={runningLocal}
              className={`px-4 py-2 rounded ${runningLocal ? 'bg-gray-300 text-gray-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {runningLocal ? 'Importing…' : 'Start Import'}
            </button>
            <button onClick={() => { reset(); setPercent(0); setFailedRowsCSV(null); }} className="px-3 py-2 border rounded">Reset progress</button>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Chunk statuses</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {chunks.map((c) => (
              <div key={c.index} className={`px-3 py-1 rounded text-sm ${c.status === 'success' ? 'bg-green-50 text-green-700' : c.status === 'in-progress' ? 'bg-blue-50 text-blue-700' : c.status === 'failed' ? 'bg-red-50 text-red-700': 'bg-gray-100 text-gray-700'}`}>
                #{c.index + 1} — {c.status}
              </div>
            ))}
          </div>
        </div>

        <ImportReport successes={useSubmitStore.getState().successes} failures={useSubmitStore.getState().failures} failedRowsCSV={failedRowsCSV} />
      </div>
    </div>
  );
}
