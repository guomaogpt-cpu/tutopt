const TRANSLIT_MAP: Record<string, string> = {
  avtomaticeskij: "автоматический",
  avtomaticheskij: "автоматический",
  avtomaticheskiy: "автоматический",
  avtomatic: "автомат",
  avto: "авто",
  avtomat: "автомат",
  stanok: "станок",
  masina: "машина",
  mashina: "машина",
  dlia: "для",
  dla: "для",
  fasovki: "фасовки",
  fasovke: "фасовке",
  fasovshchik: "фасовщик",
  fasovschik: "фасовщик",
  poroshkov: "порошков",
  poroshka: "порошка",
  granul: "гранул",
  proizvodstva: "производства",
  proizvodstvo: "производство",
  oborudovanie: "оборудование",
  oborudovanija: "оборудования",
  upakovki: "упаковки",
  upakovochnyj: "упаковочный",
  upakovochnaya: "упаковочная",
  stroitelnyh: "строительных",
  stroitelnyj: "строительный",
  gvozdej: "гвоздей",
  gvozdi: "гвозди",
  elektro: "электро",
  promyshlennyj: "промышленный",
  promyshlennogo: "промышленного",
  liniya: "линия",
  linii: "линии",
  apparat: "аппарат",
  ustanovka: "установка",
  agregat: "агрегат",
  komplekt: "комплект",
  novyj: "новый",
  bu: "бу",
  poluavtomat: "полуавтомат",
  poluavtomaticheskij: "полуавтоматический",
  i: "и",
  na: "на",
  v: "в",
  s: "с",
  po: "по",
  iz: "из",
};

const LALAFO_CITY_NAMES: Record<string, string> = {
  bishkek: "Бишкек",
  osh: "Ош",
  karakol: "Каракол",
  jalalabad: "Джалал-Абад",
  "jalal-abad": "Джалал-Абад",
  naryn: "Нарын",
  talas: "Талас",
  batken: "Баткен",
  kant: "Кант",
  tokmok: "Токмок",
};

function capitalizeFirst(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function transliterateWord(word: string): string {
  const lower = word.toLowerCase();
  if (TRANSLIT_MAP[lower]) {
    return TRANSLIT_MAP[lower];
  }

  if (/^\d+$/.test(lower)) {
    return lower;
  }

  return lower;
}

export function titleFromLalafoSlug(slug: string): string {
  const cleaned = slug
    .replace(/-id-\d+$/i, "")
    .replace(/_/g, "-")
    .trim();

  if (!cleaned) {
    return "";
  }

  const words = cleaned.split("-").filter(Boolean).map(transliterateWord);
  const title = words.join(" ").replace(/\s+/g, " ").trim();
  return capitalizeFirst(title);
}

export function parseLalafoUrlHints(url: string): {
  sourceExternalId: string | null;
  city: string | null;
  titleFromSlug: string | null;
  slug: string | null;
} {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);

    let city: string | null = null;
    let slug: string | null = null;

    const citySegment = parts[0]?.toLowerCase();
    if (citySegment && LALAFO_CITY_NAMES[citySegment]) {
      city = LALAFO_CITY_NAMES[citySegment] ?? capitalizeFirst(citySegment);
    }

    const adsIndex = parts.indexOf("ads");
    if (adsIndex >= 0 && parts[adsIndex + 1]) {
      slug = parts[adsIndex + 1] ?? null;
    } else {
      const last = parts.at(-1);
      if (last && last.includes("-id-")) {
        slug = last;
      }
    }

    const sourceExternalId =
      url.match(/-id-(\d+)/i)?.[1] ?? url.match(/[?&]id=(\d+)/i)?.[1] ?? null;

    const titleFromSlug = slug ? titleFromLalafoSlug(slug) : null;

    return {
      sourceExternalId,
      city,
      titleFromSlug: titleFromSlug || null,
      slug,
    };
  } catch {
    return {
      sourceExternalId: null,
      city: null,
      titleFromSlug: null,
      slug: null,
    };
  }
}
