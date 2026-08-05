import type { ListingVertical } from "@prisma/client";

export type CategorySeed = {
  name: string;
  slug: string;
  icon?: string;
  sort_order: number;
  vertical?: ListingVertical;
  children?: CategorySeed[];
};

/** Existing OPT catalog tree — keep as-is for backward compatibility. */
export const CATEGORIES: CategorySeed[] = [
  {
    name: "Продукты питания",
    slug: "produkty-pitaniya",
    icon: "utensils",
    sort_order: 1,
    children: [
      {
        name: "Молочные продукты",
        slug: "molochnye-produkty",
        sort_order: 1,
        children: [
          { name: "Молоко", slug: "moloko", sort_order: 1 },
          { name: "Сыры", slug: "syry", sort_order: 2 },
          { name: "Йогурты", slug: "yogurty", sort_order: 3 },
          { name: "Сметана и творог", slug: "smetana-tvorog", sort_order: 4 },
        ],
      },
      {
        name: "Мясо и птица",
        slug: "myaso-ptitsa",
        sort_order: 2,
        children: [
          { name: "Говядина", slug: "govyadina", sort_order: 1 },
          { name: "Баранина", slug: "baranina", sort_order: 2 },
          { name: "Курица", slug: "kuritsa", sort_order: 3 },
          { name: "Колбасы", slug: "kolbasy", sort_order: 4 },
        ],
      },
      {
        name: "Бакалея",
        slug: "bakaleya",
        sort_order: 3,
        children: [
          { name: "Крупы", slug: "krupy", sort_order: 1 },
          { name: "Макароны", slug: "makarony", sort_order: 2 },
          { name: "Масла", slug: "masla", sort_order: 3 },
          { name: "Консервы", slug: "konservy", sort_order: 4 },
        ],
      },
      {
        name: "Напитки",
        slug: "napitki",
        sort_order: 4,
        children: [
          { name: "Вода", slug: "voda", sort_order: 1 },
          { name: "Соки", slug: "soki", sort_order: 2 },
          { name: "Газированные напитки", slug: "gazirovannye", sort_order: 3 },
        ],
      },
      {
        name: "Кондитерские изделия",
        slug: "konditerskie",
        sort_order: 5,
        children: [
          { name: "Шоколад", slug: "shokolad", sort_order: 1 },
          { name: "Печенье", slug: "pechene", sort_order: 2 },
          { name: "Конфеты", slug: "konfety", sort_order: 3 },
        ],
      },
    ],
  },
  {
    name: "Одежда и текстиль",
    slug: "odezhda-tekstil",
    icon: "shirt",
    sort_order: 2,
    children: [
      {
        name: "Мужская одежда",
        slug: "muzhskaya-odezhda",
        sort_order: 1,
        children: [
          { name: "Костюмы", slug: "kostyumy", sort_order: 1 },
          { name: "Рубашки", slug: "rubashki", sort_order: 2 },
          { name: "Брюки", slug: "bryuki", sort_order: 3 },
        ],
      },
      {
        name: "Женская одежда",
        slug: "zhenskaya-odezhda",
        sort_order: 2,
        children: [
          { name: "Платья", slug: "platya", sort_order: 1 },
          { name: "Блузки", slug: "bluzki", sort_order: 2 },
          { name: "Юбки", slug: "yubki", sort_order: 3 },
        ],
      },
      {
        name: "Детская одежда",
        slug: "detskaya-odezhda",
        sort_order: 3,
        children: [
          { name: "Для мальчиков", slug: "dlya-malchikov", sort_order: 1 },
          { name: "Для девочек", slug: "dlya-devochek", sort_order: 2 },
        ],
      },
      {
        name: "Текстиль",
        slug: "tekstil",
        sort_order: 4,
        children: [
          { name: "Постельное бельё", slug: "postelnoe-bele", sort_order: 1 },
          { name: "Полотенца", slug: "polotenca", sort_order: 2 },
        ],
      },
    ],
  },
  {
    name: "Строительные материалы",
    slug: "stroitelnye-materialy",
    icon: "hammer",
    sort_order: 3,
    children: [
      {
        name: "Цемент и бетон",
        slug: "tsement-beton",
        sort_order: 1,
        children: [
          { name: "Цемент", slug: "tsement", sort_order: 1 },
          { name: "Бетон", slug: "beton", sort_order: 2 },
          { name: "Смеси", slug: "smesi", sort_order: 3 },
        ],
      },
      {
        name: "Кирпич и блоки",
        slug: "kirpich-bloki",
        sort_order: 2,
        children: [
          { name: "Кирпич", slug: "kirpich", sort_order: 1 },
          { name: "Газоблок", slug: "gazoblok", sort_order: 2 },
        ],
      },
      {
        name: "Металлопрокат",
        slug: "metalloprokat",
        sort_order: 3,
        children: [
          { name: "Арматура", slug: "armatura", sort_order: 1 },
          { name: "Профиль", slug: "profil", sort_order: 2 },
        ],
      },
      {
        name: "Отделочные материалы",
        slug: "otdelochnye",
        sort_order: 4,
        children: [
          { name: "Краски", slug: "kraski", sort_order: 1 },
          { name: "Плитка", slug: "plitka", sort_order: 2 },
          { name: "Обои", slug: "oboi", sort_order: 3 },
        ],
      },
    ],
  },
  {
    name: "Электроника",
    slug: "elektronika",
    icon: "cpu",
    sort_order: 4,
    children: [
      {
        name: "Телефоны и аксессуары",
        slug: "telefony-aksessuary",
        sort_order: 1,
        children: [
          { name: "Смартфоны", slug: "smartfony", sort_order: 1 },
          { name: "Чехлы", slug: "chehly", sort_order: 2 },
          { name: "Зарядные устройства", slug: "zaryadnye", sort_order: 3 },
        ],
      },
      {
        name: "Компьютеры",
        slug: "kompyutery",
        sort_order: 2,
        children: [
          { name: "Ноутбуки", slug: "noutbuki", sort_order: 1 },
          { name: "Мониторы", slug: "monitory", sort_order: 2 },
          { name: "Периферия", slug: "periferiya", sort_order: 3 },
        ],
      },
      {
        name: "Бытовая техника",
        slug: "bytovaya-tehnika",
        sort_order: 3,
        children: [
          { name: "Холодильники", slug: "holodilniki", sort_order: 1 },
          { name: "Стиральные машины", slug: "stiralnye", sort_order: 2 },
          { name: "Мелкая техника", slug: "melkaya-tehnika", sort_order: 3 },
        ],
      },
    ],
  },
  {
    name: "Авто и запчасти",
    slug: "avto-zapchasti",
    icon: "car",
    sort_order: 5,
    children: [
      {
        name: "Запчасти",
        slug: "zapchasti",
        sort_order: 1,
        children: [
          { name: "Двигатель", slug: "dvigatel", sort_order: 1 },
          { name: "Подвеска", slug: "podveska", sort_order: 2 },
          { name: "Тормозная система", slug: "tormoza", sort_order: 3 },
        ],
      },
      {
        name: "Шины и диски",
        slug: "shiny-diski",
        sort_order: 2,
        children: [
          { name: "Летние шины", slug: "letnie-shiny", sort_order: 1 },
          { name: "Зимние шины", slug: "zimnie-shiny", sort_order: 2 },
          { name: "Диски", slug: "diski", sort_order: 3 },
        ],
      },
      {
        name: "Масла и жидкости",
        slug: "masla-zhidkosti",
        sort_order: 3,
        children: [
          { name: "Моторные масла", slug: "motornye-masla", sort_order: 1 },
          { name: "Антифриз", slug: "antifriz", sort_order: 2 },
        ],
      },
    ],
  },
  {
    name: "Бытовая химия",
    slug: "bytovaya-himiya",
    icon: "spray",
    sort_order: 6,
    children: [
      {
        name: "Моющие средства",
        slug: "moyushchie",
        sort_order: 1,
        children: [
          { name: "Для посуды", slug: "dlya-posudy", sort_order: 1 },
          { name: "Для стирки", slug: "dlya-stirki", sort_order: 2 },
          { name: "Универсальные", slug: "universalnye", sort_order: 3 },
        ],
      },
      {
        name: "Средства для уборки",
        slug: "sredstva-uborki",
        sort_order: 2,
        children: [
          { name: "Пол", slug: "dlya-pola", sort_order: 1 },
          { name: "Санузел", slug: "sanuzel", sort_order: 2 },
        ],
      },
      {
        name: "Косметика и гигиена",
        slug: "kosmetika-gigiena",
        sort_order: 3,
        children: [
          { name: "Шампуни", slug: "shampuni", sort_order: 1 },
          { name: "Мыло", slug: "mylo", sort_order: 2 },
          { name: "Бумажная продукция", slug: "bumazhnaya", sort_order: 3 },
        ],
      },
    ],
  },
  {
    name: "Мебель",
    slug: "mebel",
    icon: "sofa",
    sort_order: 7,
    children: [
      {
        name: "Офисная мебель",
        slug: "ofisnaya-mebel",
        sort_order: 1,
        children: [
          { name: "Столы", slug: "stoly", sort_order: 1 },
          { name: "Стулья", slug: "stulya", sort_order: 2 },
          { name: "Шкафы", slug: "shkafy", sort_order: 3 },
        ],
      },
      {
        name: "Домашняя мебель",
        slug: "domashnyaya-mebel",
        sort_order: 2,
        children: [
          { name: "Диваны", slug: "divany", sort_order: 1 },
          { name: "Кровати", slug: "krovati", sort_order: 2 },
          { name: "Кухни", slug: "kuhni", sort_order: 3 },
        ],
      },
    ],
  },
  {
    name: "Сельское хозяйство",
    slug: "selhoz",
    icon: "wheat",
    sort_order: 8,
    children: [
      {
        name: "Корма",
        slug: "korma",
        sort_order: 1,
        children: [
          { name: "Для КРС", slug: "dlya-krs", sort_order: 1 },
          { name: "Для птицы", slug: "dlya-ptitsy", sort_order: 2 },
        ],
      },
      {
        name: "Удобрения",
        slug: "udobreniya",
        sort_order: 2,
        children: [
          { name: "Минеральные", slug: "mineralnye", sort_order: 1 },
          { name: "Органические", slug: "organicheskie", sort_order: 2 },
        ],
      },
      {
        name: "Семена",
        slug: "semena",
        sort_order: 3,
        children: [
          { name: "Зерновые", slug: "zernovye", sort_order: 1 },
          { name: "Овощные", slug: "ovoshchnye", sort_order: 2 },
        ],
      },
    ],
  },
];

/** Extra OPT top-level categories (no deep tree yet). */
export const OPT_EXTRA_CATEGORIES: CategorySeed[] = [
  { name: "Оборудование", slug: "opt-oborudovanie", icon: "cog", sort_order: 9, vertical: "OPT" },
  { name: "Упаковка и тара", slug: "opt-upakovka-i-tara", icon: "box", sort_order: 10, vertical: "OPT" },
  { name: "Хозтовары", slug: "opt-hoztovary", icon: "home", sort_order: 11, vertical: "OPT" },
  { name: "Сырьё и материалы", slug: "opt-syrye-i-materialy", icon: "layers", sort_order: 12, vertical: "OPT" },
];

/** MARKET categories with equipment taxonomy (Phase 106). Slugs prefixed — Category.slug is globally unique. */
export const MARKET_CATEGORIES: CategorySeed[] = [
  {
    name: "Электроника",
    slug: "market-telefony-i-elektronika",
    icon: "smartphone",
    sort_order: 1,
    vertical: "MARKET",
    children: [
      { name: "Телефоны", slug: "market-telefony", sort_order: 1, vertical: "MARKET" },
      { name: "Ноутбуки и компьютеры", slug: "market-noutbuki", sort_order: 2, vertical: "MARKET" },
      { name: "Телевизоры", slug: "market-televizory", sort_order: 3, vertical: "MARKET" },
      { name: "Бытовая техника", slug: "market-bytovaya-tehnika", sort_order: 4, vertical: "MARKET" },
      { name: "Другая электроника", slug: "market-elektronika-drugoe", sort_order: 5, vertical: "MARKET" },
    ],
  },
  {
    name: "Одежда и обувь",
    slug: "market-odezhda-i-obuv",
    icon: "shirt",
    sort_order: 2,
    vertical: "MARKET",
  },
  {
    name: "Дом и сад",
    slug: "market-dom-i-sad",
    icon: "home",
    sort_order: 3,
    vertical: "MARKET",
    children: [
      { name: "Мебель", slug: "market-mebel", sort_order: 1, vertical: "MARKET" },
      { name: "Сад и дача", slug: "market-sad-i-dacha", sort_order: 2, vertical: "MARKET" },
      { name: "Товары для дома", slug: "market-tovary-dlya-doma", sort_order: 3, vertical: "MARKET" },
    ],
  },
  {
    name: "Авто и транспорт",
    slug: "market-avto-i-moto",
    icon: "car",
    sort_order: 4,
    vertical: "MARKET",
  },
  {
    name: "Недвижимость",
    slug: "market-nedvizhimost",
    icon: "building",
    sort_order: 5,
    vertical: "MARKET",
  },
  {
    name: "Детские товары",
    slug: "market-detskie-tovary",
    icon: "baby",
    sort_order: 6,
    vertical: "MARKET",
  },
  {
    name: "Оборудование и станки",
    slug: "market-oborudovanie-i-stanki",
    icon: "cog",
    sort_order: 7,
    vertical: "MARKET",
    children: [
      { name: "Пищевое оборудование", slug: "market-eq-pischevoe", sort_order: 1, vertical: "MARKET" },
      { name: "Упаковочное оборудование", slug: "market-eq-upakovochnoe", sort_order: 2, vertical: "MARKET" },
      {
        name: "Оборудование для кафе и ресторанов",
        slug: "market-eq-horeca",
        sort_order: 3,
        vertical: "MARKET",
      },
      { name: "Холодильное оборудование", slug: "market-eq-holodilnoe", sort_order: 4, vertical: "MARKET" },
      { name: "Станки и металлообработка", slug: "market-eq-metalloobrabotka", sort_order: 5, vertical: "MARKET" },
      { name: "Деревообработка", slug: "market-eq-derevoobrabotka", sort_order: 6, vertical: "MARKET" },
      { name: "Пластик и полимеры", slug: "market-eq-plastik", sort_order: 7, vertical: "MARKET" },
      { name: "Швейное оборудование", slug: "market-eq-shvejnoe", sort_order: 8, vertical: "MARKET" },
      { name: "Полиграфическое оборудование", slug: "market-eq-poligraficheskoe", sort_order: 9, vertical: "MARKET" },
      { name: "Строительное оборудование", slug: "market-eq-stroitelnoe", sort_order: 10, vertical: "MARKET" },
      { name: "Складское оборудование", slug: "market-eq-skladskoe", sort_order: 11, vertical: "MARKET" },
      { name: "Сельхозоборудование", slug: "market-eq-selhoz", sort_order: 12, vertical: "MARKET" },
      { name: "Насосы и компрессоры", slug: "market-eq-nasosy", sort_order: 13, vertical: "MARKET" },
      { name: "Электрооборудование", slug: "market-eq-elektro", sort_order: 14, vertical: "MARKET" },
      { name: "Производственные линии", slug: "market-eq-linii", sort_order: 15, vertical: "MARKET" },
      { name: "Запчасти и комплектующие", slug: "market-eq-zapchasti", sort_order: 16, vertical: "MARKET" },
      { name: "Другое оборудование", slug: "market-eq-drugoe", sort_order: 17, vertical: "MARKET" },
    ],
  },
  {
    name: "Строительство и ремонт",
    slug: "market-stroitelstvo-i-remont",
    icon: "hammer",
    sort_order: 8,
    vertical: "MARKET",
  },
  {
    name: "Бизнес и склад",
    slug: "market-biznes-i-sklad",
    icon: "warehouse",
    sort_order: 9,
    vertical: "MARKET",
  },
  {
    name: "Спорт и отдых",
    slug: "market-sport-i-otdyh",
    icon: "dumbbell",
    sort_order: 10,
    vertical: "MARKET",
  },
  {
    name: "Животные",
    slug: "market-zhivotnye",
    icon: "paw",
    sort_order: 11,
    vertical: "MARKET",
  },
  {
    name: "Красота и здоровье",
    slug: "market-krasota-i-zdorove",
    icon: "heart",
    sort_order: 12,
    vertical: "MARKET",
  },
  {
    name: "Другое",
    slug: "market-drugoe",
    icon: "box",
    sort_order: 13,
    vertical: "MARKET",
  },
];

export const SERVICES_CATEGORIES: CategorySeed[] = [
  { name: "Ремонт и строительство", slug: "services-remont-i-stroitelstvo", sort_order: 1, vertical: "SERVICES" },
  { name: "Электрики", slug: "services-elektriki", sort_order: 2, vertical: "SERVICES" },
  { name: "Сантехники", slug: "services-santehniki", sort_order: 3, vertical: "SERVICES" },
  { name: "Мебельщики", slug: "services-mebelshhiki", sort_order: 4, vertical: "SERVICES" },
  { name: "Грузчики", slug: "services-perevozki-i-gruzchiki", sort_order: 5, vertical: "SERVICES" },
  { name: "Клининг", slug: "services-kliningovye-uslugi", sort_order: 6, vertical: "SERVICES" },
  { name: "Автоуслуги", slug: "services-avtouslugi", sort_order: 7, vertical: "SERVICES" },
  { name: "Красота и здоровье", slug: "services-krasota-i-zdorove", sort_order: 8, vertical: "SERVICES" },
  { name: "Обучение", slug: "services-obuchenie", sort_order: 9, vertical: "SERVICES" },
  { name: "Бухгалтерия", slug: "services-buhgalteriya", sort_order: 10, vertical: "SERVICES" },
  { name: "Юристы", slug: "services-yuridicheskie-uslugi", sort_order: 11, vertical: "SERVICES" },
  { name: "IT и digital", slug: "services-it-i-digital", sort_order: 12, vertical: "SERVICES" },
  { name: "Дизайн", slug: "services-dizajn", sort_order: 13, vertical: "SERVICES" },
  { name: "Фото и видео", slug: "services-foto-i-video", sort_order: 14, vertical: "SERVICES" },
  { name: "Мастера на час", slug: "services-mastera-na-chas", sort_order: 15, vertical: "SERVICES" },
  { name: "Другое", slug: "services-drugoe", sort_order: 16, vertical: "SERVICES" },
];

export const CARGO_CATEGORIES: CategorySeed[] = [
  { name: "Доставка из Китая", slug: "cargo-delivery-from-china", sort_order: 1, vertical: "CARGO" },
  { name: "Доставка по Кыргызстану", slug: "cargo-delivery-kyrgyzstan", sort_order: 2, vertical: "CARGO" },
  { name: "Международная доставка", slug: "cargo-international-delivery", sort_order: 3, vertical: "CARGO" },
  { name: "Автоперевозки", slug: "cargo-road-freight", sort_order: 4, vertical: "CARGO" },
  { name: "Авиадоставка", slug: "cargo-air-freight", sort_order: 5, vertical: "CARGO" },
  { name: "Железнодорожная доставка", slug: "cargo-rail-freight", sort_order: 6, vertical: "CARGO" },
  { name: "Складские услуги", slug: "cargo-warehousing", sort_order: 7, vertical: "CARGO" },
  { name: "Таможенное оформление", slug: "cargo-customs-clearance", sort_order: 8, vertical: "CARGO" },
  { name: "Другое", slug: "cargo-other", sort_order: 9, vertical: "CARGO" },
];
