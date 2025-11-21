// src/state/bulkEditStore.ts
import create from 'zustand';

type BulkAction = {
  type: 'set' | 'delete' | 'fixAll';
  payload?: any;
  prevRows?: Record<string, any>[]; // snapshot for undo
};

type BulkState = {
  selected: number[]; // row indices
  lastAction: BulkAction | null;
  setSelected: (indices: number[]) => void;
  clearSelected: () => void;

  applySetColumnValue: (rows: Record<string, any>[], field: string, value: any) => Record<string, any>[];
  applyDeleteSelected: (rows: Record<string, any>[]) => Record<string, any>[];
  applyFixAll: (rows: Record<string, any>[], fixer: (r: Record<string, any>) => Record<string, any>) => Record<string, any>[];
  undo: (setRows: (r: Record<string, any>[]) => void) => void;
};

export const useBulkStore = create<BulkState>((set, get) => ({
  selected: [],
  lastAction: null,
  setSelected: (indices) => set({ selected: indices }),
  clearSelected: () => set({ selected: [] }),

  applySetColumnValue(rows, field, value) {
    const snapshot = rows.map(r => ({ ...r }));
    const sel = get().selected;
    const next = [...rows];
    sel.forEach((i) => {
      if (i >= 0 && i < next.length) next[i] = { ...next[i], [field]: value };
    });
    set({ lastAction: { type: 'set', payload: { field, value, selected: sel }, prevRows: snapshot } });
    return next;
  },

  applyDeleteSelected(rows) {
    const snapshot = rows.map(r => ({ ...r }));
    const selSet = new Set(get().selected);
    // keep rows not selected
    const next = rows.filter((_, idx) => !selSet.has(idx));
    set({ lastAction: { type: 'delete', payload: { selected: get().selected }, prevRows: snapshot }, selected: [] });
    return next;
  },

  applyFixAll(rows, fixer) {
    const snapshot = rows.map(r => ({ ...r }));
    const next = rows.map((r) => fixer({ ...r }));
    set({ lastAction: { type: 'fixAll', payload: {}, prevRows: snapshot } });
    return next;
  },

  undo(setRows) {
    const action = get().lastAction;
    if (!action || !action.prevRows) return;
    setRows(action.prevRows.map(r => ({ ...r })));
    set({ lastAction: null, selected: [] });
  }
}));
