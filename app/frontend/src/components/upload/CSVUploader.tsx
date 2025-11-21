import { useState } from "react";
import DropZone from "../ui/DropZone";
import { useUploadStore } from "../../state/uploadStore";
import { validateCSVFile } from "../../utils/fileValidation";
import { parseCSV } from "../../utils/csv";


export default function CSVUploader() {
const { setFile, setRawRows, setError, setLoading } = useUploadStore();

  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList) {
    const file = files[0];
    const error = validateCSVFile(file);

    if (error) return setError(error);

    setError(null);
    setFile(file);
    setLoading(true);

    try {
      const parsedRows = await parseCSV(file);
      setRawRows(parsedRows);
    } catch {
      setError("Failed to parse the CSV.");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <DropZone onDrop={handleFiles} isDragging={dragging} />

      <p className="text-sm text-gray-500 text-center">
        Supports files up to <strong>50 MB</strong> with up to <strong>50k rows</strong>.
      </p>
    </div>
  );
}
