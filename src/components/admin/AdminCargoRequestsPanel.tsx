"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CargoRequestStatus } from "@prisma/client";
import { CargoRequestStatusBadge } from "@/components/seller/SellerCargoRequestsList";
import {
  CargoRequestError,
  updateAdminCargoRequestStatus,
} from "@/features/cargo/lib/cargo-requests-client";
import type { AdminCargoRequestItem } from "@/features/cargo/lib/cargo-requests-data";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

const STATUS_OPTIONS: CargoRequestStatus[] = ["NEW", "IN_REVIEW", "CONTACTED", "CLOSED"];

type AdminCargoRequestsPanelProps = {
  requests: AdminCargoRequestItem[];
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

export function AdminCargoRequestsPanel({ requests }: AdminCargoRequestsPanelProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(requestId: string, status: CargoRequestStatus) {
    setError(null);
    setPendingId(requestId);
    try {
      await updateAdminCargoRequestStatus(requestId, status);
      router.refresh();
    } catch (err) {
      if (err instanceof CargoRequestError) {
        setError(err.formErrors.form[0] ?? t("cargo.submitError"));
      } else {
        setError(t("cargo.submitError"));
      }
    } finally {
      setPendingId(null);
    }
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {t("admin.empty.noCargoRequests")}
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          {t("admin.empty.noCargoRequestsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {requests.map((request) => {
        const expanded = expandedId === request.id;

        return (
          <article
            key={request.id}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDateTime(request.created_at)}
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  <Link
                    href={`/cargo/requests/${request.id}`}
                    className="transition hover:text-orange-700 dark:hover:text-orange-300"
                  >
                    {request.item_name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {request.from_location} → {request.to_location}
                </p>
              </div>
              <CargoRequestStatusBadge status={request.status} />
            </div>

            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t("cargo.admin.clientContact")}
              </p>
              <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{request.name}</p>
              <p className="text-slate-700 dark:text-slate-300">{request.phone}</p>
              {request.company ? (
                <p className="text-slate-500 dark:text-slate-400">{request.company}</p>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t("cargo.admin.changeStatus")}
              </label>
              <select
                className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:flex-none"
                value={request.status}
                disabled={pendingId === request.id}
                onChange={(event) =>
                  handleStatusChange(request.id, event.target.value as CargoRequestStatus)
                }
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {t(
                      status === "NEW"
                        ? "cargo.status.new"
                        : status === "IN_REVIEW"
                          ? "cargo.status.inReview"
                          : status === "CONTACTED"
                            ? "cargo.status.contacted"
                            : "cargo.status.closed",
                    )}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-xl border-slate-200 dark:border-slate-700 sm:w-auto"
                onClick={() => setExpandedId(expanded ? null : request.id)}
              >
                {t("cargo.responses")} ({request.responseCount})
              </Button>
            </div>

            {request.item_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={normalizeListingImageUrl(request.item_photo_url)}
                alt=""
                className="mt-3 h-24 w-auto max-w-full rounded-xl border border-slate-200 object-cover dark:border-slate-700"
              />
            ) : null}

            {expanded ? (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {t("cargo.admin.responses")}
                </p>
                {request.responses.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">—</p>
                ) : (
                  request.responses.map((response) => (
                    <div
                      key={response.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950"
                    >
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {response.sellerProfile.company_name}
                      </p>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{response.comment}</p>
                      {response.price ? (
                        <p className="mt-1 text-slate-700 dark:text-slate-200">
                          {response.price}
                          {response.currency ? ` ${response.currency}` : null}
                          {response.estimated_time ? ` · ${response.estimated_time}` : null}
                        </p>
                      ) : null}
                      {response.contact_phone ? (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {response.contact_name ? `${response.contact_name}: ` : null}
                          {response.contact_phone}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
