import { ListingVertical } from "@prisma/client";
import { Suspense } from "react";
import { CargoLandingPage } from "@/components/cargo/CargoLandingPage";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getPublicRecentCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { getVerticalPageData } from "@/features/verticals/get-vertical-page-data";
import { prisma } from "@/shared/lib/prisma";
import { buildVerticalPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildVerticalPageMetadata(ListingVertical.CARGO);

type CargoVerticalPageProps = {
  searchParams: Promise<{ verified?: string }>;
};

export default async function CargoVerticalPage({ searchParams }: CargoVerticalPageProps) {
  const params = await searchParams;
  const verifiedOnly = params.verified === "1";
  const user = await getCurrentUser();

  const [data, recentRequests, sellerProfile] = await Promise.all([
    getVerticalPageData(ListingVertical.CARGO, { verifiedOnly }),
    getPublicRecentCargoRequests(6),
    user
      ? prisma.sellerProfile.findUnique({
          where: { user_id: user.id },
          select: { id: true, company_type: true },
        })
      : Promise.resolve(null),
  ]);

  const canRespond = Boolean(
    user &&
      sellerProfile &&
      (user.role === "SELLER" || user.role === "ADMIN" || user.role === "BUYER"),
  );

  return (
    <Suspense fallback={null}>
      <CargoLandingPage
        listings={data.listings}
        recentRequests={recentRequests}
        isAuthenticated={Boolean(user)}
        canRespond={canRespond}
      />
    </Suspense>
  );
}
