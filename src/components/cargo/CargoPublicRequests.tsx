"use client";

import type { PublicCargoRequestCard } from "@/features/cargo/lib/cargo-requests-data";
import { useTranslation } from "@/lib/i18n/useTranslation";

type CargoPublicRequestsProps = {
  requests: PublicCargoRequestCard[];
};

function formatRequestDate(date: Date): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CargoPublicRequests({ requests }: CargoPublicRequestsProps) {
  const { t } = useTranslation();

  if (requests.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="cargo-public-requests-heading" className="mt-10 sm:mt-12">
      <h2
        id="cargo-public-requests-heading"
        className="text-lg font-bold text-slate-900 sm:text-xl dark:text-slate-100"
      >
        {t("cargo.requestsTitle")}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("cargo.requestsPublicHint")}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <article
            key={request.id}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatRequestDate(request.created_at)}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {request.item_name}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {request.from_location}
              <span className="mx-1.5 text-slate-400" aria-hidden="true">
                →
              </span>
              {request.to_location}
            </p>
            <dl className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              {request.weight ? (
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-slate-600 dark:text-slate-300">
                    {t("cargo.weight")}:
                  </dt>
                  <dd className="min-w-0 truncate">{request.weight}</dd>
                </div>
              ) : null}
              {request.dimensions ? (
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-slate-600 dark:text-slate-300">
                    {t("cargo.dimensions")}:
                  </dt>
                  <dd className="min-w-0 truncate">{request.dimensions}</dd>
                </div>
              ) : null}
              {request.quantity ? (
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-slate-600 dark:text-slate-300">
                    {t("cargo.quantity")}:
                  </dt>
                  <dd className="min-w-0 truncate">{request.quantity}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
