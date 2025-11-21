// src/workers/csvWorker.ts
import Papa from "papaparse";

self.onmessage = (e) => {
  const file = e.data as File;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    worker: false, // Using *our* worker
    complete: (result) => {
      self.postMessage({ rows: result.data });
    },
    error: () => {
      self.postMessage({ error: true });
    },
  });
};
