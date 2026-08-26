export type MappedImportCategory = {
  normalizedCategory: string | null;
  normalizedSubcategory: string | null;
};

type CategoryRule = {
  patterns: RegExp[];
  categorySlug: string;
  subcategorySlug?: string;
};

const CATEGORY_RULES: CategoryRule[] = [
  {
    patterns: [/фасов/i, /запай/i, /упаков/i, /packaging/i],
    categorySlug: "market-oborudovanie-i-stanki",
    subcategorySlug: "market-eq-upakovochnoe",
  },
  {
    patterns: [/пищев/i, /horeca/i, /кафе/i, /ресторан/i],
    categorySlug: "market-oborudovanie-i-stanki",
    subcategorySlug: "market-eq-pischevoe",
  },
  {
    patterns: [/станок/i, /металло/i, /обработк/i],
    categorySlug: "market-oborudovanie-i-stanki",
    subcategorySlug: "market-eq-metalloobrabotka",
  },
  {
    patterns: [/оборудован/i, /аппарат/i, /machine/i, /equipment/i],
    categorySlug: "market-oborudovanie-i-stanki",
    subcategorySlug: "market-eq-drugoe",
  },
  {
    patterns: [/опт/i, /opt-/i],
    categorySlug: "opt-oborudovanie",
  },
  {
    patterns: [/электрон/i, /телефон/i, /ноутбук/i, /компьютер/i],
    categorySlug: "market-telefony-i-elektronika",
  },
  {
    patterns: [/авто/i, /машин/i, /транспорт/i],
    categorySlug: "market-avto-i-moto",
  },
  {
    patterns: [/недвиж/i, /квартир/i, /дом/i, /real-estate/i],
    categorySlug: "market-nedvizhimost",
  },
  {
    patterns: [/одежд/i, /обув/i, /textile/i],
    categorySlug: "market-odezhda-i-obuv",
  },
  {
    patterns: [/продукт/i, /питани/i, /food/i],
    categorySlug: "produkty-pitaniya",
  },
  {
    patterns: [/ремонт/i, /строит/i, /услуг/i, /services/i],
    categorySlug: "services-remont-i-stroitelstvo",
  },
  {
    patterns: [/достав/i, /карго/i, /cargo/i, /груз/i],
    categorySlug: "cargo-delivery-kyrgyzstan",
  },
  {
    patterns: [/бизнес/i, /склад/i],
    categorySlug: "market-biznes-i-sklad",
  },
];

const LALAFO_CATEGORY_SLUG_MAP: Record<string, MappedImportCategory> = {
  "oborudovanie-dlya-biznesa": {
    normalizedCategory: "market-oborudovanie-i-stanki",
    normalizedSubcategory: "market-eq-drugoe",
  },
  "upakovochnye-apparaty": {
    normalizedCategory: "market-oborudovanie-i-stanki",
    normalizedSubcategory: "market-eq-upakovochnoe",
  },
  "zapayshchiki-paketov": {
    normalizedCategory: "market-oborudovanie-i-stanki",
    normalizedSubcategory: "market-eq-upakovochnoe",
  },
};

function normalizeSearchText(...parts: Array<string | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ")
    .toLowerCase();
}

export function mapExternalCategory(params: {
  categoryText?: string | null;
  subcategoryText?: string | null;
  title?: string | null;
  description?: string | null;
  breadcrumbSlugs?: string[];
}): MappedImportCategory {
  const haystack = normalizeSearchText(
    params.categoryText,
    params.subcategoryText,
    params.title,
    params.description,
  );

  for (const rule of CATEGORY_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(haystack))) {
      return {
        normalizedCategory: rule.categorySlug,
        normalizedSubcategory: rule.subcategorySlug ?? null,
      };
    }
  }

  for (const slug of [...(params.breadcrumbSlugs ?? [])].reverse()) {
    const mapped = LALAFO_CATEGORY_SLUG_MAP[slug];
    if (mapped) {
      return mapped;
    }
  }

  return {
    normalizedCategory: null,
    normalizedSubcategory: null,
  };
}

export function extractLalafoBreadcrumbSlugs(html: string): string[] {
  const matches = [
    ...html.matchAll(
      /DetailBreadcrumbs_detailBreadcrumbsListItem__[^"]*"[^>]*>\s*<a[^>]*href="\/bishkek\/([^"/?#]+)"/gi,
    ),
  ];

  return matches
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value && value !== "ads"));
}

export function extractLalafoBreadcrumbLabels(html: string): string[] {
  const matches = [
    ...html.matchAll(
      /DetailBreadcrumbs_detailBreadcrumbsListItem__[^"]*"[^>]*>\s*<a[^>]*>\s*<span[^>]*>([^<]+)<\/span>/gi,
    ),
  ];

  return matches
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value));
}

export function parsePriceText(rawPrice: string | null): {
  rawPrice: string | null;
  normalizedPrice: string | null;
  normalizedCurrency: string | null;
  priceNegotiable: boolean;
} {
  if (!rawPrice) {
    return {
      rawPrice: null,
      normalizedPrice: null,
      normalizedCurrency: "KGS",
      priceNegotiable: true,
    };
  }

  const lower = rawPrice.toLowerCase();
  if (
    lower.includes("договор") ||
    lower.includes("negotiable") ||
    lower.includes("не указан") ||
    lower.includes("бесплат")
  ) {
    return {
      rawPrice,
      normalizedPrice: null,
      normalizedCurrency: "KGS",
      priceNegotiable: true,
    };
  }

  let currency = "KGS";
  if (/\bUSD\b|\$|доллар/i.test(rawPrice)) {
    currency = "USD";
  } else if (/\bEUR\b|€|евро/i.test(rawPrice)) {
    currency = "EUR";
  } else if (/KGS|сом|с\.?о\.?м/i.test(rawPrice)) {
    currency = "KGS";
  }

  const numeric = rawPrice.replace(/[^\d.,]/g, "").replace(",", ".");
  const parsed = Number.parseFloat(numeric);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return {
      rawPrice,
      normalizedPrice: null,
      normalizedCurrency: currency,
      priceNegotiable: true,
    };
  }

  return {
    rawPrice,
    normalizedPrice: parsed.toFixed(2),
    normalizedCurrency: currency,
    priceNegotiable: false,
  };
}

export function parseLalafoTitleParts(title: string | null): {
  title: string | null;
  rawPrice: string | null;
  city: string | null;
  subcategoryText: string | null;
  sourceExternalId: string | null;
} {
  if (!title) {
    return {
      title: null,
      rawPrice: null,
      city: null,
      subcategoryText: null,
      sourceExternalId: null,
    };
  }

  const cleaned = title.replace(/\s*ᐈ.*$/u, "").trim();
  const segments = cleaned.split("|").map((part) => part.trim());

  let main = segments[0] ?? cleaned;
  let city: string | null = null;
  let subcategoryText: string | null = null;
  let sourceExternalId: string | null = null;
  let rawPrice: string | null = null;

  if (segments.length >= 2) {
    city = segments[1] ?? null;
  }
  if (segments.length >= 3) {
    sourceExternalId = segments[2]?.replace(/\D/g, "") || null;
  }

  const priceMatch = main.match(/:\s*([\d\s.,]+)\s*(KGS|USD|EUR|сом|\$|€)/iu);
  if (priceMatch) {
    rawPrice = `${priceMatch[1]?.trim()} ${priceMatch[2]?.trim()}`.trim();
    main = main.split(":")[0]?.trim() ?? main;
  }

  const arrowParts = main.split("➤").map((part) => part.trim());
  if (arrowParts.length > 1) {
    main = arrowParts[0] ?? main;
    subcategoryText = arrowParts[1] ?? null;
  }

  return {
    title: main || null,
    rawPrice,
    city,
    subcategoryText,
    sourceExternalId,
  };
}

export function extractLalafoExternalId(url: string, html: string): string | null {
  const fromUrl = url.match(/-id-(\d+)/i)?.[1] ?? url.match(/id[-=](\d+)/i)?.[1];
  if (fromUrl) {
    return fromUrl;
  }

  return html.match(/ID\s+(\d{5,})/i)?.[1] ?? null;
}

export function extractPhoneContacts(html: string): string | null {
  const phones = [
    ...html.matchAll(/\+996[\s\d()\-]{8,20}/g),
    ...html.matchAll(/\b0\d{3}[\s\d\-]{6,12}\b/g),
  ]
    .map((match) => match[0]?.replace(/\s+/g, " ").trim())
    .filter((value): value is string => Boolean(value));

  const unique = [...new Set(phones)];
  return unique.length > 0 ? unique.slice(0, 3).join(", ") : null;
}
