export type Locale = "ru" | "kg" | "en";

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
  "search.photo.aria": {
    ru: "Поиск по фото",
    kg: "Сүрөт менен издөө",
    en: "Search by photo",
  },
  "search.photo.title": {
    ru: "Поиск по фото",
    kg: "Сүрөт менен издөө",
    en: "Search by photo",
  },
  "search.photo.description": {
    ru: "Загрузите фото товара, чтобы позже искать похожие объявления.",
    kg: "Окшош жарыяларды издөө үчүн товар сүрөтүн жүктөңүз.",
    en: "Upload a product photo to search similar listings later.",
  },
  "search.photo.choose": {
    ru: "Выбрать фото",
    kg: "Сүрөт тандоо",
    en: "Choose photo",
  },
  "search.photo.supportedFormats": {
    ru: "JPG, PNG, WEBP",
    kg: "JPG, PNG, WEBP",
    en: "JPG, PNG, WEBP",
  },
  "search.photo.maxSize": {
    ru: "до 5 МБ",
    kg: "5 МБ чейин",
    en: "up to 5 MB",
  },
  "search.photo.findSimilar": {
    ru: "Найти похожее",
    kg: "Окшошун табуу",
    en: "Find similar",
  },
  "search.photo.comingSoon": {
    ru: "Поиск по фото будет доступен позже.",
    kg: "Сүрөт менен издөө кийин жеткиликтүү болот.",
    en: "Photo search will be available later.",
  },
  "search.photo.invalidType": {
    ru: "Поддерживаются только JPG, PNG и WEBP.",
    kg: "Жалгыз JPG, PNG жана WEBP колдоого алынат.",
    en: "Only JPG, PNG, and WEBP are supported.",
  },
  "search.photo.tooLarge": {
    ru: "Файл слишком большой. Максимум 5 МБ.",
    kg: "Файл өтө чоң. Максимум 5 МБ.",
    en: "File is too large. Maximum 5 MB.",
  },
  "search.photo.remove": {
    ru: "Удалить фото",
    kg: "Сүрөттү өчүрүү",
    en: "Remove photo",
  },
  "search.photo.prototypeNotice": {
    ru: "Это тестовый режим поиска по фото. Сейчас показываются объявления, которые могут подойти. Точный визуальный поиск будет улучшен позже.",
    kg: "Бул сүрөт менен издөөнүн тесттик режими. Азыр ылайыктуу болушу мүмкүн болгон жарыялар көрсөтүлөт. Так визуалдык издөө кийин жакшыртылат.",
    en: "This is a prototype photo search mode. We are showing listings that may match. Accurate visual search will be improved later.",
  },
  "search.photo.resultsTitle": {
    ru: "Возможные совпадения",
    kg: "Ыктымал дал келүүлөр",
    en: "Possible matches",
  },
  "search.photo.openListing": {
    ru: "Открыть",
    kg: "Ачуу",
    en: "Open",
  },
  "search.photo.viewAllResults": {
    ru: "Смотреть все результаты",
    kg: "Бардык жыйынтыктарды көрүү",
    en: "View all results",
  },
  "search.photo.chooseAnother": {
    ru: "Выбрать другое фото",
    kg: "Башка сүрөт тандоо",
    en: "Choose another photo",
  },
  "search.photo.openAllListings": {
    ru: "Открыть все объявления",
    kg: "Бардык жарыяларды ачуу",
    en: "Open all listings",
  },
  "search.photo.emptyTitle": {
    ru: "Похожие объявления пока не найдены.",
    kg: "Окшош жарыялар азырынча табылган жок.",
    en: "No similar listings found yet.",
  },
  "search.photo.tryAgain": {
    ru: "Попробовать снова",
    kg: "Кайра аракет кылуу",
    en: "Try again",
  },
  "search.photo.searching": {
    ru: "Идёт поиск...",
    kg: "Издөө жүрүп жатат...",
    en: "Searching...",
  },
  "search.photo.networkError": {
    ru: "Не удалось выполнить поиск. Проверьте соединение и попробуйте снова.",
    kg: "Издөө ишке ашкан жок. Байланышты текшерип, кайра аракет кылыңыз.",
    en: "Search failed. Check your connection and try again.",
  },
  "search.photo.serverError": {
    ru: "Не удалось выполнить поиск. Попробуйте позже.",
    kg: "Издөө ишке ашкан жок. Кийинчерээк аракет кылыңыз.",
    en: "Search could not be completed. Please try again later.",
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

  // Footer — Phase 56
  "footer.buyersTitle": { ru: "Покупателям", kg: "Сатып алуучуларга", en: "For buyers" },
  "footer.catalog": { ru: "Каталог", kg: "Каталог", en: "Catalog" },
  "footer.favorites": { ru: "Избранное", kg: "Тандалмалар", en: "Favorites" },
  "footer.buyerDashboard": {
    ru: "Кабинет покупателя",
    kg: "Сатып алуучунун кабинети",
    en: "Buyer dashboard",
  },
  "footer.sellersTitle": { ru: "Продавцам", kg: "Сатуучуларга", en: "For sellers" },
  "footer.postListing": { ru: "Подать объявление", kg: "Жарыя берүү", en: "Post a listing" },
  "footer.sellerDashboard": {
    ru: "Кабинет продавца",
    kg: "Сатуучунун кабинети",
    en: "Seller dashboard",
  },
  "footer.leads": { ru: "Заявки", kg: "Тапшырмалар", en: "Leads" },
  "footer.platformTitle": { ru: "Платформа", kg: "Платформа", en: "Platform" },
  "footer.sellers": { ru: "Продавцы", kg: "Сатуучулар", en: "Sellers" },
  "footer.notifications": { ru: "Уведомления", kg: "Билдирмелер", en: "Notifications" },
  "footer.signIn": { ru: "Войти", kg: "Кирүү", en: "Sign in" },
  "footer.register": { ru: "Регистрация", kg: "Катталуу", en: "Register" },
  "footer.brandTagline": {
    ru: "B2B-платформа оптовых объявлений в Кыргызстане",
    kg: "Кыргызстандагы дүң жарыялардын B2B-платформасы",
    en: "B2B wholesale listings platform in Kyrgyzstan",
  },
  "footer.brandSubline": {
    ru: "Покупатели находят поставщиков, продавцы получают заявки.",
    kg: "Сатып алуучулар жеткирүүчүлөрдү табат, сатуучулар тапшырма алат.",
    en: "Buyers find suppliers, sellers get leads.",
  },
  "footer.copyright": {
    ru: "© 2026 ВсеТут. Все права защищены.",
    kg: "© 2026 ВсеТут. Бардык укуктар корголгон.",
    en: "© 2026 VseTut. All rights reserved.",
  },
  "footer.bottomTagline": {
    ru: "Оптовые объявления для бизнеса в Кыргызстане.",
    kg: "Кыргызстандагы бизнес үчүн дүң жарыялар.",
    en: "Wholesale listings for business in Kyrgyzstan.",
  },

  // Home CTA / how it works — Phase 56
  "cta.sellQuestion": {
    ru: "Продаёте товары или услуги?",
    kg: "Товар же кызмат сатасызбы?",
    en: "Selling goods or services?",
  },
  "cta.sellDescription": {
    ru: "Разместите объявление бесплатно и получайте заявки от покупателей по всему Кыргызстану.",
    kg: "Жарыяны акысыз жайгаштырыңыз жана Кыргызстан боюнча сатып алуучулардан тапшырма алыңыз.",
    en: "Post a listing for free and get leads from buyers across Kyrgyzstan.",
  },
  "cta.postListing": { ru: "Подать объявление", kg: "Жарыя берүү", en: "Post listing" },
  "howItWorks.title": { ru: "Как это работает", kg: "Бул кантип иштейт", en: "How it works" },
  "howItWorks.step1Title": { ru: "Найдите товар", kg: "Товарды табыңыз", en: "Find a product" },
  "howItWorks.step1Description": {
    ru: "Воспользуйтесь поиском и категориями, чтобы найти нужные оптовые предложения.",
    kg: "Керектүү дүң сунуштарды табуу үчүн издөө жана категорияларды колдонуңуз.",
    en: "Use search and categories to find the wholesale offers you need.",
  },
  "howItWorks.step2Title": {
    ru: "Свяжитесь с поставщиком",
    kg: "Жеткирүүчү менен байланышыңыз",
    en: "Contact the supplier",
  },
  "howItWorks.step2Description": {
    ru: "Откройте объявление и напишите продавцу напрямую.",
    kg: "Жарыяны ачып, сатуучуга түз жазыңыз.",
    en: "Open the listing and message the seller directly.",
  },
  "howItWorks.step3Title": {
    ru: "Договоритесь напрямую",
    kg: "Түздөн-түз макулдашыңыз",
    en: "Agree directly",
  },
  "howItWorks.step3Description": {
    ru: "Согласуйте цену, объём и условия поставки без посредников.",
    kg: "Ортомчусуз баасын, көлөмүн жана жеткирүү шарттарын макулдашыңыз.",
    en: "Agree on price, volume and delivery terms without intermediaries.",
  },

  // Catalog / toolbar / filters — Phase 56
  "catalog.all": { ru: "Все", kg: "Баары", en: "All" },
  "catalog.sectionAriaLabel": {
    ru: "Раздел объявлений",
    kg: "Жарыялар бөлүмү",
    en: "Listings section",
  },
  "catalog.searchAriaLabel": {
    ru: "Что вы ищете?",
    kg: "Сиз эмнени издейсиз?",
    en: "What are you looking for?",
  },
  "catalog.searchPlaceholder": {
    ru: "Что вы ищете?",
    kg: "Сиз эмнени издейсиз?",
    en: "What are you looking for?",
  },
  "catalog.clearSearch": { ru: "Очистить поиск", kg: "Издөөнү тазалоо", en: "Clear search" },
  "catalog.found": { ru: "Найдено", kg: "Табылды", en: "Found" },
  "catalog.listingWordOne": { ru: "объявление", kg: "жарыя", en: "listing" },
  "catalog.listingWordFew": { ru: "объявления", kg: "жарыя", en: "listings" },
  "catalog.listingWordMany": { ru: "объявлений", kg: "жарыя", en: "listings" },
  "catalog.sortAriaLabel": { ru: "Сортировка", kg: "Иреттөө", en: "Sort" },
  "catalog.sortNewestFirst": {
    ru: "Сначала новые",
    kg: "Жаңылары биринчи",
    en: "Newest first",
  },
  "catalog.filters": { ru: "Фильтры", kg: "Чыпкалар", en: "Filters" },
  "catalog.hasActiveFilters": {
    ru: "Есть активные фильтры",
    kg: "Активдүү чыпкалар бар",
    en: "Active filters applied",
  },
  "catalog.removeFilter": { ru: "Удалить фильтр", kg: "Чыпканы өчүрүү", en: "Remove filter" },
  "catalog.resetAll": { ru: "Сбросить всё", kg: "Баарын тазалоо", en: "Reset all" },
  "catalog.resetFilters": {
    ru: "Сбросить фильтры",
    kg: "Чыпкаларды тазалоо",
    en: "Reset filters",
  },
  "catalog.notFoundTitle": {
    ru: "Ничего не найдено",
    kg: "Эч нерсе табылбады",
    en: "Nothing found",
  },
  "catalog.notFoundDescription": {
    ru: "Попробуйте изменить запрос, выбрать другой город или сбросить фильтры.",
    kg: "Сурамжылоону өзгөртүп, башка шаарды тандап же чыпкаларды тазалап көрүңүз.",
    en: "Try changing your search, choosing another city, or resetting filters.",
  },
  "catalog.addListing": { ru: "Добавить объявление", kg: "Жарыя кошуу", en: "Add listing" },
  "catalog.goToCatalog": {
    ru: "Перейти в каталог",
    kg: "Каталогго өтүү",
    en: "Go to catalog",
  },
  "catalog.openCatalog": {
    ru: "Открыть каталог",
    kg: "Каталогду ачуу",
    en: "Open catalog",
  },
  "catalog.category": { ru: "Категория", kg: "Категория", en: "Category" },
  "catalog.allCategories": { ru: "Все категории", kg: "Бардык категориялар", en: "All categories" },
  "catalog.allCities": { ru: "Все города", kg: "Бардык шаарлар", en: "All cities" },
  "catalog.brand": { ru: "Бренд", kg: "Бренд", en: "Brand" },
  "catalog.allBrands": { ru: "Все бренды", kg: "Бардык брендтер", en: "All brands" },
  "catalog.priceFrom": { ru: "Цена от", kg: "Баасы баштап", en: "Price from" },
  "catalog.priceTo": { ru: "Цена до", kg: "Баасы чейин", en: "Price to" },
  "catalog.withPhotosOnly": {
    ru: "Только с фото",
    kg: "Сүрөттүү гана",
    en: "With photos only",
  },
  "catalog.reset": { ru: "Сбросить", kg: "Тазалоо", en: "Reset" },
  "catalog.apply": { ru: "Применить", kg: "Колдонуу", en: "Apply" },

  "listings.photoSearch.title": {
    ru: "Поиск по фото",
    kg: "Сүрөт менен издөө",
    en: "Photo search",
  },
  "listings.photoSearch.description": {
    ru: "Сейчас это тестовый режим. Мы показываем объявления, которые могут подойти. Точный визуальный поиск будет улучшен позже.",
    kg: "Бул тесттик режим. Азыр ылайыктуу болушу мүмкүн болгон жарыялар көрсөтүлөт. Так визуалдык издөө кийин жакшыртылат.",
    en: "This is a prototype mode. We are showing listings that may match. Accurate visual search will be improved later.",
  },
  "listings.photoSearch.newSearch": {
    ru: "Новый поиск по фото",
    kg: "Жаңы сүрөт менен издөө",
    en: "New photo search",
  },
  "listings.photoSearch.filterHint": {
    ru: "Фильтры можно использовать вместе с поиском по фото.",
    kg: "Фильтрлерди сүрөт менен издөө менен бирге колдонсо болот.",
    en: "You can use filters together with photo search.",
  },
  "listings.photoSearch.emptyTitle": {
    ru: "Похожие объявления пока не найдены.",
    kg: "Окшош жарыялар азырынча табылган жок.",
    en: "No similar listings found yet.",
  },
  "listings.photoSearch.emptyDescription": {
    ru: "Попробуйте другое фото или откройте все объявления.",
    kg: "Башка сүрөт колдонуп көрүңүз же бардык жарыяларды ачыңыз.",
    en: "Try another photo or open all listings.",
  },
  "listings.photoSearch.openAllListings": {
    ru: "Все объявления",
    kg: "Бардык жарыялар",
    en: "All listings",
  },

  // Listing detail — Phase 56
  "listing.characteristics": {
    ru: "Характеристики",
    kg: "Мүнөздөмөлөр",
    en: "Characteristics",
  },
  "listing.description": { ru: "Описание", kg: "Сүрөттөмө", en: "Description" },
  "listing.noDescription": {
    ru: "Описание не указано",
    kg: "Сүрөттөмө көрсөтүлгөн эмес",
    en: "No description provided",
  },
  "listing.showMore": {
    ru: "Показать полностью",
    kg: "Толугу менен көрсөтүү",
    en: "Show more",
  },
  "listing.showLess": { ru: "Свернуть", kg: "Жыйыштыруу", en: "Show less" },
  "listing.price": { ru: "Цена", kg: "Баасы", en: "Price" },
  "listing.minOrder": { ru: "Мин. партия", kg: "Мин. партия", en: "Min. order" },
  "listing.city": { ru: "Город", kg: "Шаар", en: "City" },
  "listing.brand": { ru: "Бренд", kg: "Бренд", en: "Brand" },
  "listing.moq": { ru: "Мин. партия", kg: "Мин. партия", en: "Min. order" },
  "listing.stock": { ru: "Остаток", kg: "Калдык", en: "In stock" },
  "listing.sendRequest": {
    ru: "Отправить запрос",
    kg: "Сурам жөнөтүү",
    en: "Send request",
  },
  "listing.requestOffer": {
    ru: "Запросить предложение",
    kg: "Сунуш суроо",
    en: "Request an offer",
  },
  "listing.addToFavorites": {
    ru: "Добавить в избранное",
    kg: "Тандалмаларга кошуу",
    en: "Add to favorites",
  },
  "listing.removeFromFavorites": {
    ru: "Убрать из избранного",
    kg: "Тандалмалардан алып салуу",
    en: "Remove from favorites",
  },
  "listing.perUnitPrefix": { ru: "за", kg: "үчүн", en: "per" },
  "listing.signInToSeeContacts": {
    ru: "Войти, чтобы увидеть контакты",
    kg: "Байланыштарды көрүү үчүн кирүү",
    en: "Sign in to see contacts",
  },
  "listing.loginToSeeContacts": {
    ru: "Войти, чтобы увидеть контакты",
    kg: "Байланыштарды көрүү үчүн кирүү",
    en: "Sign in to see contacts",
  },
  "listing.noContactsProvided": {
    ru: "Продавец не указал контакты",
    kg: "Сатуучу байланыш көрсөткөн эмес",
    en: "Seller has not provided contacts",
  },
  "listing.verified": { ru: "Проверен", kg: "Текшерилген", en: "Verified" },
  "listing.listingsCount": { ru: "Объявлений", kg: "Жарыялар", en: "Listings" },
  "listing.seller": { ru: "Продавец", kg: "Сатуучу", en: "Seller" },
  "listing.supplier": { ru: "Поставщик", kg: "Жеткирүүчү", en: "Supplier" },
  "listing.trust": {
    ru: "Доверие к продавцу",
    kg: "Сатуучуга ишеним",
    en: "Seller trust",
  },
  "listing.profileCompleted": {
    ru: "Профиль заполнен",
    kg: "Профиль толтурулган",
    en: "Profile completed",
  },
  "listing.profileIncomplete": {
    ru: "Профиль заполнен не полностью",
    kg: "Профиль толук толтурулган эмес",
    en: "Profile is incomplete",
  },
  "listing.standardProfile": {
    ru: "Обычный профиль",
    kg: "Кадимки профиль",
    en: "Standard profile",
  },
  "listing.phoneVerified": {
    ru: "Телефон подтверждён",
    kg: "Телефон ырасталган",
    en: "Phone verified",
  },
  "listing.activeListings": {
    ru: "Активных объявлений",
    kg: "Активдүү жарыялар",
    en: "Active listings",
  },
  "listing.memberSince": {
    ru: "На платформе с",
    kg: "Платформада",
    en: "On platform since",
  },
  "listing.sellerProfile": {
    ru: "Профиль продавца",
    kg: "Сатуучунун профили",
    en: "Seller profile",
  },
  "listing.direction": { ru: "Направление", kg: "Багыт", en: "Direction" },
  "listing.category": { ru: "Категория", kg: "Категория", en: "Category" },
  "listing.unit": { ru: "Единица", kg: "Бирдик", en: "Unit" },
  "listing.publishedAt": {
    ru: "Дата публикации",
    kg: "Жарыяланган күнү",
    en: "Published at",
  },
  "listing.similarListings": {
    ru: "Похожие объявления",
    kg: "Окшош жарыялар",
    en: "Similar listings",
  },
  "listing.otherSellerListings": {
    ru: "Другие объявления продавца",
    kg: "Сатуучунун башка жарыялары",
    en: "Other seller listings",
  },
  "listing.otherSellerListingsDescription": {
    ru: "Посмотрите ещё предложения этого продавца",
    kg: "Бул сатуучунун башка сунуштарын көрүңүз",
    en: "See more offers from this seller",
  },
  "listing.viewSellerListings": {
    ru: "Все объявления продавца",
    kg: "Сатуучунун бардык жарыялары",
    en: "All seller listings",
  },
  "listing.requestHint": {
    ru: "Перед заявкой уточните минимальную партию, наличие и условия отгрузки.",
    kg: "Сурам жөнөтүүдөн мурун минималдуу партияны, бар-жогун жана жөнөтүү шарттарын тактаңыз.",
    en: "Before sending a request, confirm the minimum order, availability, and delivery terms.",
  },
  "listing.report": { ru: "Пожаловаться", kg: "Даттануу", en: "Report" },

  // Lead form — Phase 56 / 61
  "form.phone": { ru: "Телефон", kg: "Телефон", en: "Phone" },
  "form.email": { ru: "Email", kg: "Email", en: "Email" },
  "form.sending": { ru: "Отправка...", kg: "Жөнөтүлүүдө...", en: "Sending..." },
  "form.sendAnother": {
    ru: "Отправить ещё",
    kg: "Дагы жөнөтүү",
    en: "Send another",
  },
  "form.loginToSendLead": {
    ru: "Войдите, чтобы отправить заявку",
    kg: "Тапшырма жөнөтүү үчүн кирүү",
    en: "Sign in to send a request",
  },
  "form.ownListingLeadNotice": {
    ru: "Это ваше объявление — заявки от клиентов появятся в разделе «Заявки».",
    kg: "Бул сиздин жарыяңыз — кардарлардын тапшырмалары «Тапшырмалар» бөлүмүндө көрүнөт.",
    en: "This is your listing — client requests will appear in the Leads section.",
  },
  "form.goToLeads": { ru: "Перейти к заявкам", kg: "Тапшырмаларга өтүү", en: "Go to leads" },
  "form.leadHint": {
    ru: "Отправьте заявку — продавец увидит её в своём кабинете.",
    kg: "Тапшырма жөнөтүңүз — сатуучу аны өз кабинетинде көрөт.",
    en: "Send a request — the seller will see it in their dashboard.",
  },

  "lead.title": {
    ru: "Запрос продавцу",
    kg: "Сатуучуга сурам",
    en: "Request to seller",
  },
  "lead.description": {
    ru: "Напишите, какое количество вас интересует и уточните условия.",
    kg: "Канча көлөм керек экенин жана шарттарды жазыңыз.",
    en: "Write the quantity you need and ask about the terms.",
  },
  "lead.messageLabel": {
    ru: "Сообщение",
    kg: "Билдирүү",
    en: "Message",
  },
  "lead.messagePlaceholder": {
    ru: "Здравствуйте. Меня интересует это объявление. Подскажите наличие, минимальную партию и условия отгрузки.",
    kg: "Саламатсызбы. Бул жарыя кызыктырат. Бар-жогун, минималдуу партияны жана жөнөтүү шарттарын айтып бериңизчи.",
    en: "Hello. I am interested in this listing. Please tell me the availability, minimum order, and delivery terms.",
  },
  "lead.quantityLabel": {
    ru: "Количество",
    kg: "Саны",
    en: "Quantity",
  },
  "lead.submit": {
    ru: "Отправить",
    kg: "Жөнөтүү",
    en: "Send",
  },
  "lead.sending": {
    ru: "Отправка...",
    kg: "Жөнөтүлүүдө...",
    en: "Sending...",
  },
  "lead.successTitle": {
    ru: "Запрос отправлен продавцу.",
    kg: "Сурам сатуучуга жөнөтүлдү.",
    en: "Request sent to seller.",
  },
  "lead.successDescription": {
    ru: "Продавец увидит вашу заявку в кабинете.",
    kg: "Сатуучу сурамыңызды кабинетинен көрөт.",
    en: "The seller will see your request in their dashboard.",
  },
  "lead.alreadySent": {
    ru: "Вы уже отправляли запрос по этому объявлению.",
    kg: "Бул жарыя боюнча сурам мурун жөнөтүлгөн.",
    en: "You have already sent a request for this listing.",
  },
  "lead.loginRequiredTitle": {
    ru: "Запрос продавцу",
    kg: "Сатуучуга сурам",
    en: "Request to seller",
  },
  "lead.loginRequiredDescription": {
    ru: "Чтобы отправить запрос продавцу, войдите или зарегистрируйтесь.",
    kg: "Сатуучуга сурам жөнөтүү үчүн кириңиз же катталыңыз.",
    en: "Sign in or register to send a request to the seller.",
  },
  "lead.signIn": { ru: "Войти", kg: "Кирүү", en: "Sign in" },
  "lead.register": { ru: "Регистрация", kg: "Катталуу", en: "Register" },
  "lead.validation.messageRequired": {
    ru: "Напишите сообщение продавцу.",
    kg: "Сатуучуга билдирүү жазыңыз.",
    en: "Please write a message to the seller.",
  },
  "lead.validation.messageTooShort": {
    ru: "Сообщение слишком короткое.",
    kg: "Билдирүү өтө кыска.",
    en: "Message is too short.",
  },
  "lead.validation.messageTooLong": {
    ru: "Сообщение слишком длинное.",
    kg: "Билдирүү өтө узун.",
    en: "Message is too long.",
  },
  "lead.validation.quantityInvalid": {
    ru: "Укажите корректное количество.",
    kg: "Туура санды көрсөтүңүз.",
    en: "Enter a valid quantity.",
  },
  "lead.error.generic": {
    ru: "Не удалось отправить запрос. Попробуйте ещё раз.",
    kg: "Сурам жөнөтүлгөн жок. Кайра аракет кылыңыз.",
    en: "Could not send the request. Please try again.",
  },
  "lead.error.ownListing": {
    ru: "Нельзя отправить запрос на своё объявление.",
    kg: "Өз жарыяңызга сурам жөнөтүүгө болбойт.",
    en: "You cannot send a request for your own listing.",
  },
  "lead.error.unavailableListing": {
    ru: "По этому объявлению сейчас нельзя отправить запрос.",
    kg: "Бул жарыя боюнча азыр сурам жөнөтүүгө болбойт.",
    en: "Requests cannot be sent for this listing right now.",
  },
  "lead.close": { ru: "Закрыть", kg: "Жабуу", en: "Close" },
  "lead.continueBrowsing": {
    ru: "Продолжить просмотр",
    kg: "Көрүүнү улантуу",
    en: "Continue browsing",
  },
  "lead.listingLabel": {
    ru: "Объявление",
    kg: "Жарыя",
    en: "Listing",
  },
  "lead.sellerLabel": {
    ru: "Продавец",
    kg: "Сатуучу",
    en: "Seller",
  },
  "lead.minQuantityHint": {
    ru: "Мин.",
    kg: "Мин.",
    en: "Min.",
  },
  "lead.listingUnavailable": {
    ru: "Объявление недоступно",
    kg: "Жарыя жеткиликсиз",
    en: "Listing unavailable",
  },

  "sellerLeads.title": {
    ru: "Заявки покупателей",
    kg: "Сатып алуучулардын сурамдары",
    en: "Buyer requests",
  },
  "sellerLeads.description": {
    ru: "Запросы по вашим объявлениям",
    kg: "Жарыяларыңыз боюнча сурамдар",
    en: "Requests for your listings",
  },
  "sellerLeads.emptyTitle": {
    ru: "Заявок пока нет.",
    kg: "Азырынча сурамдар жок.",
    en: "No requests yet.",
  },
  "sellerLeads.emptyDescription": {
    ru: "Когда покупатель отправит запрос по вашему объявлению, он появится здесь.",
    kg: "Сатып алуучу жарыяңыз боюнча сурам жөнөткөндө, ал ушул жерде көрүнөт.",
    en: "When a buyer sends a request for your listing, it will appear here.",
  },
  "sellerLeads.myListings": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "sellerLeads.addListing": {
    ru: "Добавить объявление",
    kg: "Жарыя кошуу",
    en: "Add listing",
  },
  "sellerLeads.openListing": {
    ru: "Открыть объявление",
    kg: "Жарыяны ачуу",
    en: "Open listing",
  },
  "sellerLeads.unavailableListing": {
    ru: "Объявление недоступно",
    kg: "Жарыя жеткиликсиз",
    en: "Listing unavailable",
  },
  "sellerLeads.buyer": {
    ru: "Покупатель",
    kg: "Сатып алуучу",
    en: "Buyer",
  },
  "sellerLeads.message": {
    ru: "Сообщение",
    kg: "Билдирүү",
    en: "Message",
  },
  "sellerLeads.quantity": {
    ru: "Количество",
    kg: "Саны",
    en: "Quantity",
  },
  "sellerLeads.createdAt": {
    ru: "Дата заявки",
    kg: "Сурамдын датасы",
    en: "Request date",
  },
  "sellerLeads.status": {
    ru: "Статус",
    kg: "Статус",
    en: "Status",
  },
  "sellerLeads.status.new": {
    ru: "Новая",
    kg: "Жаңы",
    en: "New",
  },
  "sellerLeads.status.inProgress": {
    ru: "В обработке",
    kg: "Иштетүүдө",
    en: "In progress",
  },
  "sellerLeads.status.done": {
    ru: "Обработана",
    kg: "Иштетилген",
    en: "Done",
  },
  "sellerLeads.status.closed": {
    ru: "Закрыта",
    kg: "Жабылган",
    en: "Closed",
  },
  "sellerLeads.filters.all": {
    ru: "Все",
    kg: "Баары",
    en: "All",
  },
  "sellerLeads.filters.new": {
    ru: "Новые",
    kg: "Жаңылар",
    en: "New",
  },
  "sellerLeads.filters.inProgress": {
    ru: "В обработке",
    kg: "Иштетүүдө",
    en: "In progress",
  },
  "sellerLeads.filters.done": {
    ru: "Обработанные",
    kg: "Иштетилгендер",
    en: "Done",
  },
  "sellerLeads.filters.closed": {
    ru: "Закрытые",
    kg: "Жабылгандар",
    en: "Closed",
  },
  "sellerLeads.markDone": {
    ru: "Отметить как обработанную",
    kg: "Иштетилди деп белгилөө",
    en: "Mark as done",
  },
  "sellerLeads.marking": {
    ru: "Сохранение...",
    kg: "Сакталууда...",
    en: "Saving...",
  },
  "sellerLeads.allRequests": {
    ru: "Все заявки",
    kg: "Бардык сурамдар",
    en: "All requests",
  },
  "sellerLeads.latestRequests": {
    ru: "Последние заявки",
    kg: "Акыркы сурамдар",
    en: "Latest requests",
  },
  "sellerLeads.newCount": {
    ru: "Новых",
    kg: "Жаңы",
    en: "New",
  },
  "sellerLeads.copyPhone": {
    ru: "Скопировать телефон",
    kg: "Телефонду көчүрүү",
    en: "Copy phone",
  },
  "sellerLeads.phoneCopied": {
    ru: "Телефон скопирован",
    kg: "Телефон көчүрүлдү",
    en: "Phone copied",
  },
  "sellerLeads.whatsapp": {
    ru: "WhatsApp",
    kg: "WhatsApp",
    en: "WhatsApp",
  },
  "sellerLeads.showMore": {
    ru: "Показать полностью",
    kg: "Толугу менен көрсөтүү",
    en: "Show more",
  },
  "sellerLeads.showLess": {
    ru: "Свернуть",
    kg: "Жыйыштыруу",
    en: "Show less",
  },
  "sellerLeads.dashboard": {
    ru: "Кабинет продавца",
    kg: "Сатуучунун кабинети",
    en: "Seller dashboard",
  },
  "sellerLeads.updateError": {
    ru: "Не удалось обновить статус заявки.",
    kg: "Сурамдын статусу жаңыртылган жок.",
    en: "Could not update the request status.",
  },

  // Buyer / seller quick actions — Phase 56
  "quickActions.title": { ru: "Быстрые действия", kg: "Тез аракеттер", en: "Quick actions" },
  "buyer.findProduct": { ru: "Найти товар", kg: "Товар табуу", en: "Find a product" },
  "buyer.findProductHint": {
    ru: "Каталог оптовых предложений",
    kg: "Дүң сунуштардын каталогу",
    en: "Wholesale offers catalog",
  },
  "buyer.favoritesHint": {
    ru: "Сохранённые объявления",
    kg: "Сакталган жарыялар",
    en: "Saved listings",
  },
  "buyer.notificationsHint": {
    ru: "Обновления по заявкам",
    kg: "Тапшырмалар боюнча жаңылыктар",
    en: "Updates on your leads",
  },
  "buyer.myLeads": { ru: "Мои заявки", kg: "Менин тапшырмаларым", en: "My leads" },
  "buyer.myLeadsHint": {
    ru: "Отправленные запросы",
    kg: "Жөнөтүлгөн тапшырмалар",
    en: "Sent requests",
  },
  "seller.createOptListing": {
    ru: "Создать оптовое объявление",
    kg: "Дүң жарыя түзүү",
    en: "Create wholesale listing",
  },
  "seller.createMarketListing": {
    ru: "Создать розничное объявление",
    kg: "Чекене жарыя түзүү",
    en: "Create retail listing",
  },
  "seller.createServicesListing": {
    ru: "Разместить услугу",
    kg: "Кызмат жайгаштыруу",
    en: "Post a service",
  },
  "seller.createCargoListing": {
    ru: "Разместить перевозку",
    kg: "Ташууну жайгаштыруу",
    en: "Post a cargo listing",
  },
  "seller.createNewOfferHint": {
    ru: "Создать новое предложение",
    kg: "Жаңы сунуш түзүү",
    en: "Create a new offer",
  },
  "seller.myListings": { ru: "Мои объявления", kg: "Менин жарыяларым", en: "My listings" },
  "seller.myListingsHint": {
    ru: "Управление и продление",
    kg: "Башкаруу жана узартуу",
    en: "Manage and renew",
  },
  "seller.viewLeads": { ru: "Посмотреть заявки", kg: "Тапшырмаларды көрүү", en: "View leads" },
  "seller.viewLeadsHint": {
    ru: "Ответы покупателей",
    kg: "Сатып алуучулардын жооптору",
    en: "Buyer responses",
  },
  "seller.publicProfile": {
    ru: "Публичный профиль",
    kg: "Ачык профиль",
    en: "Public profile",
  },
  "seller.publicProfileHint": {
    ru: "Как видят покупатели",
    kg: "Сатып алуучулар кандай көрөт",
    en: "How buyers see it",
  },
  "seller.publicProfilePending": {
    ru: "Появится после первого объявления",
    kg: "Биринчи жарыядан кийин чыгат",
    en: "Appears after your first listing",
  },
  "seller.goToCatalog": { ru: "Перейти в каталог", kg: "Каталогго өтүү", en: "Go to catalog" },
  "seller.goToCatalogHint": { ru: "Смотреть рынок", kg: "Рынокту көрүү", en: "View the market" },
  "seller.inDashboardSuffix": {
    ru: "в кабинете",
    kg: "кабинетте",
    en: "in dashboard",
  },

  // Admin nav — Phase 56
  "admin.navAriaLabel": {
    ru: "Админ-навигация",
    kg: "Админ-навигация",
    en: "Admin navigation",
  },
  "admin.overview": { ru: "Обзор", kg: "Обзор", en: "Overview" },
  "admin.moderation": { ru: "Модерация", kg: "Модерация", en: "Moderation" },
  "admin.reports": { ru: "Жалобы", kg: "Даттануулар", en: "Reports" },
  "admin.users": { ru: "Пользователи", kg: "Колдонуучулар", en: "Users" },
  "admin.auditLog": { ru: "Журнал", kg: "Журнал", en: "Audit log" },

  // Auth forms — Phase 56 (extends existing auth.* group)
  "auth.loginTitle": { ru: "Вход", kg: "Кирүү", en: "Sign in" },
  "auth.loginDescription": {
    ru: "Войдите по телефону и паролю или через Google.",
    kg: "Телефон менен же Google аркылуу кириңиз.",
    en: "Sign in with your phone and password, or with Google.",
  },
  "auth.registerTitle": { ru: "Регистрация", kg: "Катталуу", en: "Register" },
  "auth.registerDescription": {
    ru: "Создайте аккаунт по телефону. Альтернатива — вход через Google.",
    kg: "Телефон боюнча аккаунт түзүңүз. Google аркылуу да кирүүгө болот.",
    en: "Create an account with your phone. You can also continue with Google.",
  },
  "auth.phone": { ru: "Телефон", kg: "Телефон", en: "Phone" },
  "auth.password": { ru: "Пароль", kg: "Сырсөз", en: "Password" },
  "auth.rememberMe": { ru: "Запомнить меня", kg: "Мени эстеп кал", en: "Remember me" },
  "auth.forgotPassword": {
    ru: "Забыли пароль?",
    kg: "Сырсөздү унутуп калдыңызбы?",
    en: "Forgot password?",
  },
  "auth.signingIn": { ru: "Вход...", kg: "Кирүү...", en: "Signing in..." },
  "auth.noAccount": { ru: "Нет аккаунта?", kg: "Аккаунтуңуз жокбу?", en: "No account?" },
  "auth.signUp": { ru: "Зарегистрироваться", kg: "Катталуу", en: "Sign up" },
  "auth.haveAccount": {
    ru: "Уже есть аккаунт?",
    kg: "Аккаунтуңуз барбы?",
    en: "Already have an account?",
  },
  "auth.loginSuccess": {
    ru: "Вход выполнен успешно. Перенаправление...",
    kg: "Кирүү ийгиликтүү болду. Багыттоо...",
    en: "Signed in successfully. Redirecting...",
  },
  "auth.loginGenericError": {
    ru: "Не удалось выполнить вход. Попробуйте позже.",
    kg: "Кирүү мүмкүн болбоду. Кийинчерээк аракет кылыңыз.",
    en: "Could not sign in. Please try again later.",
  },
  "auth.registerSuccess": {
    ru: "Регистрация успешна. Перенаправление...",
    kg: "Каттоо ийгиликтүү болду. Багыттоо...",
    en: "Registration successful. Redirecting...",
  },
  "auth.registerGenericError": {
    ru: "Не удалось зарегистрироваться. Попробуйте позже.",
    kg: "Каттоо мүмкүн болбоду. Кийинчерээк аракет кылыңыз.",
    en: "Could not register. Please try again later.",
  },
  "auth.creatingAccount": {
    ru: "Создание аккаунта...",
    kg: "Аккаунт түзүлүүдө...",
    en: "Creating account...",
  },
  "auth.createAccount": { ru: "Создать аккаунт", kg: "Аккаунт түзүү", en: "Create account" },
  "auth.buyerNameLabel": { ru: "Ваше имя", kg: "Атыңыз", en: "Your name" },
  "auth.sellerNameLabel": {
    ru: "Название компании или имя продавца",
    kg: "Компаниянын аты же сатуучунун аты",
    en: "Company name or seller name",
  },
  "auth.sellerNamePlaceholder": {
    ru: "ОсОО «Ваша компания» или ваше имя",
    kg: "«Компанияңыздын аты» же атыңыз",
    en: "Your company name or your name",
  },
  "auth.confirmPhoneRequired": {
    ru: "Подтвердите телефон по коду из SMS",
    kg: "Телефонду SMS коду менен ырастаңыз",
    en: "Confirm your phone with the SMS code",
  },

  // Roles — Phase 56
  "roles.accountType": { ru: "Тип аккаунта", kg: "Аккаунттун түрү", en: "Account type" },
  "roles.buyer": { ru: "Покупатель", kg: "Сатып алуучу", en: "Buyer" },
  "roles.buyerDescription": {
    ru: "Ищу товары и отправляю заявки поставщикам",
    kg: "Товарларды издеп, жеткирүүчүлөргө тапшырма жөнөтөм",
    en: "Looking for products and sending requests to suppliers",
  },
  "roles.seller": { ru: "Продавец", kg: "Сатуучу", en: "Seller" },
  "roles.sellerDescription": {
    ru: "Публикую товары и получаю заявки от покупателей",
    kg: "Товарларды жарыялап, сатып алуучулардан тапшырма алам",
    en: "Publishing products and receiving requests from buyers",
  },

  // Favorites — Phase 56
  "favorites.emptyTitle": {
    ru: "В избранном пока пусто",
    kg: "Тандалмалар азырынча бош",
    en: "Your favorites are empty",
  },
  "favorites.emptyDescription": {
    ru: "Сохраняйте интересные объявления, чтобы быстро вернуться к ним позже.",
    kg: "Кызыктуу жарыяларды сактап коюңуз, кийин тезинен кайтып келүү үчүн.",
    en: "Save listings you like to quickly come back to them later.",
  },
  "favorites.total": { ru: "Всего в избранном", kg: "Тандалмаларда бардыгы", en: "Total favorites" },
  "favorites.lastAdded": {
    ru: "Последнее добавление:",
    kg: "Акыркы кошулган:",
    en: "Last added:",
  },

  // Notifications — Phase 56
  "notifications.allNotifications": {
    ru: "Все уведомления",
    kg: "Бардык билдирмелер",
    en: "All notifications",
  },
  "notifications.last24h": {
    ru: "За 24 часа",
    kg: "24 саат ичинде",
    en: "Last 24 hours",
  },
  "notifications.unread": {
    ru: "Непрочитанные",
    kg: "Окулбагандар",
    en: "Unread",
  },
  "notifications.leads": { ru: "Заявки", kg: "Тапшырмалар", en: "Leads" },
  "notifications.emptyTitle": {
    ru: "Уведомлений пока нет",
    kg: "Азырынча билдирме жок",
    en: "No notifications yet",
  },
  "notifications.emptyDescription": {
    ru: "Здесь будут появляться заявки, статусы модерации и важные события.",
    kg: "Бул жерде тапшырмалар, модерация статустары жана маанилүү окуялар көрүнөт.",
    en: "Leads, moderation statuses, and important events will appear here.",
  },
  "notifications.goToSellerDashboard": {
    ru: "Перейти в кабинет продавца",
    kg: "Сатуучунун кабинетине өтүү",
    en: "Go to seller dashboard",
  },
  "notifications.goToHome": {
    ru: "Перейти на главную",
    kg: "Башкы бетке өтүү",
    en: "Go to homepage",
  },
  "notifications.updating": { ru: "Обновление...", kg: "Жаңыртылууда...", en: "Updating..." },
  "notifications.markAllRead": {
    ru: "Отметить всё прочитанным",
    kg: "Баарын окулган деп белгилөө",
    en: "Mark all as read",
  },
  "notifications.emptyCategory": {
    ru: "В этой категории уведомлений нет.",
    kg: "Бул категорияда билдирме жок.",
    en: "No notifications in this category.",
  },
  "notifications.new": { ru: "Новое", kg: "Жаңы", en: "New" },
  "notifications.from": { ru: "От:", kg: "Дан:", en: "From:" },
  "notifications.open": { ru: "Открыть →", kg: "Ачуу →", en: "Open →" },

  // Listing status — Phase 56
  "status.draft": { ru: "Черновик", kg: "Долбоор", en: "Draft" },
  "status.pendingModeration": {
    ru: "На модерации",
    kg: "Модерацияда",
    en: "Pending moderation",
  },
  "status.published": { ru: "Опубликовано", kg: "Жарыяланды", en: "Published" },
  "status.rejected": { ru: "Отклонено", kg: "Четке кагылды", en: "Rejected" },
  "status.archived": { ru: "В архиве", kg: "Архивде", en: "Archived" },
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
