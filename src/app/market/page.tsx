import { ListingVertical } from "@prisma/client";
import { VerticalLandingPage } from "@/components/verticals/VerticalLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.MARKET);

export default async function MarketVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.MARKET);

  return (
    <VerticalLandingPage
      vertical={ListingVertical.MARKET}
      title="ТутМаркет"
      subtitle="Розничные товары, магазины и частные объявления."
      statusBadge="Раздел готовится к запуску"
      categories={data.categories}
      listings={data.listings}
      publishedCount={data.publishedCount}
    />
  );
}
