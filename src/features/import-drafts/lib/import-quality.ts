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
};

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
    return { level: "duplicate", label: "Дубль", fields, missingMessages };
  }

  const notes = draft.notes?.toLowerCase() ?? "";
  const isUrlOnly =
    notes.includes("из url") ||
    notes.includes("url slug") ||
    (fields.title && !fields.price && !fields.images && !fields.description);

  const filledCount = Object.values(fields).filter(Boolean).length;

  if (isUrlOnly) {
    return { level: "url-only", label: "Только из ссылки", fields, missingMessages };
  }

  if (filledCount >= 5) {
    return { level: "full", label: "Полный импорт", fields, missingMessages };
  }

  return { level: "partial", label: "Частичный импорт", fields, missingMessages };
}
