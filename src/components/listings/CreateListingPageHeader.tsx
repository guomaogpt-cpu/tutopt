"use client";

import Link from "next/link";
import type { ListingVertical } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

type CreateListingPageHeaderProps = {
  initialVertical?: ListingVertical | null;
};

export function CreateListingPageHeader({
  initialVertical,
}: CreateListingPageHeaderProps) {
  const { t } = useTranslation();
  const isCargo = initialVertical === "CARGO";
  const isServices = initialVertical === "SERVICES";
  const pageTitle = isCargo
    ? t("cargo.addCompanyButton")
    : isServices
      ? t("services.pageTitle")
      : t("createListing.title");
  const pageSubtitle = isCargo
    ? t("cargo.addCompanyDescription")
    : isServices
      ? t("services.pageSubtitle")
      : t("createListing.subtitle");

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
            <Link href="/account/listings" className="transition hover:text-blue-600">
              {t("account.myListings")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="line-clamp-1 font-medium text-slate-700 dark:text-slate-200">
            {pageTitle}
          </li>
        </ol>
      </nav>

      <PageHeader className="mt-0 pb-0 sm:mt-4">
        <PageHeaderContent>
          <PageTitle className="text-xl text-slate-900 sm:text-3xl dark:text-slate-100">
            {pageTitle}
          </PageTitle>
          <PageSubtitle className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
            {pageSubtitle}
          </PageSubtitle>
        </PageHeaderContent>
      </PageHeader>
    </>
  );
}
