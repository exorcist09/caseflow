import MappingTable from "../components/mapping/MappingTable";
import { useMappingStore } from "../state/mappingStore";
import { useUploadStore } from "../state/uploadStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function MappingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mappings, autoMap, isValid } = useMappingStore();
  const { rawRows, setMappedRows } = useUploadStore();

  // Memoize validity to avoid multiple calls
  const valid = useMemo(() => isValid(), [mappings]);

  function handleContinue() {
    if (!rawRows.length) return;

    const mapped = rawRows.map((row: any) => {
      const obj: Record<string, any> = {};
      Object.keys(mappings).forEach((schemaField) => {
        const csvColumn = mappings[schemaField];
        obj[schemaField] = csvColumn ? row[csvColumn] : null;
      });
      return obj;
    });

    setMappedRows(mapped);
    navigate("/validate");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {t("mapping.title")}
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            {t("mapping.subtitle", {
              defaultValue:
                "Map your CSV columns to the required fields before validation.",
            })}
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 space-y-6">

          {/* Auto Map Button */}
          <div className="flex justify-end">
            <button
              onClick={autoMap}
              className="rounded-lg px-4 py-2 bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-95 transition"
            >
              {t("mapping.auto_detect")}
            </button>
          </div>

          {/* Mapping Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <MappingTable />
          </div>

          {/* Error if required fields missing */}
          {!valid && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fadeIn">
              ⚠️ {t("mapping.map_all_required")}
            </div>
          )}
        </div>

        {/* Sticky bottom action bar */}
        <div className="sticky bottom-4 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!valid}
            className={`px-8 py-3 rounded-xl text-lg font-medium shadow-lg transition-all ${
              valid
                ? "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {t("mapping.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
