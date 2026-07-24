import type { ListingVertical } from "@prisma/client";

const GLOW_BY_VERTICAL: Record<ListingVertical, string> = {
  MARKET: "bg-violet-400/25",
  SERVICES: "bg-emerald-400/25",
  OPT: "bg-blue-400/25",
  CARGO: "bg-orange-400/25",
};

function isListingVertical(value: string): value is ListingVertical {
  return (
    value === "MARKET" ||
    value === "SERVICES" ||
    value === "OPT" ||
    value === "CARGO"
  );
}

/**
 * Soft neon glow color behind listing cards. Returns static Tailwind class strings.
 */
export function getListingCardGlowClass(
  vertical?: ListingVertical | string | null,
  category?: string | null,
): string {
  if (typeof vertical === "string" && isListingVertical(vertical)) {
    return GLOW_BY_VERTICAL[vertical];
  }

  const haystack = (category ?? "").toLowerCase();
  if (!haystack) {
    return "bg-slate-300/20";
  }

  if (
    haystack.includes("карго") ||
    haystack.includes("доставк") ||
    haystack.includes("перевоз") ||
    haystack.includes("авто") ||
    haystack.includes("cargo")
  ) {
    return "bg-orange-400/25";
  }

  if (
    haystack.includes("услуг") ||
    haystack.includes("ремонт") ||
    haystack.includes("дом") ||
    haystack.includes("сад") ||
    haystack.includes("service")
  ) {
    return "bg-emerald-400/25";
  }

  if (
    haystack.includes("опт") ||
    haystack.includes("оборудован") ||
    haystack.includes("электрон") ||
    haystack.includes("техник")
  ) {
    return "bg-blue-400/25";
  }

  if (
    haystack.includes("объявлен") ||
    haystack.includes("телефон") ||
    haystack.includes("одежд") ||
    haystack.includes("красот") ||
    haystack.includes("market")
  ) {
    return "bg-violet-400/25";
  }

  return "bg-slate-300/20";
}
