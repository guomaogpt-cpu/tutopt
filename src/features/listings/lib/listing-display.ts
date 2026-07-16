import type { ListingUnit, ListingVertical, Prisma } from "@prisma/client";
import { Prisma as PrismaRuntime } from "@prisma/client";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import { getUnitLabelForVertical } from "@/features/listings/lib/vertical-form-config";

export type ListingDisplayMetaItem = {
  label: string;
  value: string;
};

export function getListingVerticalBadgeLabel(vertical: ListingVertical): string {
  switch (vertical) {
    case "OPT":
      return "Опт";
    case "MARKET":
      return "Маркет";
    case "SERVICES":
      return "Услуга";
    case "CARGO":
      return "Карго";
    default:
      return "Объявление";
  }
}

/** Full section label for seller/admin context. */
export function getListingVerticalLabel(vertical: ListingVertical): string {
  switch (vertical) {
    case "OPT":
      return "ТутОпт";
    case "MARKET":
      return "ТутМаркет";
    case "SERVICES":
      return "ТутУслуги";
    case "CARGO":
      return "ТутКарго";
    default:
      return "Tutopt";
  }
}

export function getListingPriceFieldLabel(vertical: ListingVertical): string {
  switch (vertical) {
    case "SERVICES":
      return "Стоимость услуги";
    case "CARGO":
      return "Стоимость перевозки";
    case "OPT":
    case "MARKET":
    default:
      return "Цена";
  }
}

export function getListingUnitFieldLabel(vertical: ListingVertical): string {
  switch (vertical) {
    case "SERVICES":
      return "Тип оплаты";
    case "CARGO":
      return "Единица расчёта";
    default:
      return "Единица";
  }
}

export function shouldShowMoq(vertical: ListingVertical | null | undefined): boolean {
  return vertical === "OPT";
}

export function shouldShowStock(vertical: ListingVertical | null | undefined): boolean {
  return vertical === "OPT" || vertical === "MARKET";
}

export function shouldShowBrand(vertical: ListingVertical | null | undefined): boolean {
  return vertical === "OPT" || vertical === "MARKET";
}

export function getListingMoqLabel(_vertical: ListingVertical): string {
  return "Мин. партия";
}

export function getListingStockLabel(vertical: ListingVertical): string {
  return vertical === "MARKET" ? "В наличии" : "Остаток";
}

export function getListingUnitLabel(
  unit: ListingUnit | string,
  vertical?: ListingVertical | null,
): string {
  return getUnitLabelForVertical(unit, vertical);
}

type PriceInput = {
  price: Prisma.Decimal | number | string | null | undefined;
  currency: string;
  vertical: ListingVertical;
};

export function formatListingCardPrice(input: PriceInput): string {
  const amount =
    input.price == null
      ? NaN
      : typeof input.price === "number"
        ? input.price
        : Number(input.price.toString());

  if (!Number.isFinite(amount) || amount <= 0) {
    if (input.vertical === "SERVICES" || input.vertical === "CARGO") {
      return "Цена договорная";
    }
    return "Цена не указана";
  }

  const formatted = formatListingPrice(
    new PrismaRuntime.Decimal(amount),
    input.currency,
  );

  if (input.vertical === "SERVICES" || input.vertical === "CARGO") {
    return `от ${formatted}`;
  }

  return formatted;
}

type MetaListing = {
  vertical: ListingVertical;
  moq: number;
  unit: ListingUnit | string;
  city: { name: string } | null;
  brand: { name: string } | null;
  category: { name: string };
  stock_quantity?: number | null;
};

export function getListingMetaItems(listing: MetaListing): ListingDisplayMetaItem[] {
  const items: ListingDisplayMetaItem[] = [];
  const unitLabel = getListingUnitLabel(listing.unit, listing.vertical);

  if (shouldShowMoq(listing.vertical) && listing.moq > 0) {
    items.push({
      label: getListingMoqLabel(listing.vertical),
      value: `${listing.moq} ${unitLabel.toLowerCase()}`,
    });
  }

  if (listing.city?.name) {
    items.push({ label: "Город", value: listing.city.name });
  }

  if (shouldShowBrand(listing.vertical) && listing.brand?.name) {
    items.push({ label: "Бренд", value: listing.brand.name });
  } else {
    items.push({ label: "Категория", value: listing.category.name });
  }

  if (
    shouldShowStock(listing.vertical) &&
    listing.stock_quantity != null &&
    listing.stock_quantity >= 0
  ) {
    items.push({
      label: getListingStockLabel(listing.vertical),
      value: String(listing.stock_quantity),
    });
  }

  return items;
}

export type CatalogVerticalCopy = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function getCatalogVerticalCopy(
  vertical: ListingVertical | null,
): CatalogVerticalCopy {
  switch (vertical) {
    case "OPT":
      return {
        title: "Оптовые объявления",
        description: "Товары оптом, поставщики и предложения для бизнеса.",
        emptyTitle: "В ТутОпт пока нет объявлений.",
        emptyDescription: "Станьте первым поставщиком в этом разделе.",
      };
    case "MARKET":
      return {
        title: "Розничные объявления",
        description: "Товары от магазинов и частных продавцов.",
        emptyTitle: "В ТутМаркет пока нет объявлений.",
        emptyDescription: "Разместите розничное объявление и найдите покупателей.",
      };
    case "SERVICES":
      return {
        title: "Услуги и специалисты",
        description: "Мастера, компании и специалисты в Кыргызстане.",
        emptyTitle: "В ТутУслуги пока нет объявлений.",
        emptyDescription: "Добавьте услугу и получите первые заявки.",
      };
    case "CARGO":
      return {
        title: "Грузоперевозки и логистика",
        description: "Перевозчики, доставка и логистические услуги.",
        emptyTitle: "В ТутКарго пока нет объявлений.",
        emptyDescription: "Опубликуйте предложение по перевозке или логистике.",
      };
    default:
      return {
        title: "Все объявления",
        description: "Опт, розница, услуги и грузоперевозки в Кыргызстане.",
        emptyTitle: "Объявления не найдены",
        emptyDescription: "Пока нет опубликованных объявлений на платформе.",
      };
  }
}

/** Card/detail presentation flags (Phase 7). */
export function getListingDisplayFlags(vertical: ListingVertical | null | undefined) {
  return {
    showMoq: shouldShowMoq(vertical),
    showBrand: shouldShowBrand(vertical),
    showStock: shouldShowStock(vertical),
    moqLabel: vertical ? getListingMoqLabel(vertical) : "Мин. партия",
    stockLabel: vertical ? getListingStockLabel(vertical) : "Остаток",
    badgeLabel: vertical ? getListingVerticalBadgeLabel(vertical) : null,
  };
}
