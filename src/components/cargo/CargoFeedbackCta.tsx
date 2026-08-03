"use client";

import { MessageCircleWarning } from "lucide-react";
import { getCargoFeedbackHref } from "@/features/cargo/lib/cargo-feedback";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type CargoFeedbackCtaProps = {
  className?: string;
};

export function CargoFeedbackCta({ className }: CargoFeedbackCtaProps) {
  const { t } = useTranslation();
  const href = getCargoFeedbackHref();

  return (
    <aside
      className={cn(
        "rounded-2xl border border-dashed border-orange-200/80 bg-orange-50/50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900 sm:px-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-slate-800 dark:text-orange-300">
            <MessageCircleWarning className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("cargo.feedbackTitle")}
            </p>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
              {t("cargo.feedbackDescription")}
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full shrink-0 rounded-xl border-orange-200 bg-white text-orange-800 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-950 dark:text-orange-200 sm:w-auto"
        >
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {t("cargo.feedbackButton")}
          </a>
        </Button>
      </div>
    </aside>
  );
}
