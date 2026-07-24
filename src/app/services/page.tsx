import { ListingVertical } from "@prisma/client";
import { ServicesLandingPage } from "@/components/services/ServicesLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.SERVICES);

export default async function ServicesVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.SERVICES);

  return (
    <ServicesLandingPage
      categories={data.categories}
      listings={data.listings}
    />
  );
}
