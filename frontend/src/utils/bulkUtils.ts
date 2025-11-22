// src/utils/bulkUtils.ts
export function mapSelectedIndicesToRows(rows: any[], indices: number[]) {
  return indices.map(i => rows[i]).filter(Boolean);
}
