import type { ListingVertical } from "@prisma/client";
import {
  formatCharacteristicDisplayValue,
  parseListingCharacteristics,
} from "@/features/listings/types/listing-characteristic";

const PRIORITY_CHARACTERISTIC_IDS: Partial<Record<ListingVertical, readonly string[]>> = {
  MARKET: ["condition", "voltage", "power", "productivity", "capacity", "equipment_type"],
  SERVICES: ["service_format", "visit", "format", "service_area"],
  OPT: ["origin", "packaging"],
};

export type ListingCardHighlight = {
  label: string;
  value: string;
};

export function getListingCardHighlights(
  vertical: ListingVertical,
  rawCharacteristics: unknown,
  maxItems = 2,
): ListingCardHighlight[] {
  const items = parseListingCharacteristics(rawCharacteristics);
  if (items.length === 0) {
    return [];
  }

  const picked: ListingCardHighlight[] = [];
  const priorityIds = PRIORITY_CHARACTERISTIC_IDS[vertical] ?? [];

  for (const id of priorityIds) {
    const item = items.find((entry) => entry.id === id);
    if (!item) {
      continue;
    }
    const value = formatCharacteristicDisplayValue(item);
    if (!value || value === "Нет") {
      continue;
    }
    picked.push({ label: item.label, value });
    if (picked.length >= maxItems) {
      return picked;
    }
  }

  for (const item of items) {
    if (item.group === "additional") {
      continue;
    }
    const value = formatCharacteristicDisplayValue(item);
    if (!value || value === "Нет") {
      continue;
    }
    if (picked.some((entry) => entry.label === item.label)) {
      continue;
    }
    picked.push({ label: item.label, value });
    if (picked.length >= maxItems) {
      break;
    }
  }

  return picked;
}
