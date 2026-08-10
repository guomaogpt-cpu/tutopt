import type { Prisma } from "@prisma/client";
import { CATEGORY_SEARCH_SYNONYMS } from "@/features/listings/lib/category-search";

export const EQUIPMENT_SEARCH_KEYWORDS: readonly string[] = [
  "фасовщик",
  "фасовочный",
  "аппарат",
  "упаковщик",
  "упаковочное",
  "упаковка",
  "вакууматор",
  "запайщик",
  "термоусадка",
  "пастеризатор",
  "мясорубка",
  "миксер",
  "тестомес",
  "станок",
  "токарный",
  "фрезерный",
  "лазерный",
  "чпу",
  "cnc",
  "насос",
  "компрессор",
  "холодильник",
  "витрина",
  "рохля",
  "штабелер",
  "погрузчик",
  "конвейер",
  "транспортер",
  "линия",
  "оборудование",
  "380v",
  "220v",
];

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/ё/g, "е");
}

export function isEquipmentLikeQuery(query: string): boolean {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) {
    return false;
  }

  if (EQUIPMENT_SEARCH_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return true;
  }

  return CATEGORY_SEARCH_SYNONYMS.some((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase().replace(/ё/g, "е"))),
  );
}

export function expandSearchAliasTerms(query: string): string[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) {
    return [];
  }

  const terms = new Set<string>([normalized]);

  for (const rule of CATEGORY_SEARCH_SYNONYMS) {
    const matched = rule.keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase().replace(/ё/g, "е")),
    );
    if (!matched) {
      continue;
    }
    for (const keyword of rule.keywords) {
      terms.add(keyword.toLowerCase().replace(/ё/g, "е"));
    }
  }

  return Array.from(terms).slice(0, 8);
}

export function matchSynonymCategoryIds(
  query: string,
  categories: ReadonlyArray<{ id: string; name: string }>,
): string[] {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) {
    return [];
  }

  const ids = new Set<string>();

  for (const category of categories) {
    const name = category.name.toLowerCase().replace(/ё/g, "е");
    if (name.includes(normalized)) {
      ids.add(category.id);
    }
  }

  for (const rule of CATEGORY_SEARCH_SYNONYMS) {
    const keywordHit = rule.keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase().replace(/ё/g, "е")),
    );
    if (!keywordHit) {
      continue;
    }

    for (const category of categories) {
      const name = category.name.toLowerCase().replace(/ё/g, "е");
      if (rule.nameIncludes.some((token) => name.includes(token.toLowerCase()))) {
        ids.add(category.id);
      }
    }
  }

  return Array.from(ids);
}

export function buildCatalogTextSearchWhere(
  query: string,
  synonymCategoryIds: string[],
): Prisma.ListingWhereInput {
  const trimmed = query.trim();
  if (!trimmed) {
    return {};
  }

  const contains = { contains: trimmed, mode: "insensitive" as const };
  const orConditions: Prisma.ListingWhereInput[] = [
    { title: contains },
    { description: contains },
    { category: { name: contains } },
    { brand: { name: contains } },
  ];

  if (synonymCategoryIds.length > 0) {
    orConditions.push({ category_id: { in: synonymCategoryIds } });
  }

  for (const term of expandSearchAliasTerms(trimmed)) {
    if (term === normalizeSearchQuery(trimmed) || term.length < 3) {
      continue;
    }
    const termContains = { contains: term, mode: "insensitive" as const };
    orConditions.push({ title: termContains });
    orConditions.push({ description: termContains });
  }

  return { OR: orConditions };
}
