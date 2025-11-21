import React, { useState } from "react";

interface ColumnToolsProps {
  columns: string[];
  onApply: (updateFn: (rows: any[]) => any[]) => void;
}

export default function ColumnTools({ columns, onApply }: ColumnToolsProps) {
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
        return str
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
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

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Bulk Column Tools</h3>

      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
        className="w-full border rounded px-2 py-2"
      >
        <option value="">Select column</option>
        {columns.map((col) => (
          <option key={col}>{col}</option>
        ))}
      </select>

      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="w-full border rounded px-2 py-2"
      >
        <option value="">Select Action</option>
        <option value="trim">Trim whitespace</option>
        <option value="lower">Convert to lowercase</option>
        <option value="upper">Convert to UPPERCASE</option>
        <option value="title">Title Case Names</option>
        <option value="normalize_phone">Normalize Phone (digits only)</option>
        <option value="to_iso_date">Convert Date → YYYY-MM-DD</option>
      </select>

      <button
        onClick={apply}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Apply to Column
      </button>
    </div>
  );
}
