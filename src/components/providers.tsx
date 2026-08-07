"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MobileAppShell } from "@/components/mobile/MobileAppShell";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import { PwaServiceWorkerRegister } from "@/components/pwa/PwaServiceWorkerRegister";
import { TooltipProvider } from "@/components/ui/tooltip";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <TooltipProvider delayDuration={300}>
          <PwaServiceWorkerRegister />
          <MobileAppShell />
          {children}
          <PwaInstallPrompt />
        </TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
