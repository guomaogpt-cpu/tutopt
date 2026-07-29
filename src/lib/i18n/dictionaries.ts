import type { PreferredLocale } from "@/features/preferences/locale-preference";

export type Locale = PreferredLocale;

export const DEFAULT_LOCALE: Locale = "ru";

export const DICTIONARY = {
  // Nav
  "nav.opt": { ru: "Опт", kg: "Дүң соода", en: "Wholesale" },
  "nav.market": { ru: "Объявления", kg: "Жарыялар", en: "Listings" },
  "nav.services": { ru: "Услуги", kg: "Кызматтар", en: "Services" },
  "nav.cargo": { ru: "Карго", kg: "Карго", en: "Cargo" },
  "nav.main": { ru: "Основная навигация", kg: "Негизги навигация", en: "Main navigation" },

  // Auth / header actions
  "auth.signIn": { ru: "Войти", kg: "Кирүү", en: "Sign in" },
  "auth.register": { ru: "Регистрация", kg: "Катталуу", en: "Register" },
  "auth.signOut": { ru: "Выйти", kg: "Чыгуу", en: "Sign out" },
  "auth.favorites": { ru: "Избранное", kg: "Тандалмалар", en: "Favorites" },
  "auth.openSettings": { ru: "Открыть настройки", kg: "Жөндөөлөрдү ачуу", en: "Open settings" },
  "auth.closeSettings": { ru: "Закрыть настройки", kg: "Жөндөөлөрдү жабуу", en: "Close settings" },
  "auth.openMenu": { ru: "Открыть меню", kg: "Менюнү ачуу", en: "Open menu" },
  "auth.closeMenu": { ru: "Закрыть меню", kg: "Менюнү жабуу", en: "Close menu" },

  // Search
  "search.find": { ru: "Найти", kg: "Табуу", en: "Search" },
  "search.headerPlaceholder": {
    ru: "Найти товар, услугу или доставку...",
    kg: "Товар, кызмат же жеткирүүнү издөө...",
    en: "Search products, services or delivery...",
  },
  "search.homePlaceholder": {
    ru: "Поиск объявлений, услуг и компаний...",
    kg: "Жарыяларды, кызматтарды жана компанияларды издөө...",
    en: "Search listings, services and companies...",
  },
  "search.listingsLabel": {
    ru: "Поиск объявлений",
    kg: "Жарыя издөө",
    en: "Search listings",
  },
  "search.marketPlaceholder": {
    ru: "Найти товар или объявление...",
    kg: "Товар же жарыяны табуу...",
    en: "Find a product or listing...",
  },
  "search.optPlaceholder": {
    ru: "Найти оптовый товар или поставщика...",
    kg: "Дүң товар же жеткирүүчүнү табуу...",
    en: "Find wholesale goods or a supplier...",
  },
  "search.servicesPlaceholder": {
    ru: "Найти услугу или специалиста...",
    kg: "Кызмат же адисти табуу...",
    en: "Find a service or specialist...",
  },
  "search.cargoPlaceholder": {
    ru: "Найти доставку, карго или перевозчика...",
    kg: "Жеткирүү, карго же ташуучуну табуу...",
    en: "Find delivery, cargo or a carrier...",
  },

  // Home
  "home.lead": {
    ru: "Покупайте, продавайте, находите услуги",
    kg: "Сатып алыңыз, сатыңыз, кызматтарды табыңыз",
    en: "Buy, sell, and find services",
  },
  "home.directions": { ru: "Направления", kg: "Багыттар", en: "Directions" },
  "home.marketDesc": {
    ru: "Товары от частных лиц и компаний",
    kg: "Жеке адамдардын жана компаниялардын товарлары",
    en: "Goods from individuals and companies",
  },
  "home.servicesDesc": {
    ru: "Мастера, специалисты и компании",
    kg: "Усталар, адистер жана компаниялар",
    en: "Masters, specialists and companies",
  },
  "home.optDesc": {
    ru: "Оптовые товары и поставщики",
    kg: "Дүң товарлар жана жеткирүүчүлөр",
    en: "Wholesale goods and suppliers",
  },
  "home.cargoDesc": {
    ru: "Грузоперевозки и логистика",
    kg: "Жүк ташуу жана логистика",
    en: "Freight and logistics",
  },
  "home.showcase": { ru: "Витрина", kg: "Витрина", en: "Showcase" },
  "home.newListings": {
    ru: "Новые объявления",
    kg: "Жаңы жарыялар",
    en: "New listings",
  },
  "home.viewAll": { ru: "Смотреть все", kg: "Баарын көрүү", en: "View all" },
  "home.moreListings": {
    ru: "Ещё объявления",
    kg: "Дагы жарыялар",
    en: "More listings",
  },
  "home.emptyTitle": {
    ru: "Пока нет опубликованных объявлений",
    kg: "Азырынча жарыяланган жарыялар жок",
    en: "No published listings yet",
  },
  "home.emptyDescription": {
    ru: "Разместите объявление бесплатно и дождитесь модерации — оно появится в каталоге.",
    kg: "Жарыяны акысыз жайгаштырыңыз жана модерацияны күтүңүз — ал каталогдо көрүнөт.",
    en: "Post a listing for free and wait for moderation — it will appear in the catalog.",
  },

  // Vertical heroes / pages
  "vertical.seekListings": { ru: "Ищите", kg: "Издеңиз", en: "Search" },
  "vertical.seekListingsAccent": {
    ru: "объявления",
    kg: "жарыялар",
    en: "listings",
  },
  "vertical.seekOptAccent": { ru: "оптом", kg: "дүңүнөн", en: "wholesale" },
  "vertical.seekServicesAccent": {
    ru: "услуги",
    kg: "кызматтар",
    en: "services",
  },
  "vertical.seekCargoAccent": { ru: "карго", kg: "карго", en: "cargo" },
  "vertical.postListing": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post listing",
  },
  "vertical.categories": {
    ru: "Категории",
    kg: "Категориялар",
    en: "Categories",
  },
  "vertical.categoriesDescMarket": {
    ru: "Выберите раздел объявлений",
    kg: "Жарыялар бөлүмүн тандаңыз",
    en: "Choose a listings section",
  },
  "vertical.categoriesDescOpt": {
    ru: "Выберите раздел опта",
    kg: "Дүң соода бөлүмүн тандаңыз",
    en: "Choose a wholesale section",
  },
  "vertical.categoriesDescServices": {
    ru: "Выберите раздел услуг",
    kg: "Кызматтар бөлүмүн тандаңыз",
    en: "Choose a services section",
  },
  "vertical.categoriesDescCargo": {
    ru: "Выберите раздел карго",
    kg: "Карго бөлүмүн тандаңыз",
    en: "Choose a cargo section",
  },
  "vertical.categoriesEmpty": {
    ru: "Категории появятся после запуска раздела",
    kg: "Бөлүм ишке киргенден кийин категориялар чыгат",
    en: "Categories will appear after this section launches",
  },
  "vertical.latestListings": {
    ru: "Последние объявления",
    kg: "Акыркы жарыялар",
    en: "Latest listings",
  },
  "vertical.allListings": {
    ru: "Все объявления",
    kg: "Бардык жарыялар",
    en: "All listings",
  },
  "vertical.emptyMarket": {
    ru: "В Объявлениях пока нет объявлений",
    kg: "Жарыяларда азырынча жарыялар жок",
    en: "No listings in Classifieds yet",
  },
  "vertical.emptyOpt": {
    ru: "В ТутОпте пока нет объявлений",
    kg: "ТутОптто азырынча жарыялар жок",
    en: "No listings in Wholesale yet",
  },
  "vertical.emptyServices": {
    ru: "В ТутУслугах пока нет объявлений",
    kg: "ТутУслугиде азырынча жарыялар жок",
    en: "No listings in Services yet",
  },
  "vertical.emptyCargo": {
    ru: "В ТутКарго пока нет объявлений",
    kg: "ТутКаргодо азырынча жарыялар жок",
    en: "No listings in Cargo yet",
  },
  "vertical.statsListings": {
    ru: "объявлений",
    kg: "жарыя",
    en: "listings",
  },
  "vertical.statsViews": {
    ru: "просмотры объявлений",
    kg: "жарыя көрүүлөрү",
    en: "listing views",
  },
  "vertical.statsLabel": {
    ru: "Статистика раздела",
    kg: "Бөлүм статистикасы",
    en: "Section stats",
  },

  // Settings drawer
  "settings.brand": { ru: "ВсеТут", kg: "ВсеТут", en: "VseTut" },
  "settings.subtitle": {
    ru: "Настройки и разделы",
    kg: "Жөндөөлөр жана бөлүмдөр",
    en: "Settings and sections",
  },
  "settings.account": { ru: "Аккаунт", kg: "Аккаунт", en: "Account" },
  "settings.dashboard": {
    ru: "Мой кабинет",
    kg: "Менин кабинетем",
    en: "Dashboard",
  },
  "settings.city": { ru: "Город", kg: "Шаар", en: "City" },
  "settings.cityValue": { ru: "Бишкек", kg: "Бишкек", en: "Bishkek" },
  "settings.soon": { ru: "скоро", kg: "жакында", en: "soon" },
  "settings.language": { ru: "Язык", kg: "Тил", en: "Language" },
  "settings.languageHint": {
    ru: "Выбор сохраняется. Перевод интерфейса активен.",
    kg: "Тандоо сакталат. Интерфейс котормосу иштейт.",
    en: "Your choice is saved. Interface translation is active.",
  },
  "settings.theme": { ru: "Тема", kg: "Тема", en: "Theme" },
  "settings.themeLight": { ru: "Светлая", kg: "Жарык", en: "Light" },
  "settings.themeDark": { ru: "Тёмная", kg: "Караңгы", en: "Dark" },
  "settings.themeSystem": {
    ru: "Системная",
    kg: "Системалык",
    en: "System",
  },
  "settings.themeHint": {
    ru: "По умолчанию — светлая. Тёмная тема пока экспериментальная.",
    kg: "Демейки — жарык. Караңгы тема азырынча эксперименталдык.",
    en: "Default is light. Dark mode is still experimental.",
  },
  "settings.sections": { ru: "Разделы", kg: "Бөлүмдөр", en: "Sections" },
  "settings.support": { ru: "Поддержка", kg: "Колдоо", en: "Support" },
  "settings.help": { ru: "Помощь", kg: "Жардам", en: "Help" },
  "settings.contacts": { ru: "Контакты", kg: "Байланыш", en: "Contacts" },
  "settings.whatsappHint": {
    ru: "WhatsApp появится, когда будет указан рабочий контакт.",
    kg: "Иш байланыш көрсөтүлгөндө WhatsApp чыгат.",
    en: "WhatsApp will appear once a working contact is set.",
  },

  // Common
  "common.loading": { ru: "Загрузка", kg: "Жүктөлүүдө", en: "Loading" },
  "common.error": { ru: "Ошибка", kg: "Ката", en: "Error" },
  "common.noData": { ru: "Нет данных", kg: "Маалымат жок", en: "No data" },
  "common.save": { ru: "Сохранить", kg: "Сактоо", en: "Save" },
  "common.cancel": { ru: "Отмена", kg: "Жокко чыгаруу", en: "Cancel" },
  "common.close": { ru: "Закрыть", kg: "Жабуу", en: "Close" },
  "common.back": { ru: "Назад", kg: "Артка", en: "Back" },
  "common.next": { ru: "Далее", kg: "Андан ары", en: "Next" },
} as const;

export type DictionaryKey = keyof typeof DICTIONARY;

export type Dictionary = Record<DictionaryKey, string>;

export function getDictionary(locale: Locale): Dictionary {
  const entries = Object.entries(DICTIONARY) as [
    DictionaryKey,
    Record<Locale, string>,
  ][];

  return Object.fromEntries(
    entries.map(([key, value]) => [key, value[locale] ?? value.ru]),
  ) as Dictionary;
}

export function translate(
  locale: Locale,
  key: DictionaryKey,
): string {
  return DICTIONARY[key][locale] ?? DICTIONARY[key].ru;
}
