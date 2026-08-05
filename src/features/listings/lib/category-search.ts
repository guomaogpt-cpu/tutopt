import type { CategoryItem } from "@/features/listings/types/category";
import { getCategoryPath } from "@/features/listings/lib/category-tree";

const SLUG_EMOJI: Record<string, string> = {
  "produkty-pitaniya": "🥫",
  "odezhda-tekstil": "👔",
  "stroitelnye-materialy": "🏗️",
  elektronika: "💡",
  "avto-zapchasti": "🚗",
  "bytovaya-himiya": "🧴",
  mebel: "🪑",
  selhoz: "🌾",
  "market-telefony-i-elektronika": "📱",
  "market-odezhda-i-obuv": "👟",
  "market-dom-i-sad": "🏠",
  "market-avto-i-moto": "🚗",
  "market-nedvizhimost": "🏢",
  "market-detskie-tovary": "🧸",
  "market-oborudovanie-i-stanki": "⚙️",
  "market-stroitelstvo-i-remont": "🔨",
  "market-biznes-i-sklad": "📦",
  "market-sport-i-otdyh": "🏋️",
  "market-zhivotnye": "🐾",
  "market-drugoe": "📦",
};

const NAME_KEYWORDS: { match: RegExp; emoji: string }[] = [
  { match: /авто|запчаст|транспорт/i, emoji: "🚗" },
  { match: /строит|цемент|ремонт/i, emoji: "🏗️" },
  { match: /продукт|питан/i, emoji: "🥫" },
  { match: /одежд|текстил|обув/i, emoji: "👔" },
  { match: /мебел|дом|сад/i, emoji: "🏠" },
  { match: /электрон|телефон/i, emoji: "📱" },
  { match: /хими|бытов/i, emoji: "🧴" },
  { match: /сель|сельхоз/i, emoji: "🌾" },
  { match: /оборуд|станок|станк/i, emoji: "⚙️" },
  { match: /красот|космет/i, emoji: "💄" },
  { match: /животн/i, emoji: "🐾" },
  { match: /недвижим|квартир/i, emoji: "🏢" },
  { match: /склад|бизнес/i, emoji: "📦" },
  { match: /услуг/i, emoji: "🛠️" },
];

/** Synonyms → category name tokens for search (Phase 106). */
export const CATEGORY_SEARCH_SYNONYMS: ReadonlyArray<{
  keywords: readonly string[];
  nameIncludes: readonly string[];
}> = [
  {
    keywords: ["фасовщик", "вакууматор", "упаковщик", "термоусадка", "плёнка", "пленка"],
    nameIncludes: ["Упаковочное"],
  },
  {
    keywords: ["пастеризатор", "мясорубка", "тестомес", "пищевое"],
    nameIncludes: ["Пищевое"],
  },
  {
    keywords: ["станок", "лазерный", "токарный", "фрезерный", "чпу", "металлообработка"],
    nameIncludes: ["металлообработка", "Станки"],
  },
  {
    keywords: ["штабелер", "рохля", "погрузчик", "стеллаж"],
    nameIncludes: ["Складское"],
  },
  {
    keywords: ["насос", "компрессор", "вакуумный"],
    nameIncludes: ["Насосы"],
  },
  {
    keywords: ["кафе", "ресторан", "horeca", "фритюрница", "кофемашина", "витрина"],
    nameIncludes: ["кафе", "ресторанов"],
  },
  {
    keywords: ["холодильник", "холодильное"],
    nameIncludes: ["Холодильное", "холодильник"],
  },
  {
    keywords: ["iphone", "samsung", "телефон", "смартфон"],
    nameIncludes: ["Телефоны", "Электроника"],
  },
];

export function getRootCategories(categories: CategoryItem[]): CategoryItem[] {
  return categories
    .filter((category) => category.parent_id === null)
    .sort((a, b) => {
      const orderA = a.sort_order ?? 999;
      const orderB = b.sort_order ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name, "ru");
    });
}

export function getChildCategories(
  categories: CategoryItem[],
  parentId: string,
): CategoryItem[] {
  return categories
    .filter((category) => category.parent_id === parentId)
    .sort((a, b) => {
      const orderA = a.sort_order ?? 999;
      const orderB = b.sort_order ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name, "ru");
    });
}

export function getCategoryEmoji(category: CategoryItem): string {
  if (category.icon && /[\u{1F300}-\u{1FAFF}]/u.test(category.icon)) {
    return category.icon;
  }

  if (SLUG_EMOJI[category.slug]) {
    return SLUG_EMOJI[category.slug];
  }

  for (const rule of NAME_KEYWORDS) {
    if (rule.match.test(category.name) || rule.match.test(category.slug)) {
      return rule.emoji;
    }
  }

  return "📦";
}

export function getDescendantIds(
  categories: CategoryItem[],
  rootId: string,
): Set<string> {
  const childrenByParent = new Map<string, string[]>();

  for (const category of categories) {
    if (!category.parent_id) {
      continue;
    }
    const siblings = childrenByParent.get(category.parent_id) ?? [];
    siblings.push(category.id);
    childrenByParent.set(category.parent_id, siblings);
  }

  const result = new Set<string>();
  const queue = [rootId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || result.has(current)) {
      continue;
    }
    result.add(current);
    const children = childrenByParent.get(current) ?? [];
    queue.push(...children);
  }

  return result;
}

export function isLeafCategory(
  categories: CategoryItem[],
  categoryId: string,
): boolean {
  return !categories.some((category) => category.parent_id === categoryId);
}

export function searchCategoriesWithSynonyms(
  categories: CategoryItem[],
  query: string,
): { id: string; label: string; path: string }[] {
  const normalized = query.trim().toLowerCase().replace(/ё/g, "е");
  if (!normalized) {
    return [];
  }

  const scored = new Map<string, { id: string; label: string; path: string; score: number }>();

  function addHit(category: CategoryItem, score: number) {
    const pathParts = getCategoryPath(categories, category.id);
    const existing = scored.get(category.id);
    if (existing && existing.score >= score) {
      return;
    }
    scored.set(category.id, {
      id: category.id,
      label: category.name,
      path: pathParts.join(" → "),
      score,
    });
  }

  for (const category of categories) {
    const name = category.name.toLowerCase().replace(/ё/g, "е");
    const slug = category.slug.toLowerCase();
    if (name.includes(normalized) || slug.includes(normalized)) {
      addHit(category, 10);
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
        addHit(category, 8);
      }
    }
  }

  return Array.from(scored.values())
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, "ru"))
    .slice(0, 24)
    .map(({ id, label, path }) => ({ id, label, path }));
}
