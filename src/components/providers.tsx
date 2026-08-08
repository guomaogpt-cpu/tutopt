"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MobileAppShell } from "@/components/mobile/MobileAppShell";
import { PushNotificationsProvider } from "@/lib/push/push-notifications-client";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import { PwaServiceWorkerRegister } from "@/components/pwa/PwaServiceWorkerRegister";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <TooltipProvider delayDuration={300}>
          <PushNotificationsProvider>
            <PwaServiceWorkerRegister />
            <MobileAppShell />
            {children}
            <PwaInstallPrompt />
            <Toaster />
          </PushNotificationsProvider>
        </TooltipProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
