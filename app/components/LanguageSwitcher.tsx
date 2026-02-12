"use client";

import { useLocale } from "../context/LocaleContext";
import { motion } from "motion/react";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useLocale();

  const localeNames: Record<string, string> = {
    en: "English",
    ar: "العربية",
    fr: "Français",
    es: "Español",
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        className="text-sm bg-transparent border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {availableLocales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
