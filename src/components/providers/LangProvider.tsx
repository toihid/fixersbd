"use client";
import { useEffect } from "react";
import { useLangStore } from "@/store/lang-store";
import type { Locale } from "@/lib/i18n";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const { setLocale } = useLangStore();

  useEffect(() => {
    const saved = localStorage.getItem("fixersbd-lang") as Locale | null;
    if (saved === "en" || saved === "bn") {
      setLocale(saved);
    }
  }, [setLocale]);

  return <>{children}</>;
}
