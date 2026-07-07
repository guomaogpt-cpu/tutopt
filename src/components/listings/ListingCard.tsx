import Image from "next/image";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { listingUnitOptions } from "@/features/listings/constants";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type ListingCardProps = {
  listing: ListingCardData;
  isAuthenticated?: boolean;
  isFavorited?: boolean;
  variant?: "default" | "showcase" | "home";
};

export function ListingCard({
  listing,
  isAuthenticated = false,
  isFavorited = false,
  variant = "default",
}: ListingCardProps) {
  const mainImage = listing.images[0]?.url;
  const unitLabel =
    listingUnitOptions.find((option) => option.value === listing.unit)?.label ??
    listing.unit.toLowerCase();
  const isHome = variant === "home";
  const isShowcase = variant === "showcase";

  if (isHome) {
    const cityName = listing.city?.name ?? "Не указан";
    const brandName = listing.brand?.name ?? "Без бренда";
    const moqValue = `${listing.moq} ${unitLabel.toLowerCase()}`;

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

          <FavoriteButton
            listingId={listing.id}
            isAuthenticated={isAuthenticated}
            initialIsFavorited={isFavorited}
            variant="icon"
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
            {formatListingPrice(listing.price, listing.currency)}
            <span className="text-[10px] font-medium text-[#64748B] md:text-xs">
              {" "}
              / {unitLabel.toLowerCase()}
            </span>
          </p>

          <dl className="space-y-0.5 md:space-y-1">
            <div className="flex items-center justify-between gap-2 md:gap-3">
              <dt className="shrink-0 text-[11px] font-normal leading-[1.35] text-[#64748B] md:text-xs">Мин. партия</dt>
              <dd className="min-w-0 truncate text-right text-[11px] font-medium leading-[1.35] text-[#334155] md:text-xs">
                {moqValue}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2 md:gap-3">
              <dt className="shrink-0 text-[11px] font-normal leading-[1.35] text-[#64748B] md:text-xs">Город</dt>
              <dd className="min-w-0 truncate text-right text-[11px] font-medium leading-[1.35] text-[#334155] md:text-xs">
                {cityName}
              </dd>
            </div>
            <div className="hidden items-center justify-between gap-3 md:flex">
              <dt className="shrink-0 text-xs font-normal leading-[1.35] text-[#64748B]">Бренд</dt>
              <dd className="min-w-0 truncate text-right text-xs font-medium leading-[1.35] text-[#334155]">
                {brandName}
              </dd>
            </div>
          </dl>
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

        <FavoriteButton
          listingId={listing.id}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          variant="icon"
          className="absolute right-2 top-2 z-10"
        />
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <Badge variant="secondary" className="w-fit text-[11px] uppercase tracking-wide">
          {listing.category.name}
        </Badge>

        <h2 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-foreground">
          <Link
            href={`/listings/${listing.id}`}
            className="transition hover:text-primary"
          >
            {listing.title}
          </Link>
        </h2>

        <p className="mt-3 text-lg font-bold text-foreground">
          {formatListingPrice(listing.price, listing.currency)}
        </p>

        <dl className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex justify-between gap-2">
            <dt>Мин. партия</dt>
            <dd className="font-medium text-foreground">
              {listing.moq} {unitLabel.toLowerCase()}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1">
              <MapPin className="size-3" aria-hidden="true" />
              Город
            </dt>
            <dd className="font-medium text-foreground">{listing.city?.name ?? "—"}</dd>
          </div>
          {listing.brand ? (
            <div className="flex justify-between gap-2">
              <dt>Бренд</dt>
              <dd className="font-medium text-foreground">{listing.brand.name}</dd>
            </div>
          ) : null}
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
