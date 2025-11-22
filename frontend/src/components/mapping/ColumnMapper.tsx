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