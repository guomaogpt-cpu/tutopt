const LALAFO_CITY_NAMES: Record<string, string> = {
  bishkek: "Бишкек",
  osh: "Ош",
  karakol: "Каракол",
  jalalabad: "Джалал-Абад",
  "jalal-abad": "Джалал-Абад",
  naryn: "Нарын",
  talas: "Талас",
  batken: "Баткен",
  kant: "Кант",
  tokmok: "Токмок",
};

function capitalizeWord(word: string): string {
  if (!word) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function titleFromLalafoSlug(slug: string): string {
  const cleaned = slug
    .replace(/-id-\d+$/i, "")
    .replace(/_/g, "-")
    .trim();

  if (!cleaned) {
    return "";
  }

  return cleaned
    .split("-")
    .filter(Boolean)
    .map(capitalizeWord)
    .join(" ");
}

export function parseLalafoUrlHints(url: string): {
  sourceExternalId: string | null;
  city: string | null;
  titleFromSlug: string | null;
  slug: string | null;
} {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);

    let city: string | null = null;
    let slug: string | null = null;

    const citySegment = parts[0]?.toLowerCase();
    if (citySegment && LALAFO_CITY_NAMES[citySegment]) {
      city = LALAFO_CITY_NAMES[citySegment] ?? capitalizeWord(citySegment);
    }

    const adsIndex = parts.indexOf("ads");
    if (adsIndex >= 0 && parts[adsIndex + 1]) {
      slug = parts[adsIndex + 1] ?? null;
    } else {
      const last = parts.at(-1);
      if (last && last.includes("-id-")) {
        slug = last;
      }
    }

    const sourceExternalId =
      url.match(/-id-(\d+)/i)?.[1] ?? url.match(/[?&]id=(\d+)/i)?.[1] ?? null;

    const titleFromSlug = slug ? titleFromLalafoSlug(slug) : null;

    return {
      sourceExternalId,
      city,
      titleFromSlug: titleFromSlug || null,
      slug,
    };
  } catch {
    return {
      sourceExternalId: null,
      city: null,
      titleFromSlug: null,
      slug: null,
    };
  }
}
