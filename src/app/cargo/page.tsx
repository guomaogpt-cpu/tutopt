import { ListingVertical } from "@prisma/client";
import { CargoLandingPage } from "@/components/cargo/CargoLandingPage";
import { getPublicRecentCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.CARGO);

export default async function CargoVerticalPage() {
  const [data, recentRequests] = await Promise.all([
    getVerticalPageData(ListingVertical.CARGO),
    getPublicRecentCargoRequests(6),
  ]);

  return (
    <CargoLandingPage
      categories={data.categories}
      listings={data.listings}
      recentRequests={recentRequests}
    />
  );
}
