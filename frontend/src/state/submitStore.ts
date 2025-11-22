import { create } from "zustand";

export type ChunkStatus = "pending" | "in-progress" | "success" | "failed";

export type ChunkRecord = {
  index: number;
  size: number;
  status: ChunkStatus;
  processed?: number;
  successes?: string[];
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
    const chunks: ChunkRecord[] = Array.from({ length: chunkCount }).map(
      (_, i) => ({
        index: i,
        size: 0,
        status: "pending",
      })
    );

    set({
      chunks,
      current: 0,
      totalRows,
      totalChunks: chunkCount,
      successes: 0,
      failures: 0,
    });
  },

  markInProgress(idx) {
    set((state) => ({
      chunks: state.chunks.map((c) =>
        c.index === idx ? { ...c, status: "in-progress" as ChunkStatus } : c
      ),
      current: idx,
    }));
  },

  markSuccess(idx, data) {
    set((state) => {
      const updatedChunks = state.chunks.map((c) =>
        c.index === idx
          ? {
              ...c,
              status: "success" as ChunkStatus,
              processed: data.processed,
              successes: data.successes,
              failures: data.failures,
            }
          : c
      );

      return {
        chunks: updatedChunks,
        successes: state.successes + (data.successes?.length ?? 0),
        failures: state.failures + (data.failures?.length ?? 0),
      };
    });
  },

  markFailed(idx, err) {
    set((state) => ({
      chunks: state.chunks.map((c) =>
        c.index === idx
          ? {
              ...c,
              status: "failed" as ChunkStatus,
              processed: 0,
              failures: [{ row: null, error: String(err) }],
            }
          : c
      ),
      failures: state.failures + 1,
    }));
  },

  setRunning(v) {
    set({ running: v });
  },

  reset() {
    set({
      chunks: [],
      current: 0,
      totalRows: 0,
      totalChunks: 0,
      successes: 0,
      failures: 0,
      running: false,
    });
  },
}));
