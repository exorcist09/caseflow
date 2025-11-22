// src/state/uploadStore.ts
import { create } from "zustand";

export type Mapping = Record<string, string>; // schemaField -> csvHeader
export type CaseRow = Record<string, any>;

type UploadState = {
  file: File | null;
  rawRows: CaseRow[];
  mappedRows: CaseRow[];
  mapping: Mapping;
  importId: string | null; // NEW
  loading: boolean;
  error: string | null;

  setFile: (file: File | null) => void;
  setRawRows: (r: CaseRow[]) => void;
  setMappedRows: (r: CaseRow[]) => void;
  setMapping: (m: Mapping) => void;
  setImportId: (id: string | null) => void; // NEW
  applyMapping: (schemaFields: string[]) => void;
  setLoading: (b: boolean) => void;
  setError: (s: string | null) => void;
  reset: () => void;
};

export const useUploadStore = create<UploadState>((set, get) => ({
  file: null,
  rawRows: [],
  mappedRows: [],
  mapping: {},
  importId: null,
  loading: false,
  error: null,

  setFile: (f) => set({ file: f }),
  setRawRows: (r) => set({ rawRows: r }),
  setMappedRows: (r) => set({ mappedRows: r }),
  setMapping: (m) => set({ mapping: m }),
  setImportId: (id) => set({ importId: id }),
  applyMapping: (schemaFields: string[]) => {
    const { rawRows, mapping } = get();
    const mapped = rawRows.map((row) => {
      const out: Record<string, any> = {};
      for (const field of schemaFields) {
        const header = mapping[field];
        out[field] = header ? (row[header] ?? '') : '';
      }
      return out;
    });
    set({ mappedRows: mapped });
  },
  setLoading: (b) => set({ loading: b }),
  setError: (s) => set({ error: s }),
  reset: () => set({ file: null, rawRows: [], mappedRows: [], mapping: {}, importId: null, loading: false, error: null }),
}));
