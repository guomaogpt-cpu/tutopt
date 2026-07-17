import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingStatus, UserRole } from "@prisma/client";
import { ListingCharacteristics } from "@/components/listings/ListingCharacteristics";
import { ListingContactCard } from "@/components/listings/ListingContactCard";
import { ListingDescription } from "@/components/listings/ListingDescription";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingSellerCard } from "@/components/listings/ListingSellerCard";
import { calculateSellerTrust } from "@/lib/trust/seller-trust";
import { ListingLeadForm } from "@/components/listings/ListingLeadForm";
import { SimilarListings } from "@/components/listings/SimilarListings";
import { ListingViewTracker } from "@/components/analytics/ListingViewTracker";
import { RecentlyViewedTracker } from "@/components/listings/RecentlyViewedTracker";
import { AppBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { canViewListing } from "@/features/listings/lib/listing-access";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import {
  getListingDetail,
  getSellerPublishedListingCount,
  getSellerPublishedVerticals,
  getSimilarListings,
} from "@/features/listings/lib/listing-detail-data";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { listingStatusLabels } from "@/features/listings/lib/listing-status";
import {
  formatListingCardPrice,
  getListingDisplayFlags,
  getListingPriceFieldLabel,
  getListingStockLabel,
  getListingUnitFieldLabel,
  getListingUnitLabel,
} from "@/features/listings/lib/listing-display";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { recordListingView } from "@/features/buyer/lib/listing-views";
import { getCurrentUser } from "@/features/auth/lib/session";
import { VERTICALS } from "@/features/verticals/verticals";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { buildListingJsonLd } from "@/shared/seo/listing-json-ld";
import {
  SITE_NAME,
  buildPageMetadata,
  truncateSeoText,
} from "@/shared/seo/seo.config";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const listing = await getListingDetail(id);

    if (!listing) {
      return {
        title: `Объявление не найдено | ${SITE_NAME}`,
      };
    }

    const priceLabel = formatListingPrice(listing.price, listing.currency);
    const title = `${listing.title} — ${priceLabel} | ${SITE_NAME}`;
    const description = listing.description.trim()
      ? truncateSeoText(listing.description)
      : `${listing.title}: объявление на Tutopt.`;
    const firstImage = listing.images[0]
      ? normalizeListingImageUrl(listing.images[0].url)
      : undefined;

    return buildPageMetadata({
      title,
      description,
      path: `/listings/${listing.id}`,
      type: "article",
      images: firstImage ? [firstImage] : undefined,
      noIndex: listing.status !== ListingStatus.PUBLISHED,
    });
  } catch (error) {
    console.error("[listings/[id]/metadata] Failed to load listing metadata", error);
    return {
      title: `Объявление | ${SITE_NAME}`,
      description: "Объявление на платформе Tutopt.",
    };
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  const listing = await getListingDetail(id);

  if (!listing || !canViewListing(listing, user)) {
    notFound();
  }

  if (user) {
    await recordListingView(user.id, listing.id);
  }

  const [similarListings, sellerListingCount, sellerVerticals] = await Promise.all([
    getSimilarListings(listing.id, listing.category_id),
    getSellerPublishedListingCount(listing.sellerProfile.id),
    getSellerPublishedVerticals(listing.sellerProfile.id),
  ]);

  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const favoriteIds = new Set(favoriteListingIds);
  const isFavorited = favoriteIds.has(listing.id);

  const unitLabel = getListingUnitLabel(listing.unit, listing.vertical);
  const displayFlags = getListingDisplayFlags(listing.vertical);
  const priceFieldLabel = getListingPriceFieldLabel(listing.vertical);
  const unitFieldLabel = getListingUnitFieldLabel(listing.vertical);

  const priceLabel = formatListingCardPrice({
    price: listing.price,
    currency: listing.currency,
    vertical: listing.vertical,
  });

  const sellerProfile = listing.sellerProfile;
  const isOwner = user?.id === sellerProfile.user_id;
  const isPrivilegedViewer =
    isOwner || user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR;
  const showStatusBadge =
    listing.status !== ListingStatus.PUBLISHED && isPrivilegedViewer;

  const sellerName = sellerProfile.user.name;
  const sellerAvatar = sellerProfile.logo_url ?? sellerProfile.user.avatar_url;
  const sellerCity = sellerProfile.city?.name ?? listing.city?.name ?? null;

  const sellerTrust = calculateSellerTrust({
    hasSellerProfile: true,
    companyName: sellerProfile.company_name,
    userName: sellerProfile.user.name,
    description: sellerProfile.description,
    cityName: sellerProfile.city?.name ?? null,
    phone: sellerProfile.user.phone ?? sellerProfile.contact_phone,
    phoneVerifiedAt: sellerProfile.user.phone_verified_at,
    logoUrl: sellerProfile.logo_url,
    avatarUrl: sellerProfile.user.avatar_url,
    accountCreatedAt: sellerProfile.user.created_at ?? sellerProfile.created_at,
    publishedListingCount: sellerListingCount,
    activeVerticals: sellerVerticals,
    hasCompletedOnboarding: Boolean(sellerProfile.user.phone),
  });

  const vertical = VERTICALS[listing.vertical];
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: vertical.label, href: vertical.href },
    ...(listing.category
      ? [
          {
            label: listing.category.name,
            href: `/listings?vertical=${listing.vertical}&category=${listing.category_id}`,
          },
        ]
      : []),
    { label: listing.title },
  ];

  const jsonLd =
    listing.status === ListingStatus.PUBLISHED
      ? buildListingJsonLd({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          currency: listing.currency,
          vertical: listing.vertical,
          images: listing.images,
        })
      : null;

  const characteristicItems = [
    { label: "Категория", value: listing.category.name },
    ...(listing.city ? [{ label: "Город", value: listing.city.name }] : []),
    ...(displayFlags.showBrand && listing.brand
      ? [{ label: "Бренд", value: listing.brand.name }]
      : []),
    ...(displayFlags.showMoq
      ? [{ label: displayFlags.moqLabel, value: `${listing.moq} ${unitLabel.toLowerCase()}` }]
      : []),
    { label: unitFieldLabel, value: unitLabel },
    ...(displayFlags.showStock && listing.stock_quantity != null
      ? [
          {
            label: getListingStockLabel(listing.vertical),
            value: String(listing.stock_quantity),
          },
        ]
      : []),
  ];

  const contactCard = (
    <ListingContactCard
      listingId={listing.id}
      isAuthenticated={user !== null}
      isFavorited={isFavorited}
      priceLabel={priceLabel}
      priceCaption={priceFieldLabel}
      moq={listing.moq}
      unitLabel={unitLabel}
      stockQuantity={listing.stock_quantity}
      cityName={listing.city?.name ?? null}
      brandName={listing.brand?.name ?? null}
      status={listing.status}
      vertical={listing.vertical}
      showStatusBadge={showStatusBadge}
      showMoq={displayFlags.showMoq}
      moqLabel={displayFlags.moqLabel}
      showBrand={displayFlags.showBrand}
      showStock={displayFlags.showStock}
      stockLabel={displayFlags.stockLabel}
      contactPhone={sellerProfile.contact_phone}
      whatsapp={sellerProfile.whatsapp}
      telegram={sellerProfile.telegram}
    />
  );

  const sellerCard = (
    <ListingSellerCard
      sellerName={sellerName}
      companyName={sellerProfile.company_name}
      avatarUrl={sellerAvatar}
      isVerified={sellerProfile.is_verified}
      sellerCity={sellerCity}
      sellerSince={sellerProfile.created_at}
      publishedListingCount={sellerListingCount}
      sellerId={sellerProfile.id}
      listingId={listing.id}
      vertical={listing.vertical}
      trustLevel={sellerTrust.level}
      trustLevelLabel={sellerTrust.levelLabel}
      trustSignals={sellerTrust.signals}
      isAuthenticated={user !== null}
    />
  );

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <ListingViewTracker listingId={listing.id} vertical={listing.vertical} />
      {listing.status === ListingStatus.PUBLISHED ? (
        <RecentlyViewedTracker
          listingId={listing.id}
          title={listing.title}
          vertical={listing.vertical}
          price={listing.price.toString()}
          currency={listing.currency}
          city={listing.city?.name ?? null}
          imageUrl={
            listing.images[0] ? normalizeListingImageUrl(listing.images[0].url) : null
          }
        />
      ) : null}
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <Container size="lg" className="min-w-0 max-w-[1280px]">
        <AppBreadcrumbs items={breadcrumbItems} />

        <header className="mt-4 sm:mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <VerticalListingBadge vertical={listing.vertical} size="md" />
            {showStatusBadge ? (
              <Badge variant="warning">{listingStatusLabels[listing.status]}</Badge>
            ) : null}
          </div>
          <h1 className="mt-2 text-[1.375rem] font-bold leading-tight tracking-tight text-[#0F172A] sm:text-[1.625rem] lg:text-[2rem]">
            {listing.title}
          </h1>
        </header>

        <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1.85fr)_minmax(300px,1fr)] lg:items-start lg:gap-8">
          <div className="min-w-0 space-y-6">
            <ListingGallery images={listing.images} title={listing.title} />

            <div className="space-y-4 lg:hidden">
              {contactCard}
              {sellerCard}
            </div>

            <ListingCharacteristics items={characteristicItems} />
            <ListingDescription text={listing.description} />
            <ListingLeadForm
              key={`${listing.id}-${listing.vertical}`}
              listingId={listing.id}
              sellerName={sellerName}
              moq={listing.moq}
              unitLabel={unitLabel}
              vertical={listing.vertical}
              isAuthenticated={user !== null}
              isOwner={isOwner}
              defaultPhone={user?.phone}
              defaultEmail={user?.email}
            />
          </div>

          <aside className="hidden min-w-0 lg:block">
            <div className="sticky top-24 space-y-4">
              {contactCard}
              {sellerCard}
            </div>
          </aside>
        </div>

        <SimilarListings
          listings={similarListings}
          isAuthenticated={user !== null}
          favoriteListingIds={favoriteListingIds}
        />
      </Container>
    </main>
  );
}
