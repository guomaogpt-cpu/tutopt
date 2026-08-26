import type { ListingVertical } from "@prisma/client";

export type CategoryMegaLink = {
  label: string;
  href: string;
};

export type CategoryMegaGroup = {
  title: string;
  links: CategoryMegaLink[];
};

export type CategoryMegaItem = {
  id: string;
  label: string;
  emoji: string;
  accent: "purple" | "green" | "blue" | "orange" | "slate";
  href: string;
  groups: CategoryMegaGroup[];
};

function listingsCategory(
  vertical: ListingVertical,
  categorySlug: string,
  subcategorySlug?: string,
): string {
  const params = new URLSearchParams({
    vertical,
    category: categorySlug,
  });
  if (subcategorySlug) {
    params.set("subcategory", subcategorySlug);
  }
  return `/listings?${params.toString()}`;
}

function listingsSearch(query: string): string {
  return `/listings?q=${encodeURIComponent(query)}`;
}

function cargoCategory(slug: string): string {
  return listingsCategory("CARGO", slug);
}

/** Lalafo-style mega menu taxonomy — maps to existing catalog slugs where possible. */
export const CATEGORY_MEGA_MENU: CategoryMegaItem[] = [
  {
    id: "transport",
    label: "Транспорт",
    emoji: "🚗",
    accent: "slate",
    href: listingsCategory("MARKET", "market-avto-i-moto"),
    groups: [
      {
        title: "Продажа авто",
        links: [
          { label: "Toyota", href: listingsSearch("Toyota") },
          { label: "Mercedes-Benz", href: listingsSearch("Mercedes-Benz") },
          { label: "Honda", href: listingsSearch("Honda") },
          { label: "Hyundai", href: listingsSearch("Hyundai") },
          { label: "Kia", href: listingsSearch("Kia") },
        ],
      },
      {
        title: "Автозапчасти",
        links: [
          { label: "Кузовные детали", href: listingsSearch("кузовные детали") },
          { label: "Двигатели", href: listingsSearch("двигатель") },
          { label: "КПП", href: listingsSearch("КПП") },
          { label: "Электрика", href: listingsSearch("автоэлектрика") },
        ],
      },
      {
        title: "Шины и диски",
        links: [
          { label: "Шины", href: listingsSearch("шины") },
          { label: "Диски", href: listingsSearch("диски") },
          { label: "Колёса", href: listingsSearch("колёса") },
        ],
      },
      {
        title: "Автоуслуги",
        links: [
          {
            label: "СТО",
            href: listingsCategory("SERVICES", "services-avtouslugi"),
          },
          {
            label: "Эвакуатор",
            href: listingsSearch("эвакуатор"),
          },
          {
            label: "Грузоперевозки",
            href: listingsCategory("SERVICES", "services-perevozki-i-gruzchiki"),
          },
        ],
      },
    ],
  },
  {
    id: "real-estate",
    label: "Недвижимость",
    emoji: "🏢",
    accent: "purple",
    href: listingsCategory("MARKET", "market-nedvizhimost"),
    groups: [
      {
        title: "Жильё",
        links: [
          { label: "Квартиры", href: listingsSearch("квартира") },
          { label: "Дома", href: listingsSearch("дом") },
          { label: "Комнаты", href: listingsSearch("комната") },
        ],
      },
      {
        title: "Коммерческая",
        links: [
          { label: "Офисы", href: listingsSearch("офис") },
          { label: "Склады", href: listingsCategory("MARKET", "market-biznes-i-sklad") },
          { label: "Земельные участки", href: listingsSearch("участок") },
        ],
      },
    ],
  },
  {
    id: "services",
    label: "Услуги",
    emoji: "🛠️",
    accent: "green",
    href: "/services",
    groups: [
      {
        title: "Ремонт и быт",
        links: [
          {
            label: "Ремонт",
            href: listingsCategory("SERVICES", "services-remont-i-stroitelstvo"),
          },
          {
            label: "Электрики",
            href: listingsCategory("SERVICES", "services-elektriki"),
          },
          {
            label: "Сантехники",
            href: listingsCategory("SERVICES", "services-santehniki"),
          },
          {
            label: "Мастера на час",
            href: listingsCategory("SERVICES", "services-mastera-na-chas"),
          },
        ],
      },
      {
        title: "Бизнес и digital",
        links: [
          {
            label: "IT и digital",
            href: listingsCategory("SERVICES", "services-it-i-digital"),
          },
          {
            label: "Обучение",
            href: listingsCategory("SERVICES", "services-obuchenie"),
          },
          {
            label: "Бухгалтерия",
            href: listingsCategory("SERVICES", "services-buhgalteriya"),
          },
          {
            label: "Юристы",
            href: listingsCategory("SERVICES", "services-yuridicheskie-uslugi"),
          },
        ],
      },
      {
        title: "Прочее",
        links: [
          {
            label: "Клининг",
            href: listingsCategory("SERVICES", "services-kliningovye-uslugi"),
          },
          {
            label: "Грузчики",
            href: listingsCategory("SERVICES", "services-perevozki-i-gruzchiki"),
          },
          {
            label: "Красота",
            href: listingsCategory("SERVICES", "services-krasota-i-zdorove"),
          },
          {
            label: "Автоуслуги",
            href: listingsCategory("SERVICES", "services-avtouslugi"),
          },
        ],
      },
    ],
  },
  {
    id: "repair",
    label: "Ремонт и строительство",
    emoji: "🔨",
    accent: "orange",
    href: listingsCategory("MARKET", "market-stroitelstvo-i-remont"),
    groups: [
      {
        title: "Материалы",
        links: [
          { label: "Цемент и бетон", href: listingsSearch("цемент") },
          { label: "Кирпич", href: listingsSearch("кирпич") },
          { label: "Утеплители", href: listingsSearch("утеплитель") },
        ],
      },
      {
        title: "Инструменты",
        links: [
          { label: "Электроинструмент", href: listingsSearch("электроинструмент") },
          { label: "Ручной инструмент", href: listingsSearch("инструмент") },
        ],
      },
      {
        title: "Оборудование",
        links: [
          {
            label: "Строительное оборудование",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-stroitelnoe",
            ),
          },
        ],
      },
    ],
  },
  {
    id: "home",
    label: "Дом и сад",
    emoji: "🏠",
    accent: "purple",
    href: listingsCategory("MARKET", "market-dom-i-sad"),
    groups: [
      {
        title: "Для дома",
        links: [
          {
            label: "Мебель",
            href: listingsCategory("MARKET", "market-dom-i-sad", "market-mebel"),
          },
          {
            label: "Товары для дома",
            href: listingsCategory("MARKET", "market-dom-i-sad", "market-tovary-dlya-doma"),
          },
        ],
      },
      {
        title: "Сад и дача",
        links: [
          {
            label: "Сад и дача",
            href: listingsCategory("MARKET", "market-dom-i-sad", "market-sad-i-dacha"),
          },
          { label: "Садовый инвентарь", href: listingsSearch("сад") },
        ],
      },
    ],
  },
  {
    id: "electronics",
    label: "Техника и электроника",
    emoji: "📱",
    accent: "blue",
    href: listingsCategory("MARKET", "market-telefony-i-elektronika"),
    groups: [
      {
        title: "Электроника",
        links: [
          {
            label: "Телефоны",
            href: listingsCategory("MARKET", "market-telefony-i-elektronika", "market-telefony"),
          },
          {
            label: "Ноутбуки",
            href: listingsCategory("MARKET", "market-telefony-i-elektronika", "market-noutbuki"),
          },
          {
            label: "Телевизоры",
            href: listingsCategory("MARKET", "market-telefony-i-elektronika", "market-televizory"),
          },
          {
            label: "Бытовая техника",
            href: listingsCategory(
              "MARKET",
              "market-telefony-i-elektronika",
              "market-bytovaya-tehnika",
            ),
          },
        ],
      },
    ],
  },
  {
    id: "jobs",
    label: "Работа",
    emoji: "💼",
    accent: "slate",
    href: listingsSearch("работа"),
    groups: [
      {
        title: "Вакансии",
        links: [
          { label: "Полная занятость", href: listingsSearch("вакансия") },
          { label: "Подработка", href: listingsSearch("подработка") },
          { label: "Удалённая работа", href: listingsSearch("удалённая работа") },
        ],
      },
    ],
  },
  {
    id: "equipment",
    label: "Оборудование для бизнеса",
    emoji: "⚙️",
    accent: "blue",
    href: listingsCategory("MARKET", "market-oborudovanie-i-stanki"),
    groups: [
      {
        title: "Производство",
        links: [
          {
            label: "Пищевое оборудование",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-pischevoe",
            ),
          },
          {
            label: "Упаковочное оборудование",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-upakovochnoe",
            ),
          },
          {
            label: "Производственные линии",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-linii",
            ),
          },
        ],
      },
      {
        title: "Станки и обработка",
        links: [
          {
            label: "Станки и металлообработка",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-metalloobrabotka",
            ),
          },
          {
            label: "Деревообработка",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-derevoobrabotka",
            ),
          },
        ],
      },
      {
        title: "Склад и холод",
        links: [
          {
            label: "Складское оборудование",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-skladskoe",
            ),
          },
          {
            label: "Холодильное оборудование",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-holodilnoe",
            ),
          },
          {
            label: "Насосы и компрессоры",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-nasosy",
            ),
          },
        ],
      },
      {
        title: "Запчасти",
        links: [
          {
            label: "Запчасти и комплектующие",
            href: listingsCategory(
              "MARKET",
              "market-oborudovanie-i-stanki",
              "market-eq-zapchasti",
            ),
          },
        ],
      },
    ],
  },
  {
    id: "sport",
    label: "Спорт и хобби",
    emoji: "🏋️",
    accent: "green",
    href: listingsCategory("MARKET", "market-sport-i-otdyh"),
    groups: [
      {
        title: "Спорт",
        links: [
          { label: "Тренажёры", href: listingsSearch("тренажёр") },
          { label: "Велосипеды", href: listingsSearch("велосипед") },
          { label: "Туризм", href: listingsSearch("туризм") },
        ],
      },
    ],
  },
  {
    id: "kids",
    label: "Детские товары",
    emoji: "🧸",
    accent: "purple",
    href: listingsCategory("MARKET", "market-detskie-tovary"),
    groups: [
      {
        title: "Детям",
        links: [
          { label: "Игрушки", href: listingsSearch("игрушки") },
          { label: "Коляски", href: listingsSearch("коляска") },
          { label: "Одежда для детей", href: listingsSearch("детская одежда") },
        ],
      },
    ],
  },
  {
    id: "fashion",
    label: "Одежда и обувь",
    emoji: "👟",
    accent: "purple",
    href: listingsCategory("MARKET", "market-odezhda-i-obuv"),
    groups: [
      {
        title: "Мода",
        links: [
          { label: "Женская одежда", href: listingsSearch("женская одежда") },
          { label: "Мужская одежда", href: listingsSearch("мужская одежда") },
          { label: "Обувь", href: listingsSearch("обувь") },
        ],
      },
    ],
  },
  {
    id: "food",
    label: "Продукты питания",
    emoji: "🥫",
    accent: "orange",
    href: listingsCategory("OPT", "produkty-pitaniya"),
    groups: [
      {
        title: "Опт",
        links: [
          {
            label: "Продукты оптом",
            href: listingsCategory("OPT", "produkty-pitaniya"),
          },
          {
            label: "Сырьё",
            href: listingsCategory("OPT", "opt-syrye-i-materialy"),
          },
          {
            label: "Упаковка и тара",
            href: listingsCategory("OPT", "opt-upakovka-i-tara"),
          },
        ],
      },
    ],
  },
  {
    id: "beauty",
    label: "Красота и здоровье",
    emoji: "💄",
    accent: "green",
    href: listingsCategory("MARKET", "market-krasota-i-zdorove"),
    groups: [
      {
        title: "Красота",
        links: [
          { label: "Косметика", href: listingsSearch("косметика") },
          { label: "Парфюмерия", href: listingsSearch("парфюмерия") },
          {
            label: "Услуги красоты",
            href: listingsCategory("SERVICES", "services-krasota-i-zdorove"),
          },
        ],
      },
    ],
  },
  {
    id: "cargo",
    label: "Карго и доставка",
    emoji: "🚚",
    accent: "orange",
    href: "/cargo",
    groups: [
      {
        title: "Направления",
        links: [
          {
            label: "Китай → Кыргызстан",
            href: cargoCategory("cargo-delivery-from-china"),
          },
          {
            label: "Международная доставка",
            href: cargoCategory("cargo-international-delivery"),
          },
          {
            label: "Доставка по Кыргызстану",
            href: cargoCategory("cargo-delivery-kyrgyzstan"),
          },
        ],
      },
      {
        title: "Услуги",
        links: [
          { label: "Автодоставка", href: cargoCategory("cargo-road-freight") },
          { label: "Авиадоставка", href: cargoCategory("cargo-air-freight") },
          {
            label: "Контейнерные перевозки",
            href: cargoCategory("cargo-rail-freight"),
          },
          {
            label: "Складские услуги",
            href: cargoCategory("cargo-warehousing"),
          },
          {
            label: "Таможенное оформление",
            href: cargoCategory("cargo-customs-clearance"),
          },
        ],
      },
    ],
  },
  {
    id: "other",
    label: "Другое",
    emoji: "📦",
    accent: "slate",
    href: listingsCategory("MARKET", "market-drugoe"),
    groups: [
      {
        title: "Разделы",
        links: [
          { label: "Все объявления", href: "/listings" },
          { label: "Опт", href: "/opt" },
          { label: "Животные", href: listingsCategory("MARKET", "market-zhivotnye") },
          { label: "Бизнес и склад", href: listingsCategory("MARKET", "market-biznes-i-sklad") },
        ],
      },
    ],
  },
];

export const CATEGORY_MEGA_MENU_DEFAULT_ID = CATEGORY_MEGA_MENU[0]?.id ?? "transport";
