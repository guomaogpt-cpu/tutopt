import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CompanyType } from "@prisma/client";
import { Building2, MapPin } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { Container } from "@/components/layout/Container";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildCompanyProfileHref } from "@/features/company/lib/company-profile";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import {
  getSellerProfileByParam,
  getSellerPublishedListings,
  sanitizeSellerProfileForGuest,
} from "@/features/sellers/lib/seller-profile-data";
import { parseListingVerticalParam } from "@/features/verticals/verticals";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { translate } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { buildPageMetadata, truncateSeoText } from "@/shared/seo/seo.config";

type CompanyPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ vertical?: string }>;
};

const TYPE_LABEL_KEY: Record<CompanyType, DictionaryKey> = {
  STORE: "company.types.store",
  SUPPLIER: "company.types.supplier",
  SERVICE: "company.types.service",
  CARGO: "company.types.cargo",
  OTHER: "company.types.other",
};

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getSellerProfileByParam(id);

  if (!profile || !profile.company_type) {
    return buildPageMetadata({
      title: "Компания — ВсеТут",
      description: "Профиль компании на ВсеТут",
      path: `/companies/${id}`,
      noIndex: true,
    });
  }

  const path = buildCompanyProfileHref(profile.slug || profile.id);
  return buildPageMetadata({
    title: `${profile.company_name} — компания на ВсеТут`,
    description: truncateSeoText(
      profile.description?.trim() ||
        `${profile.company_name} — профиль компании на ВсеТут.`,
    ),
    path,
    type: "website",
    images: profile.logo_url ? [profile.logo_url] : undefined,
  });
}

export default async function CompanyPublicPage({
  params,
  searchParams,
}: CompanyPageProps) {
  const { id } = await params;
  const { vertical: verticalParam } = await searchParams;
  const user = await getCurrentUser();

  const profile = await getSellerProfileByParam(id);

  if (!profile || !profile.company_type) {
    notFound();
  }

  const [allListings, favoriteListingIds] = await Promise.all([
    getSellerPublishedListings(profile.id),
    user ? getUserFavoriteListingIds(user.id) : Promise.resolve([]),
  ]);

  const filterVertical = parseListingVerticalParam(verticalParam);
  const listings = filterVertical
    ? allListings.filter((listing) => listing.vertical === filterVertical)
    : allListings;

  const isAuthenticated = user !== null;
  const publicProfile = isAuthenticated
    ? profile
    : sanitizeSellerProfileForGuest(profile);

  const typeLabel = translate("ru", TYPE_LABEL_KEY[profile.company_type]);
  const cityName = profile.city?.name ?? null;
  const logoUrl = publicProfile.logo_url;

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
      <Container className="max-w-[1100px] min-w-0">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-700 dark:text-slate-200">
              {profile.company_name}
            </li>
          </ol>
        </nav>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 sm:size-20">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={profile.company_name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <Building2 className="size-7" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:bg-slate-800 dark:text-blue-300">
                  {translate("ru", "company.badge")}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {typeLabel}
                </span>
              </div>
              <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
                {profile.company_name}
              </h1>
              {cityName ? (
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {cityName}
                </p>
              ) : null}
              {publicProfile.description ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {publicProfile.description}
                </p>
              ) : null}
              {publicProfile.website ? (
                <a
                  href={publicProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  {publicProfile.website}
                </a>
              ) : null}
            </div>

            {listings[0] ? (
              <Button
                asChild
                className="h-11 w-full shrink-0 rounded-xl sm:mt-1 sm:w-auto"
              >
                <Link href={`/listings/${listings[0].id}`}>
                  {translate("ru", "company.public.contact")}
                </Link>
              </Button>
            ) : null}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {translate("ru", "company.public.listingsTitle")}
          </h2>
          {listings.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {translate("ru", "company.public.noListings")}
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isAuthenticated={isAuthenticated}
                  isFavorited={favoriteListingIds.includes(listing.id)}
                  variant="catalog"
                />
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
