"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, CheckCircle2, Circle } from "lucide-react";
import type { CompanyType } from "@prisma/client";
import { CompanyVerificationBadge } from "@/components/company/CompanyVerificationBadge";
import type { CompanyProfileSummary } from "@/features/company/lib/company-profile";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TYPE_LABEL_KEY: Record<CompanyType, DictionaryKey> = {
  STORE: "company.types.store",
  SUPPLIER: "company.types.supplier",
  SERVICE: "company.types.service",
  CARGO: "company.types.cargo",
  OTHER: "company.types.other",
};

type CompanyStorefrontPreviewProps = {
  company: CompanyProfileSummary | null;
  publicHref: string | null;
};

type PreviewField = {
  key: DictionaryKey;
  filled: boolean;
};

function buildPreviewFields(company: CompanyProfileSummary | null): PreviewField[] {
  return [
    { key: "company.name", filled: Boolean(company?.companyName.trim()) },
    { key: "company.type", filled: Boolean(company?.companyType) },
    { key: "company.city", filled: Boolean(company?.cityName) },
    { key: "company.description", filled: Boolean(company?.description?.trim()) },
    { key: "company.logo", filled: Boolean(company?.logoUrl) },
    { key: "company.phone", filled: Boolean(company?.contactPhone.trim()) },
  ];
}

export function CompanyStorefrontPreview({
  company,
  publicHref,
}: CompanyStorefrontPreviewProps) {
  const { t } = useTranslation();
  const fields = buildPreviewFields(company);
  const filledCount = fields.filter((field) => field.filled).length;
  const typeLabel =
    company?.companyType != null ? t(TYPE_LABEL_KEY[company.companyType]) : null;

  return (
    <section className="mb-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t("company.storefront.previewTitle")}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {t("company.storefront.previewHint")}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-start gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            {company?.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <Building2 className="size-5" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
                {t("company.badge")}
              </span>
              {company ? (
                <CompanyVerificationBadge
                  status={company.verificationStatus}
                  isCargo={company.companyType === "CARGO"}
                  compact
                />
              ) : null}
            </div>
            <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {company?.companyName.trim() || t("company.storefront.emptyName")}
            </p>
            {typeLabel ? (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {typeLabel}
                {company?.cityName ? ` · ${company.cityName}` : ""}
              </p>
            ) : null}
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {company?.description?.trim() || t("company.public.noDescription")}
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t("company.storefront.fieldsTitle")} ({filledCount}/{fields.length})
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {fields.map((field) => (
            <li
              key={field.key}
              className={cn(
                "flex items-center gap-2 text-sm",
                field.filled
                  ? "text-slate-700 dark:text-slate-200"
                  : "text-slate-400 dark:text-slate-500",
              )}
            >
              {field.filled ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Circle className="size-4 shrink-0" />
              )}
              {t(field.key)}
            </li>
          ))}
        </ul>
      </div>

      {company ? (
        <div className="flex flex-wrap items-center gap-2">
          <CompanyVerificationBadge status={company.verificationStatus} showOwnerStatus compact />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t("company.verification.status")}
          </span>
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("company.storefront.emptyProfileHint")}
        </p>
      )}

      {publicHref ? (
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
        >
          <Link href={publicHref}>{t("company.storefront.viewPublicProfile")}</Link>
        </Button>
      ) : null}
    </section>
  );
}
