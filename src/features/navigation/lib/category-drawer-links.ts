import type { ListingVertical } from "@prisma/client";

export type CategoryDrawerLink = {
  label: string;
  href: string;
};

export type CategoryDrawerSection = {
  title: string;
  links: CategoryDrawerLink[];
};

function listingsCategory(vertical: ListingVertical, categorySlug: string): string {
  const params = new URLSearchParams({
    vertical,
    category: categorySlug,
  });
  return `/listings?${params.toString()}`;
}

/** Vertical landing pages + catalog category shortcuts for the header drawer. */
export const CATEGORY_DRAWER_VERTICALS: CategoryDrawerLink[] = [
  { label: "Объявления", href: "/market" },
  { label: "Услуги", href: "/services" },
  { label: "Опт", href: "/opt" },
  { label: "Карго", href: "/cargo" },
];

export const CATEGORY_DRAWER_POPULAR: CategoryDrawerLink[] = [
  {
    label: "Оборудование и станки",
    href: listingsCategory("MARKET", "market-oborudovanie-i-stanki"),
  },
  {
    label: "Электроника",
    href: listingsCategory("MARKET", "market-telefony-i-elektronika"),
  },
  {
    label: "Авто и запчасти",
    href: listingsCategory("MARKET", "market-avto-i-moto"),
  },
  {
    label: "Ремонт и строительство",
    href: listingsCategory("MARKET", "market-stroitelstvo-i-remont"),
  },
  {
    label: "Для дома",
    href: listingsCategory("MARKET", "market-dom-i-sad"),
  },
  {
    label: "Одежда и обувь",
    href: listingsCategory("MARKET", "market-odezhda-i-obuv"),
  },
  {
    label: "Продукты питания",
    href: listingsCategory("OPT", "produkty-pitaniya"),
  },
  {
    label: "Красота и здоровье",
    href: listingsCategory("MARKET", "market-krasota-i-zdorove"),
  },
  {
    label: "Детские товары",
    href: listingsCategory("MARKET", "market-detskie-tovary"),
  },
  {
    label: "Недвижимость",
    href: listingsCategory("MARKET", "market-nedvizhimost"),
  },
  { label: "Работа и услуги", href: "/services" },
  { label: "Карго и доставка", href: "/cargo" },
  {
    label: "Сельхозтовары",
    href: listingsCategory("MARKET", "market-eq-selhoz"),
  },
  {
    label: "Запчасти и комплектующие",
    href: listingsCategory("MARKET", "market-eq-zapchasti"),
  },
];

export const CATEGORY_DRAWER_SERVICES: CategoryDrawerLink[] = [
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
    label: "Клининг",
    href: listingsCategory("SERVICES", "services-kliningovye-uslugi"),
  },
  {
    label: "Грузчики",
    href: listingsCategory("SERVICES", "services-perevozki-i-gruzchiki"),
  },
  {
    label: "IT и digital",
    href: listingsCategory("SERVICES", "services-it-i-digital"),
  },
  {
    label: "Обучение",
    href: listingsCategory("SERVICES", "services-obuchenie"),
  },
  {
    label: "Красота",
    href: listingsCategory("SERVICES", "services-krasota-i-zdorove"),
  },
  {
    label: "Автоуслуги",
    href: listingsCategory("SERVICES", "services-avtouslugi"),
  },
];

export const CATEGORY_DRAWER_OPT: CategoryDrawerLink[] = [
  {
    label: "Продукты",
    href: listingsCategory("OPT", "produkty-pitaniya"),
  },
  {
    label: "Оборудование",
    href: listingsCategory("OPT", "opt-oborudovanie"),
  },
  {
    label: "Сырьё",
    href: listingsCategory("OPT", "opt-syrye-i-materialy"),
  },
  {
    label: "Упаковка",
    href: listingsCategory("OPT", "opt-upakovka-i-tara"),
  },
  {
    label: "Склад",
    href: listingsCategory("MARKET", "market-biznes-i-sklad"),
  },
  {
    label: "Производство",
    href: listingsCategory("MARKET", "market-eq-linii"),
  },
];

export const CATEGORY_DRAWER_SECTIONS: CategoryDrawerSection[] = [
  { title: "Популярные категории", links: CATEGORY_DRAWER_POPULAR },
  { title: "Услуги", links: CATEGORY_DRAWER_SERVICES },
  { title: "Опт", links: CATEGORY_DRAWER_OPT },
];
