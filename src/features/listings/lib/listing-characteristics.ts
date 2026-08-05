import {
  CHARACTERISTIC_ITEMS_MAX,
  CHARACTERISTIC_OTHER_OPTION_ID,
  CHARACTERISTIC_VALUE_MAX,
  type CharacteristicFieldDef,
  type CharacteristicOption,
} from "@/config/listing-characteristics";
import type { ListingCharacteristic } from "@/features/listings/types/listing-characteristic";

export type CharacteristicFieldValue =
  | { kind: "text"; text: string }
  | { kind: "single"; optionId: string; otherText?: string }
  | { kind: "multi"; optionIds: string[]; otherText?: string }
  | { kind: "toggle"; enabled: boolean | null };

export type CharacteristicValuesState = Record<string, CharacteristicFieldValue>;

export type CharacteristicPair = {
  label: string;
  value: string;
};

function clampText(raw: string, max = CHARACTERISTIC_VALUE_MAX): string {
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

function optionLabel(
  options: readonly CharacteristicOption[] | undefined,
  optionId: string,
): string | null {
  const option = options?.find((item) => item.id === optionId);
  return option?.label ?? null;
}

function resolveSingleDisplay(
  field: CharacteristicFieldDef,
  value: Extract<CharacteristicFieldValue, { kind: "single" }>,
): string | null {
  if (!value.optionId) {
    return null;
  }

  if (value.optionId === CHARACTERISTIC_OTHER_OPTION_ID) {
    const other = clampText(value.otherText ?? "", field.maxLength ?? CHARACTERISTIC_VALUE_MAX);
    return other || null;
  }

  return optionLabel(field.options, value.optionId);
}

function resolveMultiDisplay(
  field: CharacteristicFieldDef,
  value: Extract<CharacteristicFieldValue, { kind: "multi" }>,
): string | null {
  const labels: string[] = [];
  for (const optionId of value.optionIds) {
    if (optionId === CHARACTERISTIC_OTHER_OPTION_ID) {
      const other = clampText(value.otherText ?? "", field.maxLength ?? CHARACTERISTIC_VALUE_MAX);
      if (other) {
        labels.push(other);
      }
      continue;
    }
    const label = optionLabel(field.options, optionId);
    if (label) {
      labels.push(label);
    }
  }
  return labels.length > 0 ? labels.join(", ") : null;
}

/** Empty initial value for a field definition. */
export function emptyCharacteristicValue(
  field: CharacteristicFieldDef,
): CharacteristicFieldValue {
  if (field.type === "toggle") {
    return { kind: "toggle", enabled: null };
  }
  if (field.type === "chips" && field.multiple) {
    return { kind: "multi", optionIds: [] };
  }
  if (field.type === "select" || field.type === "chips") {
    return { kind: "single", optionId: "" };
  }
  return { kind: "text", text: "" };
}

export function buildEmptyCharacteristicValues(
  fields: readonly CharacteristicFieldDef[],
): CharacteristicValuesState {
  const next: CharacteristicValuesState = {};
  for (const field of fields) {
    next[field.id] = emptyCharacteristicValue(field);
  }
  return next;
}

/**
 * Convert structured form values into label/value pairs for AI + description.
 * Skips empty values. Does not invent data.
 */
export function characteristicValuesToPairs(
  fields: readonly CharacteristicFieldDef[],
  values: CharacteristicValuesState,
): CharacteristicPair[] {
  const pairs: CharacteristicPair[] = [];

  for (const field of fields) {
    if (pairs.length >= CHARACTERISTIC_ITEMS_MAX) {
      break;
    }

    const raw = values[field.id];
    if (!raw) {
      continue;
    }

    let display: string | null = null;

    if (raw.kind === "text") {
      const text = clampText(raw.text, field.maxLength ?? CHARACTERISTIC_VALUE_MAX);
      display = text || null;
      if (display && field.unit) {
        display = `${display} ${field.unit}`;
      }
    } else if (raw.kind === "single") {
      display = resolveSingleDisplay(field, raw);
      if (display && field.unit) {
        display = `${display} ${field.unit}`;
      }
    } else if (raw.kind === "multi") {
      display = resolveMultiDisplay(field, raw);
    } else if (raw.kind === "toggle") {
      if (raw.enabled === true) {
        display = "Да";
      } else if (raw.enabled === false) {
        display = "Нет";
      } else {
        display = null;
      }
    }

    if (!display) {
      continue;
    }

    pairs.push({
      label: field.label,
      value: clampText(display, CHARACTERISTIC_VALUE_MAX),
    });
  }

  return pairs;
}

export function formatCharacteristicPairs(pairs: CharacteristicPair[]): string {
  if (pairs.length === 0) {
    return "";
  }
  return pairs.map((pair) => `${pair.label}: ${pair.value}`).join("\n");
}

export function characteristicValuesToText(
  fields: readonly CharacteristicFieldDef[],
  values: CharacteristicValuesState,
): string {
  return formatCharacteristicPairs(characteristicValuesToPairs(fields, values));
}

export function fieldShowsOtherInput(
  field: CharacteristicFieldDef,
  value: CharacteristicFieldValue | undefined,
): boolean {
  if (!value) {
    return false;
  }
  if (value.kind === "single") {
    return value.optionId === CHARACTERISTIC_OTHER_OPTION_ID;
  }
  if (value.kind === "multi") {
    return value.optionIds.includes(CHARACTERISTIC_OTHER_OPTION_ID);
  }
  return false;
}

/**
 * Serialize form values into persisted JSON characteristics.
 * Skips empty values. Does not invent data.
 */
export function characteristicValuesToPersisted(
  fields: readonly CharacteristicFieldDef[],
  values: CharacteristicValuesState,
): ListingCharacteristic[] {
  const result: ListingCharacteristic[] = [];

  for (const field of fields) {
    if (result.length >= CHARACTERISTIC_ITEMS_MAX) {
      break;
    }

    const raw = values[field.id];
    if (!raw) {
      continue;
    }

    const group = field.group === "additional" ? "additional" : "main";
    let value: ListingCharacteristic["value"] | null = null;

    if (raw.kind === "text") {
      const text = clampText(raw.text, field.maxLength ?? CHARACTERISTIC_VALUE_MAX);
      value = text || null;
    } else if (raw.kind === "single") {
      if (!raw.optionId) {
        continue;
      }
      if (raw.optionId === CHARACTERISTIC_OTHER_OPTION_ID) {
        const other = clampText(
          raw.otherText ?? "",
          field.maxLength ?? CHARACTERISTIC_VALUE_MAX,
        );
        value = other || null;
      } else {
        const label = optionLabel(field.options, raw.optionId);
        value = label;
      }
    } else if (raw.kind === "multi") {
      const labels: string[] = [];
      for (const optionId of raw.optionIds) {
        if (optionId === CHARACTERISTIC_OTHER_OPTION_ID) {
          const other = clampText(
            raw.otherText ?? "",
            field.maxLength ?? CHARACTERISTIC_VALUE_MAX,
          );
          if (other) {
            labels.push(other);
          }
          continue;
        }
        const label = optionLabel(field.options, optionId);
        if (label) {
          labels.push(label);
        }
      }
      value = labels.length > 0 ? labels : null;
    } else if (raw.kind === "toggle") {
      if (raw.enabled === null) {
        continue;
      }
      value = raw.enabled;
    }

    if (value === null) {
      continue;
    }

    result.push({
      id: field.id,
      label: field.label,
      value,
      ...(field.unit ? { unit: field.unit } : {}),
      group,
    });
  }

  return result;
}

function matchOptionId(
  field: CharacteristicFieldDef,
  display: string,
): string | null {
  const normalized = display.trim().toLowerCase();
  const option = field.options?.find(
    (item) => item.label.trim().toLowerCase() === normalized,
  );
  return option?.id ?? null;
}

/** Restore form values from persisted JSON (best-effort, never throws). */
export function hydrateCharacteristicValues(
  fields: readonly CharacteristicFieldDef[],
  persisted: readonly ListingCharacteristic[],
): CharacteristicValuesState {
  const next = buildEmptyCharacteristicValues(fields);
  const byId = new Map(persisted.map((item) => [item.id, item]));

  for (const field of fields) {
    const item = byId.get(field.id);
    if (!item) {
      continue;
    }

    if (field.type === "toggle") {
      if (typeof item.value === "boolean") {
        next[field.id] = { kind: "toggle", enabled: item.value };
      } else if (typeof item.value === "string") {
        const lower = item.value.trim().toLowerCase();
        if (lower === "да" || lower === "yes" || lower === "true") {
          next[field.id] = { kind: "toggle", enabled: true };
        } else if (lower === "нет" || lower === "no" || lower === "false") {
          next[field.id] = { kind: "toggle", enabled: false };
        }
      }
      continue;
    }

    if (field.type === "text" || field.type === "number") {
      if (typeof item.value === "string" || typeof item.value === "number") {
        next[field.id] = {
          kind: "text",
          text: String(item.value).slice(0, field.maxLength ?? CHARACTERISTIC_VALUE_MAX),
        };
      }
      continue;
    }

    if (field.type === "chips" && field.multiple) {
      const labels = Array.isArray(item.value)
        ? item.value
        : typeof item.value === "string"
          ? item.value.split(",").map((part) => part.trim()).filter(Boolean)
          : [];
      const optionIds: string[] = [];
      let otherText = "";
      for (const label of labels) {
        const optionId = matchOptionId(field, label);
        if (optionId) {
          optionIds.push(optionId);
        } else {
          optionIds.push(CHARACTERISTIC_OTHER_OPTION_ID);
          otherText = label;
        }
      }
      next[field.id] = { kind: "multi", optionIds: [...new Set(optionIds)], otherText };
      continue;
    }

    if (field.type === "select" || field.type === "chips") {
      const display =
        typeof item.value === "string"
          ? item.value
          : typeof item.value === "number"
            ? String(item.value)
            : Array.isArray(item.value)
              ? item.value[0] ?? ""
              : "";
      if (!display) {
        continue;
      }
      const optionId = matchOptionId(field, display);
      if (optionId) {
        next[field.id] = { kind: "single", optionId };
      } else {
        next[field.id] = {
          kind: "single",
          optionId: CHARACTERISTIC_OTHER_OPTION_ID,
          otherText: display.slice(0, field.maxLength ?? CHARACTERISTIC_VALUE_MAX),
        };
      }
    }
  }

  return next;
}

