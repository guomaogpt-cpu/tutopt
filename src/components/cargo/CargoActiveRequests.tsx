"use client";

import Link from "next/link";
import { CargoRequestStatusBadge } from "@/components/seller/SellerCargoRequestsList";
import { Button } from "@/components/ui/button";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import type { PublicCargoRequestCard } from "@/features/cargo/lib/cargo-requests-data";
import { VERTICALS } from "@/features/verticals/verticals";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoActiveRequestsProps = {
  requests: PublicCargoRequestCard[];
  isAuthenticated: boolean;
  canRespond: boolean;
};

function formatRequestDate(date: Date): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CargoActiveRequests({
  requests,
  isAuthenticated,
  canRespond,
}: CargoActiveRequestsProps) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="cargo-active-requests-heading" className="mt-8 sm:mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="cargo-active-requests-heading"
            className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg"
          >
            {t("cargo.activeRequestsTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("cargo.activeRequestsDescription")}
          </p>
        </div>
        {isAuthenticated && canRespond ? (
          <Link
            href="/seller/cargo-requests"
            className="shrink-0 text-sm font-medium text-orange-700 hover:underline dark:text-orange-300"
          >
            {t("cargo.viewAllRequests")}
          </Link>
        ) : null}
      </div>

      {!isAuthenticated ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t("cargo.loginToViewRequests")}
          </p>
          {requests.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-2 text-left sm:grid-cols-2">
              {requests.slice(0, 2).map((request) => (
                <article
                  key={request.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="line-clamp-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                    {request.item_name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {request.from_location} → {request.to_location}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
          <Button asChild className="mt-4 h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
            <Link href={buildLoginUrl("/cargo")}>{t("cargo.loginToViewRequests")}</Link>
          </Button>
        </div>
      ) : requests.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t("account.noData")}</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {requests.map((request) => (
            <article
              key={request.id}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatRequestDate(request.created_at)}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {request.item_name}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {request.from_location}
                    <span className="mx-1.5 text-slate-400" aria-hidden="true">
                      →
                    </span>
                    {request.to_location}
                  </p>
                </div>
                <CargoRequestStatusBadge status={request.status} />
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {[request.weight, request.dimensions, request.quantity]
                  .filter(Boolean)
                  .join(" · ")}
              </p>

              <div className="mt-4">
                {canRespond ? (
                  <Button
                    asChild
                    className="h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
                  >
                    <Link href="/seller/cargo-requests">{t("cargo.respondToRequest")}</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
                  >
                    <Link href={VERTICALS.CARGO.createListingHref}>
                      {t("cargo.addCompanyButton")}
                    </Link>
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
