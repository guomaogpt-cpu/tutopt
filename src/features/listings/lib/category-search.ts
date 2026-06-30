import type { CategoryItem } from "@/features/listings/types/category";

const SLUG_EMOJI: Record<string, string> = {
  "produkty-pitaniya": "🥫",
  "odezhda-tekstil": "👔",
  "stroitelnye-materialy": "🏗️",
  elektronika: "💡",
  "avto-zapchasti": "🚗",
  "bytovaya-himiya": "🧴",
  mebel: "🪑",
  selhoz: "🌾",
};

const NAME_KEYWORDS: { match: RegExp; emoji: string }[] = [
  { match: /авто|запчаст/i, emoji: "🚗" },
  { match: /строит|цемент/i, emoji: "🏗️" },
  { match: /продукт|питан/i, emoji: "🥫" },
  { match: /одежд|текстил/i, emoji: "👔" },
  { match: /мебел|дом/i, emoji: "🏠" },
  { match: /электрон/i, emoji: "💡" },
  { match: /хими|бытов/i, emoji: "🧴" },
  { match: /сель|сельхоз/i, emoji: "🌾" },
  { match: /оборуд/i, emoji: "⚙️" },
  { match: /красот|космет/i, emoji: "💄" },
  { match: /животн/i, emoji: "🐾" },
  { match: /услуг/i, emoji: "🛠️" },
];

export function getRootCategories(categories: CategoryItem[]): CategoryItem[] {
  return categories
    .filter((category) => category.parent_id === null)
    .sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

export function getCategoryEmoji(category: CategoryItem): string {
  if (category.icon && /[\u{1F300}-\u{1FAFF}]/u.test(category.icon)) {
    return category.icon;
  }

  if (SLUG_EMOJI[category.slug]) {
    return SLUG_EMOJI[category.slug];
  }

  for (const rule of NAME_KEYWORDS) {
    if (rule.match.test(category.name)) {
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
