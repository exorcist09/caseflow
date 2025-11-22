// src/hooks/useCSVWorker.ts
import { useState } from 'react';

export function useCSVWorker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (file: File): Promise<any[]> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('../utils/csvWorker.ts', import.meta.url), {
        type: 'module',
      });

      worker.postMessage(file);

      worker.onmessage = (event) => {
        const data = event.data;

        if (data?.error) {
          setError(data.error);
          setLoading(false);
          reject(data.error);
        } else {
          setLoading(false);
          resolve(data);
        }

        worker.terminate();
      };

      worker.onerror = (err) => {
        setError(err.message);
        setLoading(false);
        reject(err.message);
        worker.terminate();
      };
    });
  };

  return { parseCSV, loading, error };
}
