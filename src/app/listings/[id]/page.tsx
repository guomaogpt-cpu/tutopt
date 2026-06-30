import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ListingCharacteristics } from "@/components/listings/ListingCharacteristics";
import { ListingContactCard } from "@/components/listings/ListingContactCard";
import { ListingDescription } from "@/components/listings/ListingDescription";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingSellerCard } from "@/components/listings/ListingSellerCard";
import { ListingSellerMessage } from "@/components/listings/ListingSellerMessage";
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
import { getCurrentUser } from "@/features/auth/lib/session";

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

  const [similarListings, sellerListingCount] = await Promise.all([
    getSimilarListings(listing.id, listing.category_id),
    getSellerPublishedListingCount(listing.sellerProfile.id),
  ]);

  const unitLabel =
    listingUnitOptions.find((option) => option.value === listing.unit)?.label ?? listing.unit;

  const publishedDate = listing.published_at ?? listing.created_at;
  const priceLabel = formatListingPrice(listing.price, listing.currency);
  const publishedAtLabel = formatListingDate(publishedDate);

  const sellerProfile = listing.sellerProfile;
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

  const sidebar = (
    <>
      <ListingContactCard
        priceLabel={priceLabel}
        moq={listing.moq}
        unitLabel={unitLabel}
        stockQuantity={listing.stock_quantity}
        cityName={listing.city?.name ?? null}
        status={listing.status}
        publishedAtLabel={publishedAtLabel}
      />
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
    </>
  );

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
            <li>
              <Link
                href={`/listings?category=${listing.category_id}`}
                className="transition hover:text-blue-600"
              >
                {listing.category.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 font-medium text-slate-700">{listing.title}</li>
          </ol>
        </nav>

        <h1 className="mt-6 hidden text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:block">
          {listing.title}
        </h1>

        <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <ListingGallery images={listing.images} title={listing.title} />

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:hidden">
              {listing.title}
            </h1>

            <div className="mt-6 space-y-4 lg:hidden">{sidebar}</div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">{sidebar}</div>
          </aside>
        </div>

        <div className="mt-10 space-y-8 lg:mt-12 lg:space-y-10">
          <ListingCharacteristics items={characteristicItems} />
          <ListingDescription text={listing.description} />
          <ListingSellerMessage sellerName={sellerName} />
        </div>

        <SimilarListings listings={similarListings} />
      </Container>
    </main>
  );
}
