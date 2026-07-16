import { ListingVertical } from "@prisma/client";
import { VerticalLandingPage } from "@/components/verticals/VerticalLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.CARGO);

export default async function CargoVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.CARGO);

  return (
    <VerticalLandingPage
      vertical={ListingVertical.CARGO}
      title="ТутКарго"
      subtitle="Грузоперевозки, доставка и логистика."
      statusBadge="Раздел готовится к запуску"
      categories={data.categories}
      listings={data.listings}
      publishedCount={data.publishedCount}
    />
  );
}
