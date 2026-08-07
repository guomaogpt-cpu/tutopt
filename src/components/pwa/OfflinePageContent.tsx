"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function OfflinePageContent() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
        <WifiOff className="size-8 text-slate-500 dark:text-slate-400" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-xl font-bold text-slate-900 dark:text-slate-100">
        {t("pwa.offline.title")}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
        {t("pwa.offline.description")}
      </p>
      <Button
        type="button"
        className="mt-6 h-11 min-w-[10rem] rounded-xl"
        onClick={() => window.location.reload()}
      >
        {t("pwa.offline.retry")}
      </Button>
    </main>
  );
}
