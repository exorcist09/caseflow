// src/utils/chunk.ts
export function chunkArray<T>(arr: T[], size = 500): T[][] {
  if (!Array.isArray(arr)) return [];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
