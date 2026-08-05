import type { ListingVertical } from "@prisma/client";
import {
  CHARACTERISTIC_OTHER_OPTION_ID,
  resolveListingCharacteristicFields,
  type CharacteristicFieldDef,
} from "@/config/listing-characteristics";
import type { CharacteristicFieldValue } from "@/features/listings/lib/listing-characteristics";

export const LISTING_AUTOSUGGEST_TITLE_MAX = 120;

export type AutosuggestConfidence = "high" | "medium" | "low";

export type AutosuggestCategoryOption = {
  id: string;
  name: string;
  slug: string;
  vertical: ListingVertical;
};

export type SuggestedCategory = {
  categoryId: string;
  slug: string;
  name: string;
  confidence: AutosuggestConfidence;
};

export type SuggestedCharacteristic = {
  fieldId: string;
  label: string;
  displayValue: string;
  value: CharacteristicFieldValue;
};

export type ListingSuggestionsInput = {
  vertical: ListingVertical;
  title: string;
  categories: readonly AutosuggestCategoryOption[];
  currentCategoryId?: string | null;
  currentCategorySlug?: string | null;
};

export type ListingSuggestions = {
  suggestedCategories: SuggestedCategory[];
  suggestedCharacteristics: SuggestedCharacteristic[];
  confidence: AutosuggestConfidence;
  hints: string[];
};

type CategoryRule = {
  slugs: readonly string[];
  keywords: readonly string[];
  confidence: AutosuggestConfidence;
  /** Prefer longer / more specific matches. */
  weight: number;
};

const MARKET_CATEGORY_RULES: readonly CategoryRule[] = [
  {
    slugs: ["market-telefony-i-elektronika", "market-telefony"],
    keywords: [
      "телефон",
      "iphone",
      "samsung",
      "xiaomi",
      "huawei",
      "ноутбук",
      "macbook",
      "телевизор",
      "смартфон",
      "ipad",
      "планшет",
      "airpods",
      "гаджет",
    ],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["market-odezhda-i-obuv"],
    keywords: [
      "кроссовки",
      "куртка",
      "платье",
      "обувь",
      "футболка",
      "джинсы",
      "ботинки",
      "кроссовок",
      "одежда",
      "пуховик",
      "свитер",
    ],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["market-dom-i-sad", "market-mebel"],
    keywords: [
      "диван",
      "стол",
      "шкаф",
      "кровать",
      "кресло",
      "мебель",
      "стул",
      "комод",
      "тумба",
    ],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["market-avto-i-moto"],
    keywords: [
      "toyota",
      "bmw",
      "mercedes",
      "шины",
      "диски",
      "запчасти",
      "honda",
      "hyundai",
      "машина",
      "авто",
      "мотор",
    ],
    confidence: "high",
    weight: 9,
  },
  {
    slugs: ["market-eq-upakovochnoe"],
    keywords: ["фасовщик", "вакууматор", "упаковщик", "термоусадка", "упаковочное"],
    confidence: "high",
    weight: 14,
  },
  {
    slugs: ["market-eq-metalloobrabotka"],
    keywords: ["станок", "лазерный", "токарный", "фрезерный", "чпу", "металлообработка"],
    confidence: "high",
    weight: 14,
  },
  {
    slugs: ["market-eq-pischevoe"],
    keywords: ["пастеризатор", "пищевое оборудование", "тестомес"],
    confidence: "high",
    weight: 13,
  },
  {
    slugs: ["market-eq-skladskoe"],
    keywords: ["штабелер", "рохля", "погрузчик"],
    confidence: "high",
    weight: 13,
  },
  {
    slugs: ["market-eq-nasosy"],
    keywords: ["насос", "компрессор"],
    confidence: "high",
    weight: 12,
  },
  {
    slugs: ["market-eq-horeca"],
    keywords: ["кафе", "ресторан", "фритюрница", "кофемашина"],
    confidence: "high",
    weight: 12,
  },
  {
    slugs: ["market-oborudovanie-i-stanki"],
    keywords: ["оборудование", "аппарат", "линия"],
    confidence: "medium",
    weight: 9,
  },
  {
    slugs: ["market-nedvizhimost"],
    keywords: ["квартира", "дом", "участок", "офис", "аренда", "недвижимость", "комната"],
    confidence: "medium",
    weight: 8,
  },
];

const SERVICES_CATEGORY_RULES: readonly CategoryRule[] = [
  {
    slugs: ["services-remont-i-stroitelstvo"],
    keywords: ["ремонт", "строительство", "отделка", "штукатурка", "плитка", "гипсокартон"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["services-elektriki"],
    keywords: ["электрик", "проводка", "свет", "электромонтаж", "розетка"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["services-santehniki"],
    keywords: ["сантехник", "трубы", "вода", "сантехника", "смеситель"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["services-perevozki-i-gruzchiki"],
    keywords: ["грузчики", "переезд", "грузчик", "перевозка"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["services-kliningovye-uslugi"],
    keywords: ["уборка", "клининг", "клинер", "химчистка"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["services-avtouslugi"],
    keywords: ["шиномонтаж", "ремонт авто", "автосервис", "эвакуатор", "мойка авто"],
    confidence: "high",
    weight: 11,
  },
  {
    slugs: ["services-dizajn"],
    keywords: ["дизайн", "логотип", "баннер", "фирменный стиль"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["services-it-i-digital"],
    keywords: [
      "сайт",
      "реклама",
      "smm",
      "программирование",
      "разработка",
      "seo",
      "таргет",
    ],
    confidence: "high",
    weight: 10,
  },
];

const OPT_CATEGORY_RULES: readonly CategoryRule[] = [
  {
    slugs: ["produkty-pitaniya"],
    keywords: ["продукты", "сахар", "масло", "рис", "мука", "крупа", "молоко", "чай"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["odezhda-tekstil"],
    keywords: ["одежда", "обувь", "ткань", "текстиль", "футболка"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["opt-oborudovanie"],
    keywords: ["оборудование", "станок", "аппарат", "компрессор", "насос"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["opt-upakovka-i-tara"],
    keywords: ["упаковка", "коробка", "пакет", "пленка", "плёнка", "тара"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["stroitelnye-materialy"],
    keywords: ["стройматериалы", "цемент", "плитка", "кирпич", "арматура"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["opt-syrye-i-materialy"],
    keywords: ["сырьё", "сырье", "материал", "гранулы", "полимер"],
    confidence: "high",
    weight: 10,
  },
  {
    slugs: ["elektronika"],
    keywords: ["телефон", "iphone", "ноутбук", "samsung", "xiaomi", "электроника"],
    confidence: "medium",
    weight: 8,
  },
];

const RULES_BY_VERTICAL: Record<ListingVertical, readonly CategoryRule[]> = {
  MARKET: MARKET_CATEGORY_RULES,
  SERVICES: SERVICES_CATEGORY_RULES,
  OPT: OPT_CATEGORY_RULES,
  CARGO: [],
};

type BrandHint = {
  optionId: string;
  label: string;
  keywords: readonly string[];
  /** Prefer this brand when keyword matched (e.g. iphone → Apple). */
  modelPrefix?: string;
};

const ELECTRONICS_BRANDS: readonly BrandHint[] = [
  {
    optionId: "apple",
    label: "Apple",
    keywords: ["iphone", "ipad", "macbook", "airpods", "apple"],
    modelPrefix: "iPhone",
  },
  { optionId: "samsung", label: "Samsung", keywords: ["samsung", "galaxy"] },
  { optionId: "xiaomi", label: "Xiaomi", keywords: ["xiaomi", "redmi", "poco"] },
  { optionId: "huawei", label: "Huawei", keywords: ["huawei", "honor"] },
  { optionId: "lenovo", label: "Lenovo", keywords: ["lenovo", "thinkpad"] },
  { optionId: "hp", label: "HP", keywords: [" hp ", "hewlett"] },
  { optionId: "asus", label: "Asus", keywords: ["asus", "rog "] },
  { optionId: "acer", label: "Acer", keywords: ["acer"] },
];

const TEXT_BRANDS: readonly { label: string; keywords: readonly string[] }[] = [
  { label: "Nike", keywords: ["nike"] },
  { label: "Adidas", keywords: ["adidas"] },
  { label: "Puma", keywords: ["puma"] },
  { label: "Toyota", keywords: ["toyota"] },
  { label: "BMW", keywords: ["bmw"] },
  { label: "Mercedes", keywords: ["mercedes", "мерседес"] },
  { label: "Honda", keywords: ["honda"] },
  { label: "Hyundai", keywords: ["hyundai"] },
];

function normalizeTitle(raw: string): string {
  return raw
    .slice(0, LISTING_AUTOSUGGEST_TITLE_MAX)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();
}

function titleContains(normalized: string, keyword: string): boolean {
  const key = keyword.toLowerCase().replace(/ё/g, "е");
  if (key.length <= 2) {
    return false;
  }
  if (key.startsWith(" ") || key.endsWith(" ")) {
    return ` ${normalized} `.includes(key);
  }
  return normalized.includes(key);
}

function findCategoryBySlugs(
  categories: readonly AutosuggestCategoryOption[],
  vertical: ListingVertical,
  slugs: readonly string[],
): AutosuggestCategoryOption | null {
  const inVertical = categories.filter((category) => category.vertical === vertical);
  for (const slug of slugs) {
    const exact = inVertical.find((category) => category.slug === slug);
    if (exact) {
      return exact;
    }
  }
  for (const slug of slugs) {
    const token = slug.replace(/^market-|^services-|^cargo-|^opt-/, "");
    const soft = inVertical.find(
      (category) =>
        category.slug.includes(slug) ||
        (token.length > 4 && category.slug.includes(token)),
    );
    if (soft) {
      return soft;
    }
  }
  return null;
}

function matchCategoryRules(
  vertical: ListingVertical,
  normalizedTitle: string,
  categories: readonly AutosuggestCategoryOption[],
): SuggestedCategory[] {
  const rules = RULES_BY_VERTICAL[vertical];
  const scored: Array<SuggestedCategory & { weight: number }> = [];

  for (const rule of rules) {
    const hit = rule.keywords.some((keyword) => titleContains(normalizedTitle, keyword));
    if (!hit) {
      continue;
    }
    const category = findCategoryBySlugs(categories, vertical, rule.slugs);
    if (!category) {
      continue;
    }
    scored.push({
      categoryId: category.id,
      slug: category.slug,
      name: category.name,
      confidence: rule.confidence,
      weight: rule.weight,
    });
  }

  scored.sort((a, b) => b.weight - a.weight);

  const unique: SuggestedCategory[] = [];
  const seen = new Set<string>();
  for (const item of scored) {
    if (seen.has(item.categoryId)) {
      continue;
    }
    seen.add(item.categoryId);
    unique.push({
      categoryId: item.categoryId,
      slug: item.slug,
      name: item.name,
      confidence: item.confidence,
    });
    if (unique.length >= 2) {
      break;
    }
  }
  return unique;
}

function findField(
  fields: readonly CharacteristicFieldDef[],
  fieldId: string,
): CharacteristicFieldDef | undefined {
  return fields.find((field) => field.id === fieldId);
}

function singleOptionValue(
  field: CharacteristicFieldDef,
  optionId: string,
): SuggestedCharacteristic | null {
  const option = field.options?.find((item) => item.id === optionId);
  if (!option) {
    return null;
  }
  return {
    fieldId: field.id,
    label: field.label,
    displayValue: option.label,
    value: { kind: "single", optionId: option.id },
  };
}

function textValue(
  field: CharacteristicFieldDef,
  text: string,
): SuggestedCharacteristic | null {
  const cleaned = text.trim().slice(0, field.maxLength ?? 80);
  if (!cleaned) {
    return null;
  }
  return {
    fieldId: field.id,
    label: field.label,
    displayValue: field.unit ? `${cleaned} ${field.unit}` : cleaned,
    value: { kind: "text", text: cleaned },
  };
}

function extractStorage(
  rawTitle: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic | null {
  const field = findField(fields, "storage");
  if (!field) {
    return null;
  }

  const match = rawTitle.match(/(\d+)\s*(tb|тб|gb|гб)/i);
  if (!match) {
    return null;
  }

  const amount = match[1];
  const unit = match[2].toLowerCase();
  const isTb = unit === "tb" || unit === "тб";

  if (isTb && amount === "1") {
    return singleOptionValue(field, "1tb");
  }

  const map: Record<string, string> = {
    "64": "64",
    "128": "128",
    "256": "256",
    "512": "512",
  };
  const optionId = map[amount];
  if (optionId) {
    return singleOptionValue(field, optionId);
  }

  const label = `${amount} ${isTb ? "TB" : "GB"}`;
  return {
    fieldId: field.id,
    label: field.label,
    displayValue: label,
    value: {
      kind: "single",
      optionId: CHARACTERISTIC_OTHER_OPTION_ID,
      otherText: label,
    },
  };
}

function extractVoltage(
  rawTitle: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic | null {
  const field = findField(fields, "voltage");
  if (!field) {
    return null;
  }
  if (/380\s*v/i.test(rawTitle)) {
    return singleOptionValue(field, "380v");
  }
  if (/220\s*v/i.test(rawTitle)) {
    return singleOptionValue(field, "220v");
  }
  return null;
}

function extractPower(
  rawTitle: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic | null {
  const field = findField(fields, "power");
  if (!field) {
    return null;
  }
  const match = rawTitle.match(/(\d+(?:[.,]\d+)?)\s*(квт|кВт|kw|кв)/i);
  if (!match) {
    return null;
  }
  const value = `${match[1].replace(",", ".")} кВт`;
  return textValue(field, value);
}

function extractSize(
  normalized: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic | null {
  const field = findField(fields, "size");
  if (!field) {
    return null;
  }

  const clothing = normalized.match(/\b(xxl|xl|xs|s|m|l)\b/);
  if (clothing) {
    return singleOptionValue(field, clothing[1]);
  }

  const shoe = normalized.match(/\b(3[6-9]|4[0-5])\b/);
  if (shoe) {
    return singleOptionValue(field, shoe[1]);
  }

  return null;
}

function extractElectronicsBrandAndModel(
  rawTitle: string,
  normalized: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic[] {
  const result: SuggestedCharacteristic[] = [];
  const brandField = findField(fields, "brand");
  const modelField = findField(fields, "model");

  for (const brand of ELECTRONICS_BRANDS) {
    if (!brand.keywords.some((keyword) => titleContains(normalized, keyword))) {
      continue;
    }

    if (brandField?.type === "select" || brandField?.type === "chips") {
      const suggestion = singleOptionValue(brandField, brand.optionId);
      if (suggestion) {
        result.push(suggestion);
      }
    } else if (brandField) {
      const suggestion = textValue(brandField, brand.label);
      if (suggestion) {
        result.push(suggestion);
      }
    }

    if (modelField) {
      let model: string | null = null;
      const iphone = rawTitle.match(/\biphone\s*([0-9]{1,2}\s*(?:pro\s*max|pro|plus|mini)?)/i);
      if (iphone) {
        model = `iPhone ${iphone[1].replace(/\s+/g, " ").trim()}`;
      } else {
        const galaxy = rawTitle.match(/\b(?:samsung\s*)?(galaxy\s*)?([sazmf]\d{1,2}(?:\s*\+|\s*ultra|\s*fe)?)/i);
        if (galaxy && titleContains(normalized, "samsung")) {
          model = galaxy[0].replace(/samsung/i, "").trim();
        } else {
          const macbook = rawTitle.match(/\bmacbook\s*(air|pro)?\s*(\d{2})?/i);
          if (macbook) {
            model = macbook[0].replace(/\s+/g, " ").trim();
          }
        }
      }

      if (model) {
        const suggestion = textValue(modelField, model);
        if (suggestion) {
          result.push(suggestion);
        }
      }
    }

    break;
  }

  return result;
}

function extractTextBrand(
  normalized: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic | null {
  const brandField = findField(fields, "brand");
  if (!brandField || brandField.type !== "text") {
    return null;
  }

  for (const brand of TEXT_BRANDS) {
    if (brand.keywords.some((keyword) => titleContains(normalized, keyword))) {
      return textValue(brandField, brand.label);
    }
  }
  return null;
}

function extractMakeModelFromAutoTitle(
  rawTitle: string,
  normalized: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic[] {
  const result: SuggestedCharacteristic[] = [];
  const makeField = findField(fields, "make");
  const modelField = findField(fields, "model");
  const yearField = findField(fields, "year");

  for (const brand of TEXT_BRANDS) {
    if (!brand.keywords.some((keyword) => titleContains(normalized, keyword))) {
      continue;
    }
    if (makeField) {
      const suggestion = textValue(makeField, brand.label);
      if (suggestion) {
        result.push(suggestion);
      }
    }
    break;
  }

  const year = rawTitle.match(/\b(19[8-9]\d|20[0-2]\d)\b/);
  if (year && yearField) {
    const suggestion = textValue(yearField, year[1]);
    if (suggestion) {
      result.push(suggestion);
    }
  }

  if (modelField && makeField && result.some((item) => item.fieldId === "make")) {
    // light model guess: token after brand
    const afterBrand = rawTitle.match(
      /\b(?:toyota|bmw|mercedes|honda|hyundai)\s+([a-zа-я0-9-]{2,20})/i,
    );
    if (afterBrand && !/^\d{4}$/.test(afterBrand[1])) {
      const suggestion = textValue(modelField, afterBrand[1]);
      if (suggestion) {
        result.push(suggestion);
      }
    }
  }

  return result;
}

function extractCharacteristicsFromTitle(
  rawTitle: string,
  fields: readonly CharacteristicFieldDef[],
): SuggestedCharacteristic[] {
  if (fields.length === 0) {
    return [];
  }

  const normalized = normalizeTitle(rawTitle);
  const suggestions: SuggestedCharacteristic[] = [];
  const usedFields = new Set<string>();

  function push(item: SuggestedCharacteristic | null) {
    if (!item || usedFields.has(item.fieldId)) {
      return;
    }
    usedFields.add(item.fieldId);
    suggestions.push(item);
  }

  for (const item of extractElectronicsBrandAndModel(rawTitle, normalized, fields)) {
    push(item);
  }

  push(extractStorage(rawTitle, fields));
  push(extractVoltage(rawTitle, fields));
  push(extractPower(rawTitle, fields));
  push(extractSize(normalized, fields));

  if (!usedFields.has("brand") && !usedFields.has("make")) {
    push(extractTextBrand(normalized, fields));
  }

  for (const item of extractMakeModelFromAutoTitle(rawTitle, normalized, fields)) {
    push(item);
  }

  return suggestions.slice(0, 6);
}

function maxConfidence(
  items: AutosuggestConfidence[],
): AutosuggestConfidence {
  if (items.includes("high")) {
    return "high";
  }
  if (items.includes("medium")) {
    return "medium";
  }
  return "low";
}

/**
 * Rule-based listing autosuggestions from title + vertical.
 * Client-safe: no secrets, no network.
 */
export function getListingSuggestions(
  input: ListingSuggestionsInput,
): ListingSuggestions {
  const title = input.title.trim().slice(0, LISTING_AUTOSUGGEST_TITLE_MAX);
  const hints: string[] = [];

  if (title.length < 3) {
    return {
      suggestedCategories: [],
      suggestedCharacteristics: [],
      confidence: "low",
      hints: [],
    };
  }

  const normalized = normalizeTitle(title);
  const categorySuggestions = matchCategoryRules(
    input.vertical,
    normalized,
    input.categories,
  ).filter((suggestion) => suggestion.categoryId !== input.currentCategoryId);

  const effectiveSlug =
    input.currentCategorySlug?.trim() ||
    categorySuggestions[0]?.slug ||
    "";

  const fields = resolveListingCharacteristicFields(input.vertical, effectiveSlug);
  const characteristicSuggestions = extractCharacteristicsFromTitle(title, fields);

  if (categorySuggestions.length > 0) {
    hints.push("category");
  }
  if (characteristicSuggestions.length > 0) {
    hints.push("characteristics");
  }

  const confidence = maxConfidence([
    ...categorySuggestions.map((item) => item.confidence),
    ...(characteristicSuggestions.length > 0 ? (["medium"] as const) : []),
  ]);

  return {
    suggestedCategories: categorySuggestions,
    suggestedCharacteristics: characteristicSuggestions,
    confidence,
    hints,
  };
}

function isFieldValueEmpty(
  value: CharacteristicFieldValue | undefined,
): boolean {
  if (!value) {
    return true;
  }
  if (value.kind === "text") {
    return !value.text.trim();
  }
  if (value.kind === "single") {
    return !value.optionId;
  }
  if (value.kind === "multi") {
    return value.optionIds.length === 0;
  }
  return value.enabled === null;
}

/** Merge suggestions into form values without overwriting filled fields. */
export function applyCharacteristicSuggestions(
  current: Record<string, CharacteristicFieldValue>,
  suggestions: readonly SuggestedCharacteristic[],
): Record<string, CharacteristicFieldValue> {
  const next = { ...current };
  for (const suggestion of suggestions) {
    if (!isFieldValueEmpty(next[suggestion.fieldId])) {
      continue;
    }
    next[suggestion.fieldId] = suggestion.value;
  }
  return next;
}

export function buildAutosuggestDismissKey(parts: {
  title: string;
  categoryId: string;
  kind: "category" | "characteristics";
  payload: string;
}): string {
  return [
    parts.kind,
    normalizeTitle(parts.title),
    parts.categoryId || "-",
    parts.payload,
  ].join("|");
}
