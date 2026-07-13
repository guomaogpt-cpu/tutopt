import { notFound } from "next/navigation";
import { ListingStatus, UserRole } from "@prisma/client";
import { ListingCharacteristics } from "@/components/listings/ListingCharacteristics";
import { ListingContactCard } from "@/components/listings/ListingContactCard";
import { ListingDescription } from "@/components/listings/ListingDescription";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingSellerCard } from "@/components/listings/ListingSellerCard";
import { ListingLeadForm } from "@/components/listings/ListingLeadForm";
import { SimilarListings } from "@/components/listings/SimilarListings";
import { listingUnitOptions } from "@/features/listings/constants";
import { canViewListing } from "@/features/listings/lib/listing-access";
import { formatListingPrice } from "@/features/listings/lib/format-listing-price";
import {
  getListingDetail,
  getSellerPublishedListingCount,
  getSimilarListings,
} from "@/features/listings/lib/listing-detail-data";
import { listingStatusLabels } from "@/features/listings/lib/listing-status";
import { getUserFavoriteListingIds } from "@/features/favorites/lib/favorites-data";
import { recordListingView } from "@/features/buyer/lib/listing-views";
import { getCurrentUser } from "@/features/auth/lib/session";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

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

  const [similarListings, sellerListingCount] = await Promise.all([
    getSimilarListings(listing.id, listing.category_id),
    getSellerPublishedListingCount(listing.sellerProfile.id),
  ]);

  const favoriteListingIds = user ? await getUserFavoriteListingIds(user.id) : [];
  const favoriteIds = new Set(favoriteListingIds);
  const isFavorited = favoriteIds.has(listing.id);

  const unitLabel =
    listingUnitOptions.find((option) => option.value === listing.unit)?.label ?? listing.unit;

  const priceLabel = formatListingPrice(listing.price, listing.currency);

  const sellerProfile = listing.sellerProfile;
  const isOwner = user?.id === sellerProfile.user_id;
  const isPrivilegedViewer =
    isOwner || user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR;
  const showStatusBadge =
    listing.status !== ListingStatus.PUBLISHED && isPrivilegedViewer;

  const sellerName = sellerProfile.user.name;
  const sellerAvatar = sellerProfile.logo_url ?? sellerProfile.user.avatar_url;
  const sellerCity = sellerProfile.city?.name ?? listing.city?.name ?? null;

  const characteristicItems = [
    { label: "Категория", value: listing.category.name },
    ...(listing.city ? [{ label: "Город", value: listing.city.name }] : []),
    ...(listing.brand ? [{ label: "Бренд", value: listing.brand.name }] : []),
    { label: "Мин. партия", value: `${listing.moq} ${unitLabel.toLowerCase()}` },
    { label: "Единица", value: unitLabel },
    ...(listing.stock_quantity != null
      ? [{ label: "Остаток", value: String(listing.stock_quantity) }]
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
      showStatusBadge={showStatusBadge}
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
    />
  );

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="min-w-0 max-w-[1280px]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Главная</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/listings">Каталог</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/listings?category=${listing.category_id}`}>
                {listing.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{listing.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mt-4 sm:mt-5">
          <h1 className="text-[1.375rem] font-bold leading-tight tracking-tight text-[#0F172A] sm:text-[1.625rem] lg:text-[2rem]">
            {listing.title}
          </h1>
          {showStatusBadge ? (
            <Badge variant="warning" className="mt-2">
              {listingStatusLabels[listing.status]}
            </Badge>
          ) : null}
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
              listingId={listing.id}
              sellerName={sellerName}
              moq={listing.moq}
              unitLabel={unitLabel}
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
