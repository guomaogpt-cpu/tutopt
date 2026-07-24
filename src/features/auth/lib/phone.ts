/**
 * Normalize phone numbers for ВсеТут (KG-first).
 * Examples:
 * - 0500123456 -> +996500123456
 * - 996500123456 -> +996500123456
 * - +996 500 123 456 -> +996500123456
 */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) {
    return hasPlus ? "+" : "";
  }

  // Local KG mobile: 0XXXXXXXXX (10 digits)
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+996${digits.slice(1)}`;
  }

  // Local without leading 0: 9 digits after country, or 9-digit national
  if (digits.length === 9) {
    return `+996${digits}`;
  }

  // 996XXXXXXXXX
  if (digits.length === 12 && digits.startsWith("996")) {
    return `+${digits}`;
  }

  // Already +996... with digits only path
  if (digits.length === 12 && hasPlus) {
    return `+${digits}`;
  }

  // Fallback: keep cleaned international-ish form
  return hasPlus || digits.length > 10 ? `+${digits}` : `+${digits}`;
}

/** True when value looks like a phone (not an email). */
export function looksLikePhone(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed || trimmed.includes("@")) {
    return false;
  }
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 9;
}

/** Strict ВсеТут KG phone: +996 + 9 digits */
export function isValidKgPhone(phone: string): boolean {
  return /^\+996\d{9}$/.test(phone);
}
