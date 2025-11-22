import Papa from "papaparse";

export function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}
