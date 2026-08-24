import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CompanyType, ListingVertical } from "@prisma/client";
import { Building2, MapPin } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { LISTING_CARD_GRID_PROFILE_CLASS } from "@/components/listings/listing-card-grid";
import { CompanyPublicProfileActions } from "@/components/company/CompanyPublicProfileActions";
import { CompanyVerificationBadge } from "@/components/company/CompanyVerificationBadge";
import { Container } from "@/components/layout/Container";
import { isCompanyVerified } from "@/features/company/lib/company-verification";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildCompanyPublicHref } from "@/features/company/lib/company-profile";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import {
  getSellerProfileByParam,
  getSellerPublishedListings,
  sanitizeSellerProfileForGuest,
} from "@/features/sellers/lib/seller-profile-data";
import {
  countSellerVerticals,
  getSellerVerticals,
} from "@/features/sellers/lib/seller-vertical-profile";
import { parseListingVerticalParam } from "@/features/verticals/verticals";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { translate } from "@/lib/i18n/dictionaries";
import { buildPageMetadata, truncateSeoText } from "@/shared/seo/seo.config";
import { cn } from "@/lib/utils";

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

const VERTICAL_FILTER_LABEL: Record<ListingVertical, DictionaryKey> = {
  MARKET: "vertical.market",
  SERVICES: "vertical.services",
  OPT: "vertical.opt",
  CARGO: "vertical.cargo",
};

const VERTICAL_CHIP_ACTIVE: Record<ListingVertical, string> = {
  MARKET: "bg-purple-600 text-white",
  SERVICES: "bg-green-600 text-white",
  OPT: "bg-blue-600 text-white",
  CARGO: "bg-orange-600 text-white",
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

  const path = buildCompanyPublicHref(profile.id);
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

  const companyPath = profile.id;
  const [allListings, favoriteListingIds] = await Promise.all([
    getSellerPublishedListings(profile.id, { postedAsCompanyOnly: true }),
    user ? getUserFavoriteListingIds(user.id) : Promise.resolve([]),
  ]);

  const filterVertical = parseListingVerticalParam(verticalParam);
  const sellerVerticals = getSellerVerticals(allListings);
  const verticalCounts = countSellerVerticals(allListings);
  const listings = filterVertical
    ? allListings.filter((listing) => listing.vertical === filterVertical)
    : allListings;
  const showVerticalChips = sellerVerticals.length > 1;

  const isAuthenticated = user !== null;
  const publicProfile = isAuthenticated
    ? profile
    : sanitizeSellerProfileForGuest(profile);

  const typeLabel = translate("ru", TYPE_LABEL_KEY[profile.company_type]);
  const cityName = profile.city?.name ?? null;
  const logoUrl = publicProfile.logo_url;
  const verified = isCompanyVerified(profile.verification_status);

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
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 sm:size-16">
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
                  <Building2 className="size-6" aria-hidden="true" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {translate("ru", "company.badge")}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {typeLabel}
                </span>
                {verified ? (
                  <CompanyVerificationBadge
                    status={profile.verification_status}
                    isCargo={profile.company_type === "CARGO"}
                  />
                ) : null}
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
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {translate("ru", "company.verification.registeredAt")}:{" "}
                {formatListingDate(profile.created_at)}
                {" · "}
                {translate("ru", "company.verification.activeListings")}: {allListings.length}
              </p>
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

            <CompanyPublicProfileActions
              sellerProfileId={profile.id}
              isAuthenticated={isAuthenticated}
              hasListings={allListings.length > 0}
              contactListingId={listings[0]?.id ?? null}
            />
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {translate("ru", "company.public.aboutTitle")}
          </h2>
          {publicProfile.description ? (
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {publicProfile.description}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {translate("ru", "company.public.noDescription")}
            </p>
          )}
          {verified ? (
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <CompanyVerificationBadge
                status={profile.verification_status}
                isCargo={profile.company_type === "CARGO"}
              />
            </p>
          ) : null}
          <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800 sm:grid-cols-2">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">
                {translate("ru", "company.type")}
              </dt>
              <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{typeLabel}</dd>
            </div>
            {cityName ? (
              <div>
                <dt className="text-slate-500 dark:text-slate-400">
                  {translate("ru", "company.city")}
                </dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{cityName}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section id="company-listings" className="mt-8 scroll-mt-24 pb-16 sm:pb-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {translate("ru", "company.public.listingsTitle")}
            </h2>
            {allListings.length > 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filterVertical
                  ? `${verticalCounts[filterVertical]} из ${allListings.length}`
                  : allListings.length}
              </p>
            ) : null}
          </div>

          {showVerticalChips ? (
            <div className="mt-4 -mx-1 overflow-x-auto px-1">
              <div className="flex w-max min-w-full gap-2 sm:flex-wrap sm:w-auto">
                <Link
                  href={buildCompanyPublicHref(companyPath)}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center rounded-full px-3.5 text-sm font-medium transition",
                    filterVertical === null
                      ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-400 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700",
                  )}
                >
                  {translate("ru", "company.public.filterAll")}
                  <span className="ml-1.5 opacity-80">{allListings.length}</span>
                </Link>
                {sellerVerticals.map((vertical) => {
                  const isActive = filterVertical === vertical;
                  return (
                    <Link
                      key={vertical}
                      href={buildCompanyPublicHref(companyPath, vertical)}
                      className={cn(
                        "inline-flex h-9 shrink-0 items-center rounded-full px-3.5 text-sm font-medium transition",
                        isActive
                          ? VERTICAL_CHIP_ACTIVE[vertical]
                          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-400 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700",
                      )}
                    >
                      {translate("ru", VERTICAL_FILTER_LABEL[vertical])}
                      <span className="ml-1.5 opacity-80">{verticalCounts[vertical]}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          {listings.length === 0 ? (
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {allListings.length === 0
                ? translate("ru", "company.public.noListings")
                : translate("ru", "company.public.noListingsFiltered")}
            </p>
          ) : (
            <div className={cn("mt-4", LISTING_CARD_GRID_PROFILE_CLASS)}>
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isAuthenticated={isAuthenticated}
                  isFavorited={favoriteListingIds.includes(listing.id)}
                  variant="home"
                />
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
