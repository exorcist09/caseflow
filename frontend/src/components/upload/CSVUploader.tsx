import { useState } from "react";
import DropZone from "../ui/DropZone";
import { useUploadStore } from "../../state/uploadStore";
import { useMappingStore } from "../../state/mappingStore";
import { validateCSVFile } from "../../utils/fileValidation";
import { useTranslation } from "react-i18next";

export default function CSVUploader() {
   const { t } = useTranslation();
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
      const worker = new Worker(
        new URL("../../workers/csvWorker.ts", import.meta.url),
        { type: "module" }
      );

      worker.postMessage(file);

      worker.onmessage = (e) => {
        const data = e.data;

        if (data.error) {
          setError(t("upload.csv_parse_failed") +data.error);
        } else {
          const rows = data.rows || data;             
          setRawRows(rows);                           
          if (rows.length) setCSVHeaders(Object.keys(rows[0])); 
        }

        setLoading(false);
        worker.terminate();
      };

      worker.onerror = (err) => {
              setError(t("upload.worker_error") + err.message);
        setLoading(false);
        worker.terminate();
      };
    } catch (err: any) {
      setError(t("upload.unexpected") + err.message );
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <DropZone onDrop={handleFiles} isDragging={dragging} />

      <p className="text-sm text-gray-500 text-center">
        {t("upload.supports_large_files")}
      </p>
    </div>
  );
}
