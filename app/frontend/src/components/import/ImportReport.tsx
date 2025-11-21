// src/components/import/ImportReport.tsx
import React from 'react';

export default function ImportReport({ successes, failures, failedRowsCSV }: { successes: number; failures: number; failedRowsCSV: string | null }) {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Import report</h3>
      <div className="flex gap-6">
        <div><span className="font-bold text-green-700">{successes}</span> succeeded</div>
        <div><span className="font-bold text-red-700">{failures}</span> failed</div>
      </div>

      {failures > 0 && failedRowsCSV && (
        <div className="mt-4">
          <button
            onClick={() => {
              const blob = new Blob([failedRowsCSV], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'import-failures.csv';
              a.click();
            }}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Download failed rows
          </button>
        </div>
      )}
    </div>
  );
}
