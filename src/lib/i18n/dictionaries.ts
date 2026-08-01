export type Locale = "ru" | "kg" | "en";

export const DEFAULT_LOCALE: Locale = "ru";

export const DICTIONARY = {
  // Nav
  "nav.opt": { ru: "Опт", kg: "Дүң соода", en: "Wholesale" },
  "nav.market": { ru: "Объявления", kg: "Жарыялар", en: "Listings" },
  "nav.services": { ru: "Услуги", kg: "Кызматтар", en: "Services" },
  "nav.cargo": { ru: "Карго", kg: "Карго", en: "Cargo" },
  "nav.main": { ru: "Основная навигация", kg: "Негизги навигация", en: "Main navigation" },

  // Mobile bottom navigation
  "mobileNav.label": {
    ru: "Мобильная навигация",
    kg: "Мобилдик навигация",
    en: "Mobile navigation",
  },
  "mobileNav.home": { ru: "Главная", kg: "Башкы", en: "Home" },
  "mobileNav.search": { ru: "Поиск", kg: "Издөө", en: "Search" },
  "mobileNav.post": { ru: "Подать", kg: "Жарыя", en: "Post" },
  "mobileNav.favorites": {
    ru: "Избранное",
    kg: "Тандалгандар",
    en: "Favorites",
  },
  "mobileNav.profile": { ru: "Профиль", kg: "Профиль", en: "Profile" },
  "mobileSearch.placeholder": {
    ru: "Что ищем?",
    kg: "Эмне издейбиз?",
    en: "Search",
  },

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
    ru: "Загрузите фото и при желании кратко опишите, что на нём. Это тестовый режим поиска.",
    kg: "Сүрөт жүктөп, кааласаңыз кыскача жазыңыз. Бул издөөнүн тесттик режими.",
    en: "Upload a photo and optionally describe what is on it. This is a prototype search mode.",
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
    ru: "Найти по фото",
    kg: "Сүрөт боюнча издөө",
    en: "Search by photo",
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
    ru: "Это тестовый режим. Сейчас поиск учитывает раздел, наличие фото и текстовые совпадения. Точный визуальный поиск будет добавлен позже.",
    kg: "Бул тесттик режим. Азыр издөө бөлүмдү, сүрөтү бар жарыяларды жана тексттик дал келүүлөрдү эске алат. Так визуалдык издөө кийин кошулат.",
    en: "This is a prototype mode. Search currently uses section, listings with images, and text matches. Accurate visual search will be added later.",
  },
  "search.photo.prototypeModeTitle": {
    ru: "Тестовый режим",
    kg: "Тесттик режим",
    en: "Prototype mode",
  },
  "search.photo.prototypeModeDescription": {
    ru: "Сейчас поиск по фото работает в тестовом режиме: мы используем раздел, текст рядом с поиском и объявления с фотографиями. Полное сравнение изображений будет добавлено отдельным этапом.",
    kg: "Азыр сүрөт боюнча издөө тесттик режимде иштейт: бөлүм, издөө тексти жана сүрөтү бар жарыялар колдонулат. Толук сүрөт салыштыруу кийинки этапта кошулат.",
    en: "Photo search is currently in prototype mode: it uses the section, nearby search text, and listings with photos. Full image similarity will be added in a later phase.",
  },
  "search.photo.whatIsInPhoto": {
    ru: "Что на фото?",
    kg: "Сүрөттө эмне бар?",
    en: "What is in the photo?",
  },
  "search.photo.queryHintPlaceholder": {
    ru: "Например: iPhone, диван, насос, кроссовки...",
    kg: "Мисалы: iPhone, диван, насос, кроссовка...",
    en: "For example: iPhone, sofa, pump, sneakers...",
  },
  "search.photo.queryHintTip": {
    ru: "Добавьте короткое описание фото, чтобы результаты были точнее.",
    kg: "Жыйынтыктар так болушу үчүн сүрөткө кыскача түшүндүрмө кошуңуз.",
    en: "Add a short description of the photo to improve results.",
  },
  "search.photo.hybridResults": {
    ru: "Результаты поиска по фото",
    kg: "Сүрөт боюнча издөө жыйынтыктары",
    en: "Photo search results",
  },
  "search.photo.visualSearchNotEnabled": {
    ru: "Визуальный поиск изображений пока не включён",
    kg: "Сүрөттөрдү визуалдык издөө азырынча өчүк",
    en: "Visual image search is not enabled yet",
  },
  "search.photo.futureVisualSearch": {
    ru: "Точный визуальный поиск будет добавлен отдельным этапом.",
    kg: "Так визуалдык издөө өзүнчө этапта кошулат.",
    en: "Accurate visual search will be added in a later phase.",
  },
  "search.photo.resultsBasedOnTextAndCategory": {
    ru: "Результаты основаны на разделе, тексте и объявлениях с фото.",
    kg: "Жыйынтыктар бөлүмгө, текстке жана сүрөтү бар жарыяларга негизделген.",
    en: "Results are based on section, text matches, and listings with photos.",
  },
  "search.photo.resultsTitle": {
    ru: "Результаты поиска по фото",
    kg: "Сүрөт боюнча издөө жыйынтыктары",
    en: "Photo search results",
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
    ru: "Подходящие объявления пока не найдены.",
    kg: "Ылайыктуу жарыялар азырынча табылган жок.",
    en: "No matching listings found yet.",
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
  "home.mobileTitle": {
    ru: "ВсеТут — объявления, услуги, опт и карго",
    kg: "ВсеТут — жарыялар, кызматтар, дүң соода жана карго",
    en: "VseTut — listings, services, wholesale and cargo",
  },
  "home.mobileSubtitle": {
    ru: "Найдите товары, специалистов, поставщиков и доставку в одном месте.",
    kg: "Товарларды, адистерди, жеткирүүчүлөрдү жана доставканы бир жерден табыңыз.",
    en: "Find goods, specialists, suppliers and delivery in one place.",
  },
  "home.searchPlaceholder": {
    ru: "Что ищете?",
    kg: "Эмне издейсиз?",
    en: "What are you looking for?",
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
  "home.marketShort": {
    ru: "Товары рядом",
    kg: "Жакын товарлар",
    en: "Local goods",
  },
  "home.servicesShort": {
    ru: "Специалисты",
    kg: "Адистер",
    en: "Specialists",
  },
  "home.optShort": {
    ru: "Для бизнеса",
    kg: "Бизнес үчүн",
    en: "For business",
  },
  "home.cargoShort": {
    ru: "Доставка",
    kg: "Жеткирүү",
    en: "Delivery",
  },
  "home.showcase": { ru: "Витрина", kg: "Витрина", en: "Showcase" },
  "home.newListings": {
    ru: "Новые объявления",
    kg: "Жаңы жарыялар",
    en: "New listings",
  },
  "home.latestListings": {
    ru: "Новые объявления",
    kg: "Жаңы жарыялар",
    en: "New listings",
  },
  "home.popularMarket": {
    ru: "Популярное в объявлениях",
    kg: "Жарыялардагы популярдуу",
    en: "Popular in listings",
  },
  "home.wholesaleOffers": {
    ru: "Оптовые предложения",
    kg: "Дүң сунуштар",
    en: "Wholesale offers",
  },
  "home.services": {
    ru: "Услуги",
    kg: "Кызматтар",
    en: "Services",
  },
  "home.cargo": {
    ru: "Карго и доставка",
    kg: "Карго жана жеткирүү",
    en: "Cargo and delivery",
  },
  "home.sectionMarketDesc": {
    ru: "Свежие товары и предложения в разделе объявлений",
    kg: "Жарыялар бөлүмүндөгү жаңы товарлар жана сунуштар",
    en: "Fresh goods and offers in the listings section",
  },
  "home.sectionOptDesc": {
    ru: "Поставщики и оптовые партии",
    kg: "Жеткирүүчүлөр жана дүң партиялар",
    en: "Suppliers and wholesale batches",
  },
  "home.sectionServicesDesc": {
    ru: "Специалисты и компании рядом",
    kg: "Жакынкы адистер жана компаниялар",
    en: "Specialists and companies nearby",
  },
  "home.sectionCargoDesc": {
    ru: "Перевозки, логистика и доставка",
    kg: "Ташуу, логистика жана жеткирүү",
    en: "Freight, logistics, and delivery",
  },
  "home.viewAll": { ru: "Смотреть все", kg: "Баарын көрүү", en: "View all" },
  "home.postListing": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post a listing",
  },
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
  "home.emptySectionTitle": {
    ru: "В этом разделе пока тихо",
    kg: "Бул бөлүмдө азырынча тынч",
    en: "This section is quiet for now",
  },
  "home.emptySectionDescription": {
    ru: "Выберите категорию или разместите первое объявление.",
    kg: "Категорияны тандаңыз же биринчи жарыяны жайгаштырыңыз.",
    en: "Pick a category or post the first listing.",
  },
  "home.emptyListingsTitle": {
    ru: "Пока нет объявлений",
    kg: "Азырынча жарыялар жок",
    en: "No listings yet",
  },
  "home.emptyListingsDescription": {
    ru: "Станьте первым — разместите объявление бесплатно.",
    kg: "Биринчи болуңуз — жарыяны акысыз жайгаштырыңыз.",
    en: "Be the first — post a listing for free.",
  },
  "home.trendingSearches": {
    ru: "Сейчас ищут",
    kg: "Азыр издешет",
    en: "Trending searches",
  },
  "home.whyVsetut": {
    ru: "Почему ВсеТут",
    kg: "Эмне үчүн ВсеТут",
    en: "Why VseTut",
  },
  "home.why.allInOne.title": {
    ru: "Разные разделы в одном месте",
    kg: "Ар кандай бөлүмдөр бир жерде",
    en: "Different sections in one place",
  },
  "home.why.allInOne.description": {
    ru: "Объявления, услуги, опт и карго — без лишних сайтов.",
    kg: "Жарыялар, кызматтар, дүң жана карго — кошумча сайттарсыз.",
    en: "Listings, services, wholesale, and cargo — without extra sites.",
  },
  "home.why.fastSearch.title": {
    ru: "Быстрый поиск по сайту",
    kg: "Сайт боюнча тез издөө",
    en: "Fast site-wide search",
  },
  "home.why.fastSearch.description": {
    ru: "Найдите нужное по запросу, разделу или категории.",
    kg: "Сурам, бөлүм же категория боюнча керектүүнү табыңыз.",
    en: "Find what you need by query, section, or category.",
  },
  "home.why.directRequests.title": {
    ru: "Прямые заявки продавцам",
    kg: "Сатуучуларга түз сурамдар",
    en: "Direct requests to sellers",
  },
  "home.why.directRequests.description": {
    ru: "Напишите продавцу прямо со страницы объявления.",
    kg: "Жарыя барагынан сатуучуга түз жазыңыз.",
    en: "Message the seller directly from the listing page.",
  },
  "home.why.localMarket.title": {
    ru: "Локальный рынок",
    kg: "Жергиликтүү базар",
    en: "Local marketplace",
  },
  "home.why.localMarket.description": {
    ru: "Объявления и предложения из Кыргызстана.",
    kg: "Кыргызстандагы жарыялар жана сунуштар.",
    en: "Listings and offers from Kyrgyzstan.",
  },
  "home.sellerCtaTitle": {
    ru: "Продаёте товары или услуги?",
    kg: "Товар же кызмат сатасызбы?",
    en: "Do you sell goods or services?",
  },
  "home.sellerCtaDescription": {
    ru: "Разместите объявление и получайте заявки от покупателей.",
    kg: "Жарыя жайгаштырып, сатып алуучулардын сурамдарын алыңыз.",
    en: "Post a listing and receive requests from buyers.",
  },
  "home.trend.equipment": { ru: "оборудование", kg: "жабдуулар", en: "equipment" },
  "home.trend.furniture": { ru: "мебель", kg: "эмерек", en: "furniture" },
  "home.trend.chinaDelivery": {
    ru: "доставка из Китая",
    kg: "Кытайдан жеткирүү",
    en: "China delivery",
  },
  "home.trend.wholesaleClothing": {
    ru: "одежда оптом",
    kg: "кийим дүңүнөн",
    en: "wholesale clothing",
  },
  "home.trend.repair": { ru: "ремонт", kg: "оңдоо", en: "repair" },
  "home.trend.electronics": {
    ru: "электроника",
    kg: "электроника",
    en: "electronics",
  },
  "home.trend.buildingMaterials": {
    ru: "стройматериалы",
    kg: "курулуш материалдары",
    en: "building materials",
  },
  "home.trend.packaging": { ru: "упаковка", kg: "таңгак", en: "packaging" },

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

  // Cargo requests — Phase 72
  "cargo.addCompanyTitle": {
    ru: "Вы карго-компания?",
    kg: "Сиз карго компаниясызбы?",
    en: "Are you a cargo company?",
  },
  "cargo.addCompanyDescription": {
    ru: "Разместите карточку карго-компании — это не заявка на перевозку.",
    kg: "Карго компаниянын карточкасын жайгаштырыңыз — бул жеткирүү сурамы эмес.",
    en: "Publish a cargo company card — this is not a shipping request.",
  },
  "cargo.addCompanyButton": {
    ru: "Добавить карго-компанию",
    kg: "Карго компания кошуу",
    en: "Add cargo company",
  },
  "cargo.companySubmitted": {
    ru: "Карго-компания отправлена на модерацию.",
    kg: "Карго компания модерацияга жөнөтүлдү.",
    en: "Cargo company submitted for moderation.",
  },
  "cargo.companyEmptyTitle": {
    ru: "Карго-компании пока не добавлены.",
    kg: "Карго компаниялар азырынча кошула элек.",
    en: "No cargo companies have been added yet.",
  },
  "cargo.companyEmptyDescription": {
    ru: "Станьте первым поставщиком карго-услуг на сайте.",
    kg: "Сайттагы биринчи карго кызмат көрсөтүүчү болуңуз.",
    en: "Become the first cargo service provider on the site.",
  },
  "cargo.form.companyName": {
    ru: "Название карго-компании или услуги",
    kg: "Карго компаниянын же кызматтын аталышы",
    en: "Cargo company or service name",
  },
  "cargo.form.companyDescription": {
    ru: "Опишите направления, сроки, условия доставки и способы связи через заявку.",
    kg: "Багыттарды, мөөнөттөрдү, жеткирүү шарттарын жана сурам аркылуу байланышуу жолун жазыңыз.",
    en: "Describe routes, timing, delivery terms and how customers can contact you through a request.",
  },
  "cargo.form.servicePrice": {
    ru: "Стоимость услуги, если есть",
    kg: "Кызмат баасы, эгер болсо",
    en: "Service price, if available",
  },
  "cargo.form.serviceType": {
    ru: "Тип карго-услуги",
    kg: "Карго кызмат түрү",
    en: "Cargo service type",
  },
  "cargo.form.cityOffice": {
    ru: "Город / офис",
    kg: "Шаар / офис",
    en: "City / office",
  },
  "cargo.categories.deliveryFromChina": {
    ru: "Доставка из Китая",
    kg: "Кытайдан жеткирүү",
    en: "Delivery from China",
  },
  "cargo.categories.deliveryKyrgyzstan": {
    ru: "Доставка по Кыргызстану",
    kg: "Кыргызстан боюнча жеткирүү",
    en: "Delivery across Kyrgyzstan",
  },
  "cargo.categories.internationalDelivery": {
    ru: "Международная доставка",
    kg: "Эл аралык жеткирүү",
    en: "International delivery",
  },
  "cargo.categories.roadFreight": {
    ru: "Автоперевозки",
    kg: "Авто жеткирүү",
    en: "Road freight",
  },
  "cargo.categories.airFreight": {
    ru: "Авиадоставка",
    kg: "Аба аркылуу жеткирүү",
    en: "Air freight",
  },
  "cargo.categories.railFreight": {
    ru: "Железнодорожная доставка",
    kg: "Темир жол аркылуу жеткирүү",
    en: "Rail freight",
  },
  "cargo.categories.warehousing": {
    ru: "Складские услуги",
    kg: "Кампа кызматтары",
    en: "Warehousing",
  },
  "cargo.categories.customsClearance": {
    ru: "Таможенное оформление",
    kg: "Бажы жол-жоболоштуруу",
    en: "Customs clearance",
  },
  "cargo.categories.other": {
    ru: "Другое",
    kg: "Башка",
    en: "Other",
  },

  "cargo.heroTitle": {
    ru: "Карго и доставка из Китая, Кыргызстана и других направлений",
    kg: "Кытайдан, Кыргызстандан жана башка багыттардан карго жана жеткирүү",
    en: "Cargo and delivery from China, Kyrgyzstan and other routes",
  },
  "cargo.heroSubtitle": {
    ru: "Опишите товар, маршрут и контакты — карго-компании смогут увидеть вашу заявку.",
    kg: "Товарды, маршрутту жана байланыштарды жазыңыз — карго компаниялар сурамыңызды көрө алышат.",
    en: "Describe the item, route and contacts — cargo companies will be able to see your request.",
  },
  "cargo.requestTitle": {
    ru: "Оставить заявку на перевозку",
    kg: "Жеткирүүгө сурам калтыруу",
    en: "Submit a shipping request",
  },
  "cargo.requestDescription": {
    ru: "Опишите товар и маршрут. Карго-компании смогут увидеть заявку и связаться с вами.",
    kg: "Товарды жана маршрутту жазыңыз. Карго компаниялар сурамыңызды көрүп, сиз менен байланышат.",
    en: "Describe the item and route. Cargo companies will be able to see the request and contact you.",
  },
  "cargo.contactSection": {
    ru: "Контакты",
    kg: "Байланыштар",
    en: "Contacts",
  },
  "cargo.routeSection": {
    ru: "Маршрут",
    kg: "Маршрут",
    en: "Route",
  },
  "cargo.itemSection": {
    ru: "Товар",
    kg: "Товар",
    en: "Item",
  },
  "cargo.commentSection": {
    ru: "Комментарий",
    kg: "Комментарий",
    en: "Comment",
  },
  "cargo.name": {
    ru: "Ваше имя",
    kg: "Атыңыз",
    en: "Your name",
  },
  "cargo.phone": {
    ru: "Телефон",
    kg: "Телефон",
    en: "Phone",
  },
  "cargo.company": {
    ru: "Компания, если есть",
    kg: "Компания, бар болсо",
    en: "Company, if any",
  },
  "cargo.fromLocation": {
    ru: "Откуда",
    kg: "Кайдан",
    en: "From",
  },
  "cargo.toLocation": {
    ru: "Куда",
    kg: "Каяка",
    en: "To",
  },
  "cargo.itemName": {
    ru: "Что нужно перевезти?",
    kg: "Эмнени ташуу керек?",
    en: "What needs to be shipped?",
  },
  "cargo.itemPhoto": {
    ru: "Фото товара",
    kg: "Товардын сүрөтү",
    en: "Item photo",
  },
  "cargo.weight": {
    ru: "Вес",
    kg: "Салмак",
    en: "Weight",
  },
  "cargo.dimensions": {
    ru: "Габариты",
    kg: "Өлчөмдөр",
    en: "Dimensions",
  },
  "cargo.quantity": {
    ru: "Количество мест",
    kg: "Орундардын саны",
    en: "Number of pieces",
  },
  "cargo.urgency": {
    ru: "Срочность",
    kg: "Шашылыштык",
    en: "Urgency",
  },
  "cargo.comment": {
    ru: "Комментарий / дополнительные условия",
    kg: "Комментарий / кошумча шарттар",
    en: "Comment / additional conditions",
  },
  "cargo.submitRequest": {
    ru: "Отправить заявку",
    kg: "Сурамды жөнөтүү",
    en: "Submit request",
  },
  "cargo.submitting": {
    ru: "Отправка…",
    kg: "Жөнөтүлүүдө…",
    en: "Submitting…",
  },
  "cargo.successTitle": {
    ru: "Заявка отправлена",
    kg: "Сурам жөнөтүлдү",
    en: "Request submitted",
  },
  "cargo.successDescription": {
    ru: "Заявка отправлена. Карго-компании смогут увидеть её и связаться с вами.",
    kg: "Сурам жөнөтүлдү. Карго компаниялар аны көрүп, сиз менен байланышат.",
    en: "Request submitted. Cargo companies will be able to see it and contact you.",
  },
  "cargo.requestsTitle": {
    ru: "Последние заявки на перевозку",
    kg: "Жеткирүүгө акыркы сурамдар",
    en: "Recent shipping requests",
  },
  "cargo.requestsPublicHint": {
    ru: "Контакты скрыты. Полные данные видят карго-компании и администраторы.",
    kg: "Байланыштар жашырылган. Толук маалыматты карго компаниялар жана админдер көрөт.",
    en: "Contacts are hidden. Full details are visible to cargo companies and admins.",
  },
  "cargo.companiesTitle": {
    ru: "Карго-компании",
    kg: "Карго компаниялар",
    en: "Cargo companies",
  },
  "cargo.noCompaniesTitle": {
    ru: "Карго-компании пока не добавлены.",
    kg: "Карго компаниялар азырынча кошула элек.",
    en: "No cargo companies have been added yet.",
  },
  "cargo.noCompaniesDescription": {
    ru: "Вы можете оставить заявку, и мы покажем её в разделе карго.",
    kg: "Сурам калтырсаңыз, ал карго бөлүмүндө көрсөтүлөт.",
    en: "You can submit a request and it will appear in the cargo section.",
  },
  "cargo.validation.nameRequired": {
    ru: "Укажите имя",
    kg: "Атыңызды жазыңыз",
    en: "Name is required",
  },
  "cargo.validation.phoneRequired": {
    ru: "Укажите телефон",
    kg: "Телефонду жазыңыз",
    en: "Phone is required",
  },
  "cargo.validation.fromRequired": {
    ru: "Укажите откуда",
    kg: "Кайдан экенин жазыңыз",
    en: "From location is required",
  },
  "cargo.validation.toRequired": {
    ru: "Укажите куда",
    kg: "Каяка экенин жазыңыз",
    en: "To location is required",
  },
  "cargo.validation.itemRequired": {
    ru: "Укажите, что нужно перевезти",
    kg: "Эмнени ташуу керектигин жазыңыз",
    en: "Item description is required",
  },
  "cargo.status.new": {
    ru: "Новая",
    kg: "Жаңы",
    en: "New",
  },
  "cargo.status.inReview": {
    ru: "На рассмотрении",
    kg: "Каралууда",
    en: "In review",
  },
  "cargo.status.contacted": {
    ru: "Связались",
    kg: "Байланышты",
    en: "Contacted",
  },
  "cargo.status.closed": {
    ru: "Закрыта",
    kg: "Жабылды",
    en: "Closed",
  },
  "cargo.submitError": {
    ru: "Не удалось отправить заявку. Попробуйте ещё раз.",
    kg: "Сурамды жөнөтүү мүмкүн болбоду. Кайра аракет кылыңыз.",
    en: "Could not submit the request. Please try again.",
  },
  "cargo.uploadError": {
    ru: "Не удалось загрузить фото",
    kg: "Сүрөттү жүктөө мүмкүн болбоду",
    en: "Could not upload the photo",
  },
  "cargo.uploading": {
    ru: "Загрузка фото…",
    kg: "Сүрөт жүктөлүүдө…",
    en: "Uploading photo…",
  },
  "cargo.removePhoto": {
    ru: "Удалить",
    kg: "Өчүрүү",
    en: "Remove",
  },
  "cargo.sellerEmptyTitle": {
    ru: "Пока нет карго-заявок",
    kg: "Азырынча карго сурамдар жок",
    en: "No cargo requests yet",
  },
  "cargo.sellerEmptyDescription": {
    ru: "Когда клиенты оставят заявку на /cargo, она появится здесь.",
    kg: "Кардарлар /cargo бетинде сурам калтырганда, ал бул жерде көрүнөт.",
    en: "When customers submit a request on /cargo, it will appear here.",
  },
  "cargo.contactsRestricted": {
    ru: "Телефон клиента скрыт. Сначала откликнитесь через систему — полный контакт видит администратор.",
    kg: "Кардардын телефону жашырылган. Адегенде система аркылуу жооп бериңиз — толук байланышты администратор көрөт.",
    en: "Client phone is hidden. Respond through the system first — full contact is visible to admins.",
  },
  "seller.viewCargoRequests": {
    ru: "Карго-заявки",
    kg: "Карго сурамдар",
    en: "Cargo requests",
  },
  "seller.viewCargoRequestsHint": {
    ru: "Запросы на перевозку",
    kg: "Жеткирүү сурамдары",
    en: "Shipping requests",
  },

  "cargo.howItWorksTitle": {
    ru: "Как это работает",
    kg: "Бул кантип иштейт",
    en: "How it works",
  },
  "cargo.howItWorks.step1.title": {
    ru: "Опишите товар",
    kg: "Товарды сүрөттөңүз",
    en: "Describe the item",
  },
  "cargo.howItWorks.step1.description": {
    ru: "Укажите, что нужно перевезти, вес, габариты и фото.",
    kg: "Эмнени ташуу керектигин, салмакты, өлчөмдөрдү жана сүрөттү жазыңыз.",
    en: "Tell what needs shipping, weight, dimensions and photo.",
  },
  "cargo.howItWorks.step2.title": {
    ru: "Укажите маршрут и контакты",
    kg: "Маршрутту жана байланыштарды жазыңыз",
    en: "Add route and contacts",
  },
  "cargo.howItWorks.step2.description": {
    ru: "Откуда и куда везти, имя и телефон для связи.",
    kg: "Кайдан жана каяка ташуу, байланыш үчүн ат жана телефон.",
    en: "From and to locations, plus name and phone.",
  },
  "cargo.howItWorks.step3.title": {
    ru: "Карго-компании увидят заявку",
    kg: "Карго компаниялар сурамды көрүшөт",
    en: "Cargo companies see the request",
  },
  "cargo.howItWorks.step3.description": {
    ru: "Заявка появляется на доске карго-заявок.",
    kg: "Сурам карго сурамдар тактасында көрүнөт.",
    en: "The request appears on the cargo request board.",
  },
  "cargo.howItWorks.step4.title": {
    ru: "Получите отклики",
    kg: "Жоопторду алыңыз",
    en: "Get responses",
  },
  "cargo.howItWorks.step4.description": {
    ru: "Компании предложат цену, срок и условия.",
    kg: "Компаниялар бааны, мөөнөттү жана шарттарды сунушташат.",
    en: "Companies offer price, timing and terms.",
  },
  "cargo.latestRequestsTitle": {
    ru: "Последние заявки",
    kg: "Акыркы сурамдар",
    en: "Latest requests",
  },
  "cargo.publicRequestNotice": {
    ru: "Контакты скрыты. Полные данные видят карго-компании после отклика и администраторы.",
    kg: "Байланыштар жашырылган. Толук маалыматты жооп бергенден кийин карго компаниялар жана админдер көрөт.",
    en: "Contacts are hidden. Full details are visible to admins and after system responses.",
  },
  "cargo.respond": {
    ru: "Откликнуться",
    kg: "Жооп берүү",
    en: "Respond",
  },
  "cargo.responseTitle": {
    ru: "Отклик на заявку",
    kg: "Сурамга жооп",
    en: "Respond to request",
  },
  "cargo.responseDescription": {
    ru: "Укажите цену, срок и условия. Клиент или администратор сможет увидеть ваш отклик.",
    kg: "Бааны, мөөнөттү жана шарттарды көрсөтүңүз. Кардар же администратор жообуңузду көрө алат.",
    en: "Enter the price, timing and terms. The client or admin will be able to see your response.",
  },
  "cargo.responsePrice": {
    ru: "Цена / ориентировочная цена",
    kg: "Баа / болжолдуу баа",
    en: "Price / estimate",
  },
  "cargo.responseCurrency": {
    ru: "Валюта",
    kg: "Валюта",
    en: "Currency",
  },
  "cargo.responseEstimatedTime": {
    ru: "Срок доставки / забора",
    kg: "Жеткирүү / алуу мөөнөтү",
    en: "Delivery / pickup timing",
  },
  "cargo.responseComment": {
    ru: "Комментарий",
    kg: "Комментарий",
    en: "Comment",
  },
  "cargo.responseContactName": {
    ru: "Контактное лицо",
    kg: "Байланыш адамы",
    en: "Contact person",
  },
  "cargo.responseContactPhone": {
    ru: "Телефон для связи",
    kg: "Байланыш телефону",
    en: "Contact phone",
  },
  "cargo.sendResponse": {
    ru: "Отправить отклик",
    kg: "Жоопту жөнөтүү",
    en: "Send response",
  },
  "cargo.responseSent": {
    ru: "Отклик отправлен",
    kg: "Жооп жөнөтүлдү",
    en: "Response sent",
  },
  "cargo.alreadyResponded": {
    ru: "Вы уже откликались на эту заявку.",
    kg: "Бул сурамга мурун жооп бергенсиз.",
    en: "You have already responded to this request.",
  },
  "cargo.requestClosed": {
    ru: "Заявка закрыта, отклик недоступен.",
    kg: "Сурам жабылган, жооп берүү мүмкүн эмес.",
    en: "This request is closed; responses are unavailable.",
  },
  "cargo.myResponses": {
    ru: "Ваш отклик",
    kg: "Сиздин жообуңуз",
    en: "Your response",
  },
  "cargo.responses": {
    ru: "Отклики",
    kg: "Жооптор",
    en: "Responses",
  },
  "cargo.responsesCount": {
    ru: "Откликов: {count}",
    kg: "Жооптор: {count}",
    en: "Responses: {count}",
  },
  "cargo.admin.title": {
    ru: "Карго-заявки",
    kg: "Карго сурамдар",
    en: "Cargo requests",
  },
  "cargo.admin.requests": {
    ru: "Заявки",
    kg: "Сурамдар",
    en: "Requests",
  },
  "cargo.admin.responses": {
    ru: "Отклики",
    kg: "Жооптор",
    en: "Responses",
  },
  "cargo.admin.status": {
    ru: "Статус",
    kg: "Статус",
    en: "Status",
  },
  "cargo.admin.changeStatus": {
    ru: "Изменить статус",
    kg: "Статусту өзгөртүү",
    en: "Change status",
  },
  "cargo.admin.clientContact": {
    ru: "Контакт клиента",
    kg: "Кардардын байланышы",
    en: "Client contact",
  },
  "cargo.seller.requestsTitle": {
    ru: "Доска карго-заявок",
    kg: "Карго сурамдар тактасы",
    en: "Cargo request board",
  },
  "cargo.seller.requestsDescription": {
    ru: "Новые заявки на перевозку — откликнитесь через систему.",
    kg: "Жеткирүүгө жаңы сурамдар — система аркылуу жооп бериңиз.",
    en: "New shipping requests — respond through the system.",
  },
  "cargo.seller.noRequests": {
    ru: "Пока нет карго-заявок",
    kg: "Азырынча карго сурамдар жок",
    en: "No cargo requests yet",
  },
  "cargo.seller.respondToRequest": {
    ru: "Откликнуться",
    kg: "Жооп берүү",
    en: "Respond",
  },
  "cargo.subscription.title": {
    ru: "Уведомления о новых карго-заявках",
    kg: "Жаңы карго сурамдар жөнүндө билдирмелер",
    en: "Notifications for new cargo requests",
  },
  "cargo.subscription.activeDescription": {
    ru: "Вы подписаны: новые заявки появятся в уведомлениях на сайте.",
    kg: "Сиз жазылгансыз: жаңы сурамдар сайттагы билдирмелерде көрүнөт.",
    en: "You are subscribed: new requests will appear in site notifications.",
  },
  "cargo.subscription.inactiveDescription": {
    ru: "Подпишитесь, чтобы сразу видеть новые заявки на перевозку в уведомлениях.",
    kg: "Жеткирүүгө жаңы сурамдарды билдирмелерден дароо көрүү үчүн жазылыңыз.",
    en: "Subscribe to see new shipping requests in notifications right away.",
  },
  "cargo.subscription.subscribe": {
    ru: "Подписаться",
    kg: "Жазылуу",
    en: "Subscribe",
  },
  "cargo.subscription.unsubscribe": {
    ru: "Отписаться",
    kg: "Жазылууну токтотуу",
    en: "Unsubscribe",
  },
  "cargo.subscription.saving": {
    ru: "Сохранение…",
    kg: "Сакталууда…",
    en: "Saving…",
  },
  "cargo.subscription.error": {
    ru: "Не удалось изменить подписку",
    kg: "Жазылууну өзгөртүү мүмкүн болбоду",
    en: "Could not update subscription",
  },
  "cargo.settings.title": {
    ru: "Настройки карго-заявок",
    kg: "Карго сурамдарынын жөндөөлөрү",
    en: "Cargo request settings",
  },
  "cargo.settings.description": {
    ru: "Выберите, какие заявки на перевозку вы хотите получать.",
    kg: "Кайсы жеткирүү сурамдарын алгыңыз келерин тандаңыз.",
    en: "Choose which shipping requests you want to receive.",
  },
  "cargo.settings.enabled": {
    ru: "Получать заявки",
    kg: "Сурамдарды алуу",
    en: "Receive requests",
  },
  "cargo.settings.serviceTypes": {
    ru: "Типы услуг",
    kg: "Кызмат түрлөрү",
    en: "Service types",
  },
  "cargo.settings.directions": {
    ru: "Направления",
    kg: "Багыттар",
    en: "Routes",
  },
  "cargo.settings.fromLocations": {
    ru: "Города / точки отправления",
    kg: "Жөнөтүү шаарлары / чекиттери",
    en: "From locations",
  },
  "cargo.settings.toLocations": {
    ru: "Города / точки назначения",
    kg: "Жеткирүү шаарлары / чекиттери",
    en: "To locations",
  },
  "cargo.settings.notifyInApp": {
    ru: "Уведомления внутри сайта",
    kg: "Сайт ичиндеги билдирмелер",
    en: "In-app notifications",
  },
  "cargo.settings.notifyEmail": {
    ru: "Email-уведомления (скоро)",
    kg: "Email билдирмелери (жакында)",
    en: "Email notifications (soon)",
  },
  "cargo.settings.notifyTelegram": {
    ru: "Telegram-уведомления",
    kg: "Telegram билдирмелери",
    en: "Telegram notifications",
  },
  "cargo.settings.notifyWhatsApp": {
    ru: "WhatsApp-уведомления (скоро)",
    kg: "WhatsApp билдирмелери (жакында)",
    en: "WhatsApp notifications (soon)",
  },
  "cargo.telegram.title": {
    ru: "Telegram-уведомления",
    kg: "Telegram билдирмелери",
    en: "Telegram notifications",
  },
  "cargo.telegram.description": {
    ru: "Получайте новые подходящие карго-заявки в Telegram.",
    kg: "Жаңы ылайыктуу карго сурамдарын Telegram аркылуу алыңыз.",
    en: "Receive matching cargo requests in Telegram.",
  },
  "cargo.telegram.chatId": {
    ru: "Telegram Chat ID",
    kg: "Telegram Chat ID",
    en: "Telegram Chat ID",
  },
  "cargo.telegram.username": {
    ru: "Telegram username (необязательно)",
    kg: "Telegram username (милдеттүү эмес)",
    en: "Telegram username (optional)",
  },
  "cargo.telegram.enable": {
    ru: "Включить Telegram-уведомления",
    kg: "Telegram билдирмелерин иштетүү",
    en: "Enable Telegram notifications",
  },
  "cargo.telegram.saveHint": {
    ru: "Ручной режим: укажите Chat ID, если бот-ссылка недоступна.",
    kg: "Кол режим: бот шилтемеси жок болсо Chat ID киргизиңиз.",
    en: "Manual mode: enter Chat ID if the bot link is unavailable.",
  },
  "cargo.telegram.chatIdRequired": {
    ru: "Укажите Telegram Chat ID, чтобы включить уведомления.",
    kg: "Билдирмелерди иштетүү үчүн Telegram Chat ID киргизиңиз.",
    en: "Enter a Telegram Chat ID to enable notifications.",
  },
  "cargo.telegram.connectButton": {
    ru: "Подключить Telegram",
    kg: "Telegramды туташтыруу",
    en: "Connect Telegram",
  },
  "cargo.telegram.openBot": {
    ru: "Открыть Telegram bot",
    kg: "Telegram ботту ачуу",
    en: "Open Telegram bot",
  },
  "cargo.telegram.copyLink": {
    ru: "Скопировать ссылку",
    kg: "Шилтемени көчүрүү",
    en: "Copy link",
  },
  "cargo.telegram.linkCopied": {
    ru: "Ссылка скопирована",
    kg: "Шилтеме көчүрүлдү",
    en: "Link copied",
  },
  "cargo.telegram.linkCreated": {
    ru: "Ссылка создана. Откройте бота и нажмите Start.",
    kg: "Шилтеме түзүлдү. Ботту ачып, Start басыңыз.",
    en: "Link created. Open the bot and press Start.",
  },
  "cargo.telegram.linkExpired": {
    ru: "Ссылка устарела. Создайте новую в настройках.",
    kg: "Шилтеменин мөөнөтү өттү. Жөндөөлөрдөн жаңысын түзүңүз.",
    en: "Link expired. Create a new one in settings.",
  },
  "cargo.telegram.connected": {
    ru: "Telegram подключён",
    kg: "Telegram туташтырылды",
    en: "Telegram connected",
  },
  "cargo.telegram.disconnected": {
    ru: "Telegram отключён",
    kg: "Telegram өчүрүлдү",
    en: "Telegram disconnected",
  },
  "cargo.telegram.disconnect": {
    ru: "Отключить Telegram",
    kg: "Telegramды өчүрүү",
    en: "Disconnect Telegram",
  },
  "cargo.telegram.manualMode": {
    ru: "Ручной ввод Chat ID",
    kg: "Chat ID кол менен киргизүү",
    en: "Enter Chat ID manually",
  },
  "cargo.telegram.connectInstruction": {
    ru: "Откройте бота и нажмите Start.",
    kg: "Ботту ачып, Start басыңыз.",
    en: "Open the bot and press Start.",
  },
  "cargo.telegram.botUsernameMissing": {
    ru: "Telegram bot username не настроен на сервере.",
    kg: "Telegram bot username серверде жөндөлгөн эмес.",
    en: "Telegram bot username is not configured on the server.",
  },
  "cargo.telegram.connectFailed": {
    ru: "Не удалось подключить Telegram",
    kg: "Telegramды туташтыруу мүмкүн болбоду",
    en: "Could not connect Telegram",
  },
  "cargo.telegram.webhookConnectedMessage": {
    ru: "Telegram подключён. Теперь вы будете получать подходящие карго-заявки.",
    kg: "Telegram туташтырылды. Эми ылайыктуу карго сурамдарын аласыз.",
    en: "Telegram connected. You will now receive matching cargo requests.",
  },
  "cargo.telegram.statusEnabled": {
    ru: "Telegram подключён",
    kg: "Telegram туташтырылды",
    en: "Telegram connected",
  },
  "cargo.telegram.statusDisabled": {
    ru: "Telegram выключен",
    kg: "Telegram өчүрүлгөн",
    en: "Telegram disabled",
  },
  "cargo.telegram.testButton": {
    ru: "Отправить тестовое сообщение",
    kg: "Тест билдирүү жөнөтүү",
    en: "Send test message",
  },
  "cargo.telegram.testSending": {
    ru: "Отправка…",
    kg: "Жөнөтүлүүдө…",
    en: "Sending…",
  },
  "cargo.telegram.testSent": {
    ru: "Тестовое сообщение отправлено",
    kg: "Тест билдирүү жөнөтүлдү",
    en: "Test message sent",
  },
  "cargo.telegram.testFailed": {
    ru: "Не удалось отправить тестовое сообщение",
    kg: "Тест билдирүүнү жөнөтүү мүмкүн болбоду",
    en: "Could not send test message",
  },
  "cargo.telegram.tokenMissing": {
    ru: "Telegram bot token не настроен на сервере.",
    kg: "Telegram bot token серверде жөндөлгөн эмес.",
    en: "Telegram bot token is not configured on the server.",
  },
  "cargo.telegram.notConnected": {
    ru: "Telegram ещё не подключён",
    kg: "Telegram азырынча туташкан эмес",
    en: "Telegram is not connected yet",
  },
  "cargo.telegram.message.newRequestTitle": {
    ru: "Новая карго-заявка",
    kg: "Жаңы карго сурамы",
    en: "New cargo request",
  },
  "cargo.telegram.message.openRequests": {
    ru: "Открыть заявки:",
    kg: "Сурамдарды ачуу:",
    en: "Open requests:",
  },
  "cargo.telegram.testMessage": {
    ru: "Тестовое сообщение ВсеТут. Telegram-уведомления по карго-заявкам подключены.",
    kg: "ВсеТут тест билдирүүсү. Карго сурамдар боюнча Telegram билдирмелери туташтырылды.",
    en: "VseTut test message. Telegram notifications for cargo requests are connected.",
  },
  "cargo.settings.save": {
    ru: "Сохранить настройки",
    kg: "Жөндөөлөрдү сактоо",
    en: "Save settings",
  },
  "cargo.settings.saved": {
    ru: "Настройки сохранены",
    kg: "Жөндөөлөр сакталды",
    en: "Settings saved",
  },
  "cargo.settings.saveError": {
    ru: "Не удалось сохранить настройки",
    kg: "Жөндөөлөрдү сактоо мүмкүн болбоду",
    en: "Could not save settings",
  },
  "cargo.serviceType": {
    ru: "Тип услуги",
    kg: "Кызмат түрү",
    en: "Service type",
  },
  "cargo.direction": {
    ru: "Направление",
    kg: "Багыт",
    en: "Route",
  },
  "cargo.matchingOnly": {
    ru: "Показывать только подходящие мне заявки",
    kg: "Мага ылайыктуу сурамдарды гана көрсөтүү",
    en: "Show only matching requests",
  },
  "cargo.serviceTypes.deliveryFromChina": {
    ru: "Доставка из Китая",
    kg: "Кытайдан жеткирүү",
    en: "Delivery from China",
  },
  "cargo.serviceTypes.deliveryKyrgyzstan": {
    ru: "Доставка по Кыргызстану",
    kg: "Кыргызстан боюнча жеткирүү",
    en: "Delivery across Kyrgyzstan",
  },
  "cargo.serviceTypes.internationalDelivery": {
    ru: "Международная доставка",
    kg: "Эл аралык жеткирүү",
    en: "International delivery",
  },
  "cargo.serviceTypes.roadFreight": {
    ru: "Автоперевозки",
    kg: "Авто жеткирүү",
    en: "Road freight",
  },
  "cargo.serviceTypes.airFreight": {
    ru: "Авиадоставка",
    kg: "Аба аркылуу жеткирүү",
    en: "Air freight",
  },
  "cargo.serviceTypes.railFreight": {
    ru: "Железнодорожная доставка",
    kg: "Темир жол аркылуу жеткирүү",
    en: "Rail freight",
  },
  "cargo.serviceTypes.warehousing": {
    ru: "Складские услуги",
    kg: "Кампа кызматтары",
    en: "Warehousing",
  },
  "cargo.serviceTypes.customsClearance": {
    ru: "Таможенное оформление",
    kg: "Бажы жол-жоболоштуруу",
    en: "Customs clearance",
  },
  "cargo.serviceTypes.other": {
    ru: "Другое",
    kg: "Башка",
    en: "Other",
  },
  "cargo.directions.chinaKyrgyzstan": {
    ru: "Китай → Кыргызстан",
    kg: "Кытай → Кыргызстан",
    en: "China → Kyrgyzstan",
  },
  "cargo.directions.guangzhouBishkek": {
    ru: "Гуанчжоу → Бишкек",
    kg: "Гуанчжоу → Бишкек",
    en: "Guangzhou → Bishkek",
  },
  "cargo.directions.yiwuBishkek": {
    ru: "Иу → Бишкек",
    kg: "Иу → Бишкек",
    en: "Yiwu → Bishkek",
  },
  "cargo.directions.urumqiBishkek": {
    ru: "Урумчи → Бишкек",
    kg: "Үрүмчү → Бишкек",
    en: "Urumqi → Bishkek",
  },
  "cargo.directions.kyrgyzstanKazakhstan": {
    ru: "Кыргызстан → Казахстан",
    kg: "Кыргызстан → Казакстан",
    en: "Kyrgyzstan → Kazakhstan",
  },
  "cargo.directions.bishkekRegions": {
    ru: "Бишкек → регионы Кыргызстана",
    kg: "Бишкек → Кыргызстандын аймактары",
    en: "Bishkek → Kyrgyzstan regions",
  },
  "cargo.directions.international": {
    ru: "Международные направления",
    kg: "Эл аралык багыттар",
    en: "International routes",
  },
  "cargo.directions.other": {
    ru: "Другое",
    kg: "Башка",
    en: "Other",
  },
  "seller.cargoSettingsHint": {
    ru: "Выберите, какие заявки получать.",
    kg: "Кайсы сурамдарды алууну тандаңыз.",
    en: "Choose which requests to receive.",
  },
  "cargo.notifications.newRequest": {
    ru: "Новая карго-заявка: {itemName}",
    kg: "Жаңы карго сурамы: {itemName}",
    en: "New cargo request: {itemName}",
  },
  "cargo.notifications.newResponse": {
    ru: "Новый отклик на карго-заявку: {itemName}",
    kg: "Карго сурамына жаңы жооп: {itemName}",
    en: "New response to cargo request: {itemName}",
  },
  "cargo.notifications.adminNewRequest": {
    ru: "Новая карго-заявка для модерации",
    kg: "Модерация үчүн жаңы карго сурамы",
    en: "New cargo request for review",
  },
  "cargo.notifications.sellerNewRequest": {
    ru: "Новая заявка на перевозку",
    kg: "Жеткирүүгө жаңы сурам",
    en: "New shipping request",
  },
  "cargo.notifications.ownerNewResponse": {
    ru: "На вашу карго-заявку пришёл отклик",
    kg: "Сиздин карго сурамыңызга жооп келди",
    en: "Your cargo request received a response",
  },
  "cargo.seller.newRequestsTitle": {
    ru: "Новые заявки на перевозку",
    kg: "Жеткирүү боюнча жаңы сурамдар",
    en: "New shipping requests",
  },
  "cargo.seller.newRequestsDescription": {
    ru: "Свежие заявки сверху. Откликайтесь через систему — уведомления приходят на сайте.",
    kg: "Жаңы сурамдар жогоруда. Система аркылуу жооп бериңиз — билдирмелер сайтта келет.",
    en: "Newest requests first. Respond in-app — notifications arrive on the site.",
  },
  "cargo.seller.filterAll": {
    ru: "Все",
    kg: "Баары",
    en: "All",
  },
  "cargo.seller.filterNew": {
    ru: "Новые",
    kg: "Жаңылар",
    en: "New",
  },
  "cargo.seller.filterResponded": {
    ru: "Уже откликнулся",
    kg: "Жооп берилген",
    en: "Responded",
  },
  "cargo.seller.respondedBadge": {
    ru: "Вы откликнулись",
    kg: "Сиз жооп бердиңиз",
    en: "You responded",
  },
  "cargo.seller.newBadge": {
    ru: "Новая",
    kg: "Жаңы",
    en: "New",
  },
  "cargo.admin.newRequests": {
    ru: "Новые карго-заявки",
    kg: "Жаңы карго сурамдар",
    en: "New cargo requests",
  },
  "cargo.admin.responsesCount": {
    ru: "Откликов: {count}",
    kg: "Жооптор: {count}",
    en: "Responses: {count}",
  },
  "cargo.admin.openRequests": {
    ru: "Открыть карго-заявки",
    kg: "Карго сурамдарды ачуу",
    en: "Open cargo requests",
  },
  "admin.cargoRequests": {
    ru: "Карго",
    kg: "Карго",
    en: "Cargo",
  },
  "buyer.cargoRequests": {
    ru: "Мои карго-заявки",
    kg: "Менин карго сурамдарым",
    en: "My cargo requests",
  },

  // Services structure — Phase 71
  "services.heroTitle": {
    ru: "Найдите специалиста или услугу",
    kg: "Адисти же кызматты табыңыз",
    en: "Find a specialist or service",
  },
  "services.heroSubtitle": {
    ru: "Ремонт, доставка, клининг, обучение, IT, автоуслуги и другие специалисты.",
    kg: "Оңдоо, жеткирүү, клининг, окутуу, IT, авто кызматтар жана башка адистер.",
    en: "Repair, delivery, cleaning, education, IT, auto services and other specialists.",
  },
  "services.searchPlaceholder": {
    ru: "Какая услуга нужна?",
    kg: "Кандай кызмат керек?",
    en: "What service do you need?",
  },
  "services.professionsTitle": {
    ru: "Профессии и услуги",
    kg: "Кесиптер жана кызматтар",
    en: "Professions and services",
  },
  "services.professionsSubtitle": {
    ru: "Выберите направление, чтобы найти специалиста",
    kg: "Адисти табуу үчүн багытты тандаңыз",
    en: "Pick a direction to find a specialist",
  },
  "services.allServices": {
    ru: "Все услуги",
    kg: "Бардык кызматтар",
    en: "All services",
  },
  "services.postService": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post a listing",
  },
  "services.emptyTitle": {
    ru: "Пока нет специалистов в этой категории.",
    kg: "Бул категорияда азырынча адистер жок.",
    en: "No specialists in this category yet.",
  },
  "services.emptyDescription": {
    ru: "Вы можете посмотреть другие услуги или разместить своё объявление.",
    kg: "Башка кызматтарды көрүңүз же өз жарыяңызды жайгаштырыңыз.",
    en: "You can browse other services or post your own listing.",
  },
  "services.profession": {
    ru: "Профессия",
    kg: "Кесип",
    en: "Profession",
  },
  "services.serviceCategory": {
    ru: "Категория услуги",
    kg: "Кызмат категориясы",
    en: "Service category",
  },
  "services.priceByAgreement": {
    ru: "Цена по договорённости",
    kg: "Баасы макулдашуу боюнча",
    en: "Price by agreement",
  },
  "services.formTitle": {
    ru: "Описание услуги",
    kg: "Кызматтын сүрөттөмөсү",
    en: "Service description",
  },
  "services.formCategory": {
    ru: "Категория услуги / профессия",
    kg: "Кызмат категориясы / кесип",
    en: "Service category / profession",
  },
  "services.formDescriptionHint": {
    ru: "Опишите, какую услугу вы оказываете, в каком городе работаете и как с вами связаться через заявку.",
    kg: "Кандай кызмат көрсөтөрүңүздү, кайсы шаарда иштей турганыңызды жана сурам аркылуу кантип байланышса болорун жазыңыз.",
    en: "Describe what service you provide, which city you work in, and how customers can contact you through a request.",
  },
  "services.categories.repairConstruction": {
    ru: "Ремонт и строительство",
    kg: "Оңдоо жана курулуш",
    en: "Repair and construction",
  },
  "services.categories.electricians": {
    ru: "Электрики",
    kg: "Электриктер",
    en: "Electricians",
  },
  "services.categories.plumbers": {
    ru: "Сантехники",
    kg: "Сантехниктер",
    en: "Plumbers",
  },
  "services.categories.furniture": {
    ru: "Мебельщики",
    kg: "Эмерек усталары",
    en: "Furniture makers",
  },
  "services.categories.movers": {
    ru: "Грузчики",
    kg: "Жүкчүлөр",
    en: "Movers",
  },
  "services.categories.cleaning": {
    ru: "Клининг",
    kg: "Клининг",
    en: "Cleaning",
  },
  "services.categories.autoServices": {
    ru: "Автоуслуги",
    kg: "Авто кызматтар",
    en: "Auto services",
  },
  "services.categories.beautyHealth": {
    ru: "Красота и здоровье",
    kg: "Сулуулук жана ден соолук",
    en: "Beauty and health",
  },
  "services.categories.education": {
    ru: "Обучение",
    kg: "Окутуу",
    en: "Education",
  },
  "services.categories.accounting": {
    ru: "Бухгалтерия",
    kg: "Бухгалтерия",
    en: "Accounting",
  },
  "services.categories.lawyers": {
    ru: "Юристы",
    kg: "Юристтер",
    en: "Lawyers",
  },
  "services.categories.itDigital": {
    ru: "IT и digital",
    kg: "IT жана digital",
    en: "IT and digital",
  },
  "services.categories.design": {
    ru: "Дизайн",
    kg: "Дизайн",
    en: "Design",
  },
  "services.categories.photoVideo": {
    ru: "Фото и видео",
    kg: "Фото жана видео",
    en: "Photo and video",
  },
  "services.categories.handyman": {
    ru: "Мастера на час",
    kg: "Сааттык усталар",
    en: "Handyman",
  },
  "services.categories.other": {
    ru: "Другое",
    kg: "Башка",
    en: "Other",
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

  // Mobile catalog filters — Phase 67
  "filters.title": { ru: "Фильтры", kg: "Фильтрлер", en: "Filters" },
  "filters.show": {
    ru: "Показать фильтры",
    kg: "Чыпкаларды көрсөтүү",
    en: "Show filters",
  },
  "filters.reset": {
    ru: "Сбросить",
    kg: "Тазалоо",
    en: "Reset",
  },
  "filters.apply": {
    ru: "Показать",
    kg: "Көрсөтүү",
    en: "Show results",
  },
  "filters.section": { ru: "Раздел", kg: "Бөлүм", en: "Section" },
  "filters.category": { ru: "Категория", kg: "Категория", en: "Category" },
  "filters.city": { ru: "Город", kg: "Шаар", en: "City" },
  "filters.price": { ru: "Цена", kg: "Баасы", en: "Price" },
  "filters.priceFrom": { ru: "Цена от", kg: "Баасы баштап", en: "Price from" },
  "filters.priceTo": { ru: "Цена до", kg: "Баасы чейин", en: "Price to" },
  "filters.onlyWithPhoto": {
    ru: "Только с фото",
    kg: "Сүрөттүү гана",
    en: "With photos only",
  },
  "filters.activeFilters": {
    ru: "Активные фильтры",
    kg: "Активдүү чыпкалар",
    en: "Active filters",
  },
  "filters.clearOne": {
    ru: "Удалить фильтр",
    kg: "Чыпканы өчүрүү",
    en: "Remove filter",
  },
  "filters.clearAll": {
    ru: "Сбросить всё",
    kg: "Баарын тазалоо",
    en: "Clear all",
  },
  "filters.invalidPriceRange": {
    ru: "Цена «от» не может быть больше цены «до».",
    kg: "«Баштап» баасы «чейин» баасынан чоң болбошу керек.",
    en: "Minimum price cannot be greater than maximum price.",
  },
  "sort.title": { ru: "Сортировка", kg: "Иреттөө", en: "Sort" },
  "sort.newest": {
    ru: "Сначала новые",
    kg: "Жаңылары биринчи",
    en: "Newest first",
  },
  "sort.oldest": {
    ru: "Сначала старые",
    kg: "Эскилери биринчи",
    en: "Oldest first",
  },
  "sort.priceAsc": {
    ru: "Сначала дешёвые",
    kg: "Арзандары биринчи",
    en: "Cheapest first",
  },
  "sort.priceDesc": {
    ru: "Сначала дорогие",
    kg: "Кымбаттары биринчи",
    en: "Most expensive first",
  },
  "listings.emptyFilteredTitle": {
    ru: "Ничего не найдено",
    kg: "Эч нерсе табылган жок",
    en: "Nothing found",
  },
  "listings.emptyFilteredDescription": {
    ru: "Попробуйте изменить фильтры или сбросить поиск.",
    kg: "Фильтрлерди өзгөртүп көрүңүз же издөөнү тазалаңыз.",
    en: "Try changing filters or clearing the search.",
  },
  "listings.allListings": {
    ru: "Все объявления",
    kg: "Бардык жарыялар",
    en: "All listings",
  },

  // Mobile listing cards and catalog — Phase 65
  "listingCard.priceOnRequest": {
    ru: "Цена по запросу",
    kg: "Баасы сурам боюнча",
    en: "Price on request",
  },
  "listings.filters": { ru: "Фильтры", kg: "Чыпкалар", en: "Filters" },
  "listings.showFilters": {
    ru: "Показать фильтры",
    kg: "Чыпкаларды көрсөтүү",
    en: "Show filters",
  },
  "listings.hideFilters": {
    ru: "Скрыть фильтры",
    kg: "Чыпкаларды жашыруу",
    en: "Hide filters",
  },
  "listings.sort": { ru: "Сортировка", kg: "Иреттөө", en: "Sort" },
  "listings.found": { ru: "Найдено", kg: "Табылды", en: "Found" },
  "listings.loadMore": {
    ru: "Показать ещё",
    kg: "Дагы көрсөтүү",
    en: "Load more",
  },
  "listings.noImage": { ru: "Нет фото", kg: "Сүрөт жок", en: "No image" },
  "listings.openListing": {
    ru: "Открыть объявление",
    kg: "Жарыяны ачуу",
    en: "Open listing",
  },
  "listings.addToFavorites": {
    ru: "Добавить в избранное",
    kg: "Тандалгандарга кошуу",
    en: "Add to favorites",
  },
  "listings.removeFromFavorites": {
    ru: "Убрать из избранного",
    kg: "Тандалгандардан алып салуу",
    en: "Remove from favorites",
  },
  "vertical.market": { ru: "Объявления", kg: "Жарыялар", en: "Listings" },
  "vertical.opt": { ru: "Опт", kg: "Дүң", en: "Wholesale" },
  "vertical.services": { ru: "Услуги", kg: "Кызматтар", en: "Services" },
  "vertical.cargo": { ru: "Карго", kg: "Карго", en: "Cargo" },

  "listings.photoSearch.title": {
    ru: "Поиск по фото",
    kg: "Сүрөт менен издөө",
    en: "Photo search",
  },
  "listings.photoSearch.description": {
    ru: "Это тестовый режим. Сейчас поиск учитывает раздел, наличие фото и текстовые совпадения. Точный визуальный поиск будет добавлен позже.",
    kg: "Бул тесттик режим. Азыр издөө бөлүмдү, сүрөтү бар жарыяларды жана тексттик дал келүүлөрдү эске алат. Так визуалдык издөө кийин кошулат.",
    en: "This is a prototype mode. Search currently uses section, listings with images, and text matches. Accurate visual search will be added later.",
  },
  "listings.photoSearch.newSearch": {
    ru: "Новый поиск по фото",
    kg: "Жаңы сүрөт боюнча издөө",
    en: "New photo search",
  },
  "listings.photoSearch.filterHint": {
    ru: "Фильтры можно использовать вместе с поиском по фото.",
    kg: "Фильтрлерди сүрөт менен издөө менен бирге колдонсо болот.",
    en: "You can use filters together with photo search.",
  },
  "listings.photoSearch.emptyTitle": {
    ru: "Подходящие объявления пока не найдены.",
    kg: "Ылайыктуу жарыялар азырынча табылган жок.",
    en: "No matching listings found yet.",
  },
  "listings.photoSearch.emptyDescription": {
    ru: "Попробуйте другое фото или добавьте короткое описание.",
    kg: "Башка сүрөт колдонуп көрүңүз же кыскача түшүндүрмө кошуңуз.",
    en: "Try another photo or add a short description.",
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
  "listing.priceOnRequest": {
    ru: "Цена по запросу",
    kg: "Баасы сурам боюнча",
    en: "Price on request",
  },
  "listing.mobile.mainInfo": {
    ru: "Основное",
    kg: "Негизги",
    en: "Overview",
  },
  "listing.mobile.sendRequestSticky": {
    ru: "Отправить запрос",
    kg: "Сурам жөнөтүү",
    en: "Send request",
  },
  "listing.mobile.signInToRequest": {
    ru: "Войдите, чтобы отправить запрос продавцу.",
    kg: "Сатуучуга сурам жөнөтүү үчүн кириңиз.",
    en: "Sign in to send a request to the seller.",
  },
  "listing.galleryAriaLabel": {
    ru: "Галерея товара",
    kg: "Товар галереясы",
    en: "Product gallery",
  },
  "listing.photo": { ru: "Фото", kg: "Сүрөт", en: "Photo" },
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
  "auth.registerTitle": { ru: "Создать аккаунт", kg: "Аккаунт түзүү", en: "Create account" },
  "auth.createAccount": { ru: "Создать аккаунт", kg: "Аккаунт түзүү", en: "Create account" },
  "auth.signInToPost": {
    ru: "Войдите, чтобы подать объявление",
    kg: "Жарыя берүү үчүн кириңиз",
    en: "Sign in to post a listing",
  },
  "auth.returnToPost": {
    ru: "После входа вернёмся к публикации",
    kg: "Киргенден кийин жарыяга кайтабыз",
    en: "After signing in we will return to posting",
  },
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
  "auth.login": { ru: "Войти", kg: "Кирүү", en: "Sign in" },
  "auth.confirmCode": {
    ru: "Код подтверждения",
    kg: "Ырастоо коду",
    en: "Confirmation code",
  },
  "auth.sendCode": {
    ru: "Отправить код",
    kg: "Код жөнөтүү",
    en: "Send code",
  },
  "auth.resendCode": {
    ru: "Отправить код ещё раз",
    kg: "Кодду кайра жөнөтүү",
    en: "Send code again",
  },
  "auth.codeSent": {
    ru: "Код отправлен",
    kg: "Код жөнөтүлдү",
    en: "Code sent",
  },
  "auth.enterSmsCode": {
    ru: "Введите код из SMS",
    kg: "SMS кодду киргизиңиз",
    en: "Enter the SMS code",
  },
  "auth.loginWithGoogle": {
    ru: "Войти через Google",
    kg: "Google менен кирүү",
    en: "Sign in with Google",
  },
  "auth.hasAccount": {
    ru: "Уже есть аккаунт?",
    kg: "Аккаунтуңуз барбы?",
    en: "Already have an account?",
  },
  "auth.signInRequired": {
    ru: "Чтобы продолжить, войдите или зарегистрируйтесь.",
    kg: "Улантуу үчүн кириңиз же катталыңыз.",
    en: "Sign in or register to continue.",
  },
  "auth.invalidCredentials": {
    ru: "Неверный телефон или пароль",
    kg: "Телефон же сырсөз туура эмес",
    en: "Invalid phone or password",
  },
  "auth.invalidCode": {
    ru: "Неверный код",
    kg: "Код туура эмес",
    en: "Invalid code",
  },
  "auth.codeExpired": {
    ru: "Код истёк",
    kg: "Коддун мөөнөтү өттү",
    en: "Code expired",
  },
  "auth.requiredFields": {
    ru: "Заполните обязательные поля",
    kg: "Милдеттүү талааларды толтуруңуз",
    en: "Fill in the required fields",
  },
  "auth.tryAgainLater": {
    ru: "Попробуйте позже",
    kg: "Кийинчерээк аракет кылыңыз",
    en: "Try again later",
  },
  "auth.phoneVerified": {
    ru: "Телефон подтверждён",
    kg: "Телефон ырасталды",
    en: "Phone verified",
  },
  "profile.title": { ru: "Профиль", kg: "Профиль", en: "Profile" },
  "profile.buyerDashboard": {
    ru: "Личный кабинет",
    kg: "Жеке кабинет",
    en: "Dashboard",
  },
  "profile.sellerDashboard": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "account.dashboard": {
    ru: "Личный кабинет",
    kg: "Жеке кабинет",
    en: "Dashboard",
  },
  "account.profile": {
    ru: "Профиль",
    kg: "Профиль",
    en: "Profile",
  },
  "account.myListings": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "account.myRequests": {
    ru: "Мои заявки",
    kg: "Менин сурамдарым",
    en: "My requests",
  },
  "account.favorites": {
    ru: "Избранное",
    kg: "Тандалмалар",
    en: "Favorites",
  },
  "account.notifications": {
    ru: "Уведомления",
    kg: "Билдирмелер",
    en: "Notifications",
  },
  "account.companyProfile": {
    ru: "Профиль компании",
    kg: "Компаниянын профили",
    en: "Company profile",
  },
  "account.createCompanyProfile": {
    ru: "Создать профиль компании",
    kg: "Компаниянын профилин түзүү",
    en: "Create company profile",
  },
  "company.title": {
    ru: "Компания",
    kg: "Компания",
    en: "Company",
  },
  "company.createTitle": {
    ru: "Создать профиль компании",
    kg: "Компаниянын профилин түзүү",
    en: "Create company profile",
  },
  "company.editTitle": {
    ru: "Редактировать профиль компании",
    kg: "Компаниянын профилин түзөтүү",
    en: "Edit company profile",
  },
  "company.name": {
    ru: "Название компании",
    kg: "Компаниянын аталышы",
    en: "Company name",
  },
  "company.type": {
    ru: "Тип компании",
    kg: "Компаниянын түрү",
    en: "Company type",
  },
  "company.city": {
    ru: "Город",
    kg: "Шаар",
    en: "City",
  },
  "company.phone": {
    ru: "Телефон",
    kg: "Телефон",
    en: "Phone",
  },
  "company.description": {
    ru: "Описание",
    kg: "Сүрөттөмө",
    en: "Description",
  },
  "company.website": {
    ru: "Сайт",
    kg: "Сайт",
    en: "Website",
  },
  "company.logo": {
    ru: "Логотип",
    kg: "Логотип",
    en: "Logo",
  },
  "company.save": {
    ru: "Сохранить",
    kg: "Сактоо",
    en: "Save",
  },
  "company.saved": {
    ru: "Профиль компании сохранён",
    kg: "Компаниянын профили сакталды",
    en: "Company profile saved",
  },
  "company.create": {
    ru: "Создать профиль",
    kg: "Профиль түзүү",
    en: "Create profile",
  },
  "company.createProfile": {
    ru: "Создать профиль компании",
    kg: "Компаниянын профилин түзүү",
    en: "Create company profile",
  },
  "company.profile": {
    ru: "Профиль компании",
    kg: "Компаниянын профили",
    en: "Company profile",
  },
  "company.publicProfile": {
    ru: "Публичный профиль компании",
    kg: "Компаниянын ачык профили",
    en: "Public company profile",
  },
  "company.postAs": {
    ru: "Разместить от имени:",
    kg: "Кимдин атынан жайгаштыруу:",
    en: "Post as:",
  },
  "company.postAsPersonal": {
    ru: "Личный аккаунт",
    kg: "Жеке аккаунт",
    en: "Personal account",
  },
  "company.postAsCompany": {
    ru: "Компания: {companyName}",
    kg: "Компания: {companyName}",
    en: "Company: {companyName}",
  },
  "company.badge": {
    ru: "Компания",
    kg: "Компания",
    en: "Company",
  },
  "company.noProfile": {
    ru: "Профиль компании ещё не создан",
    kg: "Компаниянын профили азырынча жок",
    en: "Company profile is not created yet",
  },
  "company.createProfileHint": {
    ru: "Заполните профиль компании, чтобы публиковать от её имени.",
    kg: "Компаниянын атынан жарыялоо үчүн профилди толтуруңуз.",
    en: "Fill in your company profile to post on its behalf.",
  },
  "company.types.store": {
    ru: "Магазин",
    kg: "Дүкөн",
    en: "Store",
  },
  "company.types.supplier": {
    ru: "Поставщик",
    kg: "Жеткирүүчү",
    en: "Supplier",
  },
  "company.types.service": {
    ru: "Сервисная компания",
    kg: "Кызмат көрсөтүүчү компания",
    en: "Service company",
  },
  "company.types.cargo": {
    ru: "Карго-компания",
    kg: "Карго компания",
    en: "Cargo company",
  },
  "company.types.other": {
    ru: "Другое",
    kg: "Башка",
    en: "Other",
  },
  "company.public.listingsTitle": {
    ru: "Объявления компании",
    kg: "Компаниянын жарыялары",
    en: "Company listings",
  },
  "company.public.noListings": {
    ru: "У компании пока нет активных объявлений",
    kg: "Компанияда азырынча активдүү жарыялар жок",
    en: "This company has no active listings yet",
  },
  "company.public.contact": {
    ru: "Связаться",
    kg: "Байланышуу",
    en: "Contact",
  },
  "company.logoUploadError": {
    ru: "Не удалось загрузить логотип",
    kg: "Логотип жүктөлгөн жок",
    en: "Could not upload logo",
  },
  "company.typeRequired": {
    ru: "Выберите тип компании",
    kg: "Компаниянын түрүн тандаңыз",
    en: "Select a company type",
  },
  "company.saveError": {
    ru: "Не удалось сохранить профиль компании",
    kg: "Компаниянын профили сакталган жок",
    en: "Could not save company profile",
  },
  "company.verification.status": {
    ru: "Статус проверки",
    kg: "Текшерүү статусу",
    en: "Verification status",
  },
  "company.verification.unverified": {
    ru: "Не проверена",
    kg: "Текшерилген эмес",
    en: "Not verified",
  },
  "company.verification.pending": {
    ru: "На проверке",
    kg: "Текшерүүдө",
    en: "Under review",
  },
  "company.verification.verified": {
    ru: "Проверенная компания",
    kg: "Текшерилген компания",
    en: "Verified company",
  },
  "company.verification.rejected": {
    ru: "Проверка отклонена",
    kg: "Текшерүү четке кагылды",
    en: "Verification rejected",
  },
  "company.verification.submit": {
    ru: "Отправить компанию на проверку",
    kg: "Компанияны текшерүүгө жөнөтүү",
    en: "Submit company for verification",
  },
  "company.verification.submitDescription": {
    ru: "Мы проверим данные компании. После проверки на странице появится бейдж.",
    kg: "Компаниянын маалыматтарын текшеребиз. Текшерүүдөн кийин баракчада белги көрсөтүлөт.",
    en: "We will review the company information. After approval, a badge will appear on the company page.",
  },
  "company.verification.submitted": {
    ru: "Компания отправлена на проверку",
    kg: "Компания текшерүүгө жөнөтүлдү",
    en: "Company submitted for verification",
  },
  "company.verification.verifiedBadge": {
    ru: "Проверенная компания",
    kg: "Текшерилген компания",
    en: "Verified company",
  },
  "company.verification.verifiedCargoBadge": {
    ru: "Проверенная карго-компания",
    kg: "Текшерилген карго компания",
    en: "Verified cargo company",
  },
  "company.verification.trustBlockTitle": {
    ru: "Доверие",
    kg: "Ишеним",
    en: "Trust",
  },
  "company.verification.registeredAt": {
    ru: "На сайте с",
    kg: "Сайтта",
    en: "Registered",
  },
  "company.verification.activeListings": {
    ru: "Активные объявления",
    kg: "Активдүү жарыялар",
    en: "Active listings",
  },
  "company.verification.verifiedOnly": {
    ru: "Только проверенные",
    kg: "Текшерилгендер гана",
    en: "Verified only",
  },
  "company.verification.ownerVerifiedNotification": {
    ru: "Ваша компания прошла проверку.",
    kg: "Сиздин компания текшерүүдөн өттү.",
    en: "Your company has been verified.",
  },
  "company.verification.ownerRejectedNotification": {
    ru: "Проверка компании отклонена. Проверьте данные и отправьте повторно.",
    kg: "Компанияны текшерүү четке кагылды. Маалыматты текшерип, кайра жөнөтүңүз.",
    en: "Company verification was rejected. Check your details and submit again.",
  },
  "admin.companies.title": {
    ru: "Компании",
    kg: "Компаниялар",
    en: "Companies",
  },
  "admin.companies.description": {
    ru: "Проверка профилей компаний",
    kg: "Компания профилдерин текшерүү",
    en: "Company profile verification",
  },
  "admin.companies.verify": {
    ru: "Проверить",
    kg: "Текшерүү",
    en: "Verify",
  },
  "admin.companies.reject": {
    ru: "Отклонить",
    kg: "Четке кагуу",
    en: "Reject",
  },
  "admin.companies.reset": {
    ru: "Сбросить",
    kg: "Кайтаруу",
    en: "Reset",
  },
  "admin.companies.note": {
    ru: "Заметка admin",
    kg: "Админ белгиси",
    en: "Admin note",
  },
  "admin.companies.owner": {
    ru: "Владелец",
    kg: "Ээси",
    en: "Owner",
  },
  "admin.companies.companyType": {
    ru: "Тип компании",
    kg: "Компаниянын түрү",
    en: "Company type",
  },
  "admin.companies.verificationStatus": {
    ru: "Статус проверки",
    kg: "Текшерүү статусу",
    en: "Verification status",
  },
  "post.chooseType": {
    ru: "Что хотите разместить?",
    kg: "Эмне жайгаштыргыңыз келет?",
    en: "What do you want to post?",
  },
  "post.market": {
    ru: "Объявление",
    kg: "Жарыя",
    en: "Listing",
  },
  "post.service": {
    ru: "Услугу",
    kg: "Кызмат",
    en: "Service",
  },
  "post.wholesale": {
    ru: "Оптовое предложение",
    kg: "Дүң сунуш",
    en: "Wholesale offer",
  },
  "post.cargoCompany": {
    ru: "Карго-компанию",
    kg: "Карго компания",
    en: "Cargo company",
  },
  "post.marketDescription": {
    ru: "Товар или частное предложение",
    kg: "Товар же жеке сунуш",
    en: "A product or private offer",
  },
  "post.serviceDescription": {
    ru: "Услуга мастера или компании",
    kg: "Уста же компаниянын кызматы",
    en: "A service from a specialist or company",
  },
  "post.wholesaleDescription": {
    ru: "Оптовые товары и поставки",
    kg: "Дүң товарлар жана жеткирүүлөр",
    en: "Wholesale goods and supply",
  },
  "post.cargoCompanyDescription": {
    ru: "Карточка компании, которая перевозит грузы",
    kg: "Жүк ташуучу компаниянын карточкасы",
    en: "A company card for freight services",
  },
  "cargo.requestVsCompanyTitle": {
    ru: "Заявка и карго-компания — это разное",
    kg: "Сурам жана карго компания — ар башка",
    en: "Shipping request and cargo company are different",
  },
  "cargo.requestVsCompanyDescription": {
    ru: "Не путайте заявку клиента и карточку перевозчика.",
    kg: "Кардардын сурамын жана ташуучунун карточкасын чаташтырбаңыз.",
    en: "Do not confuse a client request with a carrier company card.",
  },
  "cargo.needShipping": {
    ru: "Карго-заявка — когда вам нужно перевезти товар.",
    kg: "Карго сурамы — товарды ташытуу керек болгондо.",
    en: "Cargo request — when you need to ship goods.",
  },
  "cargo.addCargoCompany": {
    ru: "Карго-компания — когда вы оказываете услуги перевозки.",
    kg: "Карго компания — жеткирүү кызматын көрсөтсөңүз.",
    en: "Cargo company — when you provide shipping services.",
  },
  "profile.favorites": { ru: "Избранное", kg: "Тандалмалар", en: "Favorites" },
  "profile.notifications": {
    ru: "Уведомления",
    kg: "Билдирмелер",
    en: "Notifications",
  },
  "profile.myListings": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "profile.leads": { ru: "Мои заявки", kg: "Менин сурамдарым", en: "My requests" },
  "profile.postListing": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post a listing",
  },
  "profile.completeSellerProfile": {
    ru: "Профиль продавца",
    kg: "Сатуучунун профили",
    en: "Seller profile",
  },
  "profile.addPhoneForSeller": {
    ru: "Добавьте телефон, чтобы продолжить как продавец",
    kg: "Сатуучу катары улантуу үчүн телефонду кошуңуз",
    en: "Add a phone number to continue as a seller",
  },
  "profile.sellerOnboardingDescription": {
    ru: "Укажите данные, которые будут видны в объявлениях. Подтвердите телефон.",
    kg: "Жарыяларда көрүнө турган маалыматтарды жазыңыз. Телефонду ырастаңыз.",
    en: "Enter details visible on your listings. Confirm your phone.",
  },
  "profile.sellerPhoneHint": {
    ru: "На этот номер покупатели смогут связаться с вами.",
    kg: "Сатып алуучулар бул номерге байланыша алышат.",
    en: "Buyers will be able to contact you on this number.",
  },
  "profile.saveSellerProfile": {
    ru: "Сохранить и перейти в кабинет",
    kg: "Сактап, кабинетке өтүү",
    en: "Save and go to dashboard",
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

  // Create listing — Phase 69
  "createListing.title": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post a listing",
  },
  "createListing.subtitle": {
    ru: "Добавьте товар или предложение в выбранный раздел",
    kg: "Тандалган бөлүмгө товар же сунуш кошуңуз",
    en: "Add a product or offer to the selected section",
  },
  "createListing.signInRequired": {
    ru: "Чтобы подать объявление, войдите или зарегистрируйтесь.",
    kg: "Жарыя берүү үчүн кириңиз же катталыңыз.",
    en: "Sign in or register to post a listing.",
  },
  "createListing.sections.main": {
    ru: "Основное",
    kg: "Негизги",
    en: "Basics",
  },
  "createListing.sections.photos": {
    ru: "Фото",
    kg: "Сүрөт",
    en: "Photos",
  },
  "createListing.sections.price": {
    ru: "Цена",
    kg: "Баа",
    en: "Price",
  },
  "createListing.sections.location": {
    ru: "Местоположение",
    kg: "Жайгашкан жери",
    en: "Location",
  },
  "createListing.sections.description": {
    ru: "Описание",
    kg: "Сүрөттөмө",
    en: "Description",
  },
  "createListing.sections.publish": {
    ru: "Публикация",
    kg: "Жарыялоо",
    en: "Publish",
  },
  "createListing.progress": {
    ru: "1. Основное → 2. Фото → 3. Цена → 4. Описание",
    kg: "1. Негизги → 2. Сүрөт → 3. Баа → 4. Сүрөттөмө",
    en: "1. Basics → 2. Photos → 3. Price → 4. Description",
  },
  "createListing.whatSelling": {
    ru: "Что продаёте?",
    kg: "Эмне сатасыз?",
    en: "What are you selling?",
  },
  "createListing.verticalLabel": {
    ru: "Раздел",
    kg: "Бөлүм",
    en: "Section",
  },
  "createListing.photoHint": {
    ru: "Добавьте фото товара или услуги.",
    kg: "Товардын же кызматтын сүрөтүн кошуңуз.",
    en: "Add photos of the item or service.",
  },
  "createListing.mainPhotoHint": {
    ru: "Первое фото будет главным.",
    kg: "Биринчи сүрөт негизги болот.",
    en: "The first photo will be the main one.",
  },
  "createListing.photoCount": {
    ru: "от 1 до 10 фото",
    kg: "1ден 10го чейин сүрөт",
    en: "1 to 10 photos",
  },
  "createListing.uploadPhotos": {
    ru: "Загрузить фото",
    kg: "Сүрөт жүктөө",
    en: "Upload photos",
  },
  "createListing.addPhoto": {
    ru: "Добавить",
    kg: "Кошуу",
    en: "Add",
  },
  "createListing.mainPhoto": {
    ru: "Главное",
    kg: "Негизги",
    en: "Main",
  },
  "createListing.reviewBeforePublish": {
    ru: "Проверьте данные перед публикацией.",
    kg: "Жарыялоодон мурун маалыматтарды текшериңиз.",
    en: "Review the details before publishing.",
  },
  "createListing.publish": {
    ru: "Опубликовать",
    kg: "Жарыялоо",
    en: "Publish",
  },
  "createListing.publishing": {
    ru: "Отправка...",
    kg: "Жөнөтүлүүдө...",
    en: "Publishing...",
  },
  "createListing.saveChanges": {
    ru: "Сохранить изменения",
    kg: "Өзгөртүүлөрдү сактоо",
    en: "Save changes",
  },
  "createListing.saving": {
    ru: "Сохранение...",
    kg: "Сакталууда...",
    en: "Saving...",
  },
  "createListing.moderationNote": {
    ru: "После отправки объявление будет проверено модератором.",
    kg: "Жөнөтүлгөндөн кийин жарыяны модератор текшерет.",
    en: "After submission the listing will be reviewed by a moderator.",
  },
  "createListing.editModerationNote": {
    ru: "После редактирования объявление может быть отправлено на повторную модерацию.",
    kg: "Түзөтүүдөн кийин жарыя кайра модерацияга жөнөтүлүшү мүмкүн.",
    en: "After editing the listing may be sent for re-moderation.",
  },
  "createListing.cancel": { ru: "Отмена", kg: "Жокко чыгаруу", en: "Cancel" },
  "createListing.submittedForModeration": {
    ru: "Объявление отправлено на модерацию.",
    kg: "Жарыя модерацияга жөнөтүлдү.",
    en: "Listing submitted for moderation.",
  },
  "createListing.openListing": {
    ru: "Открыть объявление",
    kg: "Жарыяны ачуу",
    en: "Open listing",
  },
  "createListing.myListings": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "createListing.summaryPhotos": {
    ru: "фото",
    kg: "сүрөт",
    en: "photos",
  },
  "createListing.summaryTitle": {
    ru: "Название",
    kg: "Аталышы",
    en: "Title",
  },
  "createListing.summaryNoTitle": {
    ru: "Без названия",
    kg: "Аталышы жок",
    en: "Untitled",
  },
  "createListing.summaryNoCity": {
    ru: "Город не выбран",
    kg: "Шаар тандалган жок",
    en: "City not selected",
  },
  "createListing.summaryNoCategory": {
    ru: "Категория не выбрана",
    kg: "Категория тандалган жок",
    en: "Category not selected",
  },
  "createListing.validation.titleRequired": {
    ru: "Укажите название",
    kg: "Аталышын жазыңыз",
    en: "Title is required",
  },
  "createListing.validation.verticalRequired": {
    ru: "Выберите раздел",
    kg: "Бөлүмдү тандаңыз",
    en: "Select a section",
  },
  "createListing.validation.categoryRequired": {
    ru: "Выберите категорию",
    kg: "Категорияны тандаңыз",
    en: "Select a category",
  },
  "createListing.validation.invalidPrice": {
    ru: "Укажите корректную цену",
    kg: "Туура бааны жазыңыз",
    en: "Enter a valid price",
  },
  "createListing.validation.cityRequired": {
    ru: "Выберите город",
    kg: "Шаарды тандаңыз",
    en: "Select a city",
  },
  "createListing.validation.photoRequired": {
    ru: "Добавьте хотя бы одно фото",
    kg: "Жок дегенде бир сүрөт кошуңуз",
    en: "Add at least one photo",
  },
  "createListing.validation.photoLimit": {
    ru: "Можно загрузить не более 10 фотографий",
    kg: "10дон ашык сүрөт жүктөөгө болбойт",
    en: "You can upload up to 10 photos",
  },
  "createListing.validation.waitUpload": {
    ru: "Дождитесь окончания загрузки фото",
    kg: "Сүрөт жүктөлүп бүткөнчө күтүңүз",
    en: "Wait until photo upload finishes",
  },

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
