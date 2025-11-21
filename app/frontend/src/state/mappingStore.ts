// src/state/mappingStore.ts
import { create } from "zustand";

interface MappingState {
  csvHeaders: string[];
  mappings: Record<string, string | null>;

  setHeaders: (headers: string[]) => void;
  setMapping: (field: string, column: string | null) => void;

  autoMap: () => void;
  isValid: () => boolean;
}

export const useMappingStore = create<MappingState>((set, get) => ({
  csvHeaders: [],
  mappings: {},
  
  setHeaders: (headers) => set({ csvHeaders: headers }),

  setMapping: (field, column) => {
    set((state) => ({
      mappings: { ...state.mappings, [field]: column },
    }));
  },

  autoMap: () => {
    const headers = get().csvHeaders;
    const newMappings: Record<string, string | null> = {};

    headers.forEach((h) => {
      const normalized = h.toLowerCase().trim();
      if (normalized.includes("case")) newMappings["case_id"] = h;
      if (normalized.includes("name")) newMappings["applicant_name"] = h;
      if (normalized.includes("dob") || normalized.includes("birth"))
        newMappings["dob"] = h;
      if (normalized.includes("email")) newMappings["email"] = h;
      if (normalized.includes("phone")) newMappings["phone"] = h;
      if (normalized.includes("category")) newMappings["category"] = h;
      if (normalized.includes("priority")) newMappings["priority"] = h;
    });

    set({ mappings: newMappings });
  },

  isValid: () => {
    const required = ["case_id", "applicant_name", "dob"];
    const mappings = get().mappings;

    return required.every((field) => mappings[field]);
  },
}));
