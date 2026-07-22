import type { ListingVertical } from "@prisma/client";
import { VERTICALS, VERTICAL_LIST } from "@/features/verticals/verticals";

export type SellerVerticalCounts = Record<ListingVertical, number>;

export type SellerListingVerticalRef = {
  vertical: ListingVertical;
};

const EMPTY_COUNTS: SellerVerticalCounts = {
  OPT: 0,
  MARKET: 0,
  SERVICES: 0,
  CARGO: 0,
};

export function countSellerVerticals(
  listings: readonly SellerListingVerticalRef[],
): SellerVerticalCounts {
  const counts: SellerVerticalCounts = { ...EMPTY_COUNTS };

  for (const listing of listings) {
    counts[listing.vertical] += 1;
  }

  return counts;
}

/** Verticals where the seller has at least one listing, in platform order. */
export function getSellerVerticals(
  listings: readonly SellerListingVerticalRef[],
): ListingVertical[] {
  const counts = countSellerVerticals(listings);
  return VERTICAL_LIST.map((item) => item.id).filter((vertical) => counts[vertical] > 0);
}

/**
 * Primary vertical for role badge / SEO.
 * - OPT wins when it exists and has the highest count (including ties).
 * - Otherwise SERVICES → CARGO → MARKET if present.
 * - Fallback: vertical of the first listing.
 */
export function getSellerPrimaryVertical(
  listings: readonly SellerListingVerticalRef[],
): ListingVertical | null {
  if (listings.length === 0) {
    return null;
  }

  const counts = countSellerVerticals(listings);
  const maxCount = Math.max(...Object.values(counts));

  if (counts.OPT > 0 && counts.OPT === maxCount) {
    return "OPT";
  }

  if (counts.SERVICES > 0) {
    return "SERVICES";
  }

  if (counts.CARGO > 0) {
    return "CARGO";
  }

  if (counts.MARKET > 0) {
    return "MARKET";
  }

  return listings[0]?.vertical ?? null;
}

/** Role badge on public profile / listing seller card. */
export function getSellerProfileLabel(primaryVertical: ListingVertical | null): string {
  switch (primaryVertical) {
    case "OPT":
      return "Поставщик";
    case "MARKET":
      return "Продавец";
    case "SERVICES":
      return "Исполнитель";
    case "CARGO":
      return "Перевозчик";
    default:
      return "Продавец";
  }
}

export function getSellerProfileDescription(primaryVertical: ListingVertical | null): string {
  switch (primaryVertical) {
    case "OPT":
      return "Оптовые товары и предложения для бизнеса.";
    case "MARKET":
      return "Розничные товары и объявления.";
    case "SERVICES":
      return "Услуги и специалисты.";
    case "CARGO":
      return "Грузоперевозки и логистика.";
    default:
      return "Объявления и предложения на Tutopt.";
  }
}

/** Primary CTA on public seller profile. */
export function getSellerCtaLabel(primaryVertical: ListingVertical | null): string {
  switch (primaryVertical) {
    case "OPT":
      return "Запросить оптовое предложение";
    case "MARKET":
      return "Написать продавцу";
    case "SERVICES":
      return "Оставить заявку";
    case "CARGO":
      return "Запросить перевозку";
    default:
      return "Связаться";
  }
}

/** CTA on listing detail seller card (scrolls to lead form). */
export function getListingSellerCardCtaLabel(vertical: ListingVertical): string {
  switch (vertical) {
    case "OPT":
      return "Запросить предложение";
    case "MARKET":
      return "Написать продавцу";
    case "SERVICES":
      return "Оставить заявку";
    case "CARGO":
      return "Запросить перевозку";
    default:
      return "Связаться";
  }
}

export function getSellerVerticalBrandLabel(vertical: ListingVertical): string {
  return VERTICALS[vertical].label;
}

export function getSellerListingsEmptyMessage(
  vertical: ListingVertical | null,
): string {
  switch (vertical) {
    case "OPT":
      return "У продавца пока нет оптовых объявлений.";
    case "MARKET":
      return "У продавца пока нет розничных объявлений.";
    case "SERVICES":
      return "У исполнителя пока нет объявлений об услугах.";
    case "CARGO":
      return "У перевозчика пока нет объявлений.";
    default:
      return "У продавца пока нет активных объявлений.";
  }
}

export function getSellerProfileSeoTitle(
  sellerName: string | null | undefined,
  primaryVertical: ListingVertical | null,
): string {
  const name = sellerName?.trim() || "Продавец";

  switch (primaryVertical) {
    case "OPT":
      return `${name} — поставщик на ТутОпт`;
    case "SERVICES":
      return `${name} — услуги на ТутУслуги`;
    case "CARGO":
      return `${name} — перевозки на ТутКарго`;
    case "MARKET":
      return `${name} — продавец на ВсеТут`;
    default:
      return `${name} — профиль на ВсеТут`;
  }
}

export function getSellerProfileSeoDescription(options: {
  sellerName: string;
  cityName: string | null;
  listingCount: number;
  primaryVertical: ListingVertical | null;
}): string {
  const { sellerName, cityName, listingCount, primaryVertical } = options;
  const role = getSellerProfileLabel(primaryVertical).toLowerCase();
  const place = cityName ? ` · ${cityName}` : "";
  const countLabel =
    listingCount === 1
      ? "1 объявление"
      : listingCount > 1 && listingCount < 5
        ? `${listingCount} объявления`
        : `${listingCount} объявлений`;

  return `${sellerName}${place} — ${role} на ВсеТут. ${countLabel}. ${getSellerProfileDescription(primaryVertical)}`;
}

export function buildSellerProfileHref(
  sellerIdOrSlug: string,
  vertical?: ListingVertical | null,
): string {
  if (!vertical) {
    return `/seller/${sellerIdOrSlug}`;
  }
  return `/seller/${sellerIdOrSlug}?vertical=${vertical}`;
}
