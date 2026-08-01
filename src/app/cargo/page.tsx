import { ListingVertical } from "@prisma/client";
import { Suspense } from "react";
import { CargoLandingPage } from "@/components/cargo/CargoLandingPage";
import { getPublicRecentCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.CARGO);

type CargoVerticalPageProps = {
  searchParams: Promise<{ verified?: string }>;
};

export default async function CargoVerticalPage({ searchParams }: CargoVerticalPageProps) {
  const params = await searchParams;
  const verifiedOnly = params.verified === "1";

  const [data, recentRequests] = await Promise.all([
    getVerticalPageData(ListingVertical.CARGO, { verifiedOnly }),
    getPublicRecentCargoRequests(6),
  ]);

  return (
    <Suspense fallback={null}>
      <CargoLandingPage
        categories={data.categories}
        listings={data.listings}
        recentRequests={recentRequests}
      />
    </Suspense>
  );
}
