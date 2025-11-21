// src/components/mapping/MappingTable.tsx
import {ColumnMapping} from "./ColumnMapper";
import { ALL_FIELDS } from "../../utils/schema";

export default function MappingTable() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Map CSV Columns</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ALL_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col space-y-1">
            <label className="font-medium text-gray-700">{field.label}</label>
            <ColumnMapping field={field.key} label={field.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
