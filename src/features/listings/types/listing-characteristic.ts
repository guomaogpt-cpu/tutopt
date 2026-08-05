import { z } from "zod";

export const LISTING_CHARACTERISTIC_MAX_ITEMS = 30;
export const LISTING_CHARACTERISTIC_LABEL_MAX = 80;
export const LISTING_CHARACTERISTIC_VALUE_STRING_MAX = 300;
export const LISTING_CHARACTERISTIC_VALUE_ARRAY_MAX = 20;
export const LISTING_CHARACTERISTIC_ID_MAX = 60;

export type ListingCharacteristicGroup = "main" | "additional";

/** Persisted structured listing characteristic (JSON on Listing.characteristics). */
export type ListingCharacteristic = {
  id: string;
  label: string;
  value: string | string[] | boolean | number;
  unit?: string;
  group?: ListingCharacteristicGroup;
};

const characteristicValueSchema = z.union([
  z.string().trim().min(1).max(LISTING_CHARACTERISTIC_VALUE_STRING_MAX),
  z
    .array(z.string().trim().min(1).max(LISTING_CHARACTERISTIC_VALUE_STRING_MAX))
    .min(1)
    .max(LISTING_CHARACTERISTIC_VALUE_ARRAY_MAX),
  z.boolean(),
  z.number().finite(),
]);

export const listingCharacteristicSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .max(LISTING_CHARACTERISTIC_ID_MAX)
    .regex(/^[a-zA-Z0-9_-]+$/, "Некорректный id характеристики"),
  label: z.string().trim().min(1).max(LISTING_CHARACTERISTIC_LABEL_MAX),
  value: characteristicValueSchema,
  unit: z.string().trim().min(1).max(40).optional(),
  group: z.enum(["main", "additional"]).optional(),
});

export const listingCharacteristicsSchema = z
  .array(listingCharacteristicSchema)
  .max(LISTING_CHARACTERISTIC_MAX_ITEMS);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeString(raw: unknown, max: number): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const text = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  if (!text) {
    return null;
  }
  return text.slice(0, max);
}

function sanitizeValue(
  raw: unknown,
): string | string[] | boolean | number | null {
  if (typeof raw === "boolean") {
    return raw;
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === "string") {
    return sanitizeString(raw, LISTING_CHARACTERISTIC_VALUE_STRING_MAX);
  }
  if (Array.isArray(raw)) {
    const items: string[] = [];
    for (const item of raw.slice(0, LISTING_CHARACTERISTIC_VALUE_ARRAY_MAX)) {
      const text = sanitizeString(item, LISTING_CHARACTERISTIC_VALUE_STRING_MAX);
      if (text) {
        items.push(text);
      }
    }
    return items.length > 0 ? items : null;
  }
  return null;
}

/** Parse unknown JSON into safe persisted characteristics (never throws). */
export function parseListingCharacteristics(raw: unknown): ListingCharacteristic[] {
  if (raw == null) {
    return [];
  }

  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw) as unknown;
    } catch {
      return [];
    }
  }

  if (!Array.isArray(data)) {
    return [];
  }

  const result: ListingCharacteristic[] = [];

  for (const item of data.slice(0, LISTING_CHARACTERISTIC_MAX_ITEMS)) {
    if (!isPlainObject(item)) {
      continue;
    }

    const id = sanitizeString(item.id, LISTING_CHARACTERISTIC_ID_MAX);
    const label = sanitizeString(item.label, LISTING_CHARACTERISTIC_LABEL_MAX);
    const value = sanitizeValue(item.value);
    if (!id || !label || value === null) {
      continue;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      continue;
    }

    const unit = sanitizeString(item.unit, 40) ?? undefined;
    const group =
      item.group === "main" || item.group === "additional" ? item.group : undefined;

    result.push({
      id,
      label,
      value,
      ...(unit ? { unit } : {}),
      ...(group ? { group } : {}),
    });
  }

  return result;
}

export function formatCharacteristicDisplayValue(
  item: ListingCharacteristic,
): string {
  let base: string;
  if (typeof item.value === "boolean") {
    base = item.value ? "Да" : "Нет";
  } else if (Array.isArray(item.value)) {
    base = item.value.join(", ");
  } else {
    base = String(item.value);
  }

  if (item.unit && typeof item.value !== "boolean" && !Array.isArray(item.value)) {
    const unit = item.unit.trim();
    if (unit && !base.includes(unit)) {
      return `${base} ${unit}`;
    }
  }

  return base;
}

export function listingCharacteristicsToPairs(
  items: readonly ListingCharacteristic[],
): Array<{ label: string; value: string }> {
  return items.map((item) => ({
    label: item.label,
    value: formatCharacteristicDisplayValue(item),
  }));
}
