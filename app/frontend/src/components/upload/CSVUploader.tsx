import { useState } from "react";
import DropZone from "../ui/DropZone";
import { useUploadStore } from "../../state/uploadStore";
import { validateCSVFile } from "../../utils/fileValidation";

export default function CSVUploader() {
  const { setFile, setRawRows, setError, setLoading } = useUploadStore();
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

    /** --- 🔥 Use Web Worker CSV Parsing for 50k+ rows --- */
    const worker = new Worker(
      new URL("../../workers/csvWorker.ts", import.meta.url)
    );

    worker.postMessage(file);

    worker.onmessage = (e) => {
      const { rows, error } = e.data;

      if (error) {
        setError("Failed to parse CSV");
      } else {
        setRawRows(rows);
      }

      setLoading(false);
      worker.terminate();
    };
  }

  return (
    <div className="space-y-4">
      <DropZone onDrop={handleFiles} isDragging={dragging} />

      <p className="text-sm text-gray-500 text-center">
        Supports files up to <strong>50 MB</strong> and{" "}
        <strong>50k+ rows</strong> (auto-optimized).
      </p>
    </div>
  );
}
