"use client";

import type { CargoResponseStatus } from "@prisma/client";
import Link from "next/link";
import { Phone } from "lucide-react";
import { ExpandableText } from "@/components/account/ExpandableText";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { Button } from "@/components/ui/button";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type AccountCargoResponseCardProps = {
  response: {
    id: string;
    created_at: Date;
    price: string | null;
    currency: string | null;
    estimated_time: string | null;
    comment: string;
    status: CargoResponseStatus;
    companyName: string;
    cargoRequestId: string;
    itemName?: string;
    fromLocation?: string;
    toLocation?: string;
    contactName?: string | null;
    contactPhone?: string | null;
  };
  mode: "incoming" | "own";
};

function responseStatusClass(status: CargoResponseStatus): string {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    case "REJECTED":
      return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300";
    case "WITHDRAWN":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    case "NEW":
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
  }
}

function responseStatusKey(status: CargoResponseStatus): DictionaryKey {
  switch (status) {
    case "ACCEPTED":
      return "accountRequests.responseStatus.accepted";
    case "REJECTED":
      return "accountRequests.responseStatus.rejected";
    case "WITHDRAWN":
      return "accountRequests.responseStatus.withdrawn";
    case "NEW":
    default:
      return "accountRequests.responseStatus.new";
  }
}

export function AccountCargoResponseCard({ response, mode }: AccountCargoResponseCardProps) {
  const { t } = useTranslation();
  const priceLabel =
    response.price && response.currency
      ? `${response.price} ${response.currency}`
      : response.price;
  const showContacts =
    mode === "incoming" && Boolean(response.contactPhone || response.contactName);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("accountRequests.createdAt")}: {formatListingDate(response.created_at)}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            {mode === "own"
              ? (response.itemName ?? response.companyName)
              : response.companyName}
          </h3>
          {mode === "own" && response.fromLocation && response.toLocation ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t("accountRequests.route")}: {response.fromLocation} → {response.toLocation}
            </p>
          ) : null}
          {mode === "incoming" && response.itemName ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t("accountRequests.item")}: {response.itemName}
              {response.fromLocation && response.toLocation
                ? ` · ${response.fromLocation} → ${response.toLocation}`
                : ""}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
            responseStatusClass(response.status),
          )}
        >
          {t(responseStatusKey(response.status))}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        {priceLabel ? (
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("accountRequests.price")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">{priceLabel}</dd>
          </div>
        ) : null}
        {response.estimated_time ? (
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">
              {t("accountRequests.estimatedTime")}
            </dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {response.estimated_time}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-3">
        <ExpandableText label={t("accountRequests.comment")} text={response.comment} />
      </div>

      {showContacts ? (
        <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/80 px-3 py-2.5 text-sm dark:border-orange-900/50 dark:bg-orange-950/30">
          <p className="text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-300">
            {t("accountRequests.companyContacts")}
          </p>
          {response.contactName ? (
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {response.contactName}
            </p>
          ) : null}
          {response.contactPhone ? (
            <a
              href={`tel:${response.contactPhone}`}
              className="mt-1 inline-flex items-center gap-1.5 font-semibold text-orange-700 hover:underline dark:text-orange-300"
            >
              <Phone className="size-3.5" aria-hidden="true" />
              {response.contactPhone}
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4">
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-xl dark:border-slate-700 sm:w-auto"
        >
          <Link href={`/cargo/requests/${response.cargoRequestId}`}>
            {t("accountRequests.openCargoRequest")}
          </Link>
        </Button>
      </div>
    </article>
  );
}
