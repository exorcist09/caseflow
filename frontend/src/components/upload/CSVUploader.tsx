// src/components/upload/CSVUploader.tsx
import { useState } from "react";
import DropZone from "../ui/DropZone";
import { useUploadStore } from "../../state/uploadStore";
import { useMappingStore } from "../../state/mappingStore";
import { validateCSVFile } from "../../utils/fileValidation";

export default function CSVUploader() {
  const { setFile, setRawRows, setError, setLoading } = useUploadStore();
  const { setCSVHeaders } = useMappingStore();
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList) {
    const file = files[0];
    const error = validateCSVFile(file);

    if (error) {
      setError(error);
      return;
    }

    setError(null);
    setFile(file);
    setLoading(true);

    try {
      // ✅ Use Web Worker for large CSV parsing
      const worker = new Worker(
        new URL("../../workers/csvWorker.ts", import.meta.url),
        { type: "module" }
      );

      worker.postMessage(file);

      worker.onmessage = (e) => {
        const data = e.data;

        if (data.error) {
          setError(`Failed to parse CSV: ${data.error}`);
        } else {
          const rows = data.rows || data;             // parsed rows
          setRawRows(rows);                           // store rows in upload store
          if (rows.length) setCSVHeaders(Object.keys(rows[0])); // store headers for mapping dropdown
        }

        setLoading(false);
        worker.terminate();
      };

      worker.onerror = (err) => {
        setError(`CSV Worker Error: ${err.message}`);
        setLoading(false);
        worker.terminate();
      };
    } catch (err: any) {
      setError(`Unexpected Error: ${err.message || err}`);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <DropZone onDrop={handleFiles} isDragging={dragging} />

      <p className="text-sm text-gray-500 text-center">
        Supports files up to <strong>50 MB</strong> and <strong>50k+ rows</strong> (parsed off main thread for smooth UI).
      </p>
    </div>
  );
}
