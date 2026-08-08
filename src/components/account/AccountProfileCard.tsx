"use client";

import Link from "next/link";
import { Building2, ChevronRight, Phone, User } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type AccountProfileCardProps = {
  userName: string;
  phone: string | null;
  hasCompany: boolean;
};

export function AccountProfileCard({
  userName,
  phone,
  hasCompany,
}: AccountProfileCardProps) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="account-profile-heading"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
          <User className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="account-profile-heading"
            className="truncate text-lg font-bold text-slate-900 dark:text-slate-100"
          >
            {userName}
          </h2>
          {phone ? (
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Phone className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{phone}</span>
            </p>
          ) : null}
        </div>
      </div>

      {!hasCompany ? (
        <Link
          href="/account/company"
          className={cn(
            "mt-4 flex min-h-[3rem] items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 px-3.5 py-2.5",
            "text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50",
            "dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/20",
          )}
        >
          <span className="flex items-center gap-2">
            <Building2 className="size-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            {t("account.addCompanyHint")}
          </span>
          <ChevronRight className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
        </Link>
      ) : null}
    </section>
  );
}
