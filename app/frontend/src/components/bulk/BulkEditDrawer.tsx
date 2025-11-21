// src/components/bulk/BulkEditDrawer.tsx
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useBulkStore } from '../../state/bulkEditStore';
import { useUploadStore } from '../../state/uploadStore';
import { useValidationStore } from '../../state/validationStore';

export default function BulkEditDrawer({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const selected = useBulkStore(s => s.selected);
  const applySetColumnValue = useBulkStore(s => s.applySetColumnValue);
  const applyFixAll = useBulkStore(s => s.applyFixAll);
  const undo = useBulkStore(s => s.undo);

  const { mappedRows, setMappedRows } = useUploadStore();
  const { validateAll } = useValidationStore();

  const [field, setField] = useState<string>('priority');
  const [value, setValue] = useState<string>('LOW');

  function applySet() {
    const next = applySetColumnValue(mappedRows, field, value);
    setMappedRows(next);
    validateAll(next);
    setOpen(false);
  }

  function applyFix() {
    // use the validationStore's fixAll (already implemented)
    const next = useValidationStore.getState().fixAll(mappedRows);
    setMappedRows(next);
    validateAll(next);
    setOpen(false);
  }

  function doUndo() {
    undo(setMappedRows);
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog className="fixed inset-0 z-50" onClose={() => setOpen(false)}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0" leave="ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-4">
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title className="text-lg font-medium">Bulk actions — {selected.length} rows</Dialog.Title>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Field</label>
                  <select value={field} onChange={(e) => setField(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2">
                    {/* show fields known in schema */}
                    <option value="priority">priority</option>
                    <option value="category">category</option>
                    <option value="applicant_name">applicant_name</option>
                    <option value="phone">phone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Value</label>
                  <input value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
                </div>

                <div className="flex gap-2 justify-end">
                  <button onClick={() => setOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                  <button onClick={applySet} className="px-4 py-2 rounded bg-blue-600 text-white">Apply</button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2 justify-between">
                    <button onClick={() => {
                      const next = useBulkStore.getState().applyFixAll(mappedRows, (r:any) => useValidationStore.getState().fixAll([r])[0]);
                      setMappedRows(next);
                      validateAll(next);
                      setOpen(false);
                    }} className="px-3 py-2 rounded bg-emerald-600 text-white">Fix All Selected</button>

                    <button onClick={doUndo} className="px-3 py-2 rounded border">Undo</button>
                  </div>
                </div>

              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
