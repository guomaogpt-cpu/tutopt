"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getPreferredLocale,
  setPreferredLocale,
  type PreferredLocale,
} from "@/features/preferences/locale-preference";
import {
  DEFAULT_LOCALE,
  translate,
  type DictionaryKey,
  type Locale,
} from "@/lib/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: PreferredLocale) => void;
  t: (key: DictionaryKey) => string;
  mounted: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getPreferredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: PreferredLocale) => {
    setPreferredLocale(next);
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: DictionaryKey) => translate(locale, key),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, mounted }),
    [locale, setLocale, t, mounted],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useTranslation(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return ctx;
}
