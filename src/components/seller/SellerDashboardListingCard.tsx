import Image from "next/image";
import Link from "next/link";
import type { ListingStatus, ListingVertical } from "@prisma/client";
import { ListingStatus as ListingStatusEnum } from "@prisma/client";
import { CalendarClock, Eye, Package } from "lucide-react";
import { Prisma } from "@prisma/client";
import { ListingQualityBadge } from "@/components/moderation/ListingQualityHints";
import { ListingStatusBadge } from "@/components/seller/ListingStatusBadge";
import { RenewListingButton } from "@/components/listings/RenewListingButton";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { getListingExpirationStatus } from "@/lib/listings/listing-expiration";
import type { QualityLevel } from "@/lib/moderation/listing-quality";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SellerDashboardListing = {
  id: string;
  title: string;
  status: ListingStatus;
  vertical: ListingVertical;
  price: string;
  currency: string;
  created_at: string;
  expires_at: string | null;
  view_count: number;
  image_url: string | null;
  qualityLevel: QualityLevel;
  qualityWarnings: { code: string; label: string }[];
};

type SellerDashboardListingCardProps = {
  listing: SellerDashboardListing;
};

export function SellerDashboardListingCard({ listing }: SellerDashboardListingCardProps) {
  const createdLabel = new Date(listing.created_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isPublished = listing.status === ListingStatusEnum.PUBLISHED;
  const expirationStatus = getListingExpirationStatus({ expires_at: listing.expires_at });
  const expiresLabel = listing.expires_at
    ? new Date(listing.expires_at).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
  const showExpirationBadge =
    isPublished && (expirationStatus === "expired" || expirationStatus === "expiring_soon");
  const showRenewButton = isPublished && showExpirationBadge;

  return (
    <article
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)]",
        "sm:flex-row sm:items-center sm:p-5",
        "transition-shadow hover:shadow-[0_8px_22px_rgba(15,23,42,0.06)]",
      )}
    >
      <Link
        href={`/listings/${listing.id}`}
        className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-xl bg-[#EEF2F7] sm:mx-0 sm:size-28"
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
          <ListingStatusBadge status={listing.status} />
          <VerticalListingBadge vertical={listing.vertical} />
          {showExpirationBadge ? (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                expirationStatus === "expired"
                  ? "bg-red-100 text-red-800"
                  : "bg-amber-100 text-amber-800",
              )}
            >
              {expirationStatus === "expired" ? "Истекло" : "Скоро истечёт"}
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
          <span className="text-base font-bold tracking-tight text-[#0F172A]">
            {formatListingPrice(new Prisma.Decimal(listing.price), listing.currency)}
          </span>
          <span>{createdLabel}</span>
          {expiresLabel ? (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" aria-hidden="true" />
              Публикация до {expiresLabel}
            </span>
          ) : null}
          {listing.view_count > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Eye className="size-3.5" aria-hidden="true" />
              {listing.view_count}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
        <Button
          asChild
          className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-[140px]"
        >
          <Link href={`/listings/${listing.id}`}>Открыть</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-[140px]"
        >
          <Link href={`/listings/${listing.id}/edit`}>Редактировать</Link>
        </Button>
        {showRenewButton ? (
          <RenewListingButton
            listingId={listing.id}
            vertical={listing.vertical}
            className="w-full sm:w-[140px]"
          />
        ) : null}
      </div>
    </article>
  );
}
