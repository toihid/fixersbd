"use client";
import { useLangStore } from "@/store/lang-store";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LangToggle() {
  const { locale, setLocale } = useLangStore();

  return (
    <button
      onClick={() => setLocale(locale === "bn" ? "en" : "bn")}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
      aria-label="Toggle language"
    >
      <Globe size={16} />
      <span className={cn(locale === "bn" ? "text-brand-500" : "text-gray-500")}>
        {locale === "bn" ? "বাং" : "EN"}
      </span>
    </button>
  );
}
