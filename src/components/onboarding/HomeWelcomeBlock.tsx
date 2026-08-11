"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Megaphone, Search, X } from "lucide-react";
import {
  HOME_WELCOME_DISMISSED_KEY,
  isViewportLargeEnoughForWelcome,
  readOnboardingDismissed,
  writeOnboardingDismissed,
} from "@/lib/onboarding/onboarding-storage";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type HomeWelcomeBlockProps = {
  className?: string;
};

/** Compact, dismissible welcome on mobile home — not modal, not blocking. */
export function HomeWelcomeBlock({ className }: HomeWelcomeBlockProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readOnboardingDismissed(HOME_WELCOME_DISMISSED_KEY)) {
      return;
    }

    if (!isViewportLargeEnoughForWelcome()) {
      return;
    }

    setVisible(true);
  }, []);

  function dismiss() {
    writeOnboardingDismissed(HOME_WELCOME_DISMISSED_KEY);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-welcome-title"
      className={cn(
        "rounded-xl border border-blue-100/80 bg-gradient-to-br from-blue-50/70 to-white p-3 dark:border-blue-900/40 dark:from-blue-950/25 dark:to-slate-900",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            id="home-welcome-title"
            className="text-[13px] font-semibold leading-snug text-slate-900 dark:text-slate-100"
          >
            {t("onboarding.homeWelcomeTitle")}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t("onboarding.homeWelcomeDescription")}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label={t("onboarding.hide")}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        <Link
          href="/listings/new"
          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] sm:flex-none"
        >
          <Megaphone className="size-3.5 shrink-0" aria-hidden="true" />
          {t("onboarding.postListing")}
        </Link>
        <Link
          href="/listings"
          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-300 active:scale-[0.99] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 sm:flex-none"
        >
          <Search className="size-3.5 shrink-0" aria-hidden="true" />
          {t("onboarding.findProduct")}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-9 items-center justify-center rounded-lg px-2 text-xs font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {t("onboarding.hide")}
        </button>
      </div>
    </section>
  );
}
