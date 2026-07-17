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
};

type ListingApiAction = "archive" | "restore" | "renew";

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
};

export function SellerListingManageCard({
  listing,
  statusFilter,
}: SellerListingManageCardProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<ListingApiAction | null>(null);
  const [error, setError] = useState("");

  const expirationStatus = getListingExpirationStatus({ expires_at: listing.expires_at });
  const isPublished = listing.status === ListingStatusEnum.PUBLISHED;
  const isExpired = expirationStatus === "expired";
  const isExpiringSoon = expirationStatus === "expiring_soon";

  const canArchive =
    listing.status === ListingStatusEnum.PUBLISHED ||
    listing.status === ListingStatusEnum.PENDING_MODERATION ||
    listing.status === ListingStatusEnum.REJECTED;
  const canRestore = listing.status === ListingStatusEnum.ARCHIVED;
  const canRenew = isPublished;

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
    ? `Опубликовано ${formatShortDate(listing.published_at)}`
    : `Создано ${formatShortDate(listing.created_at)}`;

  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
        "lg:flex-row lg:items-center lg:p-5",
      )}
    >
      <Link
        href={`/listings/${listing.id}`}
        className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F1F5F9] lg:mx-0 lg:size-28"
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
          <div className="flex h-full flex-col items-center justify-center gap-1 text-[11px] text-[#94A3B8]">
            <Package className="size-5" aria-hidden="true" />
            Нет фото
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <ListingStatusBadge status={listing.status} />
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

        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-[#0F172A]">
          <Link href={`/listings/${listing.id}`} className="transition hover:text-[#2563EB]">
            {listing.title}
          </Link>
        </h3>

        <ListingQualityBadge
          level={listing.qualityLevel}
          warnings={listing.qualityWarnings}
          className="mt-2"
        />

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">{listing.priceLabel}</span>
          <span>{listing.categoryName}</span>
          {listing.cityName ? <span>{listing.cityName}</span> : null}
          <span>{dateLabel}</span>
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

        {error ? <p className="mt-2 text-xs text-[#DC2626]">{error}</p> : null}
      </div>

      <div className="grid w-full shrink-0 grid-cols-2 gap-2 lg:w-[300px]">
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-xl border-[rgba(148,163,184,0.25)]"
          onClick={() =>
            trackSellerListingActionClick({
              action: "open",
              vertical: listing.vertical,
              statusFilter,
            })
          }
        >
          <Link href={`/listings/${listing.id}`}>Открыть</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-xl border-[rgba(148,163,184,0.25)]"
          onClick={() =>
            trackSellerListingActionClick({
              action: "edit",
              vertical: listing.vertical,
              statusFilter,
            })
          }
        >
          <Link href={`/listings/${listing.id}/edit`}>Редактировать</Link>
        </Button>

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
            label="Архивировать"
            title="Архивировать объявление?"
            description="Объявление будет скрыто с сайта и перемещено в архив. Его можно восстановить позже."
            confirmLabel="Архивировать"
            isPending={pendingAction === "archive"}
            disabled={pendingAction !== null}
            onConfirm={() => void runAction("archive")}
          />
        ) : null}

        {canRestore ? (
          <ConfirmActionButton
            label="Восстановить"
            title="Восстановить объявление?"
            description="Объявление вернётся из архива и отправится на модерацию перед публикацией."
            confirmLabel="Восстановить"
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
          className="h-10 rounded-xl border-[rgba(148,163,184,0.25)]"
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
