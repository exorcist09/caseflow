// app/frontend/src/components/mapping/ColumnMapper.tsx
import React, { useEffect, useState } from 'react';
import { useUploadStore } from '../../state/uploadStore';
import { inferMapping } from '../../utils/grid-utils';

import { Listbox } from "@headlessui/react";
import { useMappingStore } from "../../state/mappingStore";

interface Props {
  field: string;
  label: string;
}

const schemaFields = [
  'case_id',
  'applicant_name',
  'dob',
  'email',
  'phone',
  'category',
  'priority',
];

export  function ColumnMapper() {
  const { rawRows, mapping, setMapping, applyMapping } = useUploadStore();
  const headers = rawRows?.length ? Object.keys(rawRows[0]) : [];
  const [local, setLocal] = useState<Record<string, string>>(mapping || {});

  useEffect(() => {
    setLocal(mapping || {});
  }, [mapping]);

  function onAutoDetect() {
    const inferred = inferMapping(headers, schemaFields);
    setMapping(inferred);
    setLocal(inferred);
    applyMapping(schemaFields);
  }

  function onChange(field: string, header: string) {
    const next = { ...local, [field]: header };
    setLocal(next);
    setMapping(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Column mapping</h3>
        <button onClick={onAutoDetect} className="text-sm text-blue-600 hover:underline">Auto-detect</button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-500">Map CSV headers to CaseFlow fields.</p>
        <div className="divide-y">
          {schemaFields.map((field) => (
            <div key={field} className="py-2 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{field.replace(/_/g, ' ')}</div>
                <div className="text-xs text-gray-500">required</div>
              </div>
              <div className="w-48">
                <select
                  value={local[field] ?? ''}
                  onChange={(e) => onChange(field, e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">— select header —</option>
                  {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export  function ColumnMapping({ field, label }: Props) {
  const { csvHeaders, mappings, setMapping } = useMappingStore();
  const selected = mappings[field] ?? null;

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={(val) => setMapping(field, val)}>
        <div className="relative">
          <Listbox.Button className="w-full rounded-lg border px-3 py-2 text-left shadow-sm focus:outline-none">
            {selected ?? "Select column"}
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg">
            {csvHeaders.map((h) => (
              <Listbox.Option
                key={h}
                value={h}
                className={({ active }) =>
                  `cursor-pointer select-none px-3 py-2 ${
                    active ? "bg-blue-100" : ""
                  }`
                }
              >
                {h}
              </Listbox.Option>
            ))}

            <Listbox.Option value={null} className="px-3 py-2 text-red-500">
              Clear
            </Listbox.Option>
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}