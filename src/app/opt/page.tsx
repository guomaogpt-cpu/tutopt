import { ListingVertical } from "@prisma/client";
import { OptLandingPage } from "@/components/opt/OptLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.OPT);

export default async function OptVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.OPT);

  return (
    <OptLandingPage categories={data.categories} listings={data.listings} />
  );
}
