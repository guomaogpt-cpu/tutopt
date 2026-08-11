"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  dismissInstallPrompt,
  isIosDevice,
  isStandaloneMode,
  shouldOfferInstallPrompt,
  trackPwaPageView,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa/install-prompt";
import { isNativeApp } from "@/lib/pwa/native-app";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type PwaInstallPromptProps = {
  variant?: "banner" | "card";
  className?: string;
};

export function PwaInstallPrompt({
  variant = "banner",
  className,
}: PwaInstallPromptProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (isStandaloneMode() || isNativeApp()) {
      return;
    }

    setIsIos(isIosDevice());
    trackPwaPageView();

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      if (shouldOfferInstallPrompt({ minPageViews: 3 })) {
        setVisible(true);
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (isIosDevice() && shouldOfferInstallPrompt({ minPageViews: 3 })) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  function handleDismiss() {
    dismissInstallPrompt();
    setVisible(false);
  }

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setVisible(false);
      return;
    }

    if (isIos) {
      return;
    }
  }

  if (variant === "card") {
    if (isStandaloneMode() || isNativeApp()) {
      return null;
    }

    return (
      <section
        className={cn(
          "rounded-2xl border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-500/30 dark:bg-blue-950/30",
          className,
        )}
        aria-labelledby="pwa-install-card-title"
      >
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Download className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="pwa-install-card-title"
              className="text-sm font-bold text-slate-900 dark:text-slate-100"
            >
              {t("pwa.install.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {isIos ? t("pwa.install.iosHint") : t("pwa.install.description")}
            </p>
            {!isIos && deferredPrompt ? (
              <Button
                type="button"
                size="sm"
                className="mt-3 h-10 rounded-xl"
                onClick={handleInstall}
              >
                {t("pwa.install.action")}
              </Button>
            ) : null}
            {isIos ? (
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                <Share className="size-3.5" aria-hidden="true" />
                {t("pwa.install.iosSteps")}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (!visible || pathname === "/" || isNativeApp()) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-50 px-3 md:hidden",
        "bottom-[calc(5rem+env(safe-area-inset-bottom))]",
        className,
      )}
      role="region"
      aria-label={t("pwa.install.title")}
    >
      <div className="mx-auto flex max-w-lg items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Download className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("pwa.install.title")}
          </p>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            {isIos ? t("pwa.install.iosHint") : t("pwa.install.description")}
          </p>
          {isIos ? (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              <Share className="size-3.5" aria-hidden="true" />
              {t("pwa.install.iosSteps")}
            </p>
          ) : (
            <Button
              type="button"
              size="sm"
              className="mt-2 h-9 rounded-lg text-xs"
              onClick={handleInstall}
              disabled={!deferredPrompt}
            >
              {t("pwa.install.action")}
            </Button>
          )}
        </div>
        <button
          type="button"
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={handleDismiss}
          aria-label={t("pwa.install.dismiss")}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
