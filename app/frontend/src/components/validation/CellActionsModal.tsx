
import React from 'react';
import { useValidationStore } from '../../state/validationStore';

type Props = {
  open: boolean;
  onClose: () => void;
  rowIndex: number | null;
  field: string | null;
  rows: Record<string, any>[];
  onApply: (rows: Record<string, any>[]) => void;
};

export default function CellActionsModal({ open, onClose, rowIndex, field, rows, onApply }: Props) {
  const { errors } = useValidationStore();
  if (!open || rowIndex === null || !field) return null;

  const cellErrs = errors[rowIndex]?.[field] || [];
  if (!cellErrs.length) return null;

  function applyFix() {
    const newRows = useValidationStore.getState().fixCell(rows, rowIndex, field);
    onApply(newRows);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-4">
        <h3 className="text-lg font-semibold mb-2">Fix suggestions</h3>
        <div className="mb-3 text-sm text-gray-700">
          <strong>Field:</strong> {field}<br />
          <strong>Errors:</strong>
          <ul className="list-disc ml-5">
            {cellErrs.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          <button onClick={applyFix} className="px-3 py-2 rounded bg-emerald-600 text-white">Apply suggested fix</button>
        </div>
      </div>
    </div>
  );
}
