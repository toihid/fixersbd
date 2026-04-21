import { create } from "zustand";
import { translations, type Locale } from "@/lib/i18n";

interface LangState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const useLangStore = create<LangState>((set, get) => ({
  locale: "bn",
  setLocale: (locale) => {
    set({ locale });
    if (typeof window !== "undefined") {
      localStorage.setItem("fixersbd-lang", locale);
    }
  },
  t: (key: string) => {
    const { locale } = get();
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  },
}));
