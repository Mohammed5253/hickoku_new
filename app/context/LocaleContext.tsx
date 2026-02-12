"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";

type LocaleType = "en" | "ar" | "fr" | "es";

interface LocaleContextType {
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
  t: (key: string) => string;
  availableLocales: LocaleType[];
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Load all translation files
const translations: Record<LocaleType, any> = {
  en: require("../locales/en.json"),
  ar: require("../locales/ar.json"),
  fr: require("../locales/fr.json"),
  es: require("../locales/es.json"),
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleType>("en");

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let value: any = translations[locale];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return key; // Return the key if translation not found
        }
      }

      return typeof value === "string" ? value : key;
    },
    [locale],
  );

  const availableLocales: LocaleType[] = ["en", "ar", "fr", "es"];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, availableLocales }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
