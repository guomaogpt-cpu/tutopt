"use client";

import { useState } from "react";
import Link from "next/link";
import type { CargoRequestStatus } from "@prisma/client";
import { CargoRespondModal } from "@/components/seller/CargoRespondModal";
import {
  cargoRequestStatusBadgeClass,
  cargoRequestStatusI18nKey,
} from "@/features/cargo/lib/cargo-request-status";
import type { SellerCargoRequestItem } from "@/features/cargo/lib/cargo-requests-data";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type CargoRequestStatusBadgeProps = {
  status: CargoRequestStatus;
  className?: string;
};

export function CargoRequestStatusBadge({ status, className }: CargoRequestStatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        cargoRequestStatusBadgeClass[status],
        className,
      )}
    >
      {t(cargoRequestStatusI18nKey[status])}
    </span>
  );
}

type SellerCargoRequestsListProps = {
  requests: SellerCargoRequestItem[];
  showContacts: boolean;
  canRespond: boolean;
};

function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SellerCargoRequestsList({
  requests,
  showContacts,
  canRespond,
}: SellerCargoRequestsListProps) {
  const { t } = useTranslation();
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t("cargo.sellerEmptyTitle")}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("cargo.sellerEmptyDescription")}
        </p>
        <Button asChild className="mt-5 h-11 rounded-xl bg-orange-500 hover:bg-orange-600">
          <Link href="/seller/cargo-settings">{t("cargo.settings.title")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const isClosed = request.status === "CLOSED";
        const hasOwnResponse = Boolean(request.ownResponse);

        return (
          <article
            key={request.id}
            className={cn(
              "min-w-0 rounded-2xl border bg-white p-4 shadow-sm sm:p-5 dark:bg-slate-900 dark:shadow-none",
              request.status === "NEW"
                ? "border-rose-300 ring-1 ring-rose-200 dark:border-rose-800 dark:ring-rose-900/60"
                : "border-slate-200 dark:border-slate-800",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDateTime(request.created_at)}
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {request.item_name}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {request.status === "NEW" ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    {t("cargo.seller.newBadge")}
                  </span>
                ) : null}
                {hasOwnResponse ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {t("cargo.seller.respondedBadge")}
                  </span>
                ) : null}
                <CargoRequestStatusBadge status={request.status} />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t("cargo.admin.responsesCount").replace(
                    "{count}",
                    String(request.responseCount),
                  )}
                </span>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {request.from_location}
              <span className="mx-1.5 text-slate-400" aria-hidden="true">
                →
              </span>
              {request.to_location}
            </p>

            <dl className="mt-3 grid grid-cols-1 gap-1.5 text-sm text-slate-600 sm:grid-cols-3 dark:text-slate-300">
              {request.weight ? (
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{t("cargo.weight")}</dt>
                  <dd>{request.weight}</dd>
                </div>
              ) : null}
              {request.dimensions ? (
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t("cargo.dimensions")}
                  </dt>
                  <dd>{request.dimensions}</dd>
                </div>
              ) : null}
              {request.quantity ? (
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t("cargo.quantity")}
                  </dt>
                  <dd>{request.quantity}</dd>
                </div>
              ) : null}
              {request.urgency ? (
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    {t("cargo.urgency")}
                  </dt>
                  <dd>{request.urgency}</dd>
                </div>
              ) : null}
            </dl>

            {request.comment ? (
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                {request.comment}
              </p>
            ) : null}

            {request.item_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={normalizeListingImageUrl(request.item_photo_url)}
                alt=""
                className="mt-3 h-28 w-auto max-w-full rounded-xl border border-slate-200 object-cover dark:border-slate-700"
              />
            ) : null}

            {showContacts ? (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t("cargo.admin.clientContact")}
                </p>
                <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{request.name}</p>
                <p className="mt-0.5 text-slate-700 dark:text-slate-300">{request.phone}</p>
                {request.company ? (
                  <p className="mt-0.5 text-slate-500 dark:text-slate-400">{request.company}</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                {t("cargo.contactsRestricted")}
              </p>
            )}

            {hasOwnResponse && request.ownResponse ? (
              <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {t("cargo.myResponses")}
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  {request.ownResponse.comment}
                </p>
                {request.ownResponse.price ? (
                  <p className="mt-1 text-slate-700 dark:text-slate-200">
                    {request.ownResponse.price}
                    {request.ownResponse.currency
                      ? ` ${request.ownResponse.currency}`
                      : null}
                  </p>
                ) : null}
              </div>
            ) : null}

            {canRespond && !hasOwnResponse && !isClosed ? (
              <Button
                type="button"
                className="mt-4 h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                onClick={() => setActiveRequestId(request.id)}
              >
                {t("cargo.seller.respondToRequest")}
              </Button>
            ) : null}

            {canRespond && hasOwnResponse ? (
              <p className="mt-4 text-xs font-medium text-rose-700 dark:text-rose-300">
                {t("cargo.alreadyResponded")}
              </p>
            ) : null}
          </article>
        );
      })}

      {activeRequestId ? (
        <CargoRespondModal
          requestId={activeRequestId}
          open={Boolean(activeRequestId)}
          onOpenChange={(open) => {
            if (!open) {
              setActiveRequestId(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}
