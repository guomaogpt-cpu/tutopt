import { ListingVertical } from "@prisma/client";
import { VerticalLandingPage } from "@/components/verticals/VerticalLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.SERVICES);

export default async function ServicesVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.SERVICES);

  return (
    <VerticalLandingPage
      vertical={ListingVertical.SERVICES}
      categories={data.categories}
      listings={data.listings}
      publishedCount={data.publishedCount}
    />
  );
}
