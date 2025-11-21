// src/components/bulk/SelectionToolbar.tsx
import React from 'react';
import { useBulkStore } from '../../state/bulkEditStore';
import { useUploadStore } from '../../state/uploadStore';

export default function SelectionToolbar({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const selected = useBulkStore(s => s.selected);
  const clearSelected = useBulkStore(s => s.clearSelected);
  const count = selected.length;

  return (
    <div className="fixed left-4 bottom-6 z-40">
      {count > 0 && (
        <div className="flex items-center gap-3 bg-white shadow-lg rounded-lg p-3">
          <div className="text-sm font-medium">{count} selected</div>
          <button
            onClick={onOpenDrawer}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            aria-label="Bulk edit selected rows"
          >
            Bulk Edit
          </button>
          <button
            onClick={() => {
              // quick delete confirmation
              if (!confirm(`Delete ${count} selected rows?`)) return;
              const rows = useUploadStore.getState().mappedRows;
              const next = useBulkStore.getState().applyDeleteSelected(rows);
              useUploadStore.getState().setMappedRows(next);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button onClick={() => clearSelected()} className="px-2 py-1 border rounded">Clear</button>
        </div>
      )}
    </div>
  );
}
