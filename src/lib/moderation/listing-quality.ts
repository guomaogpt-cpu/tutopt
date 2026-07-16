import type { ListingVertical } from "@prisma/client";
import {
  countLinks,
  detectLinkInText,
  detectPhoneInText,
  hasExcessiveCaps,
  hasRepeatedCharacters,
  normalizeText,
} from "@/lib/moderation/content-checks";

export type QualityLevel = "good" | "warning" | "bad";
export type RiskLevel = "low" | "medium" | "high";

export type ListingQualityWarning = {
  code: string;
  label: string;
};

export type ListingQualityInput = {
  title: string;
  description?: string | null;
  price?: number | string | null;
  cityName?: string | null;
  cityId?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  vertical?: ListingVertical | null;
  imageCount?: number;
  moq?: number | null;
  unit?: string | null;
  hasPossibleDuplicate?: boolean;
};

export type ListingQualityResult = {
  score: number;
  level: QualityLevel;
  risk: RiskLevel;
  warnings: ListingQualityWarning[];
  tips: string[];
};

const QUALITY_LEVEL_LABELS: Record<QualityLevel, string> = {
  good: "Хорошо",
  warning: "Нужно улучшить",
  bad: "Проблемное",
};

const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: "Низкий риск",
  medium: "Проверить",
  high: "Высокий риск",
};

export function getListingQualityLevel(score: number): QualityLevel {
  if (score >= 80) {
    return "good";
  }
  if (score >= 50) {
    return "warning";
  }
  return "bad";
}

export function getListingQualityLevelLabel(level: QualityLevel): string {
  return QUALITY_LEVEL_LABELS[level];
}

export function getListingRiskLevelLabel(risk: RiskLevel): string {
  return RISK_LEVEL_LABELS[risk];
}

function hasPrice(price: ListingQualityInput["price"]): boolean {
  if (price === null || price === undefined) {
    return false;
  }

  if (typeof price === "string" && price.trim() === "") {
    return false;
  }

  const value = typeof price === "number" ? price : Number(price);
  return Number.isFinite(value) && value >= 0;
}

function hasCity(input: ListingQualityInput): boolean {
  if (input.cityId && input.cityId.trim()) {
    return true;
  }
  return Boolean(input.cityName && input.cityName.trim());
}

function hasCategory(input: ListingQualityInput): boolean {
  if (input.categoryId && input.categoryId.trim()) {
    return true;
  }
  return Boolean(input.categoryName && input.categoryName.trim());
}

export function getListingQualityWarnings(
  listing: ListingQualityInput,
): ListingQualityWarning[] {
  const warnings: ListingQualityWarning[] = [];
  const title = normalizeText(listing.title ?? "");
  const description = normalizeText(listing.description ?? "");
  const imageCount = listing.imageCount ?? 0;

  if (imageCount < 1) {
    warnings.push({ code: "no_photos", label: "Нет фото" });
  }

  if (description.length > 0 && description.length < 40) {
    warnings.push({ code: "short_description", label: "Слишком короткое описание" });
  } else if (!description) {
    warnings.push({ code: "empty_description", label: "Нет описания" });
  }

  if (!hasPrice(listing.price)) {
    warnings.push({ code: "no_price", label: "Нет цены" });
  }

  if (!hasCity(listing)) {
    warnings.push({ code: "no_city", label: "Нет города" });
  }

  if (!hasCategory(listing)) {
    warnings.push({ code: "no_category", label: "Нет категории" });
  }

  if (detectPhoneInText(title)) {
    warnings.push({ code: "title_phone", label: "Телефон в заголовке" });
  }

  if (detectLinkInText(title)) {
    warnings.push({ code: "title_link", label: "Ссылка в заголовке" });
  }

  if (hasExcessiveCaps(title)) {
    warnings.push({ code: "title_caps", label: "Много CAPS в заголовке" });
  }

  if (hasRepeatedCharacters(title) || hasRepeatedCharacters(description)) {
    warnings.push({ code: "repeated_chars", label: "Повторяющиеся символы" });
  }

  if (countLinks(description) >= 3) {
    warnings.push({ code: "many_links", label: "Много ссылок" });
  }

  if (listing.hasPossibleDuplicate) {
    warnings.push({ code: "possible_duplicate", label: "Возможный дубль" });
  }

  if (
    listing.vertical === "OPT" &&
    (listing.moq === null || listing.moq === undefined || listing.moq < 1) &&
    !listing.unit
  ) {
    warnings.push({ code: "opt_moq_unit", label: "Укажите партию или единицу" });
  }

  return warnings;
}

export function getListingModerationRisk(
  listing: ListingQualityInput,
  score?: number,
): RiskLevel {
  const title = normalizeText(listing.title ?? "");
  const description = normalizeText(listing.description ?? "");
  const resolvedScore = score ?? calculateListingQualityScore(listing);

  if (
    detectPhoneInText(title) ||
    detectLinkInText(title) ||
    countLinks(description) >= 3 ||
    listing.hasPossibleDuplicate
  ) {
    return "high";
  }

  if (resolvedScore < 80) {
    return "medium";
  }

  return "low";
}

function calculateListingQualityScore(listing: ListingQualityInput): number {
  const title = normalizeText(listing.title ?? "");
  const description = normalizeText(listing.description ?? "");
  const imageCount = listing.imageCount ?? 0;
  let score = 100;

  if (imageCount < 1) {
    score -= 20;
  }

  if (description.length < 40) {
    score -= 20;
  }

  if (!hasPrice(listing.price)) {
    score -= 10;
  }

  if (!hasCity(listing)) {
    score -= 10;
  }

  if (detectPhoneInText(title)) {
    score -= 30;
  }

  if (detectLinkInText(title)) {
    score -= 30;
  }

  if (hasExcessiveCaps(title)) {
    score -= 15;
  }

  if (hasRepeatedCharacters(title) || hasRepeatedCharacters(description)) {
    score -= 15;
  }

  if (countLinks(description) >= 3) {
    score -= 20;
  }

  if (listing.hasPossibleDuplicate) {
    score -= 15;
  }

  if (!hasCategory(listing)) {
    score -= 10;
  }

  // Soft bonuses (capped by starting at 100 and only subtracting; bonuses recover small gaps)
  if (title.length >= 10 && title.length <= 80) {
    score += 0;
  }

  if (description.length > 80) {
    score += 0;
  }

  if (imageCount >= 1) {
    score += 0;
  }

  return Math.max(0, Math.min(100, score));
}

export function getVerticalQualityTips(vertical: ListingVertical | null | undefined): string[] {
  switch (vertical) {
    case "MARKET":
      return [
        "Опишите состояние и комплектацию",
        "Добавьте реальные фото",
        "Укажите город и цену",
      ];
    case "SERVICES":
      return [
        "Опишите услугу, сроки и район работы",
        "Укажите формат оплаты",
        "Добавьте примеры работ, если есть",
      ];
    case "CARGO":
      return [
        "Опишите маршрут, сроки и тип груза",
        "Укажите единицу расчёта",
        "Добавьте условия перевозки",
      ];
    case "OPT":
    default:
      return [
        "Укажите минимальную партию",
        "Добавьте фото товара",
        "Опишите фасовку, наличие и условия отгрузки",
      ];
  }
}

export function calculateListingQuality(
  listing: ListingQualityInput,
): ListingQualityResult {
  const score = calculateListingQualityScore(listing);
  const level = getListingQualityLevel(score);
  const warnings = getListingQualityWarnings(listing);
  const risk = getListingModerationRisk(listing, score);
  const tips = getVerticalQualityTips(listing.vertical);

  return {
    score,
    level,
    risk,
    warnings,
    tips,
  };
}
