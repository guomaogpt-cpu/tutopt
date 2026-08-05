import { ListingVertical } from "@prisma/client";
import { MarketLandingPage } from "@/components/market/MarketLandingPage";
import {
  getVerticalPageData,
  type VerticalCategoryCard,
  type VerticalPageData,
} from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.MARKET);

const MARKET_FALLBACK_CATEGORIES: VerticalCategoryCard[] = [
  { id: "fallback-electronics", name: "Электроника", slug: "market-telefony-i-elektronika", vertical: "MARKET" },
  { id: "fallback-clothes", name: "Одежда и обувь", slug: "market-odezhda-i-obuv", vertical: "MARKET" },
  { id: "fallback-home", name: "Дом и сад", slug: "market-dom-i-sad", vertical: "MARKET" },
  { id: "fallback-auto", name: "Авто и транспорт", slug: "market-avto-i-moto", vertical: "MARKET" },
  { id: "fallback-realty", name: "Недвижимость", slug: "market-nedvizhimost", vertical: "MARKET" },
  { id: "fallback-kids", name: "Детские товары", slug: "market-detskie-tovary", vertical: "MARKET" },
  { id: "fallback-equipment", name: "Оборудование и станки", slug: "market-oborudovanie-i-stanki", vertical: "MARKET" },
  { id: "fallback-build", name: "Строительство и ремонт", slug: "market-stroitelstvo-i-remont", vertical: "MARKET" },
  { id: "fallback-biz", name: "Бизнес и склад", slug: "market-biznes-i-sklad", vertical: "MARKET" },
  { id: "fallback-sport", name: "Спорт и отдых", slug: "market-sport-i-otdyh", vertical: "MARKET" },
  { id: "fallback-animals", name: "Животные", slug: "market-zhivotnye", vertical: "MARKET" },
  { id: "fallback-other", name: "Другое", slug: "market-drugoe", vertical: "MARKET" },
];

const EMPTY_MARKET_DATA: VerticalPageData = {
  categories: MARKET_FALLBACK_CATEGORIES,
  listings: [],
  publishedCount: 0,
};

export default async function MarketVerticalPage() {
  let data: VerticalPageData = EMPTY_MARKET_DATA;

  try {
    const loaded = await getVerticalPageData(ListingVertical.MARKET);
    data = {
      categories:
        loaded.categories.length > 0
          ? loaded.categories
          : MARKET_FALLBACK_CATEGORIES,
      listings: loaded.listings ?? [],
      publishedCount: loaded.publishedCount ?? 0,
    };
  } catch (error) {
    console.error("[market] getVerticalPageData failed", error);
  }

  return (
    <MarketLandingPage
      categories={data.categories}
      listings={data.listings}
      publishedCount={data.publishedCount}
    />
  );
}
