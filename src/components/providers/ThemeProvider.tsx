"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Light is the product default. System theme only applies after the user
 * explicitly chooses “Системная” in settings (stored preference).
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="vsetut.theme.v2"
    >
      {children}
    </NextThemesProvider>
  );
}
