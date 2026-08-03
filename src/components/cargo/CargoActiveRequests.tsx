"use client";

import Link from "next/link";
import { CargoRequestStatusBadge } from "@/components/seller/SellerCargoRequestsList";
import { Button } from "@/components/ui/button";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import type { PublicCargoRequestCard } from "@/features/cargo/lib/cargo-requests-data";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoActiveRequestsProps = {
  requests: PublicCargoRequestCard[];
  isAuthenticated: boolean;
  canRespond: boolean;
  onCreateRequest?: () => void;
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
  onCreateRequest,
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
                <Link
                  key={request.id}
                  href={`/cargo/requests/${request.id}`}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 transition hover:border-orange-200 hover:bg-orange-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-orange-900"
                >
                  <p className="line-clamp-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                    {request.item_name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {request.from_location} → {request.to_location}
                  </p>
                </Link>
              ))}
            </div>
          ) : null}
          <Button asChild className="mt-4 h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
            <Link href={buildLoginUrl("/cargo")}>{t("auth.signIn")}</Link>
          </Button>
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("cargo.activeRequestsEmptyTitle")}
          </p>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {t("cargo.activeRequestsEmptyDescription")}
          </p>
          {onCreateRequest ? (
            <Button
              type="button"
              onClick={onCreateRequest}
              className="mt-4 h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
            >
              {t("cargo.createRequest")}
            </Button>
          ) : (
            <Button asChild className="mt-4 h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto">
              <Link href="/cargo">{t("cargo.createRequest")}</Link>
            </Button>
          )}
        </div>
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
                    <Link
                      href={`/cargo/requests/${request.id}`}
                      className="transition hover:text-orange-700 dark:hover:text-orange-300"
                    >
                      {request.item_name}
                    </Link>
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
                    <Link href={`/cargo/requests/${request.id}`}>
                      {t("cargo.respondToRequest")}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
                  >
                    <Link href={`/cargo/requests/${request.id}`}>
                      {t("cargoRequest.openInAccount")}
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
