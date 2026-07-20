import { ListingVertical } from "@prisma/client";

export type VerticalDefinition = {
  id: ListingVertical;
  slug: string;
  label: string;
  description: string;
  subtitle: string;
  href: string;
  listingsHref: string;
  createListingHref: string;
  homeCardDescription: string;
  metaTitle: string;
  metaDescription: string;
  comingSoon: boolean;
};

export const VERTICALS: Record<ListingVertical, VerticalDefinition> = {
  OPT: {
    id: ListingVertical.OPT,
    slug: "opt",
    label: "ТутОпт",
    description: "Оптовые товары и поставщики",
    subtitle: "Оптовые товары и поставщики Кыргызстана",
    href: "/opt",
    listingsHref: "/listings?vertical=OPT",
    createListingHref: "/listings/new?vertical=OPT",
    homeCardDescription: "Оптовые товары и поставщики",
    metaTitle: "ТутОпт — оптовые товары и поставщики Кыргызстана",
    metaDescription:
      "Оптовые объявления, поставщики и товары для бизнеса в Кыргызстане.",
    comingSoon: false,
  },
  MARKET: {
    id: ListingVertical.MARKET,
    slug: "market",
    label: "ТутМаркет",
    description: "Розничные товары и объявления",
    subtitle: "Розничные товары, магазины и частные объявления.",
    href: "/market",
    listingsHref: "/listings?vertical=MARKET",
    createListingHref: "/listings/new?vertical=MARKET",
    homeCardDescription: "Розничные товары и объявления",
    metaTitle: "ТутМаркет — розничные объявления Кыргызстана",
    metaDescription: "Розничные товары, частные объявления и предложения магазинов.",
    comingSoon: true,
  },
  SERVICES: {
    id: ListingVertical.SERVICES,
    slug: "services",
    label: "ТутУслуги",
    description: "Услуги и специалисты",
    subtitle: "Услуги, мастера и специалисты в Кыргызстане.",
    href: "/services",
    listingsHref: "/listings?vertical=SERVICES",
    createListingHref: "/listings/new?vertical=SERVICES",
    homeCardDescription: "Мастера, специалисты и компании",
    metaTitle: "ТутУслуги — услуги и специалисты Кыргызстана",
    metaDescription: "Услуги, мастера, ремонт, обучение и бизнес-сервисы.",
    comingSoon: true,
  },
  CARGO: {
    id: ListingVertical.CARGO,
    slug: "cargo",
    label: "ТутКарго",
    description: "Грузоперевозки и логистика",
    subtitle: "Грузоперевозки, доставка и логистика.",
    href: "/cargo",
    listingsHref: "/listings?vertical=CARGO",
    createListingHref: "/listings/new?vertical=CARGO",
    homeCardDescription: "Грузоперевозки и логистика",
    metaTitle: "ТутКарго — грузоперевозки и логистика",
    metaDescription: "Грузоперевозки, доставка, склады и логистика в Кыргызстане.",
    comingSoon: true,
  },
};

export const VERTICAL_LIST: VerticalDefinition[] = [
  VERTICALS.OPT,
  VERTICALS.MARKET,
  VERTICALS.SERVICES,
  VERTICALS.CARGO,
];

export const DEFAULT_LISTING_VERTICAL = ListingVertical.OPT;

const VERTICAL_BY_SLUG: Record<string, ListingVertical> = {
  opt: ListingVertical.OPT,
  market: ListingVertical.MARKET,
  services: ListingVertical.SERVICES,
  cargo: ListingVertical.CARGO,
};

const LISTING_VERTICAL_VALUES = new Set<string>(Object.values(ListingVertical));

export function isListingVertical(value: string): value is ListingVertical {
  return LISTING_VERTICAL_VALUES.has(value);
}

export function parseListingVerticalParam(
  value: string | null | undefined,
): ListingVertical | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toUpperCase();
  if (isListingVertical(normalized)) {
    return normalized;
  }

  const bySlug = VERTICAL_BY_SLUG[value.trim().toLowerCase()];
  return bySlug ?? null;
}

export function getVerticalBySlug(slug: string): VerticalDefinition | null {
  const id = VERTICAL_BY_SLUG[slug.trim().toLowerCase()];
  return id ? VERTICALS[id] : null;
}

/**
 * Active vertical for header highlight.
 * `/` and `/listings` without vertical query count as ТутОпт.
 */
export function resolveActiveVertical(
  pathname: string,
  searchParams?: URLSearchParams | { get(name: string): string | null },
): ListingVertical {
  const path = pathname.split("?")[0] ?? pathname;

  if (path === "/opt" || path.startsWith("/opt/")) {
    return ListingVertical.OPT;
  }
  if (path === "/market" || path.startsWith("/market/")) {
    return ListingVertical.MARKET;
  }
  if (path === "/services" || path.startsWith("/services/")) {
    return ListingVertical.SERVICES;
  }
  if (path === "/cargo" || path.startsWith("/cargo/")) {
    return ListingVertical.CARGO;
  }

  if (path === "/listings" || path.startsWith("/listings/")) {
    const fromQuery = parseListingVerticalParam(searchParams?.get("vertical") ?? null);
    return fromQuery ?? ListingVertical.OPT;
  }

  if (path === "/" || path === "") {
    return ListingVertical.OPT;
  }

  return ListingVertical.OPT;
}

export function getVerticalDefinition(id: ListingVertical): VerticalDefinition {
  return VERTICALS[id];
}

/** Preserve vertical when building catalog search URLs from a vertical context. */
export function resolveSearchVertical(
  pathname: string,
  searchParams?: URLSearchParams | { get(name: string): string | null },
): ListingVertical | null {
  const path = pathname.split("?")[0] ?? pathname;

  if (path === "/opt" || path.startsWith("/opt/")) {
    return ListingVertical.OPT;
  }
  if (path === "/market" || path.startsWith("/market/")) {
    return ListingVertical.MARKET;
  }
  if (path === "/services" || path.startsWith("/services/")) {
    return ListingVertical.SERVICES;
  }
  if (path === "/cargo" || path.startsWith("/cargo/")) {
    return ListingVertical.CARGO;
  }

  if (path === "/listings") {
    return parseListingVerticalParam(searchParams?.get("vertical") ?? null);
  }

  return null;
}
