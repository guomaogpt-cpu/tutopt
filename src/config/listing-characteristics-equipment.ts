import type { CharacteristicFieldDef, CharacteristicOption } from "@/config/listing-characteristics-types";

const OTHER: CharacteristicOption = {
  id: "other",
  label: "Другое",
  isOther: true,
};

const CONDITION_EQUIPMENT: readonly CharacteristicOption[] = [
  { id: "new", label: "Новое" },
  { id: "used", label: "Б/у" },
  { id: "after_repair", label: "После ремонта" },
  { id: "needs_repair", label: "Требует ремонта" },
];

const VOLTAGE: readonly CharacteristicOption[] = [
  { id: "220v", label: "220V" },
  { id: "380v", label: "380V" },
  OTHER,
];

const AVAILABILITY: readonly CharacteristicOption[] = [
  { id: "in_stock", label: "В наличии" },
  { id: "on_order", label: "Под заказ" },
];

const DOCS: readonly CharacteristicOption[] = [
  { id: "yes", label: "Есть" },
  { id: "no", label: "Нет" },
  { id: "on_request", label: "По запросу" },
];

const WARRANTY: readonly CharacteristicOption[] = [
  { id: "yes", label: "Есть" },
  { id: "no", label: "Нет" },
  { id: "negotiable", label: "По договорённости" },
];

/** Base fields for any industrial equipment listing. */
export const MARKET_EQUIPMENT_BASE_FIELDS: readonly CharacteristicFieldDef[] = [
  {
    id: "condition",
    label: "Состояние",
    type: "chips",
    group: "primary",
    options: CONDITION_EQUIPMENT,
  },
  {
    id: "equipment_type",
    label: "Тип оборудования",
    type: "text",
    group: "primary",
    placeholder: "Например: вакуумный упаковщик",
    maxLength: 80,
  },
  {
    id: "performance",
    label: "Производительность",
    type: "text",
    group: "primary",
    placeholder: "Например: 120 шт/час",
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
    group: "primary",
    options: VOLTAGE,
  },
  {
    id: "dimensions",
    label: "Габариты",
    type: "text",
    group: "additional",
    placeholder: "Д × Ш × В",
    maxLength: 60,
  },
  {
    id: "weight",
    label: "Вес",
    type: "text",
    group: "additional",
    placeholder: "Например: 85 кг",
    maxLength: 40,
  },
  {
    id: "body_material",
    label: "Материал корпуса",
    type: "chips",
    group: "additional",
    options: [
      { id: "stainless", label: "Нержавеющая сталь" },
      { id: "metal", label: "Металл" },
      { id: "plastic", label: "Пластик" },
      OTHER,
    ],
  },
  {
    id: "automation",
    label: "Автоматизация",
    type: "chips",
    group: "additional",
    options: [
      { id: "manual", label: "Ручное" },
      { id: "semi", label: "Полуавтомат" },
      { id: "auto", label: "Автомат" },
    ],
  },
  {
    id: "purpose",
    label: "Назначение",
    type: "text",
    group: "additional",
    placeholder: "Для чего используется",
    maxLength: 100,
  },
  {
    id: "country",
    label: "Страна производства",
    type: "chips",
    group: "additional",
    options: [
      { id: "cn", label: "Китай" },
      { id: "tr", label: "Турция" },
      { id: "ru", label: "Россия" },
      { id: "eu", label: "Европа" },
      OTHER,
    ],
  },
  {
    id: "year",
    label: "Год выпуска",
    type: "number",
    group: "additional",
    placeholder: "2020",
    maxLength: 4,
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
    options: AVAILABILITY,
  },
  {
    id: "documents",
    label: "Документы",
    type: "chips",
    group: "additional",
    options: DOCS,
  },
  {
    id: "warranty",
    label: "Гарантия",
    type: "chips",
    group: "additional",
    options: WARRANTY,
  },
];

export const MARKET_EQ_PACKAGING_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "packaging_type",
    label: "Тип упаковки",
    type: "chips",
    group: "primary",
    options: [
      { id: "bag", label: "пакет" },
      { id: "film", label: "плёнка" },
      { id: "box", label: "коробка" },
      { id: "vacuum", label: "вакуум" },
      { id: "shrink", label: "термоусадка" },
      OTHER,
    ],
  },
  {
    id: "film_width",
    label: "Ширина плёнки/пакета",
    type: "text",
    group: "primary",
    placeholder: "Например: 400 мм",
    maxLength: 40,
  },
  {
    id: "control_type",
    label: "Тип управления",
    type: "chips",
    group: "primary",
    options: [
      { id: "manual", label: "ручной" },
      { id: "semi", label: "полуавтомат" },
      { id: "auto", label: "автомат" },
    ],
  },
];

export const MARKET_EQ_FOOD_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "food_purpose",
    label: "Назначение",
    type: "chips",
    group: "primary",
    options: [
      { id: "meat", label: "мясо" },
      { id: "milk", label: "молоко" },
      { id: "drinks", label: "напитки" },
      { id: "veg", label: "овощи" },
      { id: "dough", label: "тесто" },
      OTHER,
    ],
  },
  {
    id: "food_material",
    label: "Материал",
    type: "chips",
    group: "primary",
    options: [
      { id: "sus304", label: "SUS304" },
      { id: "stainless", label: "нержавеющая сталь" },
      OTHER,
    ],
  },
  {
    id: "volume",
    label: "Объём/производительность",
    type: "text",
    group: "primary",
    placeholder: "Например: 200 л/час",
    maxLength: 60,
  },
];

export const MARKET_EQ_HORECA_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "horeca_type",
    label: "Тип",
    type: "chips",
    group: "primary",
    options: [
      { id: "stove", label: "плита" },
      { id: "oven", label: "печь" },
      { id: "fridge", label: "холодильник" },
      { id: "fryer", label: "фритюрница" },
      { id: "showcase", label: "витрина" },
      { id: "coffee", label: "кофемашина" },
      OTHER,
    ],
  },
];

export const MARKET_EQ_METAL_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "machine_type",
    label: "Тип станка",
    type: "chips",
    group: "primary",
    options: [
      { id: "lathe", label: "токарный" },
      { id: "mill", label: "фрезерный" },
      { id: "laser", label: "лазерный" },
      { id: "bender", label: "гибочный" },
      { id: "weld", label: "сварочный" },
      { id: "press", label: "пресс" },
      OTHER,
    ],
  },
  {
    id: "cnc",
    label: "ЧПУ",
    type: "chips",
    group: "primary",
    options: [
      { id: "yes", label: "Да" },
      { id: "no", label: "Нет" },
    ],
  },
  {
    id: "work_area",
    label: "Рабочая зона",
    type: "text",
    group: "primary",
    placeholder: "Например: 600×400 мм",
    maxLength: 60,
  },
];

export const MARKET_EQ_WAREHOUSE_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "warehouse_type",
    label: "Тип",
    type: "chips",
    group: "primary",
    options: [
      { id: "stacker", label: "штабелер" },
      { id: "forklift", label: "погрузчик" },
      { id: "pallet_jack", label: "рохля" },
      { id: "rack", label: "стеллаж" },
      { id: "cart", label: "тележка" },
      OTHER,
    ],
  },
  {
    id: "load_capacity",
    label: "Грузоподъёмность",
    type: "text",
    group: "primary",
    placeholder: "Например: 1500 кг",
    maxLength: 40,
  },
  {
    id: "lift_height",
    label: "Высота подъёма",
    type: "text",
    group: "primary",
    placeholder: "Например: 3 м",
    maxLength: 40,
  },
  {
    id: "power_source",
    label: "Питание",
    type: "chips",
    group: "primary",
    options: [
      { id: "manual", label: "ручной" },
      { id: "electric", label: "электрический" },
      OTHER,
    ],
  },
];

export const MARKET_EQ_PUMP_EXTRA: readonly CharacteristicFieldDef[] = [
  {
    id: "pump_type",
    label: "Тип",
    type: "chips",
    group: "primary",
    options: [
      { id: "pump", label: "насос" },
      { id: "compressor", label: "компрессор" },
      { id: "vacuum", label: "вакуумный насос" },
      OTHER,
    ],
  },
  {
    id: "pressure",
    label: "Давление/напор",
    type: "text",
    group: "primary",
    placeholder: "Например: 8 бар",
    maxLength: 40,
  },
];

export function mergeEquipmentFields(
  extras: readonly CharacteristicFieldDef[],
): readonly CharacteristicFieldDef[] {
  const used = new Set(extras.map((field) => field.id));
  const base = MARKET_EQUIPMENT_BASE_FIELDS.filter((field) => !used.has(field.id));
  return [...extras, ...base];
}
