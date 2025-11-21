// src/pages/MappingPage.tsx
import MappingTable from "../components/mapping/MappingTable";
import { useMappingStore } from "../state/mappingStore";
import { useNavigate } from "react-router-dom";

export default function MappingPage() {
  const { autoMap, isValid } = useMappingStore();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Column Mapping</h1>

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
        onClick={() => navigate("/validate")}
        disabled={!isValid()}
        className={`rounded-lg px-4 py-2 font-medium shadow ${
          isValid()
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
