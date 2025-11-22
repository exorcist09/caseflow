import { create } from "zustand";

interface MappingState {
  csvHeaders: string[];
  mappings: Record<string, string | null>;

  setCSVHeaders: (headers: string[]) => void;
  setMapping: (field: string, column: string | null) => void;
  resetMappings: () => void;

  autoMap: () => void;
  isValid: () => boolean;
}

export const useMappingStore = create<MappingState>((set, get) => ({
  csvHeaders: [],
  mappings: {},

  setCSVHeaders: (headers) => set({ csvHeaders: headers }),

  setMapping: (field, column) =>
    set((state) => ({
      mappings: {
        ...state.mappings,
        [field]: column,
      },
    })),

  resetMappings: () => set({ mappings: {} }),

  autoMap: () => {
    const headers = get().csvHeaders;
    const newMappings: Record<string, string | null> = {};

    headers.forEach((h) => {
      const n = h.toLowerCase().trim();
      if (n.includes("case")) newMappings["case_id"] = h;
      if (n.includes("name")) newMappings["applicant_name"] = h;
      if (n.includes("dob") || n.includes("birth")) newMappings["dob"] = h;
      if (n.includes("email")) newMappings["email"] = h;
      if (n.includes("phone")) newMappings["phone"] = h;
      if (n.includes("category")) newMappings["category"] = h;
      if (n.includes("priority")) newMappings["priority"] = h;
    });

    set({ mappings: newMappings });
  },

  isValid: () => {
    const required = ["case_id", "applicant_name", "dob"];
    const mappings = get().mappings;
    return required.every((field) => mappings[field]);
  },
}));
