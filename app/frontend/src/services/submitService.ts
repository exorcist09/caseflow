// src/services/submitService.ts
import { api } from '../lib/api';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function createImportFromCSV(csvText: string) {
  const form = new FormData();
  const blob = new Blob([csvText], { type: 'text/csv' });
  form.append('file', blob, 'import.csv');

  const res = await api.post('/import/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  // expects { importId, totalRows }
  return res.data;
}

/** send a single chunk to backend with retry */
export async function sendChunkWithRetry(importId: string, rows: any[], attempts = 3) {
  let attempt = 0;
  let lastError: any = null;
  while (attempt < attempts) {
    try {
      const res = await api.post(`/import/${importId}/chunk`, { rows });
      // res.data: { processed, successes, failures }
      return { ok: true, data: res.data };
    } catch (err) {
      lastError = err;
      attempt += 1;
      const backoff = 500 * Math.pow(2, attempt - 1);
      await sleep(backoff);
    }
  }
  return { ok: false, error: lastError };
}
