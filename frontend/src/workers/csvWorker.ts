// src/utils/csvWorker.ts
/* eslint-disable no-restricted-globals */
import { parse } from 'papaparse';

self.onmessage = async (e) => {
  const file = e.data as File;

  parse(file, {
    header: true,
    skipEmptyLines: true,
    worker: true, // PapaParse uses a worker internally
    complete: (results) => {
      // send parsed data back to main thread
      self.postMessage(results.data);
    },
    error: (err) => {
      self.postMessage({ error: err.message });
    },
  });
};
