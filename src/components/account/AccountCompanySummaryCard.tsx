"use client";

import Link from "next/link";
import type { CompanyType, CompanyVerificationStatus } from "@prisma/client";
import { CompanyVerificationBadge } from "@/components/company/CompanyVerificationBadge";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

type AccountCompanySummaryCardProps = {
  company: {
    name: string;
    companyType: CompanyType;
    verificationStatus: CompanyVerificationStatus;
    publicHref: string;
  } | null;
};

const TYPE_LABEL_KEY: Record<CompanyType, DictionaryKey> = {
  STORE: "company.types.store",
  SUPPLIER: "company.types.supplier",
  SERVICE: "company.types.service",
  CARGO: "company.types.cargo",
  OTHER: "company.types.other",
};

export function AccountCompanySummaryCard({ company }: AccountCompanySummaryCardProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
        {t("account.company")}
      </h2>

      {!company ? (
        <div className="mt-3 space-y-3">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("account.companyMissingTitle")}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("account.companyMissingDescription")}
          </p>
          <Button asChild className="h-11 w-full rounded-xl sm:w-auto">
            <Link href="/account/company">{t("account.createCompany")}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {company.name}
            </p>
            <CompanyVerificationBadge
              status={company.verificationStatus}
              isCargo={company.companyType === "CARGO"}
              showOwnerStatus
              compact
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t(TYPE_LABEL_KEY[company.companyType])}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="h-11 w-full rounded-xl sm:w-auto">
              <Link href="/account/company">{t("account.editCompany")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
            >
              <Link href={company.publicHref}>{t("account.openCompany")}</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
