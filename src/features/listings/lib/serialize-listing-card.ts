import type { Prisma } from "@prisma/client";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

export const listingCardSelect = {
  id: true,
  title: true,
  price: true,
  currency: true,
  moq: true,
  unit: true,
  status: true,
  vertical: true,
  stock_quantity: true,
  created_at: true,
  published_at: true,
  category: { select: { name: true } },
  city: { select: { name: true } },
  brand: { select: { name: true } },
  sellerProfile: { select: { company_name: true } },
  images: {
    orderBy: { sort_order: "asc" as const },
    take: 1,
    select: { url: true },
  },
} as const satisfies Prisma.ListingSelect;

export type ListingCardRow = Prisma.ListingGetPayload<{
  select: typeof listingCardSelect;
}>;

function serializeDecimal(value: Prisma.Decimal): string {
  return value.toString();
}

function serializeDate(value: Date): string {
  return value.toISOString();
}

export function serializeListingCard(row: ListingCardRow): ListingCardData {
  return {
    id: row.id,
    title: row.title,
    price: serializeDecimal(row.price),
    currency: row.currency,
    moq: row.moq,
    unit: row.unit,
    status: row.status,
    vertical: row.vertical,
    stock_quantity: row.stock_quantity,
    created_at: serializeDate(row.created_at),
    published_at: row.published_at ? serializeDate(row.published_at) : null,
    category: row.category,
    city: row.city,
    brand: row.brand,
    sellerProfile: row.sellerProfile,
    images: row.images,
  };
}

export function serializeListingCards(rows: ListingCardRow[]): ListingCardData[] {
  return rows.map(serializeListingCard);
}
