import type { ListingVertical } from "@prisma/client";

const VERTICAL_CATEGORY_PREFIX: Partial<Record<ListingVertical, string>> = {
  MARKET: "market-",
  SERVICES: "services-",
  CARGO: "cargo-",
};

/** Public SEO slug (may omit vertical DB prefix). */
export function getCategorySeoSlug(category: {
  slug: string;
  vertical: ListingVertical;
}): string {
  const prefix = VERTICAL_CATEGORY_PREFIX[category.vertical];
  if (prefix && category.slug.startsWith(prefix)) {
    return category.slug.slice(prefix.length);
  }
  return category.slug;
}

/** Candidate DB slugs for a path segment under a vertical. */
export function getCategorySlugCandidates(
  vertical: ListingVertical,
  categorySlug: string,
): string[] {
  const normalized = categorySlug.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const candidates = [normalized];
  const prefix = VERTICAL_CATEGORY_PREFIX[vertical];
  if (prefix && !normalized.startsWith(prefix)) {
    candidates.push(`${prefix}${normalized}`);
  }

  return candidates;
}

export function buildVerticalCategoryPath(
  verticalSlug: string,
  categorySeoSlug: string,
  citySeoSlug?: string,
): string {
  const base = `/${verticalSlug}/${categorySeoSlug}`;
  return citySeoSlug ? `${base}/${citySeoSlug}` : base;
}
