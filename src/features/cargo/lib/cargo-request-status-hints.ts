import type { CargoRequestStatus } from "@prisma/client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export const cargoRequestStatusHintKeys: Record<CargoRequestStatus, DictionaryKey> = {
  NEW: "cargoStatus.hint.new",
  IN_REVIEW: "cargoStatus.hint.inReview",
  CONTACTED: "cargoStatus.hint.contacted",
  CLOSED: "cargoStatus.hint.closed",
};

export function getCargoRequestStatusFallbackLabel(): string {
  return "Неизвестный статус";
}
