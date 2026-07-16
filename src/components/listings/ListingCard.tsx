import Image from "next/image";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import {
  formatListingCardPrice,
  getListingMetaItems,
  getListingUnitLabel,
} from "@/features/listings/lib/listing-display";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type ListingCardProps = {
  listing: ListingCardData;
  isAuthenticated?: boolean;
  isFavorited?: boolean;
  variant?: "default" | "showcase" | "home" | "catalog";
  onFavoriteChange?: (isFavorited: boolean) => void;
};

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
  const isHome = variant === "home";
  const isCatalog = variant === "catalog";
  const isShowcase = variant === "showcase";

  const metaItems = getListingMetaItems({
    vertical: listing.vertical,
    moq: listing.moq,
    unit: listing.unit,
    city: listing.city,
    brand: listing.brand,
    category: listing.category,
    stock_quantity: isHome ? null : listing.stock_quantity,
  }).slice(0, isHome ? 3 : 4);

  if (isHome) {
    return (
      <article
        className={cn(
          "group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-[rgba(148,163,184,0.18)]",
          "bg-[rgba(255,255,255,0.86)] shadow-[0_8px_20px_rgba(15,23,42,0.04)]",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-[rgba(37,99,235,0.22)]",
          "max-md:max-h-[300px] md:max-h-[400px]",
        )}
      >
        <div className="relative h-[128px] w-full overflow-hidden bg-[#F1F5F9] md:h-[165px]">
          <Link href={`/listings/${listing.id}`} className="relative block h-full w-full">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={listing.title}
                fill
                unoptimized
                className="block object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 20vw, 16vw"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-[10px] text-[#94A3B8] md:text-[11px]">
                <Package className="size-3.5 md:size-4" aria-hidden="true" />
                Нет фото
              </div>
            )}
          </Link>

          <VerticalListingBadge
            vertical={listing.vertical}
            className="absolute left-2 top-2 z-10 bg-white/90 backdrop-blur-sm"
          />

          <FavoriteButton
            listingId={listing.id}
            isAuthenticated={isAuthenticated}
            initialIsFavorited={isFavorited}
            variant="icon"
            onFavoriteChange={onFavoriteChange}
            className="absolute right-2 top-2 z-10 size-8 rounded-full border border-[rgba(148,163,184,0.22)] bg-[rgba(255,255,255,0.86)] p-0 shadow-none backdrop-blur-sm hover:bg-white md:right-3 md:top-3 md:size-[34px] [&_svg]:size-4"
          />
        </div>

        <div className="flex flex-1 flex-col p-2.5 md:px-3.5 md:pb-3.5 md:pt-3">
          <h2 className="mb-1 line-clamp-2 min-h-[2.4rem] text-[13px] font-semibold leading-[1.2] text-[#0F172A] md:mb-1.5 md:min-h-9 md:text-sm md:leading-[1.25]">
            <Link
              href={`/listings/${listing.id}`}
              className="transition hover:text-[#2563EB]"
            >
              {listing.title}
            </Link>
          </h2>

          <p className="mb-1.5 text-[15px] font-bold leading-[1.1] text-[#2563EB] md:mb-2 md:text-lg md:leading-[1.15]">
            {priceLabel}
            {listing.vertical === "OPT" || listing.vertical === "MARKET" ? (
              <span className="text-[10px] font-medium text-[#64748B] md:text-xs">
                {" "}
                / {unitLabel.toLowerCase()}
              </span>
            ) : null}
          </p>

          <dl className="space-y-0.5 md:space-y-1">
            {metaItems.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="flex items-center justify-between gap-2 md:gap-3"
              >
                <dt className="shrink-0 text-[11px] font-normal leading-[1.35] text-[#64748B] md:text-xs">
                  {item.label}
                </dt>
                <dd className="min-w-0 truncate text-right text-[11px] font-medium leading-[1.35] text-[#334155] md:text-xs">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    );
  }

  if (isCatalog) {
    return (
      <article
        className={cn(
          "group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-[rgba(148,163,184,0.18)] bg-white",
          "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-[rgba(37,99,235,0.22)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]",
        )}
      >
        <div className="relative h-[140px] w-full overflow-hidden bg-[#F1F5F9] md:h-[160px]">
          <Link href={`/listings/${listing.id}`} className="relative block h-full w-full">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={listing.title}
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1.5 text-xs text-[#94A3B8]">
                <Package className="size-5" aria-hidden="true" />
                Нет фото
              </div>
            )}
          </Link>

          <VerticalListingBadge
            vertical={listing.vertical}
            className="absolute left-2 top-2 z-10 bg-white/90 backdrop-blur-sm"
          />

          <FavoriteButton
            listingId={listing.id}
            isAuthenticated={isAuthenticated}
            initialIsFavorited={isFavorited}
            variant="icon"
            onFavoriteChange={onFavoriteChange}
            className="absolute right-2 top-2 z-10 size-8 rounded-full border border-[rgba(148,163,184,0.22)] bg-[rgba(255,255,255,0.9)] p-0 shadow-none backdrop-blur-sm hover:bg-white md:right-3 md:top-3 md:size-9 [&_svg]:size-4"
          />
        </div>

        <div className="flex flex-1 flex-col p-3 md:p-3.5">
          <h2 className="line-clamp-2 min-h-[2.4rem] text-sm font-semibold leading-snug text-[#0F172A] md:min-h-10 md:text-[15px]">
            <Link
              href={`/listings/${listing.id}`}
              className="transition hover:text-[#2563EB]"
            >
              {listing.title}
            </Link>
          </h2>

          <p className="mt-2 text-base font-bold leading-tight text-[#2563EB] md:text-lg">
            {priceLabel}
            {listing.vertical === "OPT" || listing.vertical === "MARKET" ? (
              <span className="text-[11px] font-medium text-[#64748B] md:text-xs">
                {" "}
                / {unitLabel.toLowerCase()}
              </span>
            ) : null}
          </p>

          <dl className="mt-2 space-y-1">
            {metaItems.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="flex items-center justify-between gap-2"
              >
                <dt className="shrink-0 text-[11px] text-[#64748B] md:text-xs">{item.label}</dt>
                <dd className="min-w-0 truncate text-right text-[11px] font-medium text-[#334155] md:text-xs">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-2 truncate border-t border-[rgba(148,163,184,0.14)] pt-2 text-xs font-medium text-[#475569] md:text-sm">
            {listing.sellerProfile.company_name}
          </p>
        </div>
      </article>
    );
  }

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden transition-all",
        isShowcase
          ? "border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2563EB]/35 hover:shadow-md"
          : "transition-shadow duration-300 hover:shadow-md",
      )}
    >
      <div className="relative">
        <Link href={`/listings/${listing.id}`} className="relative block">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={listing.title}
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-[13px] text-muted-foreground">
                <Package className="size-5" aria-hidden="true" />
                Нет фото
              </div>
            )}
          </div>
        </Link>

        <VerticalListingBadge
          vertical={listing.vertical}
          className="absolute left-2 top-2 z-10 bg-white/90 backdrop-blur-sm"
        />

        <FavoriteButton
          listingId={listing.id}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          variant="icon"
          onFavoriteChange={onFavoriteChange}
          className="absolute right-2 top-2 z-10"
        />
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="w-fit text-[11px] uppercase tracking-wide">
            {listing.category.name}
          </Badge>
        </div>

        <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-foreground">
          <Link
            href={`/listings/${listing.id}`}
            className="transition hover:text-primary"
          >
            {listing.title}
          </Link>
        </h2>

        <p className="mt-3 text-lg font-bold text-foreground">{priceLabel}</p>

        <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          {metaItems.map((item) => (
            <div key={`${item.label}-${item.value}`} className="flex justify-between gap-2">
              <dt className="flex items-center gap-1">
                {item.label === "Город" ? (
                  <MapPin className="size-3" aria-hidden="true" />
                ) : null}
                {item.label}
              </dt>
              <dd className="font-medium text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>

      <CardFooter className="mt-auto flex-col items-start border-t px-4 py-3">
        <p className="w-full truncate text-sm font-medium text-foreground">
          {listing.sellerProfile.company_name}
        </p>
      </CardFooter>
    </Card>
  );
}
