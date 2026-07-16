import type { ListingVertical } from "@prisma/client";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { getAbsoluteUrl } from "@/shared/seo/absolute-url";

type ListingJsonLdInput = {
  id: string;
  title: string;
  description: string;
  price: { toString(): string } | number | string;
  currency: string;
  vertical: ListingVertical;
  images: { url: string }[];
};

function toPlainPrice(price: ListingJsonLdInput["price"]): string {
  if (typeof price === "number") {
    return String(price);
  }
  return price.toString();
}

export function buildListingJsonLd(listing: ListingJsonLdInput): Record<string, unknown> {
  const url = getAbsoluteUrl(`/listings/${listing.id}`);
  const images = listing.images
    .map((image) => getAbsoluteUrl(normalizeListingImageUrl(image.url)))
    .filter(Boolean);
  const description = listing.description.trim() || `${listing.title}: объявление на Tutopt.`;

  if (listing.vertical === "SERVICES" || listing.vertical === "CARGO") {
    const service: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: listing.title,
      description,
      url,
    };

    if (images.length > 0) {
      service.image = images;
    }

    service.offers = {
      "@type": "Offer",
      price: toPlainPrice(listing.price),
      priceCurrency: listing.currency,
      url,
      availability: "https://schema.org/InStock",
    };

    return service;
  }

  const product: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description,
    url,
    offers: {
      "@type": "Offer",
      price: toPlainPrice(listing.price),
      priceCurrency: listing.currency,
      availability: "https://schema.org/InStock",
      url,
    },
  };

  if (images.length > 0) {
    product.image = images;
  }

  return product;
}
