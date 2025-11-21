// src/state/submitStore.ts
import create from 'zustand';

export type ChunkStatus = 'pending' | 'in-progress' | 'success' | 'failed';

type ChunkRecord = {
  index: number;
  size: number;
  status: ChunkStatus;
  processed?: number;
  successes?: string[]; // array of case_ids that succeeded
  failures?: { row: any; error: string }[];
};

type SubmitState = {
  chunks: ChunkRecord[];
  current: number;
  totalRows: number;
  totalChunks: number;
  successes: number;
  failures: number;
  running: boolean;

  init: (totalRows: number, chunkCount: number) => void;
  markInProgress: (idx: number) => void;
  markSuccess: (idx: number, data: any) => void;
  markFailed: (idx: number, err: any) => void;
  setRunning: (v: boolean) => void;
  reset: () => void;
};

export const useSubmitStore = create<SubmitState>((set) => ({
  chunks: [],
  current: 0,
  totalRows: 0,
  totalChunks: 0,
  successes: 0,
  failures: 0,
  running: false,

  init(totalRows, chunkCount) {
    const chunks = Array.from({ length: chunkCount }).map((_, i) => ({
      index: i,
      size: 0,
      status: 'pending' as ChunkStatus
    }));
    set({ chunks, current: 0, totalRows, totalChunks: chunkCount, successes: 0, failures: 0 });
  },

  markInProgress(idx) {
    set((s) => ({ chunks: s.chunks.map((c) => (c.index === idx ? { ...c, status: 'in-progress' } : c)), current: idx }));
  },

  markSuccess(idx, data) {
    set((s) => {
      const next = s.chunks.map((c) => (c.index === idx ? { ...c, status: 'success', processed: data.processed, successes: data.successes, failures: data.failures } : c));
      const succ = s.successes + (data.successes ? data.successes.length : 0);
      const fail = s.failures + (data.failures ? data.failures.length : 0);
      return { chunks: next, successes: succ, failures: fail };
    });
  },

  markFailed(idx, err) {
    set((s) => ({ chunks: s.chunks.map((c) => (c.index === idx ? { ...c, status: 'failed', processed: 0, failures: [{ row: null, error: String(err) }] } : c)), failures: s.failures + 1 }));
  },

  setRunning(v) {
    set({ running: v });
  },

  reset() {
    set({ chunks: [], current: 0, totalRows: 0, totalChunks: 0, successes: 0, failures: 0, running: false });
  }
}));
