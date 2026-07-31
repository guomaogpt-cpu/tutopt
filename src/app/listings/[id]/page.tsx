import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingStatus, UserRole } from "@prisma/client";
import { ListingCharacteristics } from "@/components/listings/ListingCharacteristics";
import { ListingContactCard } from "@/components/listings/ListingContactCard";
import { ListingDescription } from "@/components/listings/ListingDescription";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingMainInfo } from "@/components/listings/ListingMainInfo";
import { ListingMobileStickyCta } from "@/components/listings/ListingMobileStickyCta";
import { ListingMobileSummary } from "@/components/listings/ListingMobileSummary";
import { ListingRequestHint } from "@/components/listings/ListingRequestHint";
import { ListingSellerCard } from "@/components/listings/ListingSellerCard";
import { calculateSellerTrust } from "@/lib/trust/seller-trust";
import { ListingLeadForm } from "@/components/listings/ListingLeadForm";
import { SellerOtherListings } from "@/components/listings/SellerOtherListings";
import { SimilarListings } from "@/components/listings/SimilarListings";
import { ListingViewTracker } from "@/components/analytics/ListingViewTracker";
import { RecentlyViewedTracker } from "@/components/listings/RecentlyViewedTracker";
import Link from "next/link";
import { ListingVerticalHint } from "@/components/listings/ListingVerticalHint";
import {
  ListingQualityHints,
  ListingRiskBadge,
} from "@/components/moderation/ListingQualityHints";
import {
  getListingModerationRisk,
  getListingRiskLevelLabel,
} from "@/lib/moderation/listing-quality";
import { AppBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { canViewListing } from "@/features/listings/lib/listing-access";
import { RenewListingButton } from "@/components/listings/RenewListingButton";
import { getListingExpirationStatus } from "@/lib/listings/listing-expiration";
import { getLeadRestrictionMessage } from "@/lib/security/user-restrictions";
import {
  formatListingDate,
  formatListingPrice,
} from "@/features/listings/lib/format-listing-price";
import {
  getListingDetail,
  getSellerOtherListings,
  getSellerPublishedListingCount,
  getSellerPublishedVerticals,
  getSimilarListings,
} from "@/features/listings/lib/listing-detail-data";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { listingStatusLabels } from "@/features/listings/lib/listing-status";
import {
  formatListingCardPrice,
  getListingDisplayFlags,
  getListingUnitLabel,
  getListingVerticalBadgeLabel,
} from "@/features/listings/lib/listing-display";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { recordListingView } from "@/features/buyer/lib/listing-views";
import { getCurrentUser } from "@/features/auth/lib/session";
import { VERTICALS } from "@/features/verticals/verticals";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { buildListingJsonLd } from "@/shared/seo/listing-json-ld";
import { serializeJsonLd } from "@/shared/seo/serialize-json-ld";
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

    if (!listing || !canViewListing(listing, null)) {
      return {
        title: `Объявление не найдено | ${SITE_NAME}`,
        robots: { index: false, follow: false },
      };
    }

    const priceLabel = formatListingPrice(listing.price, listing.currency);
    const title = `${listing.title} — ${priceLabel} | ${SITE_NAME}`;
    const description = listing.description.trim()
      ? truncateSeoText(listing.description)
      : `${listing.title}: объявление на ВсеТут.`;
    const firstImage = listing.images[0]
      ? normalizeListingImageUrl(listing.images[0].url)
      : undefined;

    return buildPageMetadata({
      title,
      description,
      path: `/listings/${listing.id}`,
      type: "article",
      images: firstImage ? [firstImage] : undefined,
    });
  } catch (error) {
    console.error("[listings/[id]/metadata] Failed to load listing metadata", error);
    return {
      title: `Объявление | ${SITE_NAME}`,
      description: "Объявление на платформе ВсеТут.",
      robots: { index: false, follow: false },
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

  const [similarListings, sellerOtherListings, sellerListingCount, sellerVerticals] =
    await Promise.all([
      getSimilarListings({
        id: listing.id,
        category_id: listing.category_id,
        vertical: listing.vertical,
        city_id: listing.city_id,
      }),
      getSellerOtherListings(listing.sellerProfile.id, listing.id),
      getSellerPublishedListingCount(listing.sellerProfile.id),
      getSellerPublishedVerticals(listing.sellerProfile.id),
    ]);

  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const favoriteIds = new Set(favoriteListingIds);
  const isFavorited = favoriteIds.has(listing.id);

  const unitLabel = getListingUnitLabel(listing.unit, listing.vertical);
  const displayFlags = getListingDisplayFlags(listing.vertical);

  const hasPrice = Number(listing.price.toString()) > 0;
  const priceLabel = formatListingCardPrice({
    price: listing.price,
    currency: listing.currency,
    vertical: listing.vertical,
  });

  const sellerProfile = listing.sellerProfile;
  const isOwner = user?.id === sellerProfile.user_id;
  const isAdminViewer =
    user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR;
  const isPrivilegedViewer = isOwner || isAdminViewer;
  const showStatusBadge =
    listing.status !== ListingStatus.PUBLISHED && isPrivilegedViewer;

  const leadRestrictedMessage =
    user && !isOwner ? getLeadRestrictionMessage(user) : null;
  const publishedDateLabel = listing.published_at
    ? formatListingDate(listing.published_at)
    : null;
  const expirationStatus = getListingExpirationStatus({ expires_at: listing.expires_at });
  const expiresDateLabel = listing.expires_at
    ? formatListingDate(listing.expires_at)
    : null;
  const showOwnerRenewButton =
    isOwner && user?.role === UserRole.SELLER && listing.status === ListingStatus.PUBLISHED;

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

  const qualityInput = {
    title: listing.title,
    description: listing.description,
    price: listing.price.toString(),
    cityName: listing.city?.name ?? null,
    categoryName: listing.category.name,
    vertical: listing.vertical,
    imageCount: listing.images.length,
    moq: listing.moq,
    unit: listing.unit,
  };

  const adminRisk = isAdminViewer ? getListingModerationRisk(qualityInput) : null;

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
          images: listing.images,
          vertical: listing.vertical,
        })
      : null;

  const showUnitSuffix =
    (listing.vertical === "OPT" || listing.vertical === "MARKET") && hasPrice;

  const mainInfoItems = [
    ...(displayFlags.showMoq
      ? [
          {
            labelKey: "listing.minOrder" as const,
            value: `${listing.moq} ${unitLabel.toLowerCase()}`,
          },
        ]
      : []),
    ...(listing.city
      ? [{ labelKey: "listing.city" as const, value: listing.city.name }]
      : []),
    ...(displayFlags.showStock && listing.stock_quantity != null
      ? [
          {
            labelKey: "listing.stock" as const,
            value: String(listing.stock_quantity),
          },
        ]
      : []),
    { labelKey: "listing.unit" as const, value: unitLabel },
    ...(publishedDateLabel
      ? [{ labelKey: "listing.publishedAt" as const, value: publishedDateLabel }]
      : []),
  ];

  const characteristicItems = [
    {
      labelKey: "listing.direction" as const,
      value: getListingVerticalBadgeLabel(listing.vertical),
    },
    { labelKey: "listing.category" as const, value: listing.category.name },
    ...(listing.city
      ? [{ labelKey: "listing.city" as const, value: listing.city.name }]
      : []),
    hasPrice
      ? { labelKey: "listing.price" as const, value: priceLabel }
      : { labelKey: "listing.price" as const, valueKey: "listing.priceOnRequest" as const },
    ...(displayFlags.showBrand && listing.brand
      ? [{ labelKey: "listing.brand" as const, value: listing.brand.name }]
      : []),
    ...(displayFlags.showMoq
      ? [
          {
            labelKey: "listing.minOrder" as const,
            value: `${listing.moq} ${unitLabel.toLowerCase()}`,
          },
        ]
      : []),
    { labelKey: "listing.unit" as const, value: unitLabel },
    ...(displayFlags.showStock && listing.stock_quantity != null
      ? [
          {
            labelKey: "listing.stock" as const,
            value: String(listing.stock_quantity),
          },
        ]
      : []),
    ...(publishedDateLabel
      ? [{ labelKey: "listing.publishedAt" as const, value: publishedDateLabel }]
      : []),
  ];

  const contactCard = (
    <ListingContactCard
      listingId={listing.id}
      isAuthenticated={user !== null}
      isFavorited={isFavorited}
      priceLabel={priceLabel}
      moq={listing.moq}
      unitLabel={unitLabel}
      stockQuantity={listing.stock_quantity}
      cityName={listing.city?.name ?? null}
      brandName={listing.brand?.name ?? null}
      status={listing.status}
      vertical={listing.vertical}
      showStatusBadge={showStatusBadge}
      showMoq={displayFlags.showMoq}
      showBrand={displayFlags.showBrand}
      showStock={displayFlags.showStock}
      contactPhone={user ? sellerProfile.contact_phone : null}
      whatsapp={user ? sellerProfile.whatsapp : null}
      telegram={user ? sellerProfile.telegram : null}
      hasPrice={hasPrice}
      isOwnListing={isOwner}
    />
  );

  const sellerCard = (
    <ListingSellerCard
      sellerName={sellerName}
      companyName={sellerProfile.company_name}
      avatarUrl={sellerAvatar}
      isVerified={sellerProfile.is_verified}
      sellerCity={sellerCity}
      sellerSinceLabel={formatListingDate(sellerProfile.created_at)}
      publishedListingCount={sellerListingCount}
      sellerId={sellerProfile.id}
      listingId={listing.id}
      vertical={listing.vertical}
      trustLevel={sellerTrust.level}
      trustSignals={sellerTrust.signals}
      isAuthenticated={user !== null}
      hasPrice={hasPrice}
      isOwnListing={isOwner}
    />
  );

  return (
    <main className="min-w-0 bg-[#F5F7FA] pb-[calc(4.25rem+env(safe-area-inset-bottom))] pt-4 dark:bg-slate-950 sm:py-8 md:pb-8">
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      ) : null}
      <Container size="lg" className="min-w-0 max-w-[1280px]">
        <AppBreadcrumbs items={breadcrumbItems} />

        <header className="mt-4 hidden lg:block">
          <div className="flex flex-wrap items-center gap-2">
            <VerticalListingBadge vertical={listing.vertical} size="md" />
            {showStatusBadge ? (
              <Badge variant="warning">{listingStatusLabels[listing.status]}</Badge>
            ) : null}
            {isOwner ? <Badge variant="secondary">Ваше объявление</Badge> : null}
            {isOwner ? (
              <Link
                href={`/listings/${listing.id}/edit`}
                className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#334155] transition hover:border-[#2563EB]/30 hover:text-[#2563EB] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:text-blue-400"
              >
                Редактировать
              </Link>
            ) : null}
          </div>
          <h1 className="mt-2 break-words text-[1.625rem] font-bold leading-tight tracking-tight text-[#0F172A] lg:text-[2rem] dark:text-slate-100">
            {listing.title}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#64748B] dark:text-slate-400">
            <span>{listing.category.name}</span>
            {listing.city ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{listing.city.name}</span>
              </>
            ) : null}
            {publishedDateLabel ? (
              <>
                <span aria-hidden="true">·</span>
                <span>Опубликовано {publishedDateLabel}</span>
              </>
            ) : null}
          </p>
        </header>

        {isOwner ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 lg:hidden">
            {showStatusBadge ? (
              <Badge variant="warning">{listingStatusLabels[listing.status]}</Badge>
            ) : null}
            <Badge variant="secondary">Ваше объявление</Badge>
            <Link
              href={`/listings/${listing.id}/edit`}
              className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#334155] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              Редактировать
            </Link>
          </div>
        ) : null}

        {isOwner && (expiresDateLabel || expirationStatus === "expired") ? (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[rgba(148,163,184,0.25)] bg-white px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
            <div className="min-w-0">
              {expiresDateLabel ? (
                <p className="font-medium text-[#0F172A] dark:text-slate-100">
                  Публикация до: {expiresDateLabel}
                </p>
              ) : null}
              {expirationStatus === "expired" ? (
                <p className="mt-0.5 text-[#DC2626]">
                  Срок публикации истёк, объявление не видно покупателям.
                </p>
              ) : expirationStatus === "expiring_soon" ? (
                <p className="mt-0.5 text-[#D97706]">Объявление скоро истечёт.</p>
              ) : null}
            </div>
            {showOwnerRenewButton ? (
              <RenewListingButton
                listingId={listing.id}
                vertical={listing.vertical}
                className="shrink-0 sm:w-[160px]"
              />
            ) : null}
          </div>
        ) : null}

        {isAdminViewer && adminRisk ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-[rgba(148,163,184,0.25)] bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="font-semibold text-[#0F172A] dark:text-slate-100">Для модерации</span>
            <Badge variant={listing.status === ListingStatus.PUBLISHED ? "success" : "warning"}>
              {listingStatusLabels[listing.status]}
            </Badge>
            <ListingRiskBadge risk={adminRisk} label={getListingRiskLevelLabel(adminRisk)} />
            <Link
              href="/admin/moderation/listings"
              className="font-medium text-[#2563EB] underline-offset-2 hover:underline"
            >
              Открыть модерацию
            </Link>
          </div>
        ) : null}

        <div className="mt-5 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1.85fr)_minmax(300px,1fr)] lg:items-start lg:gap-8">
          <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
            <div className="order-1">
              <ListingGallery images={listing.images} title={listing.title} />
            </div>

            <div className="order-2 space-y-4 lg:hidden">
              <ListingMobileSummary
                title={listing.title}
                priceLabel={priceLabel}
                hasPrice={hasPrice}
                unitLabel={unitLabel}
                showUnitSuffix={showUnitSuffix}
                cityName={listing.city?.name ?? null}
                categoryName={listing.category.name}
                vertical={listing.vertical}
              />
              <ListingMainInfo items={mainInfoItems} />
            </div>

            <div className="order-3 lg:hidden">{sellerCard}</div>

            <div className="order-5 lg:order-3">
              <ListingDescription text={listing.description} />
            </div>

            <div className="order-6 lg:order-2">
              <ListingCharacteristics items={characteristicItems} />
            </div>

            <div className="order-7 space-y-5 lg:order-4 lg:space-y-6">
              {!isOwner ? <ListingVerticalHint vertical={listing.vertical} /> : null}
              {!isOwner ? <ListingRequestHint /> : null}
              <ListingLeadForm
                key={`${listing.id}-${listing.vertical}`}
                listingId={listing.id}
                listingTitle={listing.title}
                sellerName={sellerName}
                moq={listing.moq}
                unitLabel={unitLabel}
                vertical={listing.vertical}
                isAuthenticated={user !== null}
                isOwner={isOwner}
                restrictionMessage={leadRestrictedMessage}
                defaultPhone={user?.phone}
                defaultEmail={user?.email}
              />
              {isOwner ? <ListingQualityHints input={qualityInput} /> : null}
            </div>
          </div>

          <aside className="mt-6 hidden min-w-0 lg:mt-0 lg:block">
            <div className="sticky top-24 space-y-4">
              {contactCard}
              {sellerCard}
            </div>
          </aside>
        </div>

        <SellerOtherListings
          listings={sellerOtherListings}
          sellerId={listing.sellerProfile.id}
          sourceVertical={listing.vertical}
          isAuthenticated={user !== null}
          favoriteListingIds={favoriteListingIds}
        />

        <SimilarListings
          listings={similarListings.listings}
          isAuthenticated={user !== null}
          favoriteListingIds={favoriteListingIds}
          sourceVertical={listing.vertical}
          sameCategoryIds={similarListings.sameCategoryIds}
        />
      </Container>

      <ListingMobileStickyCta
        listingId={listing.id}
        isAuthenticated={user !== null}
        isFavorited={isFavorited}
        vertical={listing.vertical}
        hasPrice={hasPrice}
        isOwnListing={isOwner}
        contactPhone={user ? sellerProfile.contact_phone : null}
      />
    </main>
  );
}
