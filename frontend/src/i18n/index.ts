import i18n from "i18next";
import { initReactI18next } from "../../node_modules/react-i18next";
import LanguageDetector from "i18next-browser-languagedetector/cjs";

import en from "./en.json";
import hi from "./hi.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
