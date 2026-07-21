import {
  Car,
  FlaskConical,
  Hammer,
  Package,
  Shirt,
  Sofa,
  Sparkles,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICON_RULES: { match: RegExp; icon: LucideIcon }[] = [
  { match: /авто|запчаст/i, icon: Car },
  { match: /строит|цемент/i, icon: Hammer },
  { match: /продукт|питан/i, icon: UtensilsCrossed },
  { match: /одежд|текстил/i, icon: Shirt },
  { match: /мебел/i, icon: Sofa },
  { match: /электрон/i, icon: Sparkles },
  { match: /хими|бытов/i, icon: FlaskConical },
  { match: /сель|сельхоз/i, icon: Wheat },
];

export function getCategoryIcon(name: string, slug: string): LucideIcon {
  for (const rule of CATEGORY_ICON_RULES) {
    if (rule.match.test(name) || rule.match.test(slug)) {
      return rule.icon;
    }
  }

  return Package;
}

export function formatListingsCount(count: number): string {
  if (count === 0) {
    return "Нет объявлений";
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} товар`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} товара`;
  }

  return `${count} товаров`;
}

/** Count label for marketplace /categories directory. */
export function formatCategoryAnnouncementsCount(count: number): string {
  if (count === 0) {
    return "Пока нет объявлений";
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} объявление`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} объявления`;
  }

  return `${count} объявлений`;
}
