"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { useState, memo } from "react";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { buildCompanyPublicHref } from "@/features/company/lib/company-profile";
import { formatListingCardPrice } from "@/features/listings/lib/listing-display";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ListingCardProps = {
  listing: ListingCardData;
  isAuthenticated?: boolean;
  isFavorited?: boolean;
  /** home = home grid density; catalog/default = standard public card. */
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

function shortenCategoryLabel(name: string, maxLength = 16): string {
  const trimmed = name.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength - 1).trim()}…`;
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
  const isHome = variant === "home";
  const dateLabel = formatCardFreshness(
    listing.published_at ?? listing.created_at,
    locale,
    { today: t("listingCard.today"), yesterday: t("listingCard.yesterday") },
  );
  const cityName = listing.city?.name ?? null;
  const categoryLabel = shortenCategoryLabel(listing.category.name);
  const sellerName = getSellerDisplayName(listing, t("listing.listingAuthor"));

  const metaParts = [cityName, categoryLabel, dateLabel].filter(Boolean);

  return (
    <div className="group relative h-full w-full min-w-0">
      <article
        className={cn(
          "relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white",
          "dark:border-slate-800 dark:bg-slate-900",
          "shadow-[0_1px_4px_rgba(15,23,42,0.04)] dark:shadow-none",
          "transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] dark:hover:border-slate-700",
        )}
      >
        <Link
          href={`/listings/${listing.id}`}
          aria-label={`${t("listings.openListing")}: ${listing.title}`}
          className="absolute inset-0 z-[1] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <span className="sr-only">{listing.title}</span>
        </Link>

        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#EEF2F7] dark:bg-slate-800">
          {mainImage && !imageFailed ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              unoptimized
              loading="lazy"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              onError={() => setImageFailed(true)}
              sizes={
                isHome
                  ? "(max-width: 640px) 50vw, (max-width: 1280px) 20vw, 14vw"
                  : "(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 16vw"
              }
            />
          ) : (
            <div
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1",
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
              <Package className="size-6" strokeWidth={1.5} />
              <span className="text-[10px] font-medium opacity-80">{t("listings.noImage")}</span>
            </div>
          )}

          <VerticalListingBadge
            vertical={listing.vertical}
            className="absolute left-1.5 top-1.5 z-10 scale-90 opacity-95 shadow-sm backdrop-blur-sm"
          />

          <FavoriteButton
            listingId={listing.id}
            isAuthenticated={isAuthenticated}
            initialIsFavorited={isFavorited}
            vertical={listing.vertical}
            variant="icon"
            onFavoriteChange={onFavoriteChange}
            className={cn(
              "absolute right-1.5 top-1.5 z-[2] rounded-full border border-slate-200/80 bg-white/95 p-0 shadow-sm backdrop-blur-sm hover:bg-white dark:border-slate-700 dark:bg-slate-900/95 dark:hover:bg-slate-800",
              "size-8 [&_svg]:size-3.5",
            )}
          />
        </div>

        <div className="flex flex-col px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3 sm:pt-2.5">
          <p className="line-clamp-1 text-sm font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-[15px]">
            {priceLabel}
          </p>

          <h2 className="mt-1 line-clamp-2 text-xs font-medium leading-[1.25] text-slate-700 dark:text-slate-200 sm:text-[13px]">
            {listing.title}
          </h2>

          {metaParts.length > 0 ? (
            <p className="mt-1.5 line-clamp-1 text-[10px] leading-tight text-slate-400 dark:text-slate-500 sm:text-[11px]">
              {metaParts.join(" · ")}
            </p>
          ) : null}

          <p className="relative z-[2] mt-1.5 line-clamp-1 text-[10px] font-medium leading-tight text-slate-500 dark:text-slate-400 sm:text-[11px]">
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
