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
};

function detectSourceHint(notes: string | null | undefined): string | null {
  const text = notes?.toLowerCase() ?? "";
  if (text.includes("browser render") || text.includes("со страницы")) {
    return "Данные получены со страницы";
  }
  if (text.includes("только из url") || text.includes("url slug")) {
    return "Данные получены только из ссылки";
  }
  if (text.includes("lalafo api")) {
    return "Данные получены через Lalafo API";
  }
  return null;
}

export function getImportQuality(draft: ImportDraftRow): ImportQualityInfo {
  const fields: ImportQualityFieldStatus = {
    title: Boolean(draft.normalizedTitle ?? draft.rawTitle),
    price: Boolean(draft.normalizedPrice ?? draft.rawPrice),
    images: (draft.normalizedImages.length > 0 ? draft.normalizedImages : draft.rawImages).length > 0,
    description: Boolean(draft.normalizedDescription ?? draft.rawDescription),
    city: Boolean(draft.normalizedCity ?? draft.rawCity),
    category: Boolean(draft.normalizedCategory ?? draft.normalizedSubcategory),
  };

  const missingMessages: string[] = [];
  const sourceHint = detectSourceHint(draft.notes);

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

  if (draft.status === "DUPLICATE") {
    return { level: "duplicate", label: "Дубль", fields, missingMessages, sourceHint };
  }

  const notes = draft.notes?.toLowerCase() ?? "";
  const isUrlOnly =
    notes.includes("только из url") ||
    notes.includes("url slug") ||
    notes.includes("только из ссылки") ||
    (fields.title && !fields.price && !fields.images && !fields.description);

  const filledCount = Object.values(fields).filter(Boolean).length;

  if (isUrlOnly) {
    missingMessages.unshift(
      "Данные получены только из ссылки. Цена, описание и фото не извлечены.",
    );
    return { level: "url-only", label: "Только из ссылки", fields, missingMessages, sourceHint };
  }

  if (filledCount >= 5) {
    return { level: "full", label: "Полный импорт", fields, missingMessages, sourceHint };
  }

  return { level: "partial", label: "Частичный импорт", fields, missingMessages, sourceHint };
}

export function isLalafoUrlOnlyDraft(draft: ImportDraftRow): boolean {
  return getImportQuality(draft).level === "url-only" && draft.sourcePlatform === "LALAFO";
}
