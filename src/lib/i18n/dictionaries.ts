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
  "mobileNav.notifications": {
    ru: "Уведомления",
    kg: "Билдирүүлөр",
    en: "Alerts",
  },
  "mobileNav.favorites": {
    ru: "Избранное",
    kg: "Тандалгандар",
    en: "Favorites",
  },
  "mobileNav.profile": { ru: "Кабинет", kg: "Кабинет", en: "Account" },
  "mobileSearch.placeholder": {
    ru: "Что ищем?",
    kg: "Эмне издейбиз?",
    en: "Search",
  },

  // PWA
  "pwa.offline.title": {
    ru: "Нет подключения",
    kg: "Туташуу жок",
    en: "No connection",
  },
  "pwa.offline.description": {
    ru: "Проверьте интернет и попробуйте снова.",
    kg: "Интернетти текшериңиз жана кайра аракет кылыңыз.",
    en: "Check your internet connection and try again.",
  },
  "pwa.offline.retry": { ru: "Повторить", kg: "Кайра", en: "Retry" },
  "pwa.install.title": {
    ru: "Установить приложение",
    kg: "Колдонмону орнотуу",
    en: "Install app",
  },
  "pwa.install.description": {
    ru: "Добавьте ВсеТут на главный экран для быстрого доступа.",
    kg: "Тез жетүү үчүн ВсеТутту башкы экранга кошуңуз.",
    en: "Add VseTut to your home screen for quick access.",
  },
  "pwa.install.action": { ru: "Установить", kg: "Орнотуу", en: "Install" },
  "pwa.install.dismiss": { ru: "Закрыть", kg: "Жабуу", en: "Dismiss" },
  "pwa.install.iosHint": {
    ru: "На iPhone приложение можно добавить на главный экран.",
    kg: "iPhone'до колдонмону башкы экранга кошсо болот.",
    en: "On iPhone you can add the app to your home screen.",
  },
  "pwa.install.iosSteps": {
    ru: "Нажмите «Поделиться» → «На экран Домой»",
    kg: "«Бөлүшүү» → «Башкы экранга кошуу»",
    en: "Tap Share → Add to Home Screen",
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
    ru: "Что ищете оптом?",
    kg: "Дүңүнөн эмне издейсиз?",
    en: "What are you looking for wholesale?",
  },
  "search.servicesPlaceholder": {
    ru: "Какая услуга нужна?",
    kg: "Кандай кызмат керек?",
    en: "What service do you need?",
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
  "home.appTitle": {
    ru: "ВсеТут",
    kg: "ВсеТут",
    en: "VseTut",
  },
  "home.appSubtitle": {
    ru: "Объявления, услуги, опт и карго",
    kg: "Жарыялар, кызматтар, дүң жана карго",
    en: "Listings, services, wholesale and cargo",
  },
  "home.quickActions": {
    ru: "Быстрые действия",
    kg: "Тез аракеттер",
    en: "Quick actions",
  },
  "home.quickPostListing": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post listing",
  },
  "home.quickPostListingShort": {
    ru: "Подать",
    kg: "Берүү",
    en: "Post",
  },
  "home.quickFindGoods": {
    ru: "Найти товар",
    kg: "Товар табуу",
    en: "Find goods",
  },
  "home.quickFindService": {
    ru: "Найти услугу",
    kg: "Кызмат табуу",
    en: "Find service",
  },
  "home.quickCargoRequest": {
    ru: "Карго-заявка",
    kg: "Карго сурам",
    en: "Cargo request",
  },
  "home.quickCargoRequestShort": {
    ru: "Карго",
    kg: "Карго",
    en: "Cargo",
  },
  "home.sectionsTitle": {
    ru: "Разделы",
    kg: "Бөлүмдөр",
    en: "Sections",
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
  "home.trendingShortLabel": {
    ru: "Популярное",
    kg: "Популярдуу",
    en: "Popular",
  },
  "home.trendChip.equipment": {
    ru: "Оборудование",
    kg: "Жабдуулар",
    en: "Equipment",
  },
  "home.trendChip.electronics": {
    ru: "Электроника",
    kg: "Электроника",
    en: "Electronics",
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
  "market.heroTitle": {
    ru: "Объявления",
    kg: "Жарыялар",
    en: "Listings",
  },
  "market.heroSubtitle": {
    ru: "Покупайте и продавайте товары рядом с вами.",
    kg: "Жакын жерден товарларды сатып алыңыз жана сатыңыз.",
    en: "Buy and sell goods near you.",
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
    ru: "Пока нет объявлений. Разместите первое объявление или вернитесь позже.",
    kg: "Азырынча жарыялар жок. Биринчи жарыяны жайгаштырыңыз же кийинчерээк кайтыңыз.",
    en: "No listings yet. Post the first one or check back later.",
  },
  "vertical.emptyOpt": {
    ru: "Пока нет оптовых предложений.",
    kg: "Азырынча дүң сунуштар жок.",
    en: "No wholesale offers yet.",
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
    ru: "Карго и доставка",
    kg: "Карго жана жеткирүү",
    en: "Cargo and delivery",
  },
  "cargo.heroSubtitle": {
    ru: "Найдите карго-компанию или оставьте заявку на перевозку.",
    kg: "Карго компанияны табыңыз же жеткирүүгө сурам калтырыңыз.",
    en: "Find a cargo company or submit a shipping request.",
  },
  "cargo.createRequest": {
    ru: "Создать заявку",
    kg: "Сурам түзүү",
    en: "Create request",
  },
  "cargo.findCargoCompany": {
    ru: "Найти карго-компанию",
    kg: "Карго компанияны табуу",
    en: "Find cargo company",
  },
  "cargo.searchPlaceholder": {
    ru: "Найти карго-компанию, направление или услугу...",
    kg: "Карго компанияны, багытты же кызматты издөө...",
    en: "Find a cargo company, route or service...",
  },
  "cargo.searchTypeCompanies": {
    ru: "Карго-компании",
    kg: "Карго компаниялар",
    en: "Cargo companies",
  },
  "cargo.searchTypeDirections": {
    ru: "Направления",
    kg: "Багыттар",
    en: "Directions",
  },
  "cargo.searchTypeServices": {
    ru: "Услуги карго",
    kg: "Карго кызматтары",
    en: "Cargo services",
  },
  "cargo.searchTypeRequests": {
    ru: "Заявки",
    kg: "Сурамдар",
    en: "Requests",
  },
  "cargo.directionsTitle": {
    ru: "Направления и услуги",
    kg: "Багыттар жана кызматтар",
    en: "Directions and services",
  },
  "cargo.directionChinaKyrgyzstan": {
    ru: "Китай → Кыргызстан",
    kg: "Кытай → Кыргызстан",
    en: "China → Kyrgyzstan",
  },
  "cargo.directionGuangzhouBishkek": {
    ru: "Гуанчжоу → Бишкек",
    kg: "Гуанчжоу → Бишкек",
    en: "Guangzhou → Bishkek",
  },
  "cargo.directionYiwuBishkek": {
    ru: "Иу → Бишкек",
    kg: "Иу → Бишкек",
    en: "Yiwu → Bishkek",
  },
  "cargo.directionUrumqiBishkek": {
    ru: "Урумчи → Бишкек",
    kg: "Үрүмчү → Бишкек",
    en: "Urumqi → Bishkek",
  },
  "cargo.autoDelivery": {
    ru: "Автодоставка",
    kg: "Авто жеткирүү",
    en: "Road delivery",
  },
  "cargo.airDelivery": {
    ru: "Авиадоставка",
    kg: "Авиа жеткирүү",
    en: "Air delivery",
  },
  "cargo.railDelivery": {
    ru: "ЖД доставка",
    kg: "Темир жол жеткирүү",
    en: "Rail delivery",
  },
  "cargo.warehouse": {
    ru: "Склад",
    kg: "Склад",
    en: "Warehouse",
  },
  "cargo.customs": {
    ru: "Таможня",
    kg: "Бажы",
    en: "Customs",
  },
  "cargo.other": {
    ru: "Другое",
    kg: "Башка",
    en: "Other",
  },
  "cargo.noCompaniesTitle": {
    ru: "Пока нет карго-компаний.",
    kg: "Азырынча карго компаниялар жок.",
    en: "No cargo companies yet.",
  },
  "cargo.noCompaniesDescription": {
    ru: "Добавьте карточку компании, чтобы клиенты находили вас.",
    kg: "Кардарлар сизди табышы үчүн компания карточкасын кошуңуз.",
    en: "Add a company card so clients can find you.",
  },
  "cargo.verifiedCargoCompany": {
    ru: "Проверенная карго-компания",
    kg: "Текшерилген карго компания",
    en: "Verified cargo company",
  },
  "cargo.activeRequestsTitle": {
    ru: "Актуальные заявки на перевозку",
    kg: "Учурдагы жеткирүү сурамдары",
    en: "Active shipping requests",
  },
  "cargo.activeRequestsDescription": {
    ru: "Контакты клиентов скрыты. Откройте заявку, чтобы откликнуться.",
    kg: "Кардарлардын байланыштары жашыруун. Жооп берүү үчүн сурамды ачыңыз.",
    en: "Client contacts stay private. Open a request to respond.",
  },
  "cargo.activeRequestsEmptyTitle": {
    ru: "Пока нет актуальных заявок",
    kg: "Азырынча учурдагы сурамдар жок",
    en: "No active requests yet",
  },
  "cargo.activeRequestsEmptyDescription": {
    ru: "Создайте заявку на перевозку — карго-компании смогут откликнуться.",
    kg: "Жеткирүүгө сурам түзүңүз — карго компаниялар жооп бере алышат.",
    en: "Create a shipping request so cargo companies can respond.",
  },
  "cargo.loginToViewRequests": {
    ru: "Войти, чтобы посмотреть",
    kg: "Көрүү үчүн кирүү",
    en: "Log in to view",
  },
  "cargo.respondToRequest": {
    ru: "Откликнуться",
    kg: "Жооп берүү",
    en: "Respond",
  },
  "cargo.viewAllRequests": {
    ru: "Все заявки",
    kg: "Бардык сурамдар",
    en: "All requests",
  },
  "cargo.needShippingTitle": {
    ru: "Нужна перевозка?",
    kg: "Жеткирүү керекпи?",
    en: "Need shipping?",
  },
  "cargo.needShippingDescription": {
    ru: "Опишите товар и маршрут — карго-компании увидят заявку.",
    kg: "Товарды жана маршрутту жазыңыз — карго компаниялар сурамыңызды көрөт.",
    en: "Describe the item and route — cargo companies will see your request.",
  },
  "cargo.areYouCargoCompanyTitle": {
    ru: "Вы карго-компания?",
    kg: "Сиз карго компаниясызбы?",
    en: "Are you a cargo company?",
  },
  "cargo.areYouCargoCompanyDescription": {
    ru: "Добавьте компанию, подключите Telegram и получайте заявки.",
    kg: "Компанияны кошуңуз, Telegramди туташтырыңыз жана сурамдарды алыңыз.",
    en: "Add your company, connect Telegram and receive requests.",
  },
  "cargo.setupNotifications": {
    ru: "Настроить уведомления",
    kg: "Билдирмелерди жөндөө",
    en: "Set up notifications",
  },
  "cargo.requestModalTitle": {
    ru: "Заявка на перевозку",
    kg: "Жеткирүү сурамы",
    en: "Shipping request",
  },
  "cargo.requestModalDescription": {
    ru: "Заполните маршрут и контакты. Карго-компании смогут откликнуться.",
    kg: "Маршрутту жана байланыштарды толтуруңуз. Карго компаниялар жооп бере алышат.",
    en: "Fill in the route and contacts. Cargo companies will be able to respond.",
  },
  "cargo.requestLoginTitle": {
    ru: "Войдите, чтобы оставить заявку",
    kg: "Сурам калтыруу үчүн кириңиз",
    en: "Sign in to submit a request",
  },
  "cargo.requestLoginDescription": {
    ru: "Так заявка сохранится в личном кабинете, и вы увидите отклики карго-компаний с контактами.",
    kg: "Ошентип сурам жеке кабинетте сакталып, карго компаниялардын байланыштуу жоопторун көрөсүз.",
    en: "This way the request stays in your account, and you can see cargo company responses with contacts.",
  },
  "cargo.requestSuccessTitle": {
    ru: "Заявка отправлена",
    kg: "Сурам жөнөтүлдү",
    en: "Request submitted",
  },
  "cargo.requestSuccessDescription": {
    ru: "Карго-компании увидят заявку и оставят отклик с контактами. Смотрите отклики в «Мои заявки».",
    kg: "Карго компаниялар сурамыңызды көрүп, байланыш менен жооп калтырышат. Жоопторду «Менин сурамдарымдан» караңыз.",
    en: "Cargo companies will see the request and leave a response with contacts. Check responses in My requests.",
  },
  "cargo.requestSuccessGuestDescription": {
    ru: "Заявка отправлена. Войдите в аккаунт, чтобы видеть отклики карго-компаний.",
    kg: "Сурам жөнөтүлдү. Карго компаниялардын жоопторун көрүү үчүн аккаунтка кириңиз.",
    en: "Request submitted. Sign in to see cargo company responses.",
  },
  "cargo.viewMyRequests": {
    ru: "Мои заявки",
    kg: "Менин сурамдарым",
    en: "My requests",
  },
  "cargo.openCreatedRequest": {
    ru: "Открыть заявку",
    kg: "Сурамды ачуу",
    en: "Open request",
  },
  "cargo.requestTitle": {
    ru: "Оставить заявку на перевозку",
    kg: "Жеткирүүгө сурам калтыруу",
    en: "Submit a shipping request",
  },
  "cargo.requestDescription": {
    ru: "Опишите товар и маршрут. Карго-компании увидят заявку и оставят отклик с контактами.",
    kg: "Товарды жана маршрутту жазыңыз. Карго компаниялар сурамыңызды көрүп, байланыш менен жооп калтырышат.",
    en: "Describe the item and route. Cargo companies will see the request and leave a response with contacts.",
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
    ru: "Когда клиенты оставят заявку на перевозку, она появится здесь.",
    kg: "Кардарлар жеткирүүгө сурам калтырганда, ал бул жерде көрүнөт.",
    en: "When customers submit a shipping request, it will appear here.",
  },
  "cargo.contactsRestricted": {
    ru: "Телефон клиента скрыт. Откликнитесь через систему — контакт увидит администратор при необходимости.",
    kg: "Кардардын телефону жашырылган. Система аркылуу жооп бериңиз — байланышты керек болсо администратор көрөт.",
    en: "Client phone is hidden. Respond in the app — admins can view contact if needed.",
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
    ru: "Клиент оставляет заявку на перевозку.",
    kg: "Кардар жеткирүүгө сурам калтырат.",
    en: "The client submits a shipping request.",
  },
  "cargo.howItWorks.step1.description": {
    ru: "Клиент оставляет заявку на перевозку.",
    kg: "Кардар жеткирүүгө сурам калтырат.",
    en: "The client submits a shipping request.",
  },
  "cargo.howItWorks.step2.title": {
    ru: "Карго-компании получают уведомление.",
    kg: "Карго компаниялар билдирме алышат.",
    en: "Cargo companies get a notification.",
  },
  "cargo.howItWorks.step2.description": {
    ru: "Карго-компании получают уведомление.",
    kg: "Карго компаниялар билдирме алышат.",
    en: "Cargo companies get a notification.",
  },
  "cargo.howItWorks.step3.title": {
    ru: "Карго-компания отправляет условия.",
    kg: "Карго компания шарттарды жөнөтөт.",
    en: "The cargo company sends terms.",
  },
  "cargo.howItWorks.step3.description": {
    ru: "Карго-компания отправляет условия.",
    kg: "Карго компания шарттарды жөнөтөт.",
    en: "The cargo company sends terms.",
  },
  "cargo.howItWorks.step4.title": {
    ru: "Клиент выбирает подходящий вариант и связывается с компанией.",
    kg: "Кардар ылайыктуу вариантты тандап, компания менен байланышат.",
    en: "The client picks an option and contacts the company.",
  },
  "cargo.howItWorks.step4.description": {
    ru: "Клиент выбирает подходящий вариант и связывается с компанией.",
    kg: "Кардар ылайыктуу вариантты тандап, компания менен байланышат.",
    en: "The client picks an option and contacts the company.",
  },
  "cargo.feedbackTitle": {
    ru: "Нашли ошибку или что-то непонятно?",
    kg: "Ката таптыңызбы же түшүнүксүзбү?",
    en: "Found a bug or something unclear?",
  },
  "cargo.feedbackDescription": {
    ru: "Сообщите нам, мы быстро исправим.",
    kg: "Бизге жазыңыз, тез оңдойбуз.",
    en: "Tell us — we will fix it quickly.",
  },
  "cargo.feedbackButton": {
    ru: "Сообщить о проблеме",
    kg: "Көйгөй жөнүндө билдирүү",
    en: "Report a problem",
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
  "cargoRequest.detailTitle": {
    ru: "Карго-заявка",
    kg: "Карго сурам",
    en: "Cargo request",
  },
  "cargoRequest.notFoundTitle": {
    ru: "Заявка не найдена",
    kg: "Сурам табылган жок",
    en: "Request not found",
  },
  "cargoRequest.notFoundDescription": {
    ru: "Возможно, заявка удалена или ссылка устарела.",
    kg: "Сурам өчүрүлгөн же шилтеме эскирген болушу мүмкүн.",
    en: "The request may have been deleted or the link is outdated.",
  },
  "cargoRequest.noAccessTitle": {
    ru: "Нужен вход",
    kg: "Кирүү керек",
    en: "Sign in required",
  },
  "cargoRequest.noAccessDescription": {
    ru: "Войдите, чтобы откликнуться или увидеть больше деталей. Контакты клиента скрыты.",
    kg: "Жооп берүү же көбүрөөк маалымат көрүү үчүн кириңиз. Кардардын байланыштары жашыруун.",
    en: "Sign in to respond or see more details. Client contacts stay private.",
  },
  "cargoRequest.ownerContacts": {
    ru: "Контакты клиента",
    kg: "Кардардын байланыштары",
    en: "Client contacts",
  },
  "cargoRequest.responsesOwnerOnly": {
    ru: "Отклики видит только владелец заявки.",
    kg: "Жоопторду сурамдын ээси гана көрөт.",
    en: "Only the request owner can see responses.",
  },
  "cargoRequest.responsesTitle": {
    ru: "Отклики",
    kg: "Жооптор",
    en: "Responses",
  },
  "cargoRequest.noResponsesTitle": {
    ru: "Пока нет откликов",
    kg: "Азырынча жооп жок",
    en: "No responses yet",
  },
  "cargoRequest.noResponsesDescription": {
    ru: "Когда карго-компании откликнутся, они появятся здесь.",
    kg: "Карго компаниялар жооп бергенде, алар бул жерде көрүнөт.",
    en: "When cargo companies respond, they will appear here.",
  },
  "cargoRequest.respond": {
    ru: "Откликнуться",
    kg: "Жооп берүү",
    en: "Respond",
  },
  "cargoRequest.alreadyResponded": {
    ru: "Вы уже отправили отклик",
    kg: "Сиз жооп жөнөткөнсүз",
    en: "You already sent a response",
  },
  "cargoRequest.cannotRespondOwnRequest": {
    ru: "Нельзя откликнуться на свою заявку",
    kg: "Өз сурамыңызга жооп берүүгө болбойт",
    en: "You cannot respond to your own request",
  },
  "cargoRequest.closedRequest": {
    ru: "Заявка закрыта",
    kg: "Сурам жабылган",
    en: "This request is closed",
  },
  "cargoRequest.backToCargo": {
    ru: "К разделу Карго",
    kg: "Карго бөлүмүнө",
    en: "Back to Cargo",
  },
  "cargoRequest.backToRequests": {
    ru: "Мои заявки",
    kg: "Менин сурамдарым",
    en: "My requests",
  },
  "cargoRequest.openInAccount": {
    ru: "Открыть заявку",
    kg: "Сурамды ачуу",
    en: "Open request",
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
    ru: "Откройте бота, нажмите Start, затем обновите статус на этой странице.",
    kg: "Ботту ачып, Start басыңыз, андан кийин бул баракта статусту жаңыртыңыз.",
    en: "Open the bot, tap Start, then refresh the status on this page.",
  },
  "cargo.telegram.refreshStatus": {
    ru: "Обновить статус",
    kg: "Статусту жаңыртуу",
    en: "Refresh status",
  },
  "cargo.telegram.refreshHint": {
    ru: "Проверьте Telegram и нажмите «Обновить статус».",
    kg: "Telegramди текшерип, «Статусту жаңыртуу» басыңыз.",
    en: "Check Telegram, then tap Refresh status.",
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

  // Services structure — Phase 71 / 99
  "services.heroTitle": {
    ru: "Услуги",
    kg: "Кызматтар",
    en: "Services",
  },
  "services.heroSubtitle": {
    ru: "Найдите специалиста или разместите свою услугу.",
    kg: "Адисти табыңыз же өз кызматыңызды жайгаштырыңыз.",
    en: "Find a specialist or post your service.",
  },
  "services.searchPlaceholder": {
    ru: "Какая услуга нужна?",
    kg: "Кандай кызмат керек?",
    en: "What service do you need?",
  },
  "services.findService": {
    ru: "Найти услугу",
    kg: "Кызмат табуу",
    en: "Find a service",
  },
  "services.howItWorksTitle": {
    ru: "Как это работает",
    kg: "Бул кантип иштейт",
    en: "How it works",
  },
  "services.howItWorks.step1": {
    ru: "Выберите категорию или найдите нужную услугу.",
    kg: "Категорияны тандаңыз же керек кызматты табыңыз.",
    en: "Pick a category or search for the service you need.",
  },
  "services.howItWorks.step2": {
    ru: "Откройте карточку и свяжитесь с исполнителем.",
    kg: "Карточканы ачып, аткаруучу менен байланышыңыз.",
    en: "Open the card and contact the provider.",
  },
  "services.howItWorks.step3": {
    ru: "Или разместите свою услугу, чтобы клиенты нашли вас.",
    kg: "Же өз кызматыңызды жайгаштырыңыз, кардарлар сизди тапсын.",
    en: "Or post your service so clients can find you.",
  },
  "services.professionsTitle": {
    ru: "Категории услуг",
    kg: "Кызмат категориялары",
    en: "Service categories",
  },
  "services.professionsSubtitle": {
    ru: "Выберите направление",
    kg: "Багытты тандаңыз",
    en: "Choose a direction",
  },
  "services.allServices": {
    ru: "Все услуги",
    kg: "Бардык кызматтар",
    en: "All services",
  },
  "services.postService": {
    ru: "Разместить услугу",
    kg: "Кызмат жайгаштыруу",
    en: "Post a service",
  },
  "services.pageTitle": {
    ru: "Разместить услугу",
    kg: "Кызмат жайгаштыруу",
    en: "Post a service",
  },
  "services.pageSubtitle": {
    ru: "Опишите услугу, город и стоимость — клиенты смогут связаться с вами.",
    kg: "Кызматты, шаарды жана бааны жазыңыз — кардарлар байланыша алат.",
    en: "Describe the service, city and price — clients can contact you.",
  },
  "services.formCity": {
    ru: "Где оказываете услугу?",
    kg: "Кызматты кайда көрсөтөсүз?",
    en: "Where do you provide the service?",
  },
  "services.submittedForModeration": {
    ru: "Услуга отправлена на модерацию.",
    kg: "Кызмат модерацияга жөнөтүлдү.",
    en: "Service submitted for moderation.",
  },
  "services.openService": {
    ru: "Открыть услугу",
    kg: "Кызматты ачуу",
    en: "Open service",
  },
  "services.postAnotherService": {
    ru: "Разместить ещё одну услугу",
    kg: "Дагы бир кызмат жайгаштыруу",
    en: "Post another service",
  },
  "services.emptyTitle": {
    ru: "Пока нет услуг.",
    kg: "Азырынча кызматтар жок.",
    en: "No services yet.",
  },
  "services.emptyDescription": {
    ru: "Разместите услугу, чтобы клиенты могли найти вас на сайте.",
    kg: "Кызмат жайгаштырыңыз, кардарлар сайттан сизди тапсын.",
    en: "Post a service so clients can find you on the site.",
  },
  "services.emptyFilteredTitle": {
    ru: "Услуги не найдены.",
    kg: "Кызматтар табылган жок.",
    en: "No services found.",
  },
  "services.emptyFilteredDescription": {
    ru: "Попробуйте изменить запрос, город или категорию.",
    kg: "Сурамды, шаарды же категорияны өзгөртүп көрүңүз.",
    en: "Try changing the query, city, or category.",
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
    ru: "Цена договорная",
    kg: "Баасы макулдашуу боюнча",
    en: "Price by agreement",
  },
  "services.formTitle": {
    ru: "Описание услуги",
    kg: "Кызматтын сүрөттөмөсү",
    en: "Service description",
  },
  "services.formSectionTitle": {
    ru: "Какую услугу предлагаете?",
    kg: "Кандай кызмат сунуштайсыз?",
    en: "What service are you offering?",
  },
  "services.formCategory": {
    ru: "Категория услуги",
    kg: "Кызмат категориясы",
    en: "Service category",
  },
  "services.formDescriptionHint": {
    ru: "Опишите услугу, опыт, условия работы и что входит в стоимость.",
    kg: "Кызматты, тажрыйбаны, шарттарды жана баага эмне кирерин жазыңыз.",
    en: "Describe the service, experience, terms, and what is included.",
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
    en: "My account",
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
  "common.refresh": { ru: "Обновить", kg: "Жаңыртуу", en: "Refresh" },
  "common.back": { ru: "Назад", kg: "Артка", en: "Back" },
  "common.next": { ru: "Далее", kg: "Андан ары", en: "Next" },

  // Footer — Phase 56
  "footer.buyersTitle": { ru: "Пользователям", kg: "Колдонуучуларга", en: "For users" },
  "footer.catalog": { ru: "Каталог", kg: "Каталог", en: "Catalog" },
  "footer.favorites": { ru: "Избранное", kg: "Тандалмалар", en: "Favorites" },
  "footer.buyerDashboard": {
    ru: "Личный кабинет",
    kg: "Жеке кабинет",
    en: "Account",
  },
  "footer.sellersTitle": { ru: "Публикации", kg: "Жарыялар", en: "Publishing" },
  "footer.postListing": { ru: "Подать объявление", kg: "Жарыя берүү", en: "Post a listing" },
  "footer.sellerDashboard": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "footer.leads": { ru: "Мои заявки", kg: "Менин сурамдарым", en: "My requests" },
  "footer.platformTitle": { ru: "Платформа", kg: "Платформа", en: "Platform" },
  "footer.sellers": { ru: "Компании", kg: "Компаниялар", en: "Companies" },
  "footer.notifications": { ru: "Уведомления", kg: "Билдирмелер", en: "Notifications" },
  "footer.signIn": { ru: "Войти", kg: "Кирүү", en: "Sign in" },
  "footer.register": { ru: "Регистрация", kg: "Катталуу", en: "Register" },
  "footer.legalTitle": { ru: "Правовая информация", kg: "Юридикалык маалымат", en: "Legal" },
  "footer.privacy": {
    ru: "Конфиденциальность",
    kg: "Купуялык",
    en: "Privacy Policy",
  },
  "footer.terms": {
    ru: "Пользовательское соглашение",
    kg: "Колдонуучу макулдашуусу",
    en: "Terms of Service",
  },
  "footer.support": { ru: "Поддержка", kg: "Колдоо", en: "Support" },
  "footer.deleteAccount": {
    ru: "Удаление аккаунта",
    kg: "Аккаунтту өчүрүү",
    en: "Delete account",
  },
  "footer.brandTagline": {
    ru: "Платформа объявлений, услуг, опта и карго в Кыргызстане",
    kg: "Кыргызстандагы жарыялар, кызматтар, дүң жана карго платформасы",
    en: "Listings, services, wholesale and cargo platform in Kyrgyzstan",
  },
  "footer.brandSubline": {
    ru: "Находите предложения и размещайте свои публикации в одном аккаунте.",
    kg: "Сунуштарды табыңыз жана жарыяларыңызды бир аккаунттан жайгаштырыңыз.",
    en: "Find offers and post your publications from one account.",
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
  "filters.subcategory": { ru: "Подкатегория", kg: "Подкатегория", en: "Subcategory" },
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
    ru: "Попробуйте изменить запрос, убрать фильтры или выбрать другую категорию.",
    kg: "Сурамды өзгөртүп, фильтрлерди алдырып же башка категорияны тандап көрүңүз.",
    en: "Try changing the query, clearing filters, or choosing another category.",
  },
  "listings.browseEquipment": {
    ru: "Посмотреть оборудование и станки",
    kg: "Жабдуу жана станокторду көрүү",
    en: "Browse equipment and machinery",
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
  "listingCard.today": {
    ru: "Сегодня",
    kg: "Бүгүн",
    en: "Today",
  },
  "listingCard.yesterday": {
    ru: "Вчера",
    kg: "Кечээ",
    en: "Yesterday",
  },
  "listing.listingAuthor": {
    ru: "Автор объявления",
    kg: "Жарыя автору",
    en: "Listing author",
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
    ru: "Войдите, чтобы отправить запрос.",
    kg: "Сурам жөнөтүү үчүн кириңиз.",
    en: "Sign in to send a request.",
  },
  "listing.editListing": {
    ru: "Редактировать",
    kg: "Өзгөртүү",
    en: "Edit",
  },
  "listing.galleryAriaLabel": {
    ru: "Галерея товара",
    kg: "Товар галереясы",
    en: "Product gallery",
  },
  "listing.photo": { ru: "Фото", kg: "Сүрөт", en: "Photo" },
  "listing.openFullscreen": {
    ru: "Открыть фото на весь экран",
    kg: "Сүрөттү толук экранга ачуу",
    en: "Open photo fullscreen",
  },
  "listing.fullscreenGallery": {
    ru: "Галерея фото",
    kg: "Сүрөт галереясы",
    en: "Photo gallery",
  },
  "listing.previousPhoto": {
    ru: "Предыдущее фото",
    kg: "Мурунку сүрөт",
    en: "Previous photo",
  },
  "listing.nextPhoto": {
    ru: "Следующее фото",
    kg: "Кийинки сүрөт",
    en: "Next photo",
  },
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
  "listing.seller": { ru: "Автор", kg: "Автор", en: "Author" },
  "listing.executor": {
    ru: "Исполнитель",
    kg: "Аткаруучу",
    en: "Provider",
  },
  "listing.supplier": { ru: "Поставщик", kg: "Жеткирүүчү", en: "Supplier" },
  "listing.trust": {
    ru: "Доверие к автору",
    kg: "Авторго ишеним",
    en: "Author trust",
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
    ru: "Профиль автора",
    kg: "Автордун профили",
    en: "Author profile",
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
  "listing.requestHintMarket": {
    ru: "Напишите автору объявления — уточните наличие, цену и условия передачи.",
    kg: "Жарыянын авторуна жазыңыз — бар-жогун, бааны жана шарттарды тактаңыз.",
    en: "Message the listing owner — ask about availability, price, and handover.",
  },
  "listing.requestHintServices": {
    ru: "Напишите исполнителю — уточните условия, сроки и стоимость услуги.",
    kg: "Аткаруучуга жазыңыз — шарттарды, мөөнөттөрдү жана бааны тактаңыз.",
    en: "Message the provider — ask about terms, timing, and price.",
  },
  "listing.requestHintOpt": {
    ru: "Перед запросом уточните минимальную партию, наличие и условия отгрузки.",
    kg: "Сурамдан мурун минималдуу партияны, бар-жогун жана жөнөтүү шарттарын тактаңыз.",
    en: "Before requesting, confirm MOQ, availability, and shipping terms.",
  },
  "listing.report": { ru: "Пожаловаться", kg: "Даттануу", en: "Report" },

  // Lead form — Phase 56 / 61
  "form.phone": { ru: "Телефон", kg: "Телефон", en: "Phone" },
  "lead.phoneLabel": {
    ru: "Телефон для связи",
    kg: "Байланыш телефону",
    en: "Contact phone",
  },
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
    en: "This is your listing — client requests will appear in My requests.",
  },
  "form.goToLeads": { ru: "Перейти к заявкам", kg: "Сурамдарга өтүү", en: "Go to requests" },
  "form.leadHint": {
    ru: "Отправьте заявку — автор объявления увидит её в личном кабинете.",
    kg: "Тапшырма жөнөтүңүз — жарыянын автору аны жеке кабинетинен көрөт.",
    en: "Send a request — the listing owner will see it in their account.",
  },

  "lead.title": {
    ru: "Связаться с продавцом",
    kg: "Сатууучу менен байланышуу",
    en: "Contact seller",
  },
  "lead.description": {
    ru: "Оставьте заявку — продавец увидит её в кабинете и свяжется с вами.",
    kg: "Сурам калтырыңыз — сатууучу аны кабинетинен көрүп, сиз менен байланышат.",
    en: "Send a request — the seller will see it in their account and contact you.",
  },
  "lead.messageLabel": {
    ru: "Сообщение",
    kg: "Билдирүү",
    en: "Message",
  },
  "lead.messageLabelYours": {
    ru: "Ваше сообщение",
    kg: "Сиздин билдирүүңүз",
    en: "Your message",
  },
  "lead.messagePlaceholderShort": {
    ru: "Здравствуйте. Меня интересует это объявление.",
    kg: "Саламатсызбы. Бул жарыя мени кызыктырат.",
    en: "Hello. I am interested in this listing.",
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
    ru: "Заявка отправлена",
    kg: "Сурам жөнөтүлдү",
    en: "Request sent",
  },
  "lead.successDescriptionSellerContact": {
    ru: "Продавец увидит ваш номер и сообщение в кабинете.",
    kg: "Сатууучу телефонуңузду жана билдирүүңүздү кабинетинен көрөт.",
    en: "The seller will see your phone number and message in their account.",
  },
  "lead.successDescription": {
    ru: "Автор объявления получит ваши контакты и сообщение.",
    kg: "Жарыянын автору сиздин байланыштарыңызды жана билдирүүңүздү алат.",
    en: "The listing owner will receive your contacts and message.",
  },
  "lead.successDescriptionServices": {
    ru: "Исполнитель получит ваши контакты и сообщение.",
    kg: "Аткаруучу сиздин байланыштарыңызды жана билдирүүңүздү алат.",
    en: "The provider will receive your contacts and message.",
  },
  "lead.successDescriptionOpt": {
    ru: "Поставщик получит ваши контакты и сообщение.",
    kg: "Жеткирүүчү сиздин байланыштарыңызды жана билдирүүңүздү алат.",
    en: "The supplier will receive your contacts and message.",
  },
  "lead.alreadySent": {
    ru: "Вы уже отправили заявку по этому объявлению.",
    kg: "Бул жарыя боюнча сурам мурун жөнөтүлгөн.",
    en: "You have already sent a request for this listing.",
  },
  "lead.nameLabel": {
    ru: "Имя",
    kg: "Аты",
    en: "Name",
  },
  "lead.submitRequest": {
    ru: "Отправить заявку",
    kg: "Сурам жөнөтүү",
    en: "Send request",
  },
  "lead.openMyRequests": {
    ru: "Открыть мои заявки",
    kg: "Менин сурамдарымды ачуу",
    en: "Open my requests",
  },
  "lead.sendAgain": {
    ru: "Отправить повторно",
    kg: "Кайра жөнөтүү",
    en: "Send again",
  },
  "lead.openListing": {
    ru: "Открыть объявление",
    kg: "Жарыяны ачуу",
    en: "Open listing",
  },
  "lead.backToListing": {
    ru: "Вернуться к объявлению",
    kg: "Жарыяга кайтуу",
    en: "Back to listing",
  },
  "lead.loginRequiredTitle": {
    ru: "Запрос по объявлению",
    kg: "Жарыя боюнча сурам",
    en: "Listing request",
  },
  "lead.loginRequiredDescription": {
    ru: "Войдите, чтобы отправить заявку продавцу.",
    kg: "Сатууучуга сурам жөнөтүү үчүн кириңиз.",
    en: "Sign in to send a request to the seller.",
  },
  "lead.signIn": { ru: "Войти", kg: "Кирүү", en: "Sign in" },
  "lead.register": { ru: "Регистрация", kg: "Катталуу", en: "Register" },
  "lead.validation.messageRequired": {
    ru: "Напишите сообщение.",
    kg: "Билдирүү жазыңыз.",
    en: "Please write a message.",
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
  "lead.validation.phoneRequired": {
    ru: "Укажите телефон для связи",
    kg: "Байланыш телефонун көрсөтүңүз",
    en: "Phone number is required",
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
    ru: "Автор",
    kg: "Автор",
    en: "Author",
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
    ru: "В работе",
    kg: "Иштетүүдө",
    en: "In progress",
  },
  "sellerLeads.status.done": {
    ru: "Обработана",
    kg: "Иштетилген",
    en: "Done",
  },
  "sellerLeads.status.closed": {
    ru: "Завершена",
    kg: "Аякталды",
    en: "Completed",
  },
  "sellerLeads.status.rejected": {
    ru: "Отклонена",
    kg: "Четке кагылды",
    en: "Rejected",
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
    ru: "Личный кабинет",
    kg: "Жеке кабинет",
    en: "Account",
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
  "buyer.myLeads": { ru: "Мои заявки", kg: "Менин сурамдарым", en: "My requests" },
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
  "seller.viewLeads": { ru: "Посмотреть заявки", kg: "Сурамдарды көрүү", en: "View requests" },
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

  // Admin empty states — Phase 90
  "admin.empty.noModerationListings": {
    ru: "Нет объявлений на модерации",
    kg: "Модерацияда жарыя жок",
    en: "No listings awaiting moderation",
  },
  "admin.empty.noModerationListingsDescription": {
    ru: "Когда пользователи создадут новые публикации, они появятся здесь.",
    kg: "Колдонуучулар жаңы жарыяларды түзгөндө, алар бул жерде көрүнөт.",
    en: "When users create new publications, they will appear here.",
  },
  "admin.empty.noCompanies": {
    ru: "Нет компаний на проверке",
    kg: "Текшерүүдө компания жок",
    en: "No companies awaiting review",
  },
  "admin.empty.noCompaniesDescription": {
    ru: "Компании, отправленные на проверку, будут отображаться в этом разделе.",
    kg: "Текшерүүгө жөнөтүлгөн компаниялар бул бөлүмдө көрсөтүлөт.",
    en: "Companies submitted for verification will show up in this section.",
  },
  "admin.empty.noCargoRequests": {
    ru: "Нет карго-заявок",
    kg: "Карго сурамдар жок",
    en: "No cargo requests",
  },
  "admin.empty.noCargoRequestsDescription": {
    ru: "Новые заявки на перевозку появятся здесь.",
    kg: "Жаңы ташуу сурамдары бул жерде көрүнөт.",
    en: "New shipping requests will appear here.",
  },
  "admin.empty.noUsers": {
    ru: "Пользователей пока нет",
    kg: "Азырынча колдонуучу жок",
    en: "No users yet",
  },
  "admin.empty.noUsersDescription": {
    ru: "Когда появятся зарегистрированные пользователи, они отобразятся здесь.",
    kg: "Катталган колдонуучулар пайда болгондо, алар бул жерде көрүнөт.",
    en: "Registered users will appear here once they sign up.",
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
  "auth.continueLoginTitle": {
    ru: "Войдите, чтобы продолжить",
    kg: "Улантуу үчүн кириңиз",
    en: "Sign in to continue",
  },
  "auth.continueLoginDescription": {
    ru: "Это нужно, чтобы сохранить объявление в вашем кабинете.",
    kg: "Жарыяны кабинетиңизде сактоо үчүн кирүү керек.",
    en: "This lets us save the listing in your account.",
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
    ru: "Название компании или ваше имя",
    kg: "Компаниянын аты же атыңыз",
    en: "Company name or your name",
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
  "account.title": {
    ru: "Личный кабинет",
    kg: "Жеке кабинет",
    en: "Account",
  },
  "account.subtitle": {
    ru: "Объявления, заявки, компания и карго в одном месте",
    kg: "Жарыялар, сурамдар, компания жана карго бир жерде",
    en: "Listings, requests, company and cargo in one place",
  },
  "account.quickActions": {
    ru: "Быстрые действия",
    kg: "Тез аракеттер",
    en: "Quick actions",
  },
  "account.addCompanyHint": {
    ru: "Добавить компанию",
    kg: "Компания кошуу",
    en: "Add company",
  },
  "account.serviceSection": {
    ru: "Сервис",
    kg: "Кызмат",
    en: "Service",
  },
  "account.serviceSupport": {
    ru: "Поддержка",
    kg: "Колдоо",
    en: "Support",
  },
  "account.servicePrivacy": {
    ru: "Политика конфиденциальности",
    kg: "Купуялык саясаты",
    en: "Privacy Policy",
  },
  "account.serviceTerms": {
    ru: "Пользовательское соглашение",
    kg: "Колдонуучу макулдашуусу",
    en: "Terms of Service",
  },
  "account.postListing": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post listing",
  },
  "analytics.myActivity.title": {
    ru: "Моя активность",
    kg: "Менин активдүүлүгүм",
    en: "My activity",
  },
  "analytics.myActivity.activeListings": {
    ru: "Активные объявления",
    kg: "Активдүү жарыялар",
    en: "Active listings",
  },
  "analytics.myActivity.pendingListings": {
    ru: "На модерации",
    kg: "Модерацияда",
    en: "Pending moderation",
  },
  "analytics.myActivity.receivedLeads": {
    ru: "Полученные заявки",
    kg: "Келген сурамдар",
    en: "Received requests",
  },
  "analytics.myActivity.newLeads": {
    ru: "Новые заявки",
    kg: "Жаңы сурамдар",
    en: "New requests",
  },
  "analytics.myActivity.sentLeads": {
    ru: "Отправленные заявки",
    kg: "Жөнөтүлгөн сурамдар",
    en: "Sent requests",
  },
  "analytics.myActivity.emptyTitle": {
    ru: "Пока нет активности.",
    kg: "Азырынча активдүүлүк жок.",
    en: "No activity yet.",
  },
  "analytics.myActivity.emptyDescription": {
    ru: "Создайте объявление, чтобы начать получать заявки.",
    kg: "Сурамдарды алуу үчүн жарыя түзүңүз.",
    en: "Create a listing to start receiving requests.",
  },
  "analytics.requestsSummary.receivedTitle": {
    ru: "Полученные заявки",
    kg: "Келген сурамдар",
    en: "Received requests",
  },
  "analytics.requestsSummary.sentTitle": {
    ru: "Отправленные заявки",
    kg: "Жөнөтүлгөн сурамдар",
    en: "Sent requests",
  },
  "analytics.requestsSummary.total": {
    ru: "Всего",
    kg: "Бардыгы",
    en: "Total",
  },
  "analytics.requestsSummary.new": {
    ru: "Новые",
    kg: "Жаңы",
    en: "New",
  },
  "analytics.requestsSummary.inProgress": {
    ru: "В работе",
    kg: "Иште",
    en: "In progress",
  },
  "analytics.requestsSummary.completed": {
    ru: "Завершены",
    kg: "Аякталган",
    en: "Completed",
  },
  "analytics.requestsSummary.rejected": {
    ru: "Отклонены",
    kg: "Четке кагылган",
    en: "Rejected",
  },
  "account.submitCargoRequest": {
    ru: "Оставить карго-заявку",
    kg: "Карго сурам калтыруу",
    en: "Submit cargo request",
  },
  "account.myListings": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "account.management": {
    ru: "Управление",
    kg: "Башкаруу",
    en: "Manage",
  },
  "account.myRequests": {
    ru: "Мои заявки",
    kg: "Менин сурамдарым",
    en: "My requests",
  },
  "account.myCargoRequests": {
    ru: "Мои карго-заявки",
    kg: "Менин карго сурамдарым",
    en: "My cargo requests",
  },
  "account.cargoResponsesShort": {
    ru: "откликов",
    kg: "отклик",
    en: "responses",
  },
  "account.favorites": {
    ru: "Избранное",
    kg: "Тандалгандар",
    en: "Favorites",
  },
  "account.notifications": {
    ru: "Уведомления",
    kg: "Билдирмелер",
    en: "Notifications",
  },
  "account.company": {
    ru: "Профиль компании",
    kg: "Компания профили",
    en: "Company profile",
  },
  "account.companyMissingTitle": {
    ru: "Профиль компании ещё не создан",
    kg: "Компания профили азырынча жок",
    en: "Company profile is not created yet",
  },
  "account.companyMissingDescription": {
    ru: "Создайте профиль компании, чтобы публиковать объявления от имени бизнеса.",
    kg: "Бизнес атынан жарыя берүү үчүн компания профилин түзүңүз.",
    en: "Create a company profile to post listings as a business.",
  },
  "account.createCompany": {
    ru: "Создать профиль компании",
    kg: "Компания профилин түзүү",
    en: "Create company profile",
  },
  "account.editCompany": {
    ru: "Редактировать",
    kg: "Түзөтүү",
    en: "Edit",
  },
  "account.openCompany": {
    ru: "Публичная страница",
    kg: "Ачык баракча",
    en: "Public page",
  },
  "account.cargo": {
    ru: "Карго",
    kg: "Карго",
    en: "Cargo",
  },
  "account.cargoCompanyQuestion": {
    ru: "Вы карго-компания?",
    kg: "Сиз карго компаниясызбы?",
    en: "Are you a cargo company?",
  },
  "account.cargoCompanyDescription": {
    ru: "Добавьте компанию и получайте заявки на перевозку.",
    kg: "Компанияны кошуп, ташуу сурамдарын алыңыз.",
    en: "Add your company and receive shipping requests.",
  },
  "account.addCargoCompany": {
    ru: "Добавить карго-компанию",
    kg: "Карго компанияны кошуу",
    en: "Add cargo company",
  },
  "account.cargoSettings": {
    ru: "Карго-настройки",
    kg: "Карго жөндөөлөрү",
    en: "Cargo settings",
  },
  "account.deleteAccount": {
    ru: "Удалить аккаунт",
    kg: "Аккаунтту өчүрүү",
    en: "Delete account",
  },
  "account.cargoSettingsDescription": {
    ru: "Направления, уведомления и Telegram для карго-заявок.",
    kg: "Карго сурамдар үчүн багыттар, билдирмелер жана Telegram.",
    en: "Routes, notifications, and Telegram for cargo requests.",
  },
  "account.cargoRequests": {
    ru: "Карго-заявки",
    kg: "Карго сурамдар",
    en: "Cargo requests",
  },
  "account.cargoNotificationsOn": {
    ru: "Уведомления о заявках включены",
    kg: "Сурам билдирмелери күйүк",
    en: "Request notifications are on",
  },
  "account.cargoNotificationsOff": {
    ru: "Уведомления о заявках выключены",
    kg: "Сурам билдирмелери өчүк",
    en: "Request notifications are off",
  },
  "account.telegramConnected": {
    ru: "Telegram подключён",
    kg: "Telegram туташтырылган",
    en: "Telegram connected",
  },
  "account.telegramNotConnected": {
    ru: "Telegram не подключён",
    kg: "Telegram туташтырылган эмес",
    en: "Telegram not connected",
  },
  "account.listingsTotal": {
    ru: "Всего",
    kg: "Баары",
    en: "Total",
  },
  "account.listingsActive": {
    ru: "Активные",
    kg: "Активдүү",
    en: "Active",
  },
  "account.listingsPending": {
    ru: "На модерации",
    kg: "Модерацияда",
    en: "Pending",
  },
  "account.listingsRejected": {
    ru: "Отклонённые",
    kg: "Четке кагылгандар",
    en: "Rejected",
  },
  "account.listingsArchived": {
    ru: "Архивные",
    kg: "Архивдегилер",
    en: "Archived",
  },
  "account.viewAll": {
    ru: "Все",
    kg: "Баары",
    en: "View all",
  },
  "account.noData": {
    ru: "Пока нет данных",
    kg: "Азырынча маалымат жок",
    en: "No data yet",
  },
  "account.profile": {
    ru: "Профиль",
    kg: "Профиль",
    en: "Profile",
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
  "accountListings.title": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "accountListings.description": {
    ru: "Управляйте всеми своими публикациями в одном месте",
    kg: "Бардык жарыяларыңызды бир жерден башкарыңыз",
    en: "Manage all your publications in one place",
  },
  "accountListings.postListing": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post listing",
  },
  "accountListings.emptyTitle": {
    ru: "У вас пока нет объявлений.",
    kg: "Сизде азырынча жарыялар жок.",
    en: "You do not have any listings yet.",
  },
  "accountListings.emptyDescription": {
    ru: "Разместите первое объявление — это займёт пару минут.",
    kg: "Алгачкы жарыяны жайгаштырыңыз — бир нече мүнөт.",
    en: "Post your first listing — it only takes a few minutes.",
  },
  "accountListings.emptyServicesTitle": {
    ru: "У вас пока нет услуг.",
    kg: "Сизде азырынча кызматтар жок.",
    en: "You do not have any services yet.",
  },
  "accountListings.emptyServicesDescription": {
    ru: "Разместите услугу, чтобы клиенты могли найти вас на сайте.",
    kg: "Кызмат жайгаштырыңыз, кардарлар сайттан сизди тапсын.",
    en: "Post a service so clients can find you on the site.",
  },
  "accountListings.emptyOptTitle": {
    ru: "У вас пока нет оптовых предложений.",
    kg: "Сизде азырынча дүң сунуштар жок.",
    en: "You do not have any wholesale offers yet.",
  },
  "accountListings.emptyOptDescription": {
    ru: "Разместите товар оптом, чтобы компании могли найти вас на сайте.",
    kg: "Товарды дүңүнөн жайгаштырыңыз, компаниялар сайттан сизди тапсын.",
    en: "Post wholesale goods so companies can find you on the site.",
  },
  "accountListings.open": {
    ru: "Открыть",
    kg: "Ачуу",
    en: "Open",
  },
  "accountListings.edit": {
    ru: "Редактировать",
    kg: "Түзөтүү",
    en: "Edit",
  },
  "accountListings.archive": {
    ru: "Архивировать",
    kg: "Архивдөө",
    en: "Archive",
  },
  "accountListings.restore": {
    ru: "Восстановить",
    kg: "Калыбына келтирүү",
    en: "Restore",
  },
  "accountListings.delete": {
    ru: "Удалить",
    kg: "Өчүрүү",
    en: "Delete",
  },
  "accountListings.status": {
    ru: "Статус",
    kg: "Статус",
    en: "Status",
  },
  "accountListings.type": {
    ru: "Тип",
    kg: "Түрү",
    en: "Type",
  },
  "accountListings.postedAs": {
    ru: "Опубликовано от",
    kg: "Жарыяланган",
    en: "Posted as",
  },
  "accountListings.personalAccount": {
    ru: "личный аккаунт",
    kg: "жеке аккаунт",
    en: "personal account",
  },
  "accountListings.company": {
    ru: "компания",
    kg: "компания",
    en: "company",
  },
  "accountListings.leadsCount": {
    ru: "Заявки",
    kg: "Өтүнмөлөр",
    en: "Requests",
  },
  "accountListings.leadsAction": {
    ru: "Заявки",
    kg: "Өтүнмөлөр",
    en: "Requests",
  },
  "accountListings.submitModeration": {
    ru: "Отправить на модерацию",
    kg: "Модерацияга жөнөтүү",
    en: "Submit for review",
  },
  "accountListings.continueDraft": {
    ru: "Продолжить",
    kg: "Улантуу",
    en: "Continue",
  },
  "accountListings.archiveConfirmTitle": {
    ru: "Скрыть объявление из поиска?",
    kg: "Жарыяны издөөдөн жашыруу?",
    en: "Hide listing from search?",
  },
  "accountListings.archiveConfirmDescription": {
    ru: "Вы точно хотите скрыть объявление из поиска? Его можно восстановить позже.",
    kg: "Жарыяны издөөдөн жашырууну каалайсызбы? Кийин калыбына келтире аласыз.",
    en: "Hide this listing from search? You can restore it later.",
  },
  "accountListings.emptyActive": {
    ru: "Активных объявлений пока нет.",
    kg: "Активдүү жарыялар азырынча жок.",
    en: "No active listings yet.",
  },
  "accountListings.emptyPending": {
    ru: "Нет объявлений на модерации.",
    kg: "Модерациядагы жарыялар жок.",
    en: "No listings pending moderation.",
  },
  "accountListings.emptyRejected": {
    ru: "Нет отклонённых объявлений.",
    kg: "Четке кагылган жарыялар жок.",
    en: "No rejected listings.",
  },
  "accountListings.emptyArchived": {
    ru: "Архив пуст.",
    kg: "Архив бош.",
    en: "Archive is empty.",
  },
  "accountListings.emptyDraft": {
    ru: "Черновиков пока нет.",
    kg: "Долбоорлор азырынча жок.",
    en: "No drafts yet.",
  },
  "accountListings.createdAt": {
    ru: "Создано",
    kg: "Түзүлгөн",
    en: "Created",
  },
  "accountListings.updatedAt": {
    ru: "Обновлено",
    kg: "Жаңыртылган",
    en: "Updated",
  },
  "accountListings.publishedAt": {
    ru: "Опубликовано",
    kg: "Жарыяланган",
    en: "Published",
  },
  "accountListings.viewsCount": {
    ru: "Просмотры",
    kg: "Көрүүлөр",
    en: "Views",
  },
  "accountRequests.listingLeadsTitle": {
    ru: "Заявки по объявлению",
    kg: "Жарыя боюнча сурамдар",
    en: "Listing requests",
  },
  "accountListings.filters.all": {
    ru: "Все",
    kg: "Баары",
    en: "All",
  },
  "accountListings.filters.active": {
    ru: "Активные",
    kg: "Активдүү",
    en: "Active",
  },
  "accountListings.filters.pending": {
    ru: "На модерации",
    kg: "Модерацияда",
    en: "Pending",
  },
  "accountListings.filters.rejected": {
    ru: "Отклонённые",
    kg: "Четке кагылган",
    en: "Rejected",
  },
  "accountListings.filters.archived": {
    ru: "Архивные",
    kg: "Архивдегилер",
    en: "Archived",
  },
  "accountListings.filters.expired": {
    ru: "Истёкшие",
    kg: "Мөөнөтү өткөндөр",
    en: "Expired",
  },
  "accountListings.filters.draft": {
    ru: "Черновики",
    kg: "Черновиктер",
    en: "Drafts",
  },
  "accountListings.types.market": {
    ru: "Объявления",
    kg: "Жарыялар",
    en: "Listings",
  },
  "accountListings.types.services": {
    ru: "Услуги",
    kg: "Кызматтар",
    en: "Services",
  },
  "accountListings.types.opt": {
    ru: "Опт",
    kg: "Дүң",
    en: "Wholesale",
  },
  "accountListings.types.cargo": {
    ru: "Карго-компании",
    kg: "Карго компаниялар",
    en: "Cargo companies",
  },
  "accountRequests.title": {
    ru: "Мои заявки",
    kg: "Менин сурамдарым",
    en: "My requests",
  },
  "accountRequests.description": {
    ru: "Запросы по объявлениям и карго в одном месте",
    kg: "Жарыя жана карго сурамдары бир жерде",
    en: "Listing and cargo requests in one place",
  },
  "accountRequests.tabs.all": {
    ru: "Все",
    kg: "Баары",
    en: "All",
  },
  "accountRequests.tabs.sent": {
    ru: "Мои запросы",
    kg: "Менин сурамдарым",
    en: "My requests",
  },
  "accountRequests.tabs.received": {
    ru: "Запросы на мои объявления",
    kg: "Менин жарыяларыма сурамдар",
    en: "Requests to my listings",
  },
  "accountRequests.tabs.cargoRequests": {
    ru: "Карго-заявки",
    kg: "Карго сурамдары",
    en: "Cargo requests",
  },
  "accountRequests.tabs.cargoResponses": {
    ru: "Отклики карго",
    kg: "Карго жооптору",
    en: "Cargo responses",
  },
  "accountRequests.sentTitle": {
    ru: "Мои запросы по объявлениям",
    kg: "Жарыяларга менин сурамдарым",
    en: "My listing requests",
  },
  "accountRequests.receivedTitle": {
    ru: "Заявки по вашим объявлениям",
    kg: "Сиздин жарыяларыңыз боюнча сурамдар",
    en: "Requests on your listings",
  },
  "accountRequests.receivedSubtitle": {
    ru: "Заявки покупателей по опубликованным объявлениям.",
    kg: "Жарыялаган жарыяларыңыз боюнча сатып алуучулардын сурамдары.",
    en: "Buyer requests on your published listings.",
  },
  "accountRequests.cargoRequestsTitle": {
    ru: "Мои карго-заявки",
    kg: "Менин карго сурамдарым",
    en: "My cargo requests",
  },
  "accountRequests.cargoResponsesTitle": {
    ru: "Отклики карго-компаний",
    kg: "Карго компаниялардын жооптору",
    en: "Cargo company responses",
  },
  "accountRequests.myCargoResponsesTitle": {
    ru: "Мои отклики карго-компании",
    kg: "Менин карго жоопторум",
    en: "My cargo company responses",
  },
  "accountRequests.emptyReceivedTitle": {
    ru: "Пока нет полученных заявок",
    kg: "Азырынча келген сурамдар жок",
    en: "No received requests yet",
  },
  "accountRequests.emptyReceivedDescription": {
    ru: "Когда покупатель заинтересуется вашим объявлением, заявка появится здесь.",
    kg: "Сатып алуучу жарыяңызга кызыкканда, сурам ушул жерде көрүнөт.",
    en: "When a buyer is interested in your listing, a request will appear here.",
  },
  "accountRequests.emptySentTitle": {
    ru: "Вы ещё не отправляли заявки",
    kg: "Сиз азырынча сурам жөнөткөн жоксуз",
    en: "You have not sent any requests yet",
  },
  "accountRequests.emptySentDescription": {
    ru: "Найдите объявление и нажмите «Связаться».",
    kg: "Жарыя табып, «Байланышуу» баскычын басыңыз.",
    en: "Find a listing and tap Contact.",
  },
  "accountRequests.listingFilterEmptyTitle": {
    ru: "По этому объявлению пока нет заявок",
    kg: "Бул жарыя боюнча азырынча сурамдар жок",
    en: "No requests for this listing yet",
  },
  "accountRequests.listingFilterEmptyDescription": {
    ru: "Когда покупатель заинтересуется, заявка появится в этом списке.",
    kg: "Сатып алуучу кызыкканда, сурам бул тизмеде көрүнөт.",
    en: "When a buyer is interested, the request will appear in this list.",
  },
  "accountRequests.showAllRequests": {
    ru: "Показать все заявки",
    kg: "Бардык сурамдарды көрсөтүү",
    en: "Show all requests",
  },
  "accountRequests.emptyTitle": {
    ru: "Пока нет заявок",
    kg: "Азырынча сурамдар жок",
    en: "No requests yet",
  },
  "accountRequests.emptyDescription": {
    ru: "Когда покупатель заинтересуется вашим объявлением, заявка появится здесь.",
    kg: "Сатып алуучу жарыяңызга кызыкканда, сурам ушул жерде көрүнөт.",
    en: "When a buyer is interested in your listing, a request will appear here.",
  },
  "accountRequests.noListingsTitle": {
    ru: "У вас пока нет объявлений",
    kg: "Сизде азырынча жарыялар жок",
    en: "You have no listings yet",
  },
  "accountRequests.noListingsDescription": {
    ru: "Создайте объявление, чтобы начать получать заявки.",
    kg: "Сурам алуу үчүн жарыя түзүңүз.",
    en: "Create a listing to start receiving requests.",
  },
  "accountRequests.myListings": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "accountRequests.callBuyer": {
    ru: "Позвонить",
    kg: "Чалуу",
    en: "Call",
  },
  "accountRequests.markInProgress": {
    ru: "В работу",
    kg: "Ишке алуу",
    en: "Mark in progress",
  },
  "accountRequests.completeLead": {
    ru: "Завершить",
    kg: "Аяктоо",
    en: "Complete",
  },
  "accountRequests.rejectLead": {
    ru: "Отклонить",
    kg: "Четке кагуу",
    en: "Reject",
  },
  "accountRequests.closeLead": {
    ru: "Закрыть",
    kg: "Жабуу",
    en: "Close",
  },
  "accountRequests.leadActionFailed": {
    ru: "Не удалось обновить статус заявки",
    kg: "Сурам статусун жаңыртуу мүмкүн болгон жок",
    en: "Could not update request status",
  },
  "accountRequests.browseListings": {
    ru: "Смотреть объявления",
    kg: "Жарыяларды көрүү",
    en: "Browse listings",
  },
  "accountRequests.submitCargoRequest": {
    ru: "Оставить карго-заявку",
    kg: "Карго сурам калтыруу",
    en: "Submit cargo request",
  },
  "accountRequests.openListing": {
    ru: "Открыть объявление",
    kg: "Жарыяны ачуу",
    en: "Open listing",
  },
  "accountRequests.openCargoRequest": {
    ru: "Открыть карго-заявку",
    kg: "Карго сурамды ачуу",
    en: "Open cargo request",
  },
  "accountRequests.viewResponses": {
    ru: "Посмотреть отклики",
    kg: "Жоопторду көрүү",
    en: "View responses",
  },
  "accountRequests.responsesCount": {
    ru: "Отклики",
    kg: "Жооптор",
    en: "Responses",
  },
  "accountRequests.message": {
    ru: "Сообщение",
    kg: "Билдирүү",
    en: "Message",
  },
  "accountRequests.status": {
    ru: "Статус",
    kg: "Статус",
    en: "Status",
  },
  "accountRequests.responseStatus.new": {
    ru: "Новый отклик",
    kg: "Жаңы жооп",
    en: "New response",
  },
  "accountRequests.responseStatus.accepted": {
    ru: "Отклик принят",
    kg: "Жооп кабыл алынды",
    en: "Response accepted",
  },
  "accountRequests.responseStatus.rejected": {
    ru: "Отклонён",
    kg: "Четке кагылды",
    en: "Rejected",
  },
  "accountRequests.responseStatus.withdrawn": {
    ru: "Отозван",
    kg: "Кайтарылды",
    en: "Withdrawn",
  },
  "accountRequests.companyContacts": {
    ru: "Контакты компании",
    kg: "Компаниянын байланыштары",
    en: "Company contacts",
  },
  "accountRequests.createdAt": {
    ru: "Дата",
    kg: "Күн",
    en: "Date",
  },
  "accountRequests.route": {
    ru: "Маршрут",
    kg: "Маршрут",
    en: "Route",
  },
  "accountRequests.item": {
    ru: "Товар",
    kg: "Товар",
    en: "Item",
  },
  "accountRequests.price": {
    ru: "Цена",
    kg: "Баа",
    en: "Price",
  },
  "accountRequests.estimatedTime": {
    ru: "Срок",
    kg: "Мөөнөт",
    en: "Estimated time",
  },
  "accountRequests.comment": {
    ru: "Комментарий",
    kg: "Комментарий",
    en: "Comment",
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
    ru: "Вы можете создать профиль компании позже и публиковать объявления от имени бизнеса.",
    kg: "Кийинчерээк компаниянын профилин түзүп, бизнес атынан жарыялай аласыз.",
    en: "You can create a company profile later and post listings on behalf of the business.",
  },
  "company.openPublicPage": {
    ru: "Открыть публичную страницу",
    kg: "Ачык баракчаны ачуу",
    en: "Open public page",
  },
  "company.openCompany": {
    ru: "Открыть компанию",
    kg: "Компанияны ачуу",
    en: "Open company",
  },
  "company.public.filterAll": {
    ru: "Все",
    kg: "Баары",
    en: "All",
  },
  "company.public.noListingsFiltered": {
    ru: "В этом направлении пока нет объявлений компании.",
    kg: "Бул багытта компаниянын жарыялары азырынча жок.",
    en: "This company has no listings in this category yet.",
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
    ru: "У этой компании пока нет активных объявлений.",
    kg: "Бул компанияда азырынча активдүү жарыялар жок.",
    en: "This company has no active listings yet.",
  },
  "company.public.aboutTitle": {
    ru: "О компании",
    kg: "Компания жөнүндө",
    en: "About the company",
  },
  "company.public.noDescription": {
    ru: "Компания пока не добавила описание.",
    kg: "Компания азырынча сүрөттөмө кошкон жок.",
    en: "This company has not added a description yet.",
  },
  "company.public.viewListings": {
    ru: "Посмотреть объявления",
    kg: "Жарыяларды көрүү",
    en: "View listings",
  },
  "company.public.reportProfile": {
    ru: "Пожаловаться на профиль",
    kg: "Профилге арыздануу",
    en: "Report profile",
  },
  "company.storefront.previewTitle": {
    ru: "Как вас видят покупатели",
    kg: "Сатып алуучулар сизди кандай көрүшөт",
    en: "How buyers see you",
  },
  "company.storefront.previewHint": {
    ru: "Заполненный профиль повышает доверие покупателей.",
    kg: "Толук профиль сатып алуучулардын ишенимин жогорулатат.",
    en: "A complete profile helps buyers trust your business.",
  },
  "company.storefront.fieldsTitle": {
    ru: "Заполненность профиля",
    kg: "Профилдин толуктугу",
    en: "Profile completeness",
  },
  "company.storefront.emptyName": {
    ru: "Название компании",
    kg: "Компаниянын аталышы",
    en: "Company name",
  },
  "company.storefront.emptyProfileHint": {
    ru: "Заполните профиль компании, чтобы покупатели видели больше информации о вас.",
    kg: "Сатып алуучулар сиз жөнүндө көбүрөөк маалымат көрүшү үчүн компаниянын профилин толтуруңуз.",
    en: "Fill in your company profile so buyers can learn more about you.",
  },
  "company.storefront.viewPublicProfile": {
    ru: "Посмотреть публичный профиль",
    kg: "Ачык профилди көрүү",
    en: "View public profile",
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
  "admin.companies.publicProfile": {
    ru: "Публичный профиль",
    kg: "Ачык профиль",
    en: "Public profile",
  },
  "admin.companies.activeListings": {
    ru: "Активные объявления",
    kg: "Активдүү жарыялар",
    en: "Active listings",
  },
  "admin.companies.actions": {
    ru: "Действия",
    kg: "Аракеттер",
    en: "Actions",
  },
  "post.chooseType": {
    ru: "Что хотите разместить?",
    kg: "Эмне жайгаштыргыңыз келет?",
    en: "What do you want to post?",
  },
  "post.chooseTypeHint": {
    ru: "Выберите тип — дальше укажете категорию и детали.",
    kg: "Түрүн тандаңыз — андан кийин категория жана маалыматтар.",
    en: "Pick a type — then add category and details.",
  },
  "post.sellGoods": {
    ru: "Продать товар",
    kg: "Товар сатуу",
    en: "Sell a product",
  },
  "post.sellGoodsDescription": {
    ru: "Частное или розничное объявление",
    kg: "Жеке же чекене жарыя",
    en: "Private or retail listing",
  },
  "post.offerService": {
    ru: "Предложить услугу",
    kg: "Кызмат сунуштоо",
    en: "Offer a service",
  },
  "post.offerServiceDescription": {
    ru: "Мастер, специалист или компания",
    kg: "Уsta, адис же компания",
    en: "Specialist or company",
  },
  "post.wholesaleGoods": {
    ru: "Оптовый товар",
    kg: "Дүң товар",
    en: "Wholesale goods",
  },
  "post.wholesaleGoodsDescription": {
    ru: "Поставка оптом для бизнеса",
    kg: "Бизнес үчүн дүң жеткирүү",
    en: "Wholesale supply for business",
  },
  "post.market": {
    ru: "Объявление",
    kg: "Жарыя",
    en: "Listing",
  },
  "post.service": {
    ru: "Услуга",
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
    ru: "Профиль для публикаций",
    kg: "Жарыялар үчүн профиль",
    en: "Publishing profile",
  },
  "profile.addPhoneForSeller": {
    ru: "Добавьте телефон, чтобы публиковать объявления",
    kg: "Жарыя жайгаштыруу үчүн телефонду кошуңуз",
    en: "Add a phone number to publish listings",
  },
  "profile.sellerOnboardingDescription": {
    ru: "Укажите данные, которые будут видны в объявлениях. Подтвердите телефон.",
    kg: "Жарыяларда көрүнө турган маалыматтарды жазыңыз. Телефонду ырастаңыз.",
    en: "Enter details visible on your listings. Confirm your phone.",
  },
  "profile.sellerPhoneHint": {
    ru: "На этот номер с вами смогут связаться по объявлениям.",
    kg: "Жарыялар боюнча бул номерге байланыша алышат.",
    en: "People can contact you on this number about your listings.",
  },
  "profile.saveSellerProfile": {
    ru: "Сохранить и продолжить",
    kg: "Сактап улантуу",
    en: "Save and continue",
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
    ru: "Пока нет избранного",
    kg: "Тандалмалар азырынча жок",
    en: "No favorites yet",
  },
  "favorites.emptyDescription": {
    ru: "Сохраняйте интересные объявления, чтобы быстро вернуться к ним.",
    kg: "Кызыктуу жарыяларды сактап коюңуз, тез кайтуу үчүн.",
    en: "Save listings to quickly come back to them.",
  },
  "favorites.findListings": {
    ru: "Найти объявления",
    kg: "Жарыяларды табуу",
    en: "Find listings",
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
  "notifications.filterAll": { ru: "Все", kg: "Баары", en: "All" },
  "notifications.filterLeads": { ru: "Заявки", kg: "Сурамдар", en: "Requests" },
  "notifications.filterListings": { ru: "Объявления", kg: "Жарыялар", en: "Listings" },
  "notifications.filterCargo": { ru: "Карго", kg: "Карго", en: "Cargo" },
  "notifications.filterSystem": { ru: "Система", kg: "Система", en: "System" },
  "notifications.actionOpenRequest": {
    ru: "Открыть заявку",
    kg: "Сурамды ачуу",
    en: "Open request",
  },
  "notifications.actionOpenCargo": {
    ru: "Открыть карго",
    kg: "Карго ачуу",
    en: "Open cargo",
  },
  "notifications.actionOpenCompany": {
    ru: "Открыть компанию",
    kg: "Компанияны ачуу",
    en: "Open company",
  },
  "notifications.actionOpenListing": {
    ru: "Открыть объявление",
    kg: "Жарыяны ачуу",
    en: "Open listing",
  },
  "notifications.actionOpenMyListings": {
    ru: "Открыть мои объявления",
    kg: "Менин жарыяларымды ачуу",
    en: "Open my listings",
  },
  "push.settings.title": {
    ru: "Уведомления",
    kg: "Билдирмелер",
    en: "Notifications",
  },
  "push.settings.description": {
    ru: "Получайте уведомления о заявках и статусах объявлений.",
    kg: "Сурамдар жана жарыялар статусу боюнча билдирмелерди алыңыз.",
    en: "Get notified about requests and listing status updates.",
  },
  "push.settings.statusEnabled": {
    ru: "Push-уведомления включены",
    kg: "Push билдирмелер күйүк",
    en: "Push notifications enabled",
  },
  "push.settings.statusDisabled": {
    ru: "Push-уведомления выключены",
    kg: "Push билдирмелер өчүк",
    en: "Push notifications disabled",
  },
  "push.settings.statusPermissionRequired": {
    ru: "Требуется разрешение Android",
    kg: "Android уруксаты керек",
    en: "Android permission required",
  },
  "push.settings.statusBrowser": {
    ru: "Доступно в приложении Android",
    kg: "Android колдонмосунда гана",
    en: "Available in the Android app",
  },
  "push.settings.enable": {
    ru: "Включить уведомления",
    kg: "Билдирмелерди күйгүзүү",
    en: "Enable notifications",
  },
  "push.settings.disable": {
    ru: "Отключить уведомления",
    kg: "Билдирмелерди өчүрүү",
    en: "Disable notifications",
  },
  "push.settings.test": {
    ru: "Отправить тестовое уведомление",
    kg: "Сынак билдирме жөнөтүү",
    en: "Send test notification",
  },
  "push.settings.enabledSuccess": {
    ru: "Уведомления включены",
    kg: "Билдирмелер күйгүзүлдү",
    en: "Notifications enabled",
  },
  "push.settings.disabledSuccess": {
    ru: "Уведомления отключены",
    kg: "Билдирмелер өчүрүлдү",
    en: "Notifications disabled",
  },
  "push.settings.permissionDenied": {
    ru: "Разрешение на уведомления отклонено",
    kg: "Билдирме уруксаты четке какты",
    en: "Notification permission denied",
  },
  "push.settings.permissionDeniedHint": {
    ru: "Разрешение отключено. Его можно включить в настройках Android.",
    kg: "Уруксат четке какты. Android жөндөөлөрүнөн күйгүзсө болот.",
    en: "Permission denied. You can enable it in Android settings.",
  },
  "push.settings.unavailableBrowser": {
    ru: "Push недоступен в браузере. Используйте приложение Android.",
    kg: "Push браузерде жок. Android колдонмосун колдонуңуз.",
    en: "Push is not available in the browser. Use the Android app.",
  },
  "push.settings.enableFailed": {
    ru: "Не удалось включить уведомления",
    kg: "Билдирмелерди күйгүзүү мүмкүн болгон жок",
    en: "Could not enable notifications",
  },
  "push.settings.disableFailed": {
    ru: "Не удалось отключить уведомления",
    kg: "Билдирмелерди өчүрүү мүмкүн болгон жок",
    en: "Could not disable notifications",
  },
  "push.settings.testSent": {
    ru: "Тестовое уведомление отправлено",
    kg: "Сынак билдирме жөнөтүлдү",
    en: "Test notification sent",
  },
  "push.settings.testFailed": {
    ru: "Не удалось отправить тестовое уведомление",
    kg: "Сынак билдирме жөнөтүлбөдү",
    en: "Could not send test notification",
  },
  "push.settings.noTokens": {
    ru: "Сначала включите push-уведомления",
    kg: "Алдыда push билдирмелерди күйгүзүңүз",
    en: "Enable push notifications first",
  },
  "push.settings.firebaseMissing": {
    ru: "Push на сервере не настроен (Firebase credentials)",
    kg: "Push серверде орнотулган эмес (Firebase)",
    en: "Push not configured on server (Firebase credentials)",
  },
  "notifications.markAllReadSuccess": {
    ru: "Все уведомления отмечены прочитанными",
    kg: "Бардык билдирмелер окуулган",
    en: "All notifications marked as read",
  },
  "notifications.markAllReadError": {
    ru: "Не удалось обновить уведомления",
    kg: "Билдирмелерди жаңыртуу мүмкүн болгон жок",
    en: "Could not update notifications",
  },
  "notifications.emptyListingsCategory": {
    ru: "Пока нет уведомлений по объявлениям. Здесь появятся статусы модерации и публикации ваших объявлений.",
    kg: "Жарыялар боюнча билдирмелер азырынча жок. Модерация жана жарыялоо статустары бул жерде көрүнөт.",
    en: "No listing notifications yet. Moderation and publication status updates will appear here.",
  },
  "notifications.emptyTitle": {
    ru: "Пока нет уведомлений",
    kg: "Азырынча билдирме жок",
    en: "No notifications yet",
  },
  "notifications.emptyDescription": {
    ru: "Здесь будут заявки, статусы объявлений и важные события.",
    kg: "Сурамдар, жарыя статустары жана маанилүү окуялар бул жерде көрүнөт.",
    en: "Requests, listing updates and important events will appear here.",
  },
  "notifications.goToAccount": {
    ru: "Перейти в кабинет",
    kg: "Кабинетке өтүү",
    en: "Go to account",
  },
  "notifications.goToSellerDashboard": {
    ru: "Перейти в личный кабинет",
    kg: "Жеке кабинетке өтүү",
    en: "Go to account",
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
  "opt.heroTitle": {
    ru: "Опт",
    kg: "Дүң",
    en: "Wholesale",
  },
  "opt.heroSubtitle": {
    ru: "Находите поставщиков, партии товаров и оптовые предложения.",
    kg: "Жеткирүүчүлөрдү, партияларды жана дүң сунуштарды табыңыз.",
    en: "Find suppliers, batches, and wholesale offers.",
  },
  "opt.searchPlaceholder": {
    ru: "Что ищете оптом?",
    kg: "Дүңүнөн эмне издейсиз?",
    en: "What are you looking for wholesale?",
  },
  "opt.findWholesale": {
    ru: "Найти оптом",
    kg: "Дүңүнөн табуу",
    en: "Find wholesale",
  },
  "opt.postOffer": {
    ru: "Разместить оптовое предложение",
    kg: "Дүң сунуш жайгаштыруу",
    en: "Post a wholesale offer",
  },
  "opt.forBusinessTitle": {
    ru: "Для бизнеса",
    kg: "Бизнес үчүн",
    en: "For business",
  },
  "opt.forBusiness.step1": {
    ru: "Найдите оптовое предложение по категории или поиску.",
    kg: "Категория же издөө аркылуу дүң сунушту табыңыз.",
    en: "Find a wholesale offer by category or search.",
  },
  "opt.forBusiness.step2": {
    ru: "Откройте карточку и свяжитесь с поставщиком.",
    kg: "Карточканы ачып, жеткирүүчү менен байланышыңыз.",
    en: "Open the card and contact the supplier.",
  },
  "opt.forBusiness.step3": {
    ru: "Или разместите своё оптовое предложение для компаний.",
    kg: "Же компаниялар үчүн өз дүң сунушуңузду жайгаштырыңыз.",
    en: "Or post your wholesale offer for companies.",
  },
  "opt.pageTitle": {
    ru: "Разместить оптовое предложение",
    kg: "Дүң сунуш жайгаштыруу",
    en: "Post a wholesale offer",
  },
  "opt.pageSubtitle": {
    ru: "Укажите товар, оптовую цену, минимальную партию и город.",
    kg: "Товарды, дүң бааны, минималдуу партияны жана шаарды жазыңыз.",
    en: "Add the product, wholesale price, MOQ, and city.",
  },
  "opt.formCity": {
    ru: "Где находится товар?",
    kg: "Товар кайда?",
    en: "Where is the product?",
  },
  "opt.submittedForModeration": {
    ru: "Оптовое предложение отправлено на модерацию.",
    kg: "Дүң сунуш модерацияга жөнөтүлдү.",
    en: "Wholesale offer submitted for moderation.",
  },
  "opt.openOffer": {
    ru: "Открыть предложение",
    kg: "Сунушту ачуу",
    en: "Open offer",
  },
  "opt.postAnotherOffer": {
    ru: "Разместить ещё одно оптовое предложение",
    kg: "Дагы бир дүң сунуш жайгаштыруу",
    en: "Post another wholesale offer",
  },
  "opt.emptyFilteredTitle": {
    ru: "Оптовые предложения не найдены.",
    kg: "Дүң сунуштар табылган жок.",
    en: "No wholesale offers found.",
  },
  "opt.emptyFilteredDescription": {
    ru: "Попробуйте изменить запрос, город или категорию.",
    kg: "Сурамды, шаарды же категорияны өзгөртүп көрүңүз.",
    en: "Try changing the query, city, or category.",
  },
  "opt.formSectionTitle": {
    ru: "Какое оптовое предложение?",
    kg: "Кандай дүң сунуш?",
    en: "What wholesale offer?",
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
  "createListing.photoUploaded": {
    ru: "Фото загружено",
    kg: "Сүрөт жүктөлдү",
    en: "Photo uploaded",
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
  "createListing.postAnother": {
    ru: "Подать ещё одно",
    kg: "Дагы бирөөнү берүү",
    en: "Post another",
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

  "listingForm.steps.type": {
    ru: "Тип",
    kg: "Түр",
    en: "Type",
  },
  "listingForm.steps.category": {
    ru: "Категория",
    kg: "Категория",
    en: "Category",
  },
  "listingForm.steps.details": {
    ru: "Данные",
    kg: "Маалымат",
    en: "Details",
  },
  "listingForm.steps.description": {
    ru: "Описание",
    kg: "Сүрөттөмө",
    en: "Description",
  },
  "listingForm.steps.preview": {
    ru: "Проверка",
    kg: "Текшерүү",
    en: "Review",
  },
  "listingForm.stepsProgress": {
    ru: "Шаги создания объявления",
    kg: "Жарыя түзүү кадамдары",
    en: "Listing creation steps",
  },
  "listingForm.stepProgress": {
    ru: "Шаг {n} из {total}",
    kg: "{n}/{total} кadam",
    en: "Step {n} of {total}",
  },
  "listingForm.composeDescription": {
    ru: "Составить описание",
    kg: "Сүрөттөмө түзүү",
    en: "Compose description",
  },
  "listingForm.composingDescription": {
    ru: "Составляем...",
    kg: "Түзүлүүдө...",
    en: "Composing...",
  },
  "listingForm.composeDescriptionHint": {
    ru: "Мы соберём описание из выбранных данных. Проверьте текст перед публикацией.",
    kg: "Тандалган маалыматтардан сүрөттөмө түзөбүз. Жарыялоодон мурун текшериңиз.",
    en: "We will compose a description from your data. Review it before publishing.",
  },
  "listingForm.composeDescriptionNeedData": {
    ru: "Укажите название и категорию, чтобы составить описание.",
    kg: "Сүрөттөмө түзүү үчүн аталышты жана категорияны жазыңыз.",
    en: "Enter a title and category to compose a description.",
  },
  "listingForm.chooseType": {
    ru: "Что хотите разместить?",
    kg: "Эмне жайгаштыргыңыз келет?",
    en: "What do you want to post?",
  },
  "listingForm.chooseCategory": {
    ru: "Выберите категорию",
    kg: "Категорияны тандаңыз",
    en: "Choose a category",
  },
  "listingForm.mainInfo": {
    ru: "Основная информация",
    kg: "Негизги маалымат",
    en: "Main information",
  },
  "listingForm.characteristics": {
    ru: "Характеристики",
    kg: "Мүнөздөмөлөр",
    en: "Characteristics",
  },
  "listingForm.characteristicsHint": {
    ru: "Добавьте коротко важные данные. Например: модель, размер, цвет, состояние, материал, мощность.",
    kg: "Маанилүү маалыматты кыскача жазыңыз. Мисалы: модель, өлчөм, түс, абал.",
    en: "Add short key details. For example: model, size, color, condition, material.",
  },
  "listingForm.characteristicsPlaceholder": {
    ru: "iPhone 13 Pro Max\n256 GB\nСостояние хорошее\nЦвет графитовый",
    kg: "iPhone 13 Pro Max\n256 GB\nАбалы жакшы\nТүсү графит",
    en: "iPhone 13 Pro Max\n256 GB\nGood condition\nGraphite color",
  },
  "listingForm.description": {
    ru: "Описание",
    kg: "Сүрөттөмө",
    en: "Description",
  },
  "listingForm.generateDescription": {
    ru: "Составить описание",
    kg: "Сүрөттөмө түзүү",
    en: "Compose description",
  },
  "listingForm.generatingDescription": {
    ru: "Составляем...",
    kg: "Түзүлүүдө...",
    en: "Composing...",
  },
  "listingForm.descriptionGenerated": {
    ru: "Описание составлено",
    kg: "Сүрөттөмө түзүлдү",
    en: "Description composed",
  },
  "listingForm.aiNotConnected": {
    ru: "Составление описания пока недоступно.",
    kg: "Сүрөттөмө түзүү азырынча жеткиликтүү эмес.",
    en: "Description compose is not available yet.",
  },
  "listingForm.aiNeedMoreData": {
    ru: "Укажите название и категорию, чтобы составить описание.",
    kg: "Сүрөттөмө түзүү үчүн аталышты жана категорияны жазыңыз.",
    en: "Enter a title and category to compose a description.",
  },
  "listingForm.aiGenerateError": {
    ru: "Не удалось составить описание. Попробуйте позже.",
    kg: "Сүрөттөмө түзүлгөн жок. Кийинчерээк аракет кылыңыз.",
    en: "Could not compose description. Try again later.",
  },
  "listingForm.reviewDescriptionHint": {
    ru: "Проверьте описание перед публикацией.",
    kg: "Жарыялоодон мурун сүрөттөмөнү текшериңиз.",
    en: "Review the description before publishing.",
  },

  // Onboarding hints — Phase 115
  "onboarding.title": {
    ru: "Как быстро подать объявление",
    kg: "Жарыяны тез кантип берүү",
    en: "How to post quickly",
  },
  "onboarding.hintPost": {
    ru: "Подайте объявление за пару минут",
    kg: "Жарыяны бир нече мүнөттө бериңиз",
    en: "Post a listing in a few minutes",
  },
  "onboarding.hintPhotos": {
    ru: "Фото и описание можно добавить сразу",
    kg: "Сүрөт жана сүрөттөмөнү дароо кошсо болот",
    en: "Add photos and description right away",
  },
  "onboarding.hintDescription": {
    ru: "Описание можно составить автоматически",
    kg: "Сүрөттөмөнү автоматтык түзсө болот",
    en: "Description can be composed automatically",
  },
  "onboarding.dismiss": {
    ru: "Закрыть подсказки",
    kg: "Кеңештерди жабуу",
    en: "Dismiss hints",
  },
  "onboarding.hide": {
    ru: "Скрыть",
    kg: "Жашыруу",
    en: "Hide",
  },
  "onboarding.homeWelcomeTitle": {
    ru: "ВсеТут — объявления, услуги, опт и карго.",
    kg: "ВсеТут — жарыялар, кызматтар, дүң жана карго.",
    en: "VseTut — listings, services, wholesale and cargo.",
  },
  "onboarding.homeWelcomeDescription": {
    ru: "Подайте объявление, найдите товар или создайте карго-заявку.",
    kg: "Жарыя бериңиз, товар табыңыз же карго-сурам түзүңүз.",
    en: "Post a listing, find products or create a cargo request.",
  },
  "onboarding.postListing": {
    ru: "Подать объявление",
    kg: "Жарыя берүү",
    en: "Post listing",
  },
  "onboarding.findProduct": {
    ru: "Найти товар",
    kg: "Товар табуу",
    en: "Find products",
  },
  "onboarding.quickStart": {
    ru: "Быстрый старт",
    kg: "Тез баштоо",
    en: "Quick start",
  },
  "onboarding.postFirstListing": {
    ru: "Подать первое объявление",
    kg: "Алгачкы жарыя берүү",
    en: "Post your first listing",
  },
  "onboarding.setupCompany": {
    ru: "Настроить компанию",
    kg: "Компанияны орнотуу",
    en: "Set up company",
  },
  "onboarding.addCompany": {
    ru: "Добавить компанию",
    kg: "Компания кошуу",
    en: "Add company",
  },
  "onboarding.listingFormHintIntro": {
    ru: "Заполните основные данные. Описание можно составить автоматически.",
    kg: "Негизги маалыматтарды толтуруңуз. Сүрөттөмөнү автоматтык түзсө болот.",
    en: "Fill in the basics. You can compose the description automatically.",
  },
  "onboarding.listingFormHintCategory": {
    ru: "выберите категорию",
    kg: "категорияны тандаңыз",
    en: "choose a category",
  },
  "onboarding.listingFormHintPhotos": {
    ru: "добавьте фото",
    kg: "сүрөт кошуңуз",
    en: "add photos",
  },
  "onboarding.listingFormHintPrice": {
    ru: "укажите цену и город",
    kg: "баа жана шаарды көрсөтүңүз",
    en: "set price and city",
  },
  "onboarding.listingFormHintCompose": {
    ru: "нажмите «Составить описание», если не хотите писать вручную",
    kg: "кол менен жазгыңыз келбесе «Сүрөттөмө түзүү» баскычын басыңыз",
    en: "tap Compose description if you do not want to write manually",
  },
  "onboarding.collapseHint": {
    ru: "Свернуть подсказку",
    kg: "Кеңешти жыйноо",
    en: "Collapse hint",
  },
  "onboarding.expandHint": {
    ru: "Развернуть подсказку",
    kg: "Кеңешти ачуу",
    en: "Expand hint",
  },
  "onboarding.cargoQuickGuideTitle": {
    ru: "Как работает карго:",
    kg: "Карго кантип иштейт:",
    en: "How cargo works:",
  },
  "onboarding.cargoQuickGuideStep1": {
    ru: "Создайте заявку",
    kg: "Сурам түзүңүз",
    en: "Create a request",
  },
  "onboarding.cargoQuickGuideStep2": {
    ru: "Укажите маршрут и груз",
    kg: "Маршрутту жана жүктү көрсөтүңүз",
    en: "Specify route and cargo",
  },
  "onboarding.cargoQuickGuideStep3": {
    ru: "Получите отклики от карго-компаний",
    kg: "Карго компаниялардан жооп алыңыз",
    en: "Get replies from cargo companies",
  },
  "onboarding.cargoCreateRequest": {
    ru: "Создать заявку",
    kg: "Сурам түзүү",
    en: "Create request",
  },
  "listingForm.aiKeptExistingDescription": {
    ru: "Описание уже заполнено — текст не перезаписан.",
    kg: "Сүрөттөмө толук — текст алмаштырылган жок.",
    en: "Description already filled — your text was kept.",
  },
  "listingForm.draft.found": {
    ru: "Найден черновик объявления",
    kg: "Жарыя черновиги табылды",
    en: "Listing draft found",
  },
  "listingForm.draft.description": {
    ru: "Можно восстановить ранее введённые данные.",
    kg: "Мурунтуу киргизилген маалыматты калыбына келтирсе болот.",
    en: "You can restore previously entered data.",
  },
  "listingForm.draft.restore": {
    ru: "Восстановить",
    kg: "Калыбына келтирүү",
    en: "Restore",
  },
  "listingForm.draft.dismiss": {
    ru: "Удалить",
    kg: "Өчүрүү",
    en: "Delete",
  },
  "listingForm.unsavedExitConfirm": {
    ru: "Выйти без сохранения? Несохранённые данные будут потеряны.",
    kg: "Сактабай чыгуу? Сакталбаган маалымат жоголот.",
    en: "Leave without saving? Unsaved data will be lost.",
  },
  "listingForm.publishPreview": {
    ru: "Проверка и публикация",
    kg: "Текшерүү жана жарыялоо",
    en: "Review and publish",
  },
  "listingForm.submitForModeration": {
    ru: "Отправить на модерацию",
    kg: "Модерацияга жөнөтүү",
    en: "Submit for moderation",
  },
  "listingForm.priceNegotiable": {
    ru: "Договорная",
    kg: "Макулдашуу боюнча",
    en: "Negotiable",
  },
  "listingForm.postAs": {
    ru: "Разместить от имени",
    kg: "Кимдин атынан",
    en: "Post as",
  },
  "listingForm.postAsPersonal": {
    ru: "Личный аккаунт",
    kg: "Жеке аккаунт",
    en: "Personal account",
  },
  "listingForm.postAsCompany": {
    ru: "Компания: {companyName}",
    kg: "Компания: {companyName}",
    en: "Company: {companyName}",
  },
  "listingForm.showExtra": {
    ru: "Дополнительно",
    kg: "Кошумча",
    en: "Additional",
  },
  "listingForm.hideExtra": {
    ru: "Скрыть дополнительно",
    kg: "Кошумчаны жашыруу",
    en: "Hide additional",
  },
  "listingForm.descriptionTooShort": {
    ru: "Добавьте описание или характеристики (минимум 20 символов).",
    kg: "Сүрөттөмө же мүнөздөмө кошуңуз (кеминде 20 белги).",
    en: "Add a description or characteristics (at least 20 characters).",
  },

  "listingCharacteristics.title": {
    ru: "Характеристики",
    kg: "Мүнөздөмөлөр",
    en: "Characteristics",
  },
  "listingCharacteristics.description": {
    ru: "Выберите подходящие параметры — мы используем их для описания и поиска.",
    kg: "Ылайыктуу параметрлерди тандаңыз — сүрөттөмө жана издөө үчүн колдонобуз.",
    en: "Choose matching parameters — we use them for the description and search.",
  },
  "listingCharacteristics.main": {
    ru: "Основные",
    kg: "Негизги",
    en: "Main",
  },
  "listingCharacteristics.additional": {
    ru: "Дополнительные",
    kg: "Кошумча",
    en: "Additional",
  },
  "listingCharacteristics.showMore": {
    ru: "Показать дополнительные",
    kg: "Кошумчаларды көрсөтүү",
    en: "Show additional",
  },
  "listingCharacteristics.showLess": {
    ru: "Скрыть дополнительные",
    kg: "Кошумчаларды жашыруу",
    en: "Hide additional",
  },
  "listingCharacteristics.other": {
    ru: "Другое",
    kg: "Башка",
    en: "Other",
  },
  "listingCharacteristics.otherPlaceholder": {
    ru: "Укажите своё значение",
    kg: "Өз мааниңизди жазыңыз",
    en: "Enter your value",
  },
  "listingCharacteristics.previewTitle": {
    ru: "Характеристики",
    kg: "Мүнөздөмөлөр",
    en: "Characteristics",
  },
  "listingCharacteristics.usedForAi": {
    ru: "Эти параметры учитываются при составлении описания.",
    kg: "Бул параметрлер сүрөттөмө түзүүдө эске алынат.",
    en: "These parameters are used when composing the description.",
  },
  "listingCharacteristics.detailTitle": {
    ru: "Характеристики",
    kg: "Мүнөздөмөлөр",
    en: "Specifications",
  },
  "listingCharacteristics.empty": {
    ru: "Характеристики не указаны",
    kg: "Мүнөздөмөлөр көрсөтүлгөн эмес",
    en: "No specifications",
  },
  "listingCharacteristics.saved": {
    ru: "Характеристики сохранены",
    kg: "Мүнөздөмөлөр сакталды",
    en: "Specifications saved",
  },
  "listingCharacteristics.mainSpecs": {
    ru: "Основные",
    kg: "Негизги",
    en: "Main",
  },
  "listingCharacteristics.additionalSpecs": {
    ru: "Дополнительные",
    kg: "Кошумча",
    en: "Additional",
  },
  "listingCharacteristics.marketTitle": {
    ru: "Характеристики",
    kg: "Мүнөздөмөлөр",
    en: "Specifications",
  },
  "listingCharacteristics.servicesTitle": {
    ru: "Условия услуги",
    kg: "Кызматтын шарттары",
    en: "Service details",
  },
  "listingCharacteristics.optTitle": {
    ru: "Условия опта",
    kg: "Опт шарттары",
    en: "Wholesale details",
  },
  "listingCharacteristics.cargoTitle": {
    ru: "Направления и услуги",
    kg: "Багыттар жана кызматтар",
    en: "Routes and services",
  },

  "listingAutosuggest.categoryHint": {
    ru: "Похоже, это категория «{category}». Выбрать?",
    kg: "Бул «{category}» категориясына окшойт. Тандайсызбы?",
    en: "This looks like “{category}”. Select it?",
  },
  "listingAutosuggest.chooseCategory": {
    ru: "Выбрать категорию",
    kg: "Категорияны тандоо",
    en: "Choose category",
  },
  "listingAutosuggest.characteristicsHint": {
    ru: "Мы нашли возможные характеристики:",
    kg: "Мүмкүн болгон мүнөздөмөлөрдү таптык:",
    en: "We found possible characteristics:",
  },
  "listingAutosuggest.apply": {
    ru: "Применить",
    kg: "Колдонуу",
    en: "Apply",
  },
  "listingAutosuggest.dismiss": {
    ru: "Не сейчас",
    kg: "Азыр эмес",
    en: "Not now",
  },
  "listingAutosuggest.detected": {
    ru: "Обнаружено",
    kg: "Табылды",
    en: "Detected",
  },
  "listingAutosuggest.suggestedCategory": {
    ru: "Предложенная категория",
    kg: "Сунушталган категория",
    en: "Suggested category",
  },
  "listingAutosuggest.suggestedCharacteristics": {
    ru: "Предложенные характеристики",
    kg: "Сунушталган мүнөздөмөлөр",
    en: "Suggested characteristics",
  },
  "listingAutosuggest.noSuggestions": {
    ru: "Пока нет подсказок — продолжайте заполнение.",
    kg: "Азырынча сунуш жок — толтурууну улантыңыз.",
    en: "No suggestions yet — keep filling the form.",
  },

  // Listing status — Phase 56
  "status.draft": { ru: "Черновик", kg: "Долбоор", en: "Draft" },
  "status.pendingModeration": {
    ru: "На модерации",
    kg: "Модерацияда",
    en: "Pending moderation",
  },
  "status.published": { ru: "Активно", kg: "Активдүү", en: "Active" },
  "status.rejected": { ru: "Отклонено", kg: "Четке кагылды", en: "Rejected" },
  "status.archived": { ru: "В архиве", kg: "Архивде", en: "Archived" },
  "status.hint.pendingModeration": {
    ru: "Мы проверяем объявление. После одобрения оно появится в поиске.",
    kg: "Жарыяны текшеребиз. Макулданганда издөөдө көрүнөт.",
    en: "We are reviewing your listing. It will appear in search after approval.",
  },
  "status.hint.rejected": {
    ru: "Объявление не прошло проверку. Измените данные и отправьте повторно.",
    kg: "Жарыя текшерүүдөн өткөн жок. Маалыматты өзгөртүп, кайра жөнөтүңүз.",
    en: "Listing was not approved. Update details and submit again.",
  },
  "status.hint.published": {
    ru: "Объявление опубликовано и видно пользователям.",
    kg: "Жарыя жарыяланды жана колдонуучуларга көрүнөт.",
    en: "Listing is published and visible to users.",
  },
  "status.hint.draft": {
    ru: "Объявление ещё не отправлено на публикацию.",
    kg: "Жарыя азырынча жарыялоого жөнөтүлгөн эмес.",
    en: "Listing has not been submitted for publication yet.",
  },
  "status.hint.archived": {
    ru: "Объявление скрыто из поиска. Его можно восстановить.",
    kg: "Жарыя издөөдөн жашырылган. Аны калыбына келтирсе болот.",
    en: "Listing is hidden from search. You can restore it.",
  },
  "leadStatus.hint.new": {
    ru: "Новая заявка — ответьте покупателю как можно скорее.",
    kg: "Жаңы сурам — сатып алуучуга тез жооп бериңиз.",
    en: "New request — reply to the buyer soon.",
  },
  "leadStatus.hint.inProgress": {
    ru: "Заявка в работе.",
    kg: "Сурам иштетилүүдө.",
    en: "Request is in progress.",
  },
  "leadStatus.hint.closed": {
    ru: "Заявка завершена.",
    kg: "Сурам аякталды.",
    en: "Request is completed.",
  },
  "leadStatus.hint.rejected": {
    ru: "Заявка отклонена.",
    kg: "Сурам четке кагылды.",
    en: "Request was rejected.",
  },
  "cargoStatus.hint.new": {
    ru: "Новая карго-заявка ожидает обработки.",
    kg: "Жаңы карго сурамы иштетилүүдө.",
    en: "New cargo request awaiting processing.",
  },
  "cargoStatus.hint.inReview": {
    ru: "Заявка на рассмотрении.",
    kg: "Сурам каралууда.",
    en: "Request is under review.",
  },
  "cargoStatus.hint.contacted": {
    ru: "С вами связались по заявке.",
    kg: "Сурам боюнча байланышты.",
    en: "You have been contacted about this request.",
  },
  "cargoStatus.hint.closed": {
    ru: "Карго-заявка закрыта.",
    kg: "Карго сурамы жабылды.",
    en: "Cargo request is closed.",
  },
  "accountActivity.title": {
    ru: "Активность",
    kg: "Активдүүлүк",
    en: "Activity",
  },
  "accountActivity.unreadNotifications": {
    ru: "{count} новых уведомлений",
    kg: "{count} жаңы билдирме",
    en: "{count} new notifications",
  },
  "accountActivity.newLeads": {
    ru: "{count} новых заявок",
    kg: "{count} жаңы сурам",
    en: "{count} new requests",
  },
  "accountActivity.leadsInProgress": {
    ru: "{count} заявок в работе",
    kg: "{count} сурам иште",
    en: "{count} requests in progress",
  },
  "accountActivity.pendingListings": {
    ru: "{count} объявлений на модерации",
    kg: "{count} жарыя модерацияда",
    en: "{count} listings pending moderation",
  },
  "accountActivity.activeListings": {
    ru: "{count} активных объявлений",
    kg: "{count} активдүү жарыя",
    en: "{count} active listings",
  },
  "accountActivity.rejectedListings": {
    ru: "{count} отклонённых объявлений",
    kg: "{count} четке кагылган жарыя",
    en: "{count} rejected listings",
  },
  "accountActivity.cargoRequests": {
    ru: "{count} карго-заявок",
    kg: "{count} карго сурам",
    en: "{count} cargo requests",
  },
  "accountActivity.quietTitle": {
    ru: "Пока всё спокойно",
    kg: "Азырынча тынч",
    en: "All quiet for now",
  },
  "accountActivity.quietDescription": {
    ru: "Создайте объявление или заявку, чтобы начать работу.",
    kg: "Иштей баштоо үчүн жарыя же сурам түзүңүз.",
    en: "Post a listing or submit a request to get started.",
  },
  "accountActivity.openNotifications": {
    ru: "Открыть уведомления",
    kg: "Билдирмелерди ачуу",
    en: "Open notifications",
  },
  "accountActivity.openListings": {
    ru: "Мои объявления",
    kg: "Менин жарыяларым",
    en: "My listings",
  },
  "accountActivity.openRequests": {
    ru: "Мои заявки",
    kg: "Менин сурамдарым",
    en: "My requests",
  },
  "accountActivity.leadsStatsTitle": {
    ru: "Заявки по объявлениям",
    kg: "Жарыялар боюнча сурамдар",
    en: "Listing requests",
  },
  "accountActivity.newLeadsShort": {
    ru: "Новые заявки",
    kg: "Жаңы сурамдар",
    en: "New requests",
  },
  "accountActivity.receivedLeadsShort": {
    ru: "Полученные заявки",
    kg: "Келген сурамдар",
    en: "Received requests",
  },
  "accountActivity.sentLeadsShort": {
    ru: "Отправленные заявки",
    kg: "Жөнөтүлгөн сурамдар",
    en: "Sent requests",
  },
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
