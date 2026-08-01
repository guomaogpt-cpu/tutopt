"use client";

import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";

type AccountRequestsSectionTitleProps = {
  titleKey: DictionaryKey;
};

export function AccountRequestsSectionTitle({ titleKey }: AccountRequestsSectionTitleProps) {
  const { t } = useTranslation();

  return (
    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
      {t(titleKey)}
    </h2>
  );
}
