"use client";

import { AccountRequestsSectionTitle } from "@/components/account/AccountRequestsSectionTitle";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function AccountReceivedRequestsSectionHeader() {
  const { t } = useTranslation();

  return (
    <div>
      <AccountRequestsSectionTitle titleKey="accountRequests.receivedTitle" />
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {t("accountRequests.receivedSubtitle")}
      </p>
    </div>
  );
}
