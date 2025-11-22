// src/state/languageStore.ts
import { create } from "zustand";
import i18n from "../i18n";

interface LanguageStore {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => {
  const initialLang =
    i18n.language || localStorage.getItem("i18nextLng") || "en";

  return {
    language: initialLang,
    setLanguage: (lang: string) => {
      i18n.changeLanguage(lang); // change i18n language
      try {
        localStorage.setItem("i18nextLng", lang);
      } catch (e) {
        // ignore localStorage error in some environments
      }
      set({ language: lang }); // update Zustand state (forces re-render where used)
    },
  };
});
