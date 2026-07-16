import type { Metadata } from "next";
import {
  buildVerticalCategoryPath,
  getCategorySeoSlug,
} from "@/features/seo/category-seo-slug";
import { getCitySeoSlug, formatCityInPhrase } from "@/features/seo/city-slug";
import type {
  SeoLandingCategory,
  SeoLandingCity,
} from "@/features/seo/get-vertical-category-page-data";
import { VERTICALS } from "@/features/verticals/verticals";
import { getAbsoluteUrl } from "@/shared/seo/absolute-url";
import { buildPageMetadata, truncateSeoText } from "@/shared/seo/seo.config";

export function buildSeoLandingPath(
  category: SeoLandingCategory,
  city?: SeoLandingCity | null,
): string {
  const vertical = VERTICALS[category.vertical];
  return buildVerticalCategoryPath(
    vertical.slug,
    getCategorySeoSlug(category),
    city ? getCitySeoSlug(city) : undefined,
  );
}

export function buildSeoLandingH1(
  category: SeoLandingCategory,
  city?: SeoLandingCity | null,
): string {
  const vertical = VERTICALS[category.vertical];

  if (city) {
    return `${category.name} в ${formatCityInPhrase(city)} — объявления ${vertical.label}`;
  }

  return `${category.name} — объявления в разделе ${vertical.label}`;
}

export function buildSeoLandingBodyText(
  category: SeoLandingCategory,
  city?: SeoLandingCity | null,
): string {
  const place = city ? formatCityInPhrase(city) : "Кыргызстане";
  const name = category.name;

  switch (category.vertical) {
    case "OPT":
      return `${name} оптом в ${place}: предложения поставщиков, партии товаров, цены и условия продажи. Актуальные объявления для бизнеса на Tutopt.`;
    case "MARKET":
      return `${name} в ${place}: розничные предложения, частные объявления и товары от продавцов. Смотрите свежие предложения на Tutopt.`;
    case "SERVICES":
      return `${name} в ${place}: услуги специалистов, мастеров и компаний. Найдите подходящее предложение на Tutopt.`;
    case "CARGO":
      return `${name} в ${place}: перевозчики, логистика и предложения по доставке. Актуальные объявления на Tutopt.`;
    default:
      return `${name} в ${place}: актуальные объявления на Tutopt.`;
  }
}

function buildTitle(
  category: SeoLandingCategory,
  city?: SeoLandingCity | null,
): string {
  const name = category.name;
  const cityName = city ? formatCityInPhrase(city) : null;

  switch (category.vertical) {
    case "OPT":
      return cityName
        ? `${name} оптом в ${cityName} — цены поставщиков | ТутОпт`
        : `${name} оптом в Кыргызстане — объявления поставщиков | ТутОпт`;
    case "MARKET":
      return cityName
        ? `${name} в ${cityName} — объявления | ТутМаркет`
        : `${name} в Кыргызстане — объявления | ТутМаркет`;
    case "SERVICES":
      return cityName
        ? `${name} в ${cityName} — услуги | ТутУслуги`
        : `${name} в Кыргызстане — услуги специалистов | ТутУслуги`;
    case "CARGO":
      return cityName
        ? `${name} в ${cityName} — перевозки и логистика | ТутКарго`
        : `${name} в Кыргызстане — логистика и перевозки | ТутКарго`;
    default:
      return `${name} | Tutopt`;
  }
}

export function buildSeoLandingMetadata(
  category: SeoLandingCategory,
  city?: SeoLandingCity | null,
): Metadata {
  const vertical = VERTICALS[category.vertical];
  const path = buildSeoLandingPath(category, city);
  const place = city ? formatCityInPhrase(city) : "Кыргызстане";
  const description = truncateSeoText(
    `${category.name} в ${place} — раздел ${vertical.label}. Найдите актуальные предложения, поставщиков и объявления в Кыргызстане на Tutopt.`,
  );

  return buildPageMetadata({
    title: buildTitle(category, city),
    description,
    path,
    type: "website",
  });
}

export function buildSeoLandingBreadcrumbJsonLd(options: {
  category: SeoLandingCategory;
  city?: SeoLandingCity | null;
}): Record<string, unknown> {
  const vertical = VERTICALS[options.category.vertical];
  const categoryPath = buildSeoLandingPath(options.category);
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: getAbsoluteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: vertical.label,
      item: getAbsoluteUrl(vertical.href),
    },
    {
      "@type": "ListItem",
      position: 3,
      name: options.category.name,
      item: getAbsoluteUrl(categoryPath),
    },
  ];

  if (options.city) {
    items.push({
      "@type": "ListItem",
      position: 4,
      name: options.city.name,
      item: getAbsoluteUrl(buildSeoLandingPath(options.category, options.city)),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function buildSeoLandingItemListJsonLd(options: {
  path: string;
  name: string;
  listings: { id: string; title: string }[];
}): Record<string, unknown> | null {
  if (options.listings.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    url: getAbsoluteUrl(options.path),
    numberOfItems: options.listings.length,
    itemListElement: options.listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getAbsoluteUrl(`/listings/${listing.id}`),
      name: listing.title,
    })),
  };
}
