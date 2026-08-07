"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { confirmMobileBackGuard } from "@/lib/mobile/mobile-back-guard";
import {
  blurActiveField,
  closeTopmostOverlay,
  syncMobileKeyboardInset,
} from "@/lib/mobile/mobile-viewport";

export function MobileAppShell() {
  useEffect(() => {
    const cleanupViewport = syncMobileKeyboardInset();

    if (!Capacitor.isNativePlatform()) {
      return cleanupViewport;
    }

    const listener = App.addListener("backButton", () => {
      if (closeTopmostOverlay()) {
        return;
      }

      if (blurActiveField()) {
        return;
      }

      if (!confirmMobileBackGuard()) {
        return;
      }

      if (window.history.length > 1) {
        window.history.back();
        return;
      }

      void App.exitApp();
    });

    return () => {
      cleanupViewport();
      void listener.then((handle) => handle.remove());
    };
  }, []);

  return null;
}
