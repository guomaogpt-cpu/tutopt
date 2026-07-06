import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { SellerProfileContacts } from "@/components/seller/SellerProfileContacts";
import { SellerProfileHeader } from "@/components/seller/SellerProfileHeader";
import { SellerProfileListings } from "@/components/seller/SellerProfileListings";
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
    <main className="bg-slate-50 py-6 sm:py-10">
      <Container className="max-w-[1280px]">
        <nav aria-label="Хлебные крошки" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-blue-600">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/listings" className="transition hover:text-blue-600">
                Каталог
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 font-medium text-slate-700">{profile.company_name}</li>
          </ol>
        </nav>

        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
          <div className="min-w-0">
            <SellerProfileHeader profile={profile} publishedListingCount={publishedListingCount} />

            <div className="mt-6 lg:hidden">
              <SellerProfileContacts
                isAuthenticated={user !== null}
                contactPhone={profile.contact_phone}
                contactEmail={profile.contact_email}
                whatsapp={profile.whatsapp}
                telegram={profile.telegram}
                website={profile.website}
              />
            </div>

            <SellerProfileListings
              listings={listings}
              isAuthenticated={user !== null}
              favoriteListingIds={favoriteListingIds}
            />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <SellerProfileContacts
                isAuthenticated={user !== null}
                contactPhone={profile.contact_phone}
                contactEmail={profile.contact_email}
                whatsapp={profile.whatsapp}
                telegram={profile.telegram}
                website={profile.website}
              />
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}
