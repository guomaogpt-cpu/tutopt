"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { useState, memo } from "react";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { buildCompanyPublicHref } from "@/features/company/lib/company-profile";
import { getListingCardGlowClass } from "@/features/listings/lib/listing-card-glow";
import {
  formatListingCardPrice,
} from "@/features/listings/lib/listing-display";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ListingCardProps = {
  listing: ListingCardData;
  isAuthenticated?: boolean;
  isFavorited?: boolean;
  /** home = compact density; catalog/default = standard marketplace card. */
  variant?: "default" | "showcase" | "home" | "catalog";
  onFavoriteChange?: (isFavorited: boolean) => void;
};

function formatCardFreshness(
  value: string | null,
  locale: "ru" | "kg" | "en",
  labels: { today: string; yesterday: string },
): string | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const diffDays = Math.floor(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  );

  if (diffDays === 0) {
    return labels.today;
  }
  if (diffDays === 1) {
    return labels.yesterday;
  }

  const dateLocale = locale === "en" ? "en-US" : locale === "kg" ? "ky-KG" : "ru-RU";
  return parsed.toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "short",
  });
}

function getSellerDisplayName(listing: ListingCardData, fallback: string): string {
  if (listing.posted_as_company && listing.sellerProfile.company_type) {
    return listing.sellerProfile.company_name.trim() || fallback;
  }
  return (
    listing.sellerProfile.user.name?.trim() ||
    listing.sellerProfile.company_name?.trim() ||
    fallback
  );
}

export const ListingCard = memo(function ListingCard({
  listing,
  isAuthenticated = false,
  isFavorited = false,
  variant = "default",
  onFavoriteChange,
}: ListingCardProps) {
  const { t, locale } = useTranslation();
  const rawMainImage = listing.images[0]?.url;
  const mainImage = rawMainImage ? normalizeListingImageUrl(rawMainImage) : undefined;
  const [imageFailed, setImageFailed] = useState(false);
  const hasPrice = Number.isFinite(Number(listing.price)) && Number(listing.price) > 0;
  const priceLabel = hasPrice
    ? formatListingCardPrice({
        price: listing.price,
        currency: listing.currency,
        vertical: listing.vertical,
      })
    : listing.vertical === "SERVICES"
      ? t("services.priceByAgreement")
      : t("listingCard.priceOnRequest");
  const isCompact = variant === "home";
  const dateLabel = formatCardFreshness(
    listing.published_at ?? listing.created_at,
    locale,
    { today: t("listingCard.today"), yesterday: t("listingCard.yesterday") },
  );
  const cityName = listing.city?.name ?? null;
  const categoryLabel = listing.category.name;
  const sellerName = getSellerDisplayName(listing, t("listing.listingAuthor"));
  const glowClass = getListingCardGlowClass(
    listing.vertical,
    listing.category?.name,
  );

  const metaParts = [cityName, categoryLabel, dateLabel].filter(Boolean);

  return (
    <div className="group relative h-full w-full min-w-0">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-3 -bottom-1 -z-10 h-16 rounded-3xl blur-2xl",
          "opacity-[0.14] transition-opacity duration-300 group-hover:opacity-[0.22]",
          "max-sm:hidden",
          glowClass,
        )}
      />
      <article
        className={cn(
          "relative z-10 flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white",
          "dark:border-slate-800 dark:bg-slate-900",
          "shadow-[0_4px_14px_rgba(15,23,42,0.04)] dark:shadow-none",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-[rgba(148,163,184,0.28)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] dark:hover:border-slate-700",
        )}
      >
        <Link
          href={`/listings/${listing.id}`}
          aria-label={`${t("listings.openListing")}: ${listing.title}`}
          className="absolute inset-0 z-[1] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <span className="sr-only">{listing.title}</span>
        </Link>

        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#EEF2F7] dark:bg-slate-800">
          {mainImage && !imageFailed ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              unoptimized
              loading="lazy"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              onError={() => setImageFailed(true)}
              sizes={
                isCompact
                  ? "(max-width: 768px) 50vw, (max-width: 1280px) 20vw, 16vw"
                  : "(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
              }
            />
          ) : (
            <div
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1.5",
                listing.vertical === "OPT" &&
                  "bg-blue-50/80 text-blue-300 dark:bg-blue-950/40 dark:text-blue-400",
                listing.vertical === "MARKET" &&
                  "bg-indigo-50/80 text-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-400",
                listing.vertical === "SERVICES" &&
                  "bg-teal-50/80 text-teal-300 dark:bg-teal-950/40 dark:text-teal-400",
                listing.vertical === "CARGO" &&
                  "bg-rose-50/80 text-rose-300 dark:bg-rose-950/40 dark:text-rose-400",
              )}
            >
              <Package className={cn(isCompact ? "size-7" : "size-8")} strokeWidth={1.5} />
              <span className="text-[10px] font-medium opacity-80 sm:text-xs">
                {t("listings.noImage")}
              </span>
            </div>
          )}

          <VerticalListingBadge
            vertical={listing.vertical}
            className="absolute left-2 top-2 z-10 opacity-90 shadow-sm backdrop-blur-sm"
          />

          <FavoriteButton
            listingId={listing.id}
            isAuthenticated={isAuthenticated}
            initialIsFavorited={isFavorited}
            vertical={listing.vertical}
            variant="icon"
            onFavoriteChange={onFavoriteChange}
            className={cn(
              "absolute right-2 top-2 z-[2] rounded-full border border-[rgba(148,163,184,0.2)] bg-white/95 p-0 shadow-sm backdrop-blur-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/95 dark:hover:bg-slate-800",
              "size-9 [&_svg]:size-4 sm:size-9",
            )}
          />
        </div>

        <div
          className={cn(
            "flex min-h-[8.75rem] flex-1 flex-col bg-white dark:bg-slate-900",
            isCompact ? "gap-1 p-2.5 md:p-3" : "gap-1 p-2.5 sm:gap-1.5 sm:p-3 md:p-3.5",
          )}
        >
          <p
            className={cn(
              "line-clamp-1 font-bold leading-tight tracking-tight text-[#0F172A] dark:text-slate-100",
              isCompact ? "text-[15px] md:text-base" : "text-[15px] sm:text-base md:text-lg",
            )}
          >
            {priceLabel}
          </p>

          <h2
            className={cn(
              "line-clamp-2 min-h-[2.5em] font-medium leading-snug text-[#334155] dark:text-slate-200",
              isCompact ? "text-[13px] md:text-sm" : "text-[13px] sm:text-sm md:text-[15px]",
            )}
          >
            {listing.title}
          </h2>

          {metaParts.length > 0 ? (
            <p
              className={cn(
                "line-clamp-2 text-[#94A3B8] dark:text-slate-400",
                isCompact ? "text-[11px]" : "text-[11px] sm:text-xs",
              )}
            >
              {cityName ? (
                <span className="inline-flex min-w-0 max-w-full items-center gap-0.5 align-middle">
                  <MapPin className="mb-px inline size-3 shrink-0" aria-hidden="true" />
                  <span>{metaParts.join(" · ")}</span>
                </span>
              ) : (
                metaParts.join(" · ")
              )}
            </p>
          ) : null}

          <div className="mt-auto" />

          <p
            className={cn(
              "relative z-[2] truncate border-t border-[rgba(148,163,184,0.12)] pt-2 font-medium text-[#64748B] dark:border-slate-800 dark:text-slate-400",
              isCompact ? "text-[11px]" : "text-xs md:text-[13px]",
            )}
          >
            {listing.posted_as_company && listing.sellerProfile.company_type ? (
              <Link
                href={buildCompanyPublicHref(listing.sellerProfile.id)}
                className="truncate hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                onClick={(event) => event.stopPropagation()}
              >
                {sellerName}
              </Link>
            ) : (
              <span className="truncate">{sellerName}</span>
            )}
          </p>
        </div>
      </article>
    </div>
  );
});
