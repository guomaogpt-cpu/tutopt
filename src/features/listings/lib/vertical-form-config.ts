import { ListingUnit, type ListingVertical } from "@prisma/client";
import { listingUnitOptions } from "@/features/listings/constants";

export type VerticalFormUnitOption = {
  value: ListingUnit;
  label: string;
};

export type VerticalFormConfig = {
  titleLabel: string;
  titlePlaceholder: string;
  titleHint: string;
  basicsDescription: string;
  categoryDescription: string;
  priceSectionTitle: string;
  priceSectionDescription: string;
  priceLabel: string;
  priceHint: string;
  showMoq: boolean;
  moqLabel: string;
  moqHint: string;
  moqPlaceholder: string;
  unitLabel: string;
  unitOptions: VerticalFormUnitOption[];
  defaultUnit: ListingUnit;
  locationSectionTitle: string;
  locationSectionDescription: string;
  showBrand: boolean;
  showStock: boolean;
  stockLabel: string;
  stockHint: string;
  stockPlaceholder: string;
  descriptionSectionDescription: string;
  descriptionPlaceholder: string;
  descriptionTips: string[];
  sidebarTips: string[];
  previewQuantityLabel: string;
};

const OPT_UNITS: VerticalFormUnitOption[] = listingUnitOptions.map((option) => ({
  value: option.value,
  label: option.label,
}));

const MARKET_UNITS: VerticalFormUnitOption[] = [
  { value: ListingUnit.PIECE, label: "Штука" },
  { value: ListingUnit.PACK, label: "Упаковка" },
  { value: ListingUnit.BOX, label: "Короб" },
  { value: ListingUnit.KG, label: "Килограмм" },
  { value: ListingUnit.LITER, label: "Литр" },
];

/** Remapped labels on existing ListingUnit enum — no schema change. */
const SERVICES_UNITS: VerticalFormUnitOption[] = [
  { value: ListingUnit.PIECE, label: "Услуга" },
  { value: ListingUnit.PACK, label: "Час" },
  { value: ListingUnit.BOX, label: "День" },
  { value: ListingUnit.KG, label: "м²" },
  { value: ListingUnit.PALLET, label: "Проект" },
  { value: ListingUnit.LITER, label: "Выезд" },
];

const CARGO_UNITS: VerticalFormUnitOption[] = [
  { value: ListingUnit.PIECE, label: "Рейс" },
  { value: ListingUnit.KG, label: "кг" },
  { value: ListingUnit.BOX, label: "м³" },
  { value: ListingUnit.PACK, label: "Тонна" },
  { value: ListingUnit.PALLET, label: "км" },
  { value: ListingUnit.LITER, label: "Услуга" },
];

export const VERTICAL_FORM_CONFIG: Record<ListingVertical, VerticalFormConfig> = {
  OPT: {
    titleLabel: "Название товара",
    titlePlaceholder: "Например: Сахар оптом 50 кг",
    titleHint: "Укажите товар, фасовку или ключевую характеристику",
    basicsDescription: "Название и бренд помогут покупателю быстро понять предложение.",
    categoryDescription: "Выберите наиболее подходящую категорию для вашего товара.",
    priceSectionTitle: "Цена и условия опта",
    priceSectionDescription: "Укажите оптовую цену, валюту и минимальную партию.",
    priceLabel: "Цена",
    priceHint: "Цена за выбранную единицу измерения",
    showMoq: true,
    moqLabel: "Минимальная партия",
    moqHint: "Минимальный объём заказа для опта",
    moqPlaceholder: "100",
    unitLabel: "Единица",
    unitOptions: OPT_UNITS,
    defaultUnit: ListingUnit.PIECE,
    locationSectionTitle: "Наличие и город",
    locationSectionDescription: "Укажите город отгрузки и остаток, если он известен.",
    showBrand: true,
    showStock: true,
    stockLabel: "Остаток на складе",
    stockHint: "Можно оставить пустым, если точный остаток неизвестен",
    stockPlaceholder: "1000",
    descriptionSectionDescription: "Расскажите об упаковке, отгрузке и особенностях товара.",
    descriptionPlaceholder:
      "Опишите товар, фасовку, минимальную партию, наличие и условия отгрузки.",
    descriptionTips: [
      "Упаковка и фасовка",
      "Минимальная партия и условия отгрузки",
      "Город и сроки поставки",
      "Ключевые характеристики товара",
    ],
    sidebarTips: [
      "Добавьте реальные фото товара и упаковки",
      "Укажите точную минимальную партию",
      "Напишите город отгрузки",
      "Опишите упаковку, наличие и условия отгрузки",
    ],
    previewQuantityLabel: "MOQ",
  },
  MARKET: {
    titleLabel: "Название товара",
    titlePlaceholder: "Например: iPhone 13 128 GB",
    titleHint: "Укажите модель, объём памяти или ключевую характеристику",
    basicsDescription: "Название и бренд помогут покупателю быстрее найти товар.",
    categoryDescription: "Выберите категорию розничного объявления.",
    priceSectionTitle: "Цена и условия",
    priceSectionDescription: "Укажите цену, валюту и количество.",
    priceLabel: "Цена",
    priceHint: "Цена за выбранную единицу",
    showMoq: true,
    moqLabel: "Количество",
    moqHint: "Сколько единиц предлагаете к продаже",
    moqPlaceholder: "1",
    unitLabel: "Единица",
    unitOptions: MARKET_UNITS,
    defaultUnit: ListingUnit.PIECE,
    locationSectionTitle: "Наличие и город",
    locationSectionDescription: "Укажите город и количество в наличии.",
    showBrand: true,
    showStock: true,
    stockLabel: "Количество в наличии",
    stockHint: "Можно оставить пустым",
    stockPlaceholder: "1",
    descriptionSectionDescription: "Опишите товар и условия передачи.",
    descriptionPlaceholder:
      "Опишите состояние, комплектацию, причину продажи и условия передачи.",
    descriptionTips: [
      "Состояние и комплектация",
      "Причина продажи",
      "Условия встречи или доставки",
      "Город и район",
    ],
    sidebarTips: [
      "Добавьте чёткие фото товара",
      "Укажите реальное состояние",
      "Напишите город передачи",
      "Опишите комплектацию и условия",
    ],
    previewQuantityLabel: "Кол-во",
  },
  SERVICES: {
    titleLabel: "Название услуги",
    titlePlaceholder: "Например: Ремонт квартир под ключ",
    titleHint: "Кратко опишите, какую услугу вы оказываете",
    basicsDescription: "Название поможет клиенту понять вашу услугу.",
    categoryDescription: "Выберите категорию услуги.",
    priceSectionTitle: "Стоимость и оплата",
    priceSectionDescription: "Укажите стоимость и тип оплаты.",
    priceLabel: "Стоимость услуги",
    priceHint: "Стоимость за выбранный тип оплаты",
    showMoq: false,
    moqLabel: "Количество",
    moqHint: "",
    moqPlaceholder: "1",
    unitLabel: "Тип оплаты",
    unitOptions: SERVICES_UNITS,
    defaultUnit: ListingUnit.PIECE,
    locationSectionTitle: "Город",
    locationSectionDescription: "Укажите город, где оказываете услугу.",
    showBrand: false,
    showStock: false,
    stockLabel: "",
    stockHint: "",
    stockPlaceholder: "",
    descriptionSectionDescription: "Расскажите об опыте, условиях и районе работы.",
    descriptionPlaceholder:
      "Опишите услугу, опыт, условия работы, район выезда и сроки.",
    descriptionTips: [
      "Опыт и специализация",
      "Район выезда",
      "Сроки выполнения",
      "Что входит в стоимость",
    ],
    sidebarTips: [
      "Добавьте фото работ или примеров",
      "Укажите район выезда",
      "Опишите опыт и условия",
      "Назовите ориентировочные сроки",
    ],
    previewQuantityLabel: "",
  },
  CARGO: {
    titleLabel: "Название предложения",
    titlePlaceholder: "Например: Доставка грузов Китай - Кыргызстан",
    titleHint: "Укажите маршрут или тип перевозки",
    basicsDescription: "Название поможет клиенту быстро понять предложение.",
    categoryDescription: "Выберите категорию грузоперевозки или логистики.",
    priceSectionTitle: "Стоимость и расчёт",
    priceSectionDescription: "Укажите стоимость перевозки и единицу расчёта.",
    priceLabel: "Стоимость перевозки",
    priceHint: "Стоимость за выбранную единицу расчёта",
    showMoq: true,
    moqLabel: "Минимальный груз",
    moqHint: "Минимальный объём или вес для заказа",
    moqPlaceholder: "1",
    unitLabel: "Единица расчёта",
    unitOptions: CARGO_UNITS,
    defaultUnit: ListingUnit.PIECE,
    locationSectionTitle: "Город",
    locationSectionDescription: "Укажите основной город или хаб.",
    showBrand: false,
    showStock: false,
    stockLabel: "",
    stockHint: "",
    stockPlaceholder: "",
    descriptionSectionDescription: "Опишите маршрут, транспорт и условия доставки.",
    descriptionPlaceholder:
      "Опишите маршрут, тип груза, сроки доставки, транспорт и условия работы.",
    descriptionTips: [
      "Маршрут и направление",
      "Тип транспорта и груза",
      "Сроки доставки",
      "Условия и ограничения",
    ],
    sidebarTips: [
      "Укажите маршрут явно",
      "Опишите тип транспорта",
      "Назовите сроки доставки",
      "Укажите ограничения по грузу",
    ],
    previewQuantityLabel: "Мин.",
  },
};

export function getVerticalFormConfig(vertical: ListingVertical): VerticalFormConfig {
  return VERTICAL_FORM_CONFIG[vertical];
}

export function getUnitLabelForVertical(
  unit: ListingUnit | string,
  vertical?: ListingVertical | null,
): string {
  const config = vertical ? VERTICAL_FORM_CONFIG[vertical] : null;
  if (config) {
    const match = config.unitOptions.find((option) => option.value === unit);
    if (match) {
      return match.label;
    }
  }

  return (
    listingUnitOptions.find((option) => option.value === unit)?.label ??
    String(unit).toLowerCase()
  );
}

/** @deprecated Prefer getListingDisplayFlags from listing-display.ts */
export function getVerticalCardHints(vertical: ListingVertical | null | undefined) {
  switch (vertical) {
    case "MARKET":
      return {
        showMoq: false,
        moqLabel: "Количество",
        showBrand: true,
      };
    case "SERVICES":
    case "CARGO":
      return {
        showMoq: false,
        moqLabel: "",
        showBrand: false,
      };
    case "OPT":
    default:
      return {
        showMoq: true,
        moqLabel: "Мин. партия",
        showBrand: true,
      };
  }
}

export function catalogShowsBrandFilter(
  vertical: ListingVertical | null,
): boolean {
  return vertical === null || vertical === "OPT" || vertical === "MARKET";
}
