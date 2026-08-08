"use client";

import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type StatusHintProps = {
  hintKey: DictionaryKey;
  className?: string;
};

export function StatusHint({ hintKey, className }: StatusHintProps) {
  const { t } = useTranslation();

  return (
    <p className={cn("text-xs leading-relaxed text-slate-500 dark:text-slate-400", className)}>
      {t(hintKey)}
    </p>
  );
}
