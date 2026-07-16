/** Friendly SEO aliases → City.slug in DB. */
const CITY_SEO_TO_DB: Record<string, string> = {
  bishkek: "bishkek-city",
  osh: "osh-city",
};

/** City.slug → preferred public SEO slug. */
const CITY_DB_TO_SEO: Record<string, string> = {
  "bishkek-city": "bishkek",
  "osh-city": "osh",
};

/** Locative forms for “в …” phrases in H1/meta. */
const CITY_IN_LOCATIVE: Record<string, string> = {
  "bishkek-city": "Бишкеке",
  "osh-city": "Оше",
};

export function normalizeCitySlug(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-");
}

/** Resolve possible DB slugs for a public city path segment. */
export function getCitySlugCandidates(citySlug: string): string[] {
  const normalized = normalizeCitySlug(citySlug);
  if (!normalized) {
    return [];
  }

  const aliased = CITY_SEO_TO_DB[normalized];
  if (aliased && aliased !== normalized) {
    return [normalized, aliased];
  }

  return [normalized];
}

export function getCitySeoSlug(city: { slug: string }): string {
  return CITY_DB_TO_SEO[city.slug] ?? city.slug;
}

/** “в Бишкеке” / fallback to city.name. */
export function formatCityInPhrase(city: { slug: string; name: string }): string {
  return CITY_IN_LOCATIVE[city.slug] ?? city.name;
}
