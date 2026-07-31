"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

export function CreateListingPageHeader() {
  const { t } = useTranslation();

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="hidden text-sm text-slate-500 sm:block dark:text-slate-400"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="transition hover:text-blue-600">
              Главная
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/seller/dashboard" className="transition hover:text-blue-600">
              Кабинет продавца
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="line-clamp-1 font-medium text-slate-700 dark:text-slate-200">
            {t("createListing.title")}
          </li>
        </ol>
      </nav>

      <PageHeader className="mt-0 pb-0 sm:mt-4">
        <PageHeaderContent>
          <PageTitle className="text-xl text-slate-900 sm:text-3xl dark:text-slate-100">
            {t("createListing.title")}
          </PageTitle>
          <PageSubtitle className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
            {t("createListing.subtitle")}
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>
    </>
  );
}
