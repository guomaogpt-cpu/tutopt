import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export const CARGO_SERVICE_TYPE_IDS = [
  "deliveryFromChina",
  "deliveryKyrgyzstan",
  "internationalDelivery",
  "roadFreight",
  "airFreight",
  "railFreight",
  "warehousing",
  "customsClearance",
  "other",
] as const;

export type CargoServiceTypeId = (typeof CARGO_SERVICE_TYPE_IDS)[number];

export const CARGO_DIRECTION_IDS = [
  "chinaKyrgyzstan",
  "guangzhouBishkek",
  "yiwuBishkek",
  "urumqiBishkek",
  "kyrgyzstanKazakhstan",
  "bishkekRegions",
  "international",
  "other",
] as const;

export type CargoDirectionId = (typeof CARGO_DIRECTION_IDS)[number];

export const CARGO_SERVICE_TYPE_LABEL_KEY: Record<CargoServiceTypeId, DictionaryKey> = {
  deliveryFromChina: "cargo.serviceTypes.deliveryFromChina",
  deliveryKyrgyzstan: "cargo.serviceTypes.deliveryKyrgyzstan",
  internationalDelivery: "cargo.serviceTypes.internationalDelivery",
  roadFreight: "cargo.serviceTypes.roadFreight",
  airFreight: "cargo.serviceTypes.airFreight",
  railFreight: "cargo.serviceTypes.railFreight",
  warehousing: "cargo.serviceTypes.warehousing",
  customsClearance: "cargo.serviceTypes.customsClearance",
  other: "cargo.serviceTypes.other",
};

export const CARGO_DIRECTION_LABEL_KEY: Record<CargoDirectionId, DictionaryKey> = {
  chinaKyrgyzstan: "cargo.directions.chinaKyrgyzstan",
  guangzhouBishkek: "cargo.directions.guangzhouBishkek",
  yiwuBishkek: "cargo.directions.yiwuBishkek",
  urumqiBishkek: "cargo.directions.urumqiBishkek",
  kyrgyzstanKazakhstan: "cargo.directions.kyrgyzstanKazakhstan",
  bishkekRegions: "cargo.directions.bishkekRegions",
  international: "cargo.directions.international",
  other: "cargo.directions.other",
};

export function isCargoServiceTypeId(value: string): value is CargoServiceTypeId {
  return (CARGO_SERVICE_TYPE_IDS as readonly string[]).includes(value);
}

export function isCargoDirectionId(value: string): value is CargoDirectionId {
  return (CARGO_DIRECTION_IDS as readonly string[]).includes(value);
}

export function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}
