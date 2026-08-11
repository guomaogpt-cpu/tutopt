"use client";

import Image from "next/image";
import Link from "next/link";
import type { ListingStatus, ListingVertical } from "@prisma/client";
import { ListingStatus as ListingStatusEnum } from "@prisma/client";
import { CalendarClock, Eye, Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListingQualityBadge } from "@/components/moderation/ListingQualityHints";
import { ListingStatusBadge } from "@/components/seller/ListingStatusBadge";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import type { SellerListingsStatusFilter } from "@/features/sellers/lib/seller-listings";
import { trackSellerListingActionClick } from "@/lib/analytics/events";
import { getListingExpirationStatus } from "@/lib/listings/listing-expiration";
import type { QualityLevel } from "@/lib/moderation/listing-quality";
import { Button } from "@/components/ui/button";
import {
  ConfirmDialog,
  ConfirmDialogAction,
  ConfirmDialogCancel,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
} from "@/components/ui/confirm-dialog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export type SellerManagedListing = {
  id: string;
  title: string;
  status: ListingStatus;
  vertical: ListingVertical;
  priceLabel: string;
  categoryName: string;
  cityName: string | null;
  created_at: string;
  published_at: string | null;
  expires_at: string | null;
  view_count: number;
  image_url: string | null;
  qualityLevel: QualityLevel;
  qualityWarnings: { code: string; label: string }[];
  postedAsCompany?: boolean;
  companyName?: string | null;
  leadsCount?: number;
  rejection_reason?: string | null;
  updated_at?: string;
};

type ListingApiAction = "archive" | "restore" | "renew" | "submit";

type ErrorBody = {
  error?: { message?: string };
};

function formatShortDate(value: string): string {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type SellerListingManageCardProps = {
  listing: SellerManagedListing;
  statusFilter: SellerListingsStatusFilter;
  /** Use accountListings.* action labels when true. */
  useAccountLabels?: boolean;
};

export function SellerListingManageCard({
  listing,
  statusFilter,
  useAccountLabels = false,
}: SellerListingManageCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<ListingApiAction | null>(null);
  const [error, setError] = useState("");

  const expirationStatus = getListingExpirationStatus({ expires_at: listing.expires_at });
  const isDraft = listing.status === ListingStatusEnum.DRAFT;
  const isPending = listing.status === ListingStatusEnum.PENDING_MODERATION;
  const isRejected = listing.status === ListingStatusEnum.REJECTED;
  const isArchived = listing.status === ListingStatusEnum.ARCHIVED;
  const isPublished = listing.status === ListingStatusEnum.PUBLISHED;

  const canArchive =
    isPublished || isPending || isRejected;
  const canRestore = isArchived;
  const canRenew = isPublished;
  const canSubmit = isDraft || isRejected;
  const canShowLeads = isPublished;
  const showOpen = !isDraft;

  const openLabel = useAccountLabels ? t("accountListings.open") : "Открыть";
  const editLabel = useAccountLabels ? t("accountListings.edit") : "Редактировать";
  const archiveLabel = useAccountLabels ? t("accountListings.archive") : "В архив";
  const restoreLabel = useAccountLabels ? t("accountListings.restore") : "Восстановить";
  const submitLabel = useAccountLabels
    ? t("accountListings.submitModeration")
    : "Отправить на модерацию";
  const continueLabel = useAccountLabels ? t("accountListings.continueDraft") : "Продолжить";
  const leadsLabel = useAccountLabels ? t("accountListings.leadsAction") : "Заявки";
  const postedAsLabel = listing.postedAsCompany
    ? `${t("accountListings.postedAs")}: ${t("accountListings.company")}${
        listing.companyName ? ` · ${listing.companyName}` : ""
      }`
    : useAccountLabels
      ? `${t("accountListings.postedAs")}: ${t("accountListings.personalAccount")}`
      : null;

  async function runAction(action: ListingApiAction) {
    if (pendingAction) {
      return;
    }

    setPendingAction(action);
    setError("");
    trackSellerListingActionClick({
      action,
      vertical: listing.vertical,
      statusFilter,
    });

    try {
      const response =
        action === "renew"
          ? await fetch(`/api/listings/${listing.id}/renew`, { method: "POST" })
          : action === "submit"
            ? await fetch(`/api/listings/${listing.id}/submit`, { method: "POST" })
            : await fetch(`/api/listings/${listing.id}/lifecycle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
              });

      if (!response.ok) {
        const body = (await response.json()) as ErrorBody;
        setError(body.error?.message ?? "Не удалось выполнить действие.");
        setPendingAction(null);
        return;
      }

      router.refresh();
      setPendingAction(null);
    } catch {
      setError("Не удалось выполнить действие. Попробуйте позже.");
      setPendingAction(null);
    }
  }

  const dateLabel = listing.published_at
    ? `${t("accountListings.publishedAt")} ${formatShortDate(listing.published_at)}`
    : null;

  const createdLabel = `${t("accountListings.createdAt")} ${formatShortDate(listing.created_at)}`;
  const updatedLabel =
    listing.updated_at && listing.updated_at !== listing.created_at
      ? `${t("accountListings.updatedAt")} ${formatShortDate(listing.updated_at)}`
      : null;

  const isExpired = expirationStatus === "expired";
  const isExpiringSoon = expirationStatus === "expiring_soon";

  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)]",
        "dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        "lg:flex-row lg:items-center lg:p-5",
        "transition-shadow hover:shadow-[0_8px_22px_rgba(15,23,42,0.06)]",
      )}
    >
      <Link
        href={`/listings/${listing.id}`}
        className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-xl bg-[#EEF2F7] dark:bg-slate-800 lg:mx-0 lg:size-28"
      >
        {listing.image_url ? (
          <Image
            src={normalizeListingImageUrl(listing.image_url)}
            alt={listing.title}
            fill
            unoptimized
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-[#CBD5E1]">
            <Package className="size-6" strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <ListingStatusBadge status={listing.status} showHint={useAccountLabels} />
          <VerticalListingBadge vertical={listing.vertical} />
          {isPublished && (isExpired || isExpiringSoon) ? (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                isExpired ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800",
              )}
            >
              {isExpired ? "Истекло" : "Скоро истечёт"}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-[#0F172A] dark:text-slate-100">
          <Link href={`/listings/${listing.id}`} className="transition hover:text-[#2563EB]">
            {listing.title}
          </Link>
        </h3>

        <ListingQualityBadge
          level={listing.qualityLevel}
          warnings={listing.qualityWarnings}
          className="mt-2"
        />

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#64748B] dark:text-slate-400">
          <span className="text-base font-bold tracking-tight text-[#0F172A] dark:text-slate-100">
            {listing.priceLabel}
          </span>
          <span>{listing.categoryName}</span>
          {listing.cityName ? <span>{listing.cityName}</span> : null}
          {useAccountLabels ? (
            <>
              <span>{createdLabel}</span>
              {updatedLabel ? <span>{updatedLabel}</span> : null}
              {dateLabel ? <span>{dateLabel}</span> : null}
            </>
          ) : (
            <span>{dateLabel ?? createdLabel}</span>
          )}
          {postedAsLabel ? <span>{postedAsLabel}</span> : null}
          {useAccountLabels && typeof listing.leadsCount === "number" ? (
            <span>
              {t("accountListings.leadsCount")}: {listing.leadsCount}
            </span>
          ) : typeof listing.leadsCount === "number" && listing.leadsCount > 0 ? (
            <Link
              href={`/account/requests?tab=received&listingId=${listing.id}`}
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("accountListings.leadsCount")}: {listing.leadsCount}
            </Link>
          ) : null}
          {listing.expires_at ? (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              Публикация до {formatShortDate(listing.expires_at)}
            </span>
          ) : null}
          {listing.view_count > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" aria-hidden="true" />
              {listing.view_count}
            </span>
          ) : null}
        </div>

        {listing.rejection_reason ? (
          <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-800 dark:bg-red-950/40 dark:text-red-200">
            Причина отклонения: {listing.rejection_reason}
          </p>
        ) : null}

        {error ? <p className="mt-2 text-xs text-[#DC2626]">{error}</p> : null}
      </div>

      <div className="grid w-full min-w-0 shrink-0 grid-cols-1 gap-2 min-[380px]:grid-cols-2 lg:w-[300px] [&_a]:min-w-0 [&_button]:min-w-0 [&_button]:whitespace-normal [&_a]:whitespace-normal">
        {showOpen ? (
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-[rgba(148,163,184,0.25)] dark:border-slate-700 sm:h-10"
            onClick={() =>
              trackSellerListingActionClick({
                action: "open",
                vertical: listing.vertical,
                statusFilter,
              })
            }
          >
            <Link href={`/listings/${listing.id}`}>{openLabel}</Link>
          </Button>
        ) : null}

        <Button
          asChild
          variant="outline"
          className="h-11 rounded-xl border-[rgba(148,163,184,0.25)] dark:border-slate-700 sm:h-10"
          onClick={() =>
            trackSellerListingActionClick({
              action: "edit",
              vertical: listing.vertical,
              statusFilter,
            })
          }
        >
          <Link href={`/listings/${listing.id}/edit`}>
            {isDraft && useAccountLabels ? continueLabel : editLabel}
          </Link>
        </Button>

        {canShowLeads ? (
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-[rgba(148,163,184,0.25)] dark:border-slate-700 sm:h-10"
          >
            <Link href={`/account/requests?tab=received&listingId=${listing.id}`}>
              {leadsLabel}
              {listing.leadsCount ? ` (${listing.leadsCount})` : ""}
            </Link>
          </Button>
        ) : null}

        {canSubmit ? (
          <Button
            type="button"
            disabled={pendingAction !== null}
            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 sm:h-10"
            onClick={() => void runAction("submit")}
          >
            {pendingAction === "submit" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              submitLabel
            )}
          </Button>
        ) : null}

        {canRenew ? (
          <ConfirmActionButton
            label="Продлить"
            title="Продлить объявление?"
            description={
              isExpired
                ? "Срок публикации будет продлён на 30 дней. Объявление отправится на модерацию, так как срок уже истёк."
                : "Срок публикации будет продлён на 30 дней от текущей даты."
            }
            confirmLabel="Продлить"
            isPending={pendingAction === "renew"}
            disabled={pendingAction !== null}
            onConfirm={() => void runAction("renew")}
          />
        ) : null}

        {canArchive ? (
          <ConfirmActionButton
            label={archiveLabel}
            title={
              useAccountLabels
                ? t("accountListings.archiveConfirmTitle")
                : "Скрыть объявление из поиска?"
            }
            description={
              useAccountLabels
                ? t("accountListings.archiveConfirmDescription")
                : "Вы точно хотите скрыть объявление из поиска? Его можно восстановить позже."
            }
            confirmLabel={archiveLabel}
            isPending={pendingAction === "archive"}
            disabled={pendingAction !== null}
            onConfirm={() => void runAction("archive")}
          />
        ) : null}

        {canRestore ? (
          <ConfirmActionButton
            label={restoreLabel}
            title="Восстановить объявление?"
            description="Объявление вернётся из архива и отправится на модерацию перед публикацией."
            confirmLabel={restoreLabel}
            isPending={pendingAction === "restore"}
            disabled={pendingAction !== null}
            onConfirm={() => void runAction("restore")}
          />
        ) : null}
      </div>
    </article>
  );
}

type ConfirmActionButtonProps = {
  label: string;
  title: string;
  description: string;
  confirmLabel: string;
  isPending: boolean;
  disabled: boolean;
  onConfirm: () => void;
};

function ConfirmActionButton({
  label,
  title,
  description,
  confirmLabel,
  isPending,
  disabled,
  onConfirm,
}: ConfirmActionButtonProps) {
  return (
    <ConfirmDialog>
      <ConfirmDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-11 rounded-xl border-[rgba(148,163,184,0.25)] dark:border-slate-700 sm:h-10"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            label
          )}
        </Button>
      </ConfirmDialogTrigger>
      <ConfirmDialogContent>
        <ConfirmDialogHeader>
          <ConfirmDialogTitle>{title}</ConfirmDialogTitle>
          <ConfirmDialogDescription>{description}</ConfirmDialogDescription>
        </ConfirmDialogHeader>
        <ConfirmDialogFooter>
          <ConfirmDialogCancel>Отмена</ConfirmDialogCancel>
          <ConfirmDialogAction onClick={onConfirm}>{confirmLabel}</ConfirmDialogAction>
        </ConfirmDialogFooter>
      </ConfirmDialogContent>
    </ConfirmDialog>
  );
}
