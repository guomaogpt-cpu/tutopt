import { ListingVertical } from "@prisma/client";
import { VerticalLandingPage } from "@/components/verticals/VerticalLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.OPT);

export default async function OptVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.OPT);

  return (
    <VerticalLandingPage
      vertical={ListingVertical.OPT}
      title="ТутОпт"
      subtitle="Оптовые товары и поставщики Кыргызстана"
      categories={data.categories}
      listings={data.listings}
      publishedCount={data.publishedCount}
    />
  );
}
