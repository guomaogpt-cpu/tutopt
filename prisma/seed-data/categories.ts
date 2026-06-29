export type CategorySeed = {
  name: string;
  slug: string;
  icon?: string;
  sort_order: number;
  children?: CategorySeed[];
};

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
