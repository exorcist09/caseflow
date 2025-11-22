import {create} from 'zustand';
import { validateRow, titleCase, normalizePhoneSimple, trimString } from '../utils/validation';
import Papa from 'papaparse';

type CellErrors = Record<string, string[]>; // field -> messages
type RowErrorsMap = Record<number, CellErrors>; // rowIndex -> cell errors

type ValidationState = {
  errors: RowErrorsMap;
  columnErrorCounts: Record<string, number>;
  validating: boolean;

  validateAll: (rows: Record<string, any>[]) => void;
  validateRow: (rows: Record<string, any>[], idx: number) => void;
  clearErrors: () => void;

  fixCell: (rows: Record<string, any>[], rowIndex: number, field: string) => Record<string, any>[];
  fixAll: (rows: Record<string, any>[]) => Record<string, any>[];

  exportErrorCSV: (rows: Record<string, any>[]) => string;
};

export const useValidationStore = create<ValidationState>((set, get) => ({
  errors: {},
  columnErrorCounts: {},
  validating: false,

  validateAll(rows) {
    set({ validating: true });
    const errors: RowErrorsMap = {};
    const colCounts: Record<string, number> = {};
    rows.forEach((r, i) => {
      const res = validateRow(r);
      if (!res.ok) {
        errors[i] = res.errors;
        Object.keys(res.errors).forEach((f) => (colCounts[f] = (colCounts[f] || 0) + 1));
      }
    });
    set({ errors, columnErrorCounts: colCounts, validating: false });
  },

  validateRow(rows, idx) {
    const row = rows[idx];
    const res = validateRow(row);
    set((s) => {
      const nextErrors = { ...s.errors };
      if (!res.ok) nextErrors[idx] = res.errors;
      else delete nextErrors[idx];
      // recompute column counts (simple approach)
      const colCounts: Record<string, number> = {};
      Object.entries(nextErrors).forEach(([, cellErrs]) => {
        Object.keys(cellErrs).forEach((f) => (colCounts[f] = (colCounts[f] || 0) + 1));
      });
      return { errors: nextErrors, columnErrorCounts: colCounts };
    });
  },

  clearErrors() {
    set({ errors: {}, columnErrorCounts: {} });
  },

  fixCell(rows, rowIndex, field) {
    // returns new rows array with the fix applied for the targeted cell
    const newRows = [...rows];
    const row = { ...newRows[rowIndex] };
    if (field === 'applicant_name') row.applicant_name = titleCase(row.applicant_name);
    if (field === 'phone') row.phone = normalizePhoneSimple(row.phone);
    if (field === 'case_id') row.case_id = trimString(row.case_id);
    if (field === 'priority' && !row.priority) row.priority = 'LOW';
    newRows[rowIndex] = row;
    // re-validate this row
    get().validateRow(newRows, rowIndex);
    return newRows;
  },

  fixAll(rows) {
    const newRows = rows.map((r) => {
      const copy = { ...r };
      copy.applicant_name = titleCase(copy.applicant_name);
      copy.phone = normalizePhoneSimple(copy.phone);
      copy.case_id = trimString(copy.case_id);
      if (!copy.priority) copy.priority = 'LOW';
      return copy;
    });
    // validate all
    get().validateAll(newRows);
    return newRows;
  },

  exportErrorCSV(rows) {
    // export rows with an extra column "errors" containing concatenated messages
    const errRows = Object.keys(get().errors).map((idxStr) => {
      const idx = Number(idxStr);
      const row = rows[idx];
      const cellErrs = get().errors[idx] || {};
      const msgParts: string[] = [];
      Object.entries(cellErrs).forEach(([f, msgs]) => {
        msgParts.push(`${f}: ${msgs.join('; ')}`);
      });
      return { ...row, __errors: msgParts.join(' | ') };
    });
    return Papa.unparse(errRows);
  }
}));
