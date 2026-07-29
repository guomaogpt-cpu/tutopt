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
  resolveInitialLocale,
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
  // Always start with ru to avoid hydration mismatch; resolve after mount.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Priority: stored user/auto choice → browser detect → ru (inside helpers).
    setLocaleState(resolveInitialLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: PreferredLocale) => {
    // Manual selection from settings drawer — persist localStorage + cookie.
    setPreferredLocale(next, "manual");
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
