import { ListingVertical } from "@prisma/client";
import { CargoLandingPage } from "@/components/cargo/CargoLandingPage";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.CARGO);

export default async function CargoVerticalPage() {
  const data = await getVerticalPageData(ListingVertical.CARGO);

  return (
    <CargoLandingPage categories={data.categories} listings={data.listings} />
  );
}
