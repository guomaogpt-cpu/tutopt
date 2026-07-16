import type { ListingVertical } from "@prisma/client";
import { VERTICALS } from "@/features/verticals/verticals";

export type SellerTrustLevel = "trusted" | "normal" | "incomplete";

export type SellerTrustSignal = {
  code: string;
  label: string;
};

export type SellerTrustWarning = {
  code: string;
  label: string;
};

export type SellerTrustInput = {
  hasSellerProfile: boolean;
  companyName?: string | null;
  userName?: string | null;
  description?: string | null;
  cityName?: string | null;
  cityId?: string | null;
  phone?: string | null;
  phoneVerifiedAt?: string | Date | null;
  logoUrl?: string | null;
  avatarUrl?: string | null;
  accountCreatedAt?: string | Date | null;
  publishedListingCount?: number;
  activeVerticals?: ListingVertical[];
  hasCompletedOnboarding?: boolean;
};

export type SellerTrustResult = {
  score: number;
  level: SellerTrustLevel;
  levelLabel: string;
  signals: SellerTrustSignal[];
  warnings: SellerTrustWarning[];
  improvements: string[];
};

const LEVEL_LABELS: Record<SellerTrustLevel, string> = {
  trusted: "Профиль вызывает доверие",
  normal: "Обычный профиль",
  incomplete: "Профиль заполнен не полностью",
};

const BADGE_LABELS: Record<SellerTrustLevel, string> = {
  trusted: "Профиль заполнен",
  normal: "Обычный профиль",
  incomplete: "Нужно больше данных",
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function hasText(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatSinceDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getSellerTrustLevel(score: number): SellerTrustLevel {
  if (score >= 80) {
    return "trusted";
  }
  if (score >= 50) {
    return "normal";
  }
  return "incomplete";
}

export function getSellerTrustLevelLabel(level: SellerTrustLevel): string {
  return LEVEL_LABELS[level];
}

export function getSellerTrustBadgeLabel(level: SellerTrustLevel): string {
  return BADGE_LABELS[level];
}

export function getSellerTrustSignals(seller: SellerTrustInput): SellerTrustSignal[] {
  const signals: SellerTrustSignal[] = [];
  const publishedCount = seller.publishedListingCount ?? 0;
  const createdAt = toDate(seller.accountCreatedAt);

  if (seller.phoneVerifiedAt) {
    signals.push({ code: "phone_verified", label: "Телефон подтверждён" });
  }

  if (seller.hasSellerProfile && hasText(seller.companyName)) {
    signals.push({ code: "profile_filled", label: "Профиль продавца заполнен" });
  }

  if (publishedCount > 0) {
    signals.push({
      code: "active_listings",
      label:
        publishedCount === 1
          ? "1 активное объявление"
          : `${publishedCount} активных объявлений`,
    });
  }

  for (const vertical of seller.activeVerticals ?? []) {
    const label = VERTICALS[vertical]?.label;
    if (label) {
      signals.push({
        code: `vertical_${vertical}`,
        label: `Продавец размещает объявления в ${label}`,
      });
    }
  }

  if (createdAt) {
    signals.push({
      code: "member_since",
      label: `На платформе с ${formatSinceDate(createdAt)}`,
    });
  }

  if (seller.hasCompletedOnboarding) {
    signals.push({ code: "onboarding_done", label: "Онбординг пройден" });
  }

  return signals;
}

export function getSellerTrustWarnings(seller: SellerTrustInput): SellerTrustWarning[] {
  const warnings: SellerTrustWarning[] = [];
  const publishedCount = seller.publishedListingCount ?? 0;
  const hasDescription = hasText(seller.description);
  const hasCity = hasText(seller.cityName) || hasText(seller.cityId);
  const hasPhone = hasText(seller.phone);
  const hasName = hasText(seller.companyName) || hasText(seller.userName);
  const hasLogo = hasText(seller.logoUrl) || hasText(seller.avatarUrl);

  if (!hasPhone) {
    warnings.push({ code: "no_phone", label: "Нет телефона" });
  } else if (!seller.phoneVerifiedAt) {
    warnings.push({ code: "phone_unverified", label: "Телефон не подтверждён" });
  }

  if (!seller.hasSellerProfile) {
    warnings.push({ code: "no_profile", label: "Нет профиля продавца" });
  }

  if (!hasDescription) {
    warnings.push({ code: "no_description", label: "Нет описания профиля" });
  }

  if (!hasCity) {
    warnings.push({ code: "no_city", label: "Не указан город" });
  }

  if (publishedCount < 1) {
    warnings.push({ code: "no_listings", label: "Нет активных объявлений" });
  }

  if (!hasLogo) {
    warnings.push({ code: "no_logo", label: "Нет фото профиля" });
  }

  if (seller.hasSellerProfile && !hasName && !hasDescription && !hasCity) {
    warnings.push({ code: "empty_profile", label: "Профиль почти пустой" });
  }

  return warnings;
}

function getSellerTrustImprovements(seller: SellerTrustInput): string[] {
  const improvements: string[] = [];
  const publishedCount = seller.publishedListingCount ?? 0;

  if (!hasText(seller.description)) {
    improvements.push("Добавьте описание профиля");
  }

  if (!hasText(seller.cityName) && !hasText(seller.cityId)) {
    improvements.push("Укажите город");
  }

  if (!hasText(seller.companyName) || (seller.companyName?.trim().length ?? 0) < 3) {
    improvements.push("Добавьте больше информации о компании");
  }

  if (!hasText(seller.logoUrl) && !hasText(seller.avatarUrl)) {
    improvements.push("Добавьте логотип или фото профиля");
  }

  if (!seller.phoneVerifiedAt) {
    improvements.push("Подтвердите телефон");
  }

  if (publishedCount < 1) {
    improvements.push("Разместите первое объявление");
  }

  return improvements;
}

function calculateSellerTrustScoreValue(seller: SellerTrustInput): number {
  let score = 50;

  if (seller.phoneVerifiedAt) {
    score += 20;
  }

  if (seller.hasSellerProfile) {
    score += 15;
  }

  if (hasText(seller.companyName) || hasText(seller.userName)) {
    score += 15;
  }

  if (hasText(seller.description)) {
    score += 10;
  }

  if (hasText(seller.cityName) || hasText(seller.cityId)) {
    score += 10;
  }

  if ((seller.publishedListingCount ?? 0) > 0) {
    score += 15;
  }

  if (hasText(seller.logoUrl) || hasText(seller.avatarUrl)) {
    score += 10;
  }

  const createdAt = toDate(seller.accountCreatedAt);
  if (createdAt && Date.now() - createdAt.getTime() >= SEVEN_DAYS_MS) {
    score += 5;
  }

  if (!hasText(seller.phone)) {
    score -= 20;
  }

  if (!hasText(seller.description)) {
    score -= 10;
  }

  if ((seller.publishedListingCount ?? 0) < 1) {
    score -= 15;
  }

  const almostEmpty =
    seller.hasSellerProfile &&
    !hasText(seller.description) &&
    !hasText(seller.cityName) &&
    !hasText(seller.cityId) &&
    !hasText(seller.logoUrl) &&
    !hasText(seller.avatarUrl);

  if (almostEmpty) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

export function calculateSellerTrustScore(seller: SellerTrustInput): number {
  return calculateSellerTrustScoreValue(seller);
}

export function calculateSellerTrust(seller: SellerTrustInput): SellerTrustResult {
  const score = calculateSellerTrustScoreValue(seller);
  const level = getSellerTrustLevel(score);

  return {
    score,
    level,
    levelLabel: getSellerTrustLevelLabel(level),
    signals: getSellerTrustSignals(seller),
    warnings: getSellerTrustWarnings(seller),
    improvements: getSellerTrustImprovements(seller),
  };
}
