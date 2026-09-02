import type { ImportDraftRow } from "@/features/import-drafts/types/import-draft";

export type ImportQualityLevel =
  | "full"
  | "partial"
  | "url-only"
  | "duplicate"
  | "error";

export type ImportQualityFieldStatus = {
  title: boolean;
  price: boolean;
  images: boolean;
  description: boolean;
  city: boolean;
  category: boolean;
};

export type ImportQualityInfo = {
  level: ImportQualityLevel;
  label: string;
  fields: ImportQualityFieldStatus;
  missingMessages: string[];
  sourceHint: string | null;
  extractionSourceLabel: string | null;
  titleFromSlug: boolean;
  invalidTitleRejected: boolean;
};

function isInvalidDisplayTitle(title: string | null | undefined): boolean {
  if (!title?.trim()) {
    return true;
  }
  const lower = title.trim().toLowerCase();
  return lower === "lalafo.kg" || lower === "lalafo" || lower === "www.lalafo.kg";
}

function detectExtractionSourceLabel(notes: string | null | undefined): string | null {
  const text = notes?.toLowerCase() ?? "";
  if (text.includes("network json") || text.includes("network-json") || text.includes("network api")) {
    return "network-json";
  }
  if (text.includes("embedded json") || text.includes("embedded-json")) {
    return "embedded-json";
  }
  if (text.includes("browser render") || text.includes("dom") || text.includes("со страницы")) {
    return "dom";
  }
  if (text.includes("open graph") || text.includes("open-graph") || text.includes("meta")) {
    return "open-graph";
  }
  if (
    text.includes("только из url") ||
    text.includes("url slug") ||
    text.includes("только из ссылки") ||
    text.includes("восстановлено из ссылки")
  ) {
    return "url-slug-fallback";
  }
  if (text.includes("lalafo api")) {
    return "lalafo-api";
  }
  return null;
}

function formatExtractionSourceLabel(source: string | null): string | null {
  switch (source) {
    case "network-json":
      return "Network JSON (XHR/API)";
    case "embedded-json":
      return "Embedded JSON";
    case "dom":
      return "DOM страницы";
    case "open-graph":
      return "OpenGraph / meta";
    case "url-slug-fallback":
      return "Только из ссылки";
    case "lalafo-api":
      return "Lalafo API";
    default:
      return null;
  }
}

function detectSourceHint(notes: string | null | undefined): string | null {
  const source = detectExtractionSourceLabel(notes);
  if (source === "network-json") {
    return "Данные получены из network API (browser)";
  }
  if (source === "dom") {
    return "Данные получены со страницы";
  }
  if (source === "url-slug-fallback") {
    return "Данные получены только из ссылки";
  }
  if (source === "lalafo-api") {
    return "Данные получены через Lalafo API";
  }
  return null;
}

export function getImportQuality(draft: ImportDraftRow): ImportQualityInfo {
  const displayTitle = draft.normalizedTitle ?? draft.rawTitle;
  const invalidTitleRejected = isInvalidDisplayTitle(displayTitle);

  const fields: ImportQualityFieldStatus = {
    title: Boolean(displayTitle) && !invalidTitleRejected,
    price: Boolean(draft.normalizedPrice ?? draft.rawPrice),
    images: (draft.normalizedImages.length > 0 ? draft.normalizedImages : draft.rawImages).length > 0,
    description: Boolean(draft.normalizedDescription ?? draft.rawDescription),
    city: Boolean(draft.normalizedCity ?? draft.rawCity),
    category: Boolean(draft.normalizedCategory ?? draft.normalizedSubcategory),
  };

  const missingMessages: string[] = [];
  const notes = draft.notes ?? "";
  const sourceHint = detectSourceHint(notes);
  const extractionSource = detectExtractionSourceLabel(notes);
  const extractionSourceLabel = formatExtractionSourceLabel(extractionSource);
  const titleFromSlug =
    extractionSource === "url-slug-fallback" ||
    notes.toLowerCase().includes("восстановлено из ссылки");

  if (!fields.images) {
    missingMessages.push("Фото не найдены. Источник не отдал изображения.");
  }
  if (!fields.price) {
    missingMessages.push("Цена не найдена.");
  }
  if (!fields.description) {
    missingMessages.push("Описание не найдено.");
  }
  if (!fields.category) {
    missingMessages.push("Категория не определена — выберите перед публикацией.");
  }
  if (titleFromSlug && fields.title) {
    missingMessages.unshift("Название восстановлено из ссылки.");
  }

  if (draft.status === "DUPLICATE") {
    return {
      level: "duplicate",
      label: "Дубль",
      fields,
      missingMessages,
      sourceHint,
      extractionSourceLabel,
      titleFromSlug,
      invalidTitleRejected,
    };
  }

  const notesLower = notes.toLowerCase();
  const isUrlOnly =
    notesLower.includes("только из url") ||
    notesLower.includes("url slug") ||
    notesLower.includes("только из ссылки") ||
    extractionSource === "url-slug-fallback" ||
    (fields.title && !fields.price && !fields.images && !fields.description);

  const filledCount = Object.values(fields).filter(Boolean).length;

  if (isUrlOnly) {
    missingMessages.unshift(
      "Данные получены только из ссылки. Цена, описание и фото не извлечены.",
    );
    return {
      level: "url-only",
      label: "Только из ссылки",
      fields,
      missingMessages,
      sourceHint,
      extractionSourceLabel,
      titleFromSlug,
      invalidTitleRejected,
    };
  }

  if (filledCount >= 5) {
    return {
      level: "full",
      label: "Полный импорт",
      fields,
      missingMessages,
      sourceHint,
      extractionSourceLabel,
      titleFromSlug,
      invalidTitleRejected,
    };
  }

  return {
    level: "partial",
    label: "Частичный импорт",
    fields,
    missingMessages,
    sourceHint,
    extractionSourceLabel,
    titleFromSlug,
    invalidTitleRejected,
  };
}

export function isLalafoUrlOnlyDraft(draft: ImportDraftRow): boolean {
  return getImportQuality(draft).level === "url-only" && draft.sourcePlatform === "LALAFO";
}
