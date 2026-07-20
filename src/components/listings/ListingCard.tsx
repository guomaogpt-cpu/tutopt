import Image from "next/image";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import {
  formatListingCardPrice,
  getListingUnitLabel,
} from "@/features/listings/lib/listing-display";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { cn } from "@/lib/utils";

type ListingCardProps = {
  listing: ListingCardData;
  isAuthenticated?: boolean;
  isFavorited?: boolean;
  /** home = compact density; catalog/default = standard marketplace card. */
  variant?: "default" | "showcase" | "home" | "catalog";
  onFavoriteChange?: (isFavorited: boolean) => void;
};

function formatCardDate(value: string | null): string | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function ListingCard({
  listing,
  isAuthenticated = false,
  isFavorited = false,
  variant = "default",
  onFavoriteChange,
}: ListingCardProps) {
  const rawMainImage = listing.images[0]?.url;
  const mainImage = rawMainImage ? normalizeListingImageUrl(rawMainImage) : undefined;
  const unitLabel = getListingUnitLabel(listing.unit, listing.vertical);
  const priceLabel = formatListingCardPrice({
    price: listing.price,
    currency: listing.currency,
    vertical: listing.vertical,
  });
  const isCompact = variant === "home";
  const showSeller = variant === "catalog" || variant === "default" || variant === "showcase";
  const dateLabel = formatCardDate(listing.published_at ?? listing.created_at);
  const cityName = listing.city?.name ?? null;
  const showUnitSuffix =
    (listing.vertical === "OPT" || listing.vertical === "MARKET") &&
    Number(listing.price) > 0;

  return (
    <article
      className={cn(
        "group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.16)] bg-white",
        "shadow-[0_4px_14px_rgba(15,23,42,0.04)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-[rgba(148,163,184,0.28)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EEF2F7]">
        <Link href={`/listings/${listing.id}`} className="relative block h-full w-full">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              unoptimized
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
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
                listing.vertical === "OPT" && "bg-blue-50/80 text-blue-300",
                listing.vertical === "MARKET" && "bg-indigo-50/80 text-indigo-300",
                listing.vertical === "SERVICES" && "bg-teal-50/80 text-teal-300",
                listing.vertical === "CARGO" && "bg-rose-50/80 text-rose-300",
              )}
              aria-hidden="true"
            >
              <Package className={cn(isCompact ? "size-7" : "size-8")} strokeWidth={1.5} />
            </div>
          )}
        </Link>

        <VerticalListingBadge
          vertical={listing.vertical}
          className="absolute left-2 top-2 z-10 bg-white/95 shadow-sm backdrop-blur-sm"
        />

        <FavoriteButton
          listingId={listing.id}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          vertical={listing.vertical}
          variant="icon"
          onFavoriteChange={onFavoriteChange}
          className={cn(
            "absolute right-2 top-2 z-10 rounded-full border border-[rgba(148,163,184,0.2)] bg-white/95 p-0 shadow-sm backdrop-blur-sm hover:bg-white",
            isCompact ? "size-8 [&_svg]:size-3.5" : "size-9 [&_svg]:size-4",
          )}
        />
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          isCompact ? "gap-1 p-2.5 md:p-3" : "gap-1.5 p-3 md:p-3.5",
        )}
      >
        <p
          className={cn(
            "font-bold leading-tight tracking-tight text-[#0F172A]",
            isCompact ? "text-[15px] md:text-base" : "text-base md:text-lg",
          )}
        >
          {priceLabel}
          {showUnitSuffix ? (
            <span className="text-[11px] font-medium text-[#94A3B8] md:text-xs">
              {" "}
              / {unitLabel.toLowerCase()}
            </span>
          ) : null}
        </p>

        <h2
          className={cn(
            "line-clamp-2 font-medium leading-snug text-[#334155]",
            isCompact ? "min-h-[2.4rem] text-[13px] md:text-sm" : "min-h-[2.5rem] text-sm md:text-[15px]",
          )}
        >
          <Link
            href={`/listings/${listing.id}`}
            className="transition hover:text-[#2563EB]"
          >
            {listing.title}
          </Link>
        </h2>

        <div
          className={cn(
            "mt-auto flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[#94A3B8]",
            isCompact ? "pt-1 text-[11px]" : "pt-1.5 text-xs",
          )}
        >
          {cityName ? (
            <span className="inline-flex min-w-0 items-center gap-0.5">
              <MapPin className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{cityName}</span>
            </span>
          ) : null}
          {cityName && dateLabel ? <span aria-hidden="true">·</span> : null}
          {dateLabel ? <span className="shrink-0">{dateLabel}</span> : null}
          {!cityName && !dateLabel ? (
            <span className="truncate">{listing.category.name}</span>
          ) : null}
        </div>

        {showSeller ? (
          <p
            className={cn(
              "truncate border-t border-[rgba(148,163,184,0.12)] font-medium text-[#64748B]",
              isCompact ? "mt-1.5 pt-1.5 text-[11px]" : "mt-2 pt-2 text-xs md:text-[13px]",
            )}
          >
            {listing.sellerProfile.company_name}
          </p>
        ) : null}
      </div>
    </article>
  );
}
