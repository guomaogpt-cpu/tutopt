import { ListingVertical } from "@prisma/client";

export type VerticalDefinition = {
  id: ListingVertical;
  slug: string;
  label: string;
  description: string;
  href: string;
  listingsHref: string;
  comingSoon: boolean;
};

export const VERTICALS: Record<ListingVertical, VerticalDefinition> = {
  OPT: {
    id: ListingVertical.OPT,
    slug: "opt",
    label: "ТутОпт",
    description: "Оптовые товары и поставщики",
    href: "/opt",
    listingsHref: "/listings?vertical=OPT",
    comingSoon: false,
  },
  MARKET: {
    id: ListingVertical.MARKET,
    slug: "market",
    label: "ТутМаркет",
    description: "Розничные товары и объявления",
    href: "/market",
    listingsHref: "/listings?vertical=MARKET",
    comingSoon: true,
  },
  SERVICES: {
    id: ListingVertical.SERVICES,
    slug: "services",
    label: "ТутУслуги",
    description: "Услуги и специалисты",
    href: "/services",
    listingsHref: "/listings?vertical=SERVICES",
    comingSoon: true,
  },
  CARGO: {
    id: ListingVertical.CARGO,
    slug: "cargo",
    label: "ТутКарго",
    description: "Грузоперевозки и логистика",
    href: "/cargo",
    listingsHref: "/listings?vertical=CARGO",
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
