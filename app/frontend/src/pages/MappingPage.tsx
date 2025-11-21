// src/pages/MappingPage.tsx
import MappingTable from "../components/mapping/MappingTable";
import { useMappingStore } from "../state/mappingStore";
import { useUploadStore } from "../state/uploadStore";
import { useNavigate } from "react-router-dom";

export default function MappingPage() {
  const navigate = useNavigate();

  // From mapping store
  const { mappings, autoMap, isValid } = useMappingStore();

  // From upload store
  const { rawRows, setMappedRows } = useUploadStore();

  // Convert rawRows -> mappedRows based on user's dropdown selections
  function handleContinue() {
    if (!rawRows.length) return;

    const mapped = rawRows.map((row: any) => {
      const obj: any = {};

      Object.keys(mappings).forEach((schemaField) => {
        const csvColumn = mappings[schemaField];
        obj[schemaField] = csvColumn ? row[csvColumn] : null;
      });

      return obj;
    });

    setMappedRows(mapped);

    navigate("/validate"); // GO TO VALIDATION PAGE
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Column Mapping / Schema Mapping</h1>

      <button
        onClick={autoMap}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
      >
        Auto-Detect
      </button>

      <MappingTable />

      {!isValid() && (
        <p className="text-red-500 text-sm">
          Please map all required fields before continuing.
        </p>
      )}

      <button
        onClick={handleContinue}
        disabled={!isValid()}
        className={`rounded-lg px-4 py-2 font-medium shadow ${
          isValid()
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue →
      </button>
    </div>
  );
}
