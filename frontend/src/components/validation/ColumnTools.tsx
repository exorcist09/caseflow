import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ColumnToolsProps {
  columns: string[];
  onApply: (updateFn: (rows: any[]) => any[]) => void;
}

export default function ColumnTools({ columns, onApply }: ColumnToolsProps) {
  const { t } = useTranslation();
  const [selectedColumn, setSelectedColumn] = useState("");
  const [action, setAction] = useState("");

  function transform(value: any) {
    if (value == null) return value;
    const str = String(value);

    switch (action) {
      case "trim":
        return str.trim();
      case "lower":
        return str.toLowerCase();
      case "upper":
        return str.toUpperCase();
      case "title":
        return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      case "normalize_phone":
        return str.replace(/\D/g, "");
      case "to_iso_date":
        return new Date(str).toISOString().split("T")[0];
      default:
        return value;
    }
  }

  function apply() {
    if (!selectedColumn || !action) return;

    onApply((rows) =>
      rows.map((r) => ({
        ...r,
        [selectedColumn]: transform(r[selectedColumn]),
      }))
    );
  }

  const isReady = selectedColumn && action;

  return (
    <div className="space-y-5 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-lg">
        {t("columnTools.title")}
      </h3>

      {/* Column Select */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">
          {t("columnTools.selectColumn")}
        </label>

        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">{t("columnTools.selectColumn")}</option>
          {columns.map((col) => (
            <option key={col}>{col}</option>
          ))}
        </select>
      </div>

      {/* Action Select */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">
          {t("columnTools.selectAction")}
        </label>

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">{t("columnTools.selectAction")}</option>
          <option value="trim">{t("columnTools.trim")}</option>
          <option value="lower">{t("columnTools.lower")}</option>
          <option value="upper">{t("columnTools.upper")}</option>
          <option value="title">{t("columnTools.titleCase")}</option>
          <option value="normalize_phone">{t("columnTools.normalizePhone")}</option>
          <option value="to_iso_date">{t("columnTools.toISODate")}</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={apply}
        disabled={!isReady}
        className={`w-full py-2 rounded-lg font-medium transition shadow-sm ${
          isReady
            ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {t("columnTools.apply")}
      </button>

      {/* Preview info */}
      {isReady && (
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          {t("columnTools.willApplyTo")}{" "}
          <span className="font-semibold">{selectedColumn}</span>
        </div>
      )}
    </div>
  );
}
