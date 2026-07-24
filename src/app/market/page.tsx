import { ListingVertical } from "@prisma/client";
import { MarketLandingPage } from "@/components/market/MarketLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.MARKET);

export default async function MarketVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.MARKET);

  return (
    <MarketLandingPage
      categories={data.categories}
      listings={data.listings}
      publishedCount={data.publishedCount}
    />
  );
}
