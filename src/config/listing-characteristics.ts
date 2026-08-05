import type { ListingVertical } from "@prisma/client";
import {
  mergeEquipmentFields,
  MARKET_EQUIPMENT_BASE_FIELDS,
  MARKET_EQ_FOOD_EXTRA,
  MARKET_EQ_HORECA_EXTRA,
  MARKET_EQ_METAL_EXTRA,
  MARKET_EQ_PACKAGING_EXTRA,
  MARKET_EQ_PUMP_EXTRA,
  MARKET_EQ_WAREHOUSE_EXTRA,
} from "@/config/listing-characteristics-equipment";
import type {
  CharacteristicFieldDef,
  CharacteristicOption,
} from "@/config/listing-characteristics-types";

export type {
  CharacteristicFieldDef,
  CharacteristicFieldType,
  CharacteristicOption,
} from "@/config/listing-characteristics-types";

export type CharacteristicPreset = {
  id: string;
  vertical: ListingVertical;
  /** Exact category slug match (highest priority within vertical). */
  categorySlugExact?: readonly string[];
  /** Match if slug includes any token (e.g. "elektronika"). */
  categorySlugIncludes?: readonly string[];
  fields: readonly CharacteristicFieldDef[];
};

export const CHARACTERISTIC_OTHER_OPTION_ID = "other";
export const CHARACTERISTIC_VALUE_MAX = 120;
export const CHARACTERISTIC_ITEMS_MAX = 30;

const OTHER: CharacteristicOption = {
  id: CHARACTERISTIC_OTHER_OPTION_ID,
  label: "Другое",
  isOther: true,
};

const CONDITION_MARKET: readonly CharacteristicOption[] = [
  { id: "new", label: "Новый" },
  { id: "excellent", label: "Отличное" },
  { id: "good", label: "Хорошее" },
  { id: "used_marks", label: "Есть следы использования" },
  { id: "needs_repair", label: "Требует ремонта" },
];

const CONDITION_SIMPLE: readonly CharacteristicOption[] = [
  { id: "new", label: "Новое" },
  { id: "excellent", label: "Отличное" },
  { id: "good", label: "Хорошее" },
  { id: "used", label: "Б/у" },
];

const CONDITION_CLOTHING: readonly CharacteristicOption[] = [
  { id: "new", label: "Новое" },
  { id: "excellent", label: "Отличное" },
  { id: "good", label: "Хорошее" },
  { id: "used_marks", label: "Есть следы использования" },
];

const CONDITION_AUTO: readonly CharacteristicOption[] = [
  { id: "new", label: "Новое" },
  { id: "used", label: "Б/у" },
  { id: "needs_repair", label: "Требует ремонта" },
];

const CONDITION_EQUIPMENT: readonly CharacteristicOption[] = [
  { id: "new", label: "Новое" },
  { id: "used", label: "Б/у" },
  { id: "after_repair", label: "После ремонта" },
];

const VOLTAGE: readonly CharacteristicOption[] = [
  { id: "220v", label: "220V" },
  { id: "380v", label: "380V" },
  OTHER,
];

const MARKET_ELECTRONICS_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "brand",
    label: "Бренд",
    type: "select",
    group: "primary",
    options: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "xiaomi", label: "Xiaomi" },
      { id: "huawei", label: "Huawei" },
      { id: "lenovo", label: "Lenovo" },
      { id: "hp", label: "HP" },
      { id: "asus", label: "Asus" },
      { id: "acer", label: "Acer" },
      OTHER,
    ],
  },
  {
    id: "model",
    label: "Модель",
    type: "text",
    group: "primary",
    placeholder: "Например: iPhone 13",
    maxLength: 80,
  },
  {
    id: "condition",
    label: "Состояние",
    type: "chips",
    group: "primary",
    options: CONDITION_MARKET,
  },
  {
    id: "storage",
    label: "Память",
    type: "chips",
    group: "primary",
    options: [
      { id: "64", label: "64 GB" },
      { id: "128", label: "128 GB" },
      { id: "256", label: "256 GB" },
      { id: "512", label: "512 GB" },
      { id: "1tb", label: "1 TB" },
      OTHER,
    ],
  },
  {
    id: "kit",
    label: "Комплект",
    type: "chips",
    group: "additional",
    multiple: true,
    options: [
      { id: "box", label: "Коробка" },
      { id: "charger", label: "Зарядка" },
      { id: "docs", label: "Документы" },
      { id: "case", label: "Чехол" },
      { id: "none", label: "Без комплекта" },
    ],
  },
  {
    id: "color",
    label: "Цвет",
    type: "text",
    group: "additional",
    placeholder: "Например: чёрный",
    maxLength: 40,
  },
];

const MARKET_CLOTHING_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "item_type",
    label: "Тип",
    type: "chips",
    group: "primary",
    options: [
      { id: "clothes", label: "Одежда" },
      { id: "shoes", label: "Обувь" },
      { id: "accessory", label: "Аксессуар" },
    ],
  },
  {
    id: "gender",
    label: "Пол",
    type: "chips",
    group: "primary",
    options: [
      { id: "men", label: "Мужское" },
      { id: "women", label: "Женское" },
      { id: "kids", label: "Детское" },
      { id: "unisex", label: "Унисекс" },
    ],
  },
  {
    id: "size",
    label: "Размер",
    type: "chips",
    group: "primary",
    options: [
      { id: "xs", label: "XS" },
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
      { id: "xxl", label: "XXL" },
      { id: "36", label: "36" },
      { id: "37", label: "37" },
      { id: "38", label: "38" },
      { id: "39", label: "39" },
      { id: "40", label: "40" },
      { id: "41", label: "41" },
      { id: "42", label: "42" },
      { id: "43", label: "43" },
      { id: "44", label: "44" },
      { id: "45", label: "45" },
    ],
  },
  {
    id: "condition",
    label: "Состояние",
    type: "chips",
    group: "primary",
    options: CONDITION_CLOTHING,
  },
  {
    id: "brand",
    label: "Бренд",
    type: "text",
    group: "additional",
    placeholder: "Например: Nike",
    maxLength: 40,
  },
  {
    id: "color",
    label: "Цвет",
    type: "text",
    group: "additional",
    placeholder: "Например: синий",
    maxLength: 40,
  },
];

const MARKET_HOME_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "product_type",
    label: "Тип товара",
    type: "text",
    group: "primary",
    placeholder: "Например: диван",
    maxLength: 80,
  },
  {
    id: "condition",
    label: "Состояние",
    type: "chips",
    group: "primary",
    options: CONDITION_SIMPLE,
  },
  {
    id: "material",
    label: "Материал",
    type: "text",
    group: "primary",
    placeholder: "Например: дерево",
    maxLength: 60,
  },
  {
    id: "dimensions",
    label: "Размеры",
    type: "text",
    group: "additional",
    placeholder: "Например: 200×90 см",
    maxLength: 60,
  },
];

const MARKET_AUTO_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "make",
    label: "Марка",
    type: "text",
    group: "primary",
    placeholder: "Например: Toyota",
    maxLength: 60,
  },
  {
    id: "model",
    label: "Модель",
    type: "text",
    group: "primary",
    placeholder: "Например: Camry",
    maxLength: 60,
  },
  {
    id: "year",
    label: "Год",
    type: "number",
    group: "primary",
    placeholder: "2018",
    maxLength: 4,
  },
  {
    id: "condition",
    label: "Состояние",
    type: "chips",
    group: "primary",
    options: CONDITION_AUTO,
  },
  {
    id: "auto_type",
    label: "Тип",
    type: "chips",
    group: "additional",
    options: [
      { id: "car", label: "Авто" },
      { id: "part", label: "Запчасть" },
      { id: "accessory", label: "Аксессуар" },
      { id: "tires", label: "Шины/диски" },
    ],
  },
];

const MARKET_REAL_ESTATE_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "estate_type",
    label: "Тип",
    type: "select",
    group: "primary",
    options: [
      { id: "apartment", label: "Квартира" },
      { id: "house", label: "Дом" },
      { id: "room", label: "Комната" },
      { id: "office", label: "Офис" },
      { id: "land", label: "Участок" },
      { id: "warehouse", label: "Склад" },
    ],
  },
  {
    id: "deal",
    label: "Сделка",
    type: "chips",
    group: "primary",
    options: [
      { id: "sale", label: "Продажа" },
      { id: "rent", label: "Аренда" },
    ],
  },
  {
    id: "area",
    label: "Площадь",
    type: "number",
    group: "primary",
    unit: "м²",
    placeholder: "60",
    maxLength: 8,
  },
  {
    id: "rooms",
    label: "Комнат",
    type: "chips",
    group: "primary",
    options: [
      { id: "1", label: "1" },
      { id: "2", label: "2" },
      { id: "3", label: "3" },
      { id: "4", label: "4" },
      { id: "5plus", label: "5+" },
    ],
  },
  {
    id: "floor",
    label: "Этаж",
    type: "text",
    group: "additional",
    placeholder: "Например: 5/9",
    maxLength: 20,
  },
  {
    id: "district",
    label: "Район",
    type: "text",
    group: "additional",
    placeholder: "Например: Центр",
    maxLength: 80,
  },
];

const MARKET_FALLBACK_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "condition",
    label: "Состояние",
    type: "chips",
    group: "primary",
    options: CONDITION_SIMPLE,
  },
  {
    id: "brand",
    label: "Производитель/бренд",
    type: "text",
    group: "primary",
    placeholder: "Например: производитель",
    maxLength: 60,
  },
  {
    id: "model",
    label: "Модель",
    type: "text",
    group: "primary",
    placeholder: "Модель или артикул",
    maxLength: 80,
  },
  {
    id: "main_params",
    label: "Основные параметры",
    type: "text",
    group: "primary",
    placeholder: "Ключевые параметры товара",
    maxLength: 120,
  },
  {
    id: "kit",
    label: "Комплектация",
    type: "text",
    group: "additional",
    placeholder: "Что входит в комплект",
    maxLength: 120,
  },
  {
    id: "availability",
    label: "Наличие",
    type: "chips",
    group: "additional",
    options: [
      { id: "in_stock", label: "В наличии" },
      { id: "on_order", label: "Под заказ" },
    ],
  },
];

const SERVICES_BASE_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "format",
    label: "Формат",
    type: "chips",
    group: "primary",
    options: [
      { id: "visit", label: "Выезд" },
      { id: "online", label: "Онлайн" },
      { id: "onsite", label: "На месте" },
      OTHER,
    ],
  },
  {
    id: "experience",
    label: "Опыт",
    type: "chips",
    group: "primary",
    options: [
      { id: "lt1", label: "До 1 года" },
      { id: "1_3", label: "1–3 года" },
      { id: "3_5", label: "3–5 лет" },
      { id: "5plus", label: "5+ лет" },
    ],
  },
  {
    id: "price_type",
    label: "Цена",
    type: "chips",
    group: "primary",
    options: [
      { id: "fixed", label: "Фиксированная" },
      { id: "from", label: "От" },
      { id: "negotiable", label: "Договорная" },
    ],
  },
  {
    id: "district",
    label: "Город/район",
    type: "text",
    group: "additional",
    placeholder: "Например: Бишкек, Центр",
    maxLength: 80,
  },
  {
    id: "urgency",
    label: "Срочность",
    type: "chips",
    group: "additional",
    options: [
      { id: "same_day", label: "В день обращения" },
      { id: "appointment", label: "По записи" },
      OTHER,
    ],
  },
];

const SERVICES_REPAIR_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "work_type",
    label: "Тип работ",
    type: "chips",
    group: "primary",
    options: [
      { id: "repair", label: "Ремонт" },
      { id: "install", label: "Монтаж" },
      { id: "finish", label: "Отделка" },
      { id: "build", label: "Строительство" },
      OTHER,
    ],
  },
  {
    id: "visit_yes",
    label: "Выезд",
    type: "toggle",
    group: "additional",
  },
  {
    id: "materials",
    label: "Материалы",
    type: "chips",
    group: "additional",
    options: [
      { id: "mine", label: "Ваши" },
      { id: "client", label: "Клиента" },
      { id: "negotiable", label: "По договорённости" },
    ],
  },
];

const SERVICES_AUTO_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "auto_service_type",
    label: "Тип автоуслуги",
    type: "chips",
    group: "primary",
    options: [
      { id: "repair", label: "Ремонт" },
      { id: "diag", label: "Диагностика" },
      { id: "wash", label: "Мойка" },
      { id: "tires", label: "Шиномонтаж" },
      { id: "tow", label: "Эвакуатор" },
      OTHER,
    ],
  },
];

const OPT_BASE_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "min_lot",
    label: "Минимальная партия",
    type: "text",
    group: "primary",
    placeholder: "Например: 10",
    maxLength: 40,
  },
  {
    id: "price_unit",
    label: "Единица цены",
    type: "chips",
    group: "primary",
    options: [
      { id: "pcs", label: "шт" },
      { id: "kg", label: "кг" },
      { id: "box", label: "коробка" },
      { id: "bag", label: "мешок" },
      { id: "set", label: "комплект" },
      { id: "lot", label: "партия" },
    ],
  },
  {
    id: "availability",
    label: "Наличие",
    type: "chips",
    group: "primary",
    options: [
      { id: "in_stock", label: "В наличии" },
      { id: "on_order", label: "Под заказ" },
    ],
  },
  {
    id: "packaging",
    label: "Упаковка",
    type: "text",
    group: "additional",
    placeholder: "Описание упаковки",
    maxLength: 80,
  },
  {
    id: "delivery_time",
    label: "Срок поставки",
    type: "text",
    group: "additional",
    placeholder: "Например: 3–5 дней",
    maxLength: 60,
  },
  {
    id: "warehouse_city",
    label: "Город склада",
    type: "text",
    group: "additional",
    placeholder: "Например: Бишкек",
    maxLength: 60,
  },
];

const OPT_FOOD_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "expiry",
    label: "Срок годности",
    type: "text",
    group: "primary",
    placeholder: "Например: 12 месяцев",
    maxLength: 60,
  },
  {
    id: "food_packaging",
    label: "Упаковка",
    type: "chips",
    group: "primary",
    options: [
      { id: "box", label: "коробка" },
      { id: "bag", label: "мешок" },
      { id: "pallet", label: "паллета" },
      OTHER,
    ],
  },
  {
    id: "storage",
    label: "Условия хранения",
    type: "chips",
    group: "additional",
    options: [
      { id: "normal", label: "обычные" },
      { id: "chilled", label: "охлаждение" },
      { id: "frozen", label: "заморозка" },
    ],
  },
];

const OPT_EQUIPMENT_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "equipment_type",
    label: "Тип оборудования",
    type: "text",
    group: "primary",
    placeholder: "Например: фрезерный станок",
    maxLength: 80,
  },
  {
    id: "performance",
    label: "Производительность",
    type: "text",
    group: "primary",
    placeholder: "Например: 100 шт/час",
    maxLength: 60,
  },
  {
    id: "power",
    label: "Мощность",
    type: "text",
    group: "primary",
    placeholder: "Например: 3 кВт",
    maxLength: 40,
  },
  {
    id: "voltage",
    label: "Напряжение",
    type: "chips",
    group: "additional",
    options: VOLTAGE,
  },
  {
    id: "condition",
    label: "Состояние",
    type: "chips",
    group: "additional",
    options: CONDITION_EQUIPMENT,
  },
  {
    id: "warranty",
    label: "Гарантия",
    type: "chips",
    group: "additional",
    options: [
      { id: "yes", label: "Есть" },
      { id: "no", label: "Нет" },
      { id: "negotiable", label: "По договорённости" },
    ],
  },
];

const CARGO_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "routes",
    label: "Направления",
    type: "chips",
    group: "primary",
    multiple: true,
    options: [
      { id: "cn_kg", label: "Китай → Кыргызстан" },
      { id: "gz_bishkek", label: "Гуанчжоу → Бишкек" },
      { id: "yiwu_bishkek", label: "Иу → Бишкек" },
      { id: "urumqi_bishkek", label: "Урумчи → Бишкек" },
      { id: "intl", label: "Международные направления" },
    ],
  },
  {
    id: "delivery_type",
    label: "Тип доставки",
    type: "chips",
    group: "primary",
    multiple: true,
    options: [
      { id: "road", label: "Авто" },
      { id: "air", label: "Авиа" },
      { id: "rail", label: "ЖД" },
      { id: "lcl", label: "Сборный груз" },
      { id: "container", label: "Контейнер" },
      OTHER,
    ],
  },
  {
    id: "services",
    label: "Услуги",
    type: "chips",
    group: "primary",
    multiple: true,
    options: [
      { id: "warehouse", label: "Склад" },
      { id: "customs", label: "Таможня" },
      { id: "buyout", label: "Выкуп" },
      { id: "packaging", label: "Упаковка" },
      { id: "check", label: "Проверка товара" },
    ],
  },
  {
    id: "delivery_time",
    label: "Срок доставки",
    type: "text",
    group: "additional",
    placeholder: "Например: 12–18 дней",
    maxLength: 60,
  },
  {
    id: "office_city",
    label: "Город офиса",
    type: "text",
    group: "additional",
    placeholder: "Например: Бишкек",
    maxLength: 60,
  },
];

/**
 * Ordered presets: more specific matches first within a vertical.
 * Real estate slug may not be seeded yet — kept for future / fallback pages.
 */
export const LISTING_CHARACTERISTIC_PRESETS: readonly CharacteristicPreset[] = [
  {
    id: "market-electronics",
    vertical: "MARKET",
    categorySlugExact: [
      "market-telefony-i-elektronika",
      "market-telefony",
      "market-noutbuki",
      "market-televizory",
      "market-elektronika-drugoe",
    ],
    categorySlugIncludes: ["market-telefony", "market-noutbuki"],
    fields: MARKET_ELECTRONICS_FIELDS,
  },
  {
    id: "market-appliances",
    vertical: "MARKET",
    categorySlugExact: ["market-bytovaya-tehnika"],
    fields: MARKET_FALLBACK_FIELDS,
  },
  {
    id: "market-clothing",
    vertical: "MARKET",
    categorySlugExact: ["market-odezhda-i-obuv"],
    fields: MARKET_CLOTHING_FIELDS,
  },
  {
    id: "market-home",
    vertical: "MARKET",
    categorySlugExact: [
      "market-dom-i-sad",
      "market-mebel",
      "market-sad-i-dacha",
      "market-tovary-dlya-doma",
    ],
    fields: MARKET_HOME_FIELDS,
  },
  {
    id: "market-auto",
    vertical: "MARKET",
    categorySlugExact: ["market-avto-i-moto"],
    fields: MARKET_AUTO_FIELDS,
  },
  {
    id: "market-realty",
    vertical: "MARKET",
    categorySlugExact: ["market-nedvizhimost"],
    categorySlugIncludes: ["nedvizhimost"],
    fields: MARKET_REAL_ESTATE_FIELDS,
  },
  {
    id: "market-eq-packaging",
    vertical: "MARKET",
    categorySlugExact: ["market-eq-upakovochnoe"],
    fields: mergeEquipmentFields(MARKET_EQ_PACKAGING_EXTRA),
  },
  {
    id: "market-eq-food",
    vertical: "MARKET",
    categorySlugExact: ["market-eq-pischevoe"],
    fields: mergeEquipmentFields(MARKET_EQ_FOOD_EXTRA),
  },
  {
    id: "market-eq-horeca",
    vertical: "MARKET",
    categorySlugExact: ["market-eq-horeca", "market-eq-holodilnoe"],
    fields: mergeEquipmentFields(MARKET_EQ_HORECA_EXTRA),
  },
  {
    id: "market-eq-metal",
    vertical: "MARKET",
    categorySlugExact: ["market-eq-metalloobrabotka", "market-eq-derevoobrabotka"],
    fields: mergeEquipmentFields(MARKET_EQ_METAL_EXTRA),
  },
  {
    id: "market-eq-warehouse",
    vertical: "MARKET",
    categorySlugExact: ["market-eq-skladskoe"],
    fields: mergeEquipmentFields(MARKET_EQ_WAREHOUSE_EXTRA),
  },
  {
    id: "market-eq-pumps",
    vertical: "MARKET",
    categorySlugExact: ["market-eq-nasosy"],
    fields: mergeEquipmentFields(MARKET_EQ_PUMP_EXTRA),
  },
  {
    id: "market-equipment",
    vertical: "MARKET",
    categorySlugExact: ["market-oborudovanie-i-stanki"],
    categorySlugIncludes: ["market-eq-"],
    fields: MARKET_EQUIPMENT_BASE_FIELDS,
  },
  {
    id: "market-fallback",
    vertical: "MARKET",
    fields: MARKET_FALLBACK_FIELDS,
  },
  {
    id: "services-repair",
    vertical: "SERVICES",
    categorySlugExact: [
      "services-remont-i-stroitelstvo",
      "services-elektriki",
      "services-santehniki",
      "services-mebelshhiki",
      "services-mastera-na-chas",
    ],
    fields: [...SERVICES_REPAIR_EXTRA, ...SERVICES_BASE_FIELDS],
  },
  {
    id: "services-auto",
    vertical: "SERVICES",
    categorySlugExact: ["services-avtouslugi"],
    fields: [...SERVICES_AUTO_EXTRA, ...SERVICES_BASE_FIELDS],
  },
  {
    id: "services-base",
    vertical: "SERVICES",
    fields: SERVICES_BASE_FIELDS,
  },
  {
    id: "opt-food",
    vertical: "OPT",
    categorySlugIncludes: [
      "produkty-pitaniya",
      "molochnye",
      "myaso",
      "bakaleya",
      "napitki",
      "konditerskie",
      "moloko",
      "syry",
      "govyadina",
    ],
    fields: [...OPT_FOOD_EXTRA, ...OPT_BASE_FIELDS],
  },
  {
    id: "opt-equipment",
    vertical: "OPT",
    categorySlugExact: ["opt-oborudovanie"],
    categorySlugIncludes: ["oborudovanie"],
    fields: [...OPT_EQUIPMENT_EXTRA, ...OPT_BASE_FIELDS],
  },
  {
    id: "opt-electronics",
    vertical: "OPT",
    categorySlugExact: ["elektronika"],
    categorySlugIncludes: [
      "elektronika",
      "telefony",
      "kompyutery",
      "smartfony",
      "noutbuki",
    ],
    fields: MARKET_ELECTRONICS_FIELDS,
  },
  {
    id: "opt-base",
    vertical: "OPT",
    fields: OPT_BASE_FIELDS,
  },
  {
    id: "cargo-company",
    vertical: "CARGO",
    fields: CARGO_FIELDS,
  },
];

function slugMatchesPreset(slug: string, preset: CharacteristicPreset): boolean {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (preset.categorySlugExact?.some((exact) => exact === normalized)) {
    return true;
  }

  if (
    preset.categorySlugIncludes?.some((token) =>
      normalized.includes(token.toLowerCase()),
    )
  ) {
    return true;
  }

  return false;
}

function isFallbackPreset(preset: CharacteristicPreset): boolean {
  return (
    !preset.categorySlugExact?.length && !preset.categorySlugIncludes?.length
  );
}

/** Resolve field definitions for vertical + category slug. */
export function resolveListingCharacteristicFields(
  vertical: ListingVertical,
  categorySlug: string | null | undefined,
): readonly CharacteristicFieldDef[] {
  const forVertical = LISTING_CHARACTERISTIC_PRESETS.filter(
    (preset) => preset.vertical === vertical,
  );

  const slug = categorySlug?.trim() ?? "";
  if (slug) {
    const specific = forVertical.find(
      (preset) => !isFallbackPreset(preset) && slugMatchesPreset(slug, preset),
    );
    if (specific) {
      return specific.fields;
    }
  }

  const fallback = forVertical.find(isFallbackPreset);
  return fallback?.fields ?? MARKET_FALLBACK_FIELDS;
}

export function splitCharacteristicFields(
  fields: readonly CharacteristicFieldDef[],
): {
  primary: readonly CharacteristicFieldDef[];
  additional: readonly CharacteristicFieldDef[];
} {
  return {
    primary: fields.filter((field) => field.group === "primary"),
    additional: fields.filter((field) => field.group === "additional"),
  };
}
