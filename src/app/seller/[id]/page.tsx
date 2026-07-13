import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SellerProfileListings } from "@/components/seller/SellerProfileListings";
import { SellerProfileSidebar } from "@/components/seller/SellerProfileSidebar";
import { getCurrentUser } from "@/features/auth/lib/session";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import {
  getSellerProfileByParam,
  getSellerPublishedListingCount,
  getSellerPublishedListings,
} from "@/features/sellers/lib/seller-profile-data";

type SellerProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SellerProfilePage({ params }: SellerProfilePageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const profile = await getSellerProfileByParam(id);

  if (!profile) {
    notFound();
  }

  const [listings, publishedListingCount, favoriteListingIds] = await Promise.all([
    getSellerPublishedListings(profile.id),
    getSellerPublishedListingCount(profile.id),
    user ? getUserFavoriteListingIds(user.id) : Promise.resolve([]),
  ]);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container className="max-w-[1280px] min-w-0">
        <nav aria-label="Хлебные крошки" className="text-sm text-[#64748B]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-[#2563EB]">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/listings" className="transition hover:text-[#2563EB]">
                Каталог
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 font-medium text-[#334155]">{profile.company_name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
          <SellerProfileSidebar
            profile={profile}
            publishedListingCount={publishedListingCount}
            isAuthenticated={user !== null}
            contactPhone={profile.contact_phone}
            contactEmail={profile.contact_email}
            whatsapp={profile.whatsapp}
            telegram={profile.telegram}
            website={profile.website}
          />
          <div className="order-2 min-w-0 lg:order-1">
            <SellerProfileListings
              listings={listings}
              isAuthenticated={user !== null}
              favoriteListingIds={favoriteListingIds}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
