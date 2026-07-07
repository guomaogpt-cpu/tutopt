import { notFound } from "next/navigation";
import { ListingCharacteristics } from "@/components/listings/ListingCharacteristics";
import { ListingContactCard } from "@/components/listings/ListingContactCard";
import { ListingDescription } from "@/components/listings/ListingDescription";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingSellerCard } from "@/components/listings/ListingSellerCard";
import { ListingLeadForm } from "@/components/listings/ListingLeadForm";
import { SimilarListings } from "@/components/listings/SimilarListings";
import { listingUnitOptions } from "@/features/listings/constants";
import { canViewListing } from "@/features/listings/lib/listing-access";
import {
  formatListingDate,
  formatListingPrice,
} from "@/features/listings/lib/format-listing-price";
import {
  getListingDetail,
  getSellerPublishedListingCount,
  getSimilarListings,
} from "@/features/listings/lib/listing-detail-data";
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
import { Container } from "@/components/ui/container";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageTitle } from "@/components/ui/page-title";

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

  const publishedDate = listing.published_at ?? listing.created_at;
  const priceLabel = formatListingPrice(listing.price, listing.currency);
  const publishedAtLabel = formatListingDate(publishedDate);

  const sellerProfile = listing.sellerProfile;
  const isOwner = user?.id === sellerProfile.user_id;
  const sellerName = sellerProfile.user.name;
  const sellerAvatar = sellerProfile.logo_url ?? sellerProfile.user.avatar_url;
  const sellerCity = sellerProfile.city?.name ?? listing.city?.name ?? null;

  const characteristicItems = [
    { label: "Категория", value: listing.category.name },
    ...(listing.brand ? [{ label: "Бренд", value: listing.brand.name }] : []),
    { label: "MOQ", value: `${listing.moq} ${unitLabel.toLowerCase()}` },
    { label: "Единица", value: unitLabel },
    ...(listing.city ? [{ label: "Город", value: listing.city.name }] : []),
    ...(listing.stock_quantity != null
      ? [{ label: "Остаток", value: String(listing.stock_quantity) }]
      : []),
    { label: "Дата", value: publishedAtLabel },
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
      publishedAtLabel={publishedAtLabel}
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
    <main className="bg-background py-6 sm:py-10">
      <Container className="max-w-[1280px]">
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

        <PageHeader className="mt-4 pb-0">
          <PageHeaderContent>
            <PageTitle className="hidden text-2xl sm:text-3xl lg:block">{listing.title}</PageTitle>
          </PageHeaderContent>
        </PageHeader>

        <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
          <div className="min-w-0 space-y-8">
            <ListingGallery images={listing.images} title={listing.title} />

            <PageTitle className="text-2xl sm:text-3xl lg:hidden">{listing.title}</PageTitle>

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

          <aside className="hidden lg:block">
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
