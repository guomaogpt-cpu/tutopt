import {
  CHARACTERISTIC_ITEMS_MAX,
  CHARACTERISTIC_OTHER_OPTION_ID,
  CHARACTERISTIC_VALUE_MAX,
  type CharacteristicFieldDef,
  type CharacteristicOption,
} from "@/config/listing-characteristics";

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
