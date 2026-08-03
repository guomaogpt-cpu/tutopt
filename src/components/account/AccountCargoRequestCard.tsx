"use client";

import Link from "next/link";
import { ExpandableText } from "@/components/account/ExpandableText";
import { CargoRequestStatusBadge } from "@/components/seller/SellerCargoRequestsList";
import type { BuyerCargoRequestItem } from "@/features/cargo/lib/cargo-requests-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type AccountCargoRequestCardProps = {
  request: BuyerCargoRequestItem;
};

export function AccountCargoRequestCard({ request }: AccountCargoRequestCardProps) {
  const { t } = useTranslation();
  const responsesCount = request.responses.length;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("accountRequests.createdAt")}: {formatListingDate(request.created_at)}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            <Link
              href={`/cargo/requests/${request.id}`}
              className="transition hover:text-orange-700 dark:hover:text-orange-300"
            >
              {t("accountRequests.item")}: {request.item_name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {t("accountRequests.route")}: {request.from_location} → {request.to_location}
          </p>
        </div>
        <CargoRequestStatusBadge status={request.status} />
      </div>

      {(request.weight || request.dimensions || request.quantity) && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {[request.weight, request.dimensions, request.quantity].filter(Boolean).join(" · ")}
        </p>
      )}

      {request.comment ? (
        <div className="mt-3">
          <ExpandableText label={t("accountRequests.comment")} text={request.comment} />
        </div>
      ) : null}

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {t("accountRequests.responsesCount")}: {responsesCount}
      </p>

      <div className="mt-4">
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
        >
          <Link href={`/cargo/requests/${request.id}`}>
            {t("accountRequests.viewResponses")}
          </Link>
        </Button>
      </div>
    </article>
  );
}
