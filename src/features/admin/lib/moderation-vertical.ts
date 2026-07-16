import type { ListingVertical } from "@prisma/client";
import { VERTICALS } from "@/features/verticals/verticals";

export function getModerationEmptyMessage(vertical: ListingVertical | null): string {
  switch (vertical) {
    case "OPT":
      return "Нет оптовых объявлений на модерации.";
    case "MARKET":
      return "Нет розничных объявлений на модерации.";
    case "SERVICES":
      return "Нет услуг на модерации.";
    case "CARGO":
      return "Нет объявлений карго на модерации.";
    default:
      return "Нет объявлений на модерации.";
  }
}

export function getModerationHint(vertical: ListingVertical): string {
  switch (vertical) {
    case "OPT":
      return "Проверьте товар, цену, минимальную партию (MOQ) и данные поставщика. Объявление должно соответствовать разделу ТутОпт.";
    case "MARKET":
      return "Проверьте товар, фото, цену и описание. Объявление должно соответствовать разделу ТутМаркет.";
    case "SERVICES":
      return "Проверьте описание услуги, контакты и категорию. Объявление должно соответствовать разделу ТутУслуги.";
    case "CARGO":
      return "Проверьте маршрут/логистику, описание и категорию. Объявление должно соответствовать разделу ТутКарго.";
    default:
      return "Проверьте, соответствует ли объявление выбранному разделу.";
  }
}

export function getModerationVerticalFilterHref(
  vertical: ListingVertical | null,
): string {
  if (!vertical) {
    return "/admin/moderation/listings";
  }
  return `/admin/moderation/listings?vertical=${vertical}`;
}

export function getModerationVerticalLabel(vertical: ListingVertical): string {
  return VERTICALS[vertical].label;
}
