import type { LeadStatus, ListingStatus, ListingVertical, Prisma } from "@prisma/client";
import {
  sellerLeadStatusFilterToEnum,
  type SellerLeadStatusFilter,
} from "@/features/leads/lib/lead-status";
import { prisma } from "@/shared/lib/prisma";

export type SellerLeadItem = {
  id: string;
  quantity: number;
  message: string | null;
  status: LeadStatus;
  created_at: Date;
  listing: {
    id: string;
    title: string;
    image_url: string | null;
    vertical: ListingVertical;
    status: ListingStatus;
    city: string | null;
    price: string | null;
    currency: string | null;
  };
  buyer: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
  };
};

export type BuyerLeadItem = {
  id: string;
  quantity: number;
  message: string | null;
  status: LeadStatus;
  created_at: Date;
  listing: {
    id: string;
    title: string;
    image_url: string | null;
    vertical: ListingVertical;
  };
  sellerProfile: {
    id: string;
    company_name: string;
  };
};

export async function getBuyerLeads(userId: string): Promise<BuyerLeadItem[]> {
  const leads = await prisma.lead.findMany({
    where: { buyer_id: userId },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      quantity: true,
      message: true,
      status: true,
      created_at: true,
      listing: {
        select: {
          id: true,
          title: true,
          vertical: true,
          images: {
            orderBy: { sort_order: "asc" },
            take: 1,
            select: {
              url: true,
              thumbnail_url: true,
            },
          },
        },
      },
      sellerProfile: {
        select: {
          id: true,
          company_name: true,
        },
      },
    },
  });

  return leads.map((lead) => ({
    id: lead.id,
    quantity: lead.quantity,
    message: lead.message,
    status: lead.status,
    created_at: lead.created_at,
    listing: {
      id: lead.listing.id,
      title: lead.listing.title,
      vertical: lead.listing.vertical,
      image_url: lead.listing.images[0]?.thumbnail_url ?? lead.listing.images[0]?.url ?? null,
    },
    sellerProfile: lead.sellerProfile,
  }));
}

export async function getSellerLeads(
  sellerProfileId: string,
  options?: { statusFilter?: SellerLeadStatusFilter; listingId?: string },
): Promise<SellerLeadItem[]> {
  const status = sellerLeadStatusFilterToEnum(options?.statusFilter ?? "all");
  const where: Prisma.LeadWhereInput = {
    seller_profile_id: sellerProfileId,
    ...(status ? { status } : {}),
    ...(options?.listingId ? { listing_id: options.listingId } : {}),
  };

  const leads = await prisma.lead.findMany({
    where,
    orderBy: [{ status: "asc" }, { created_at: "desc" }],
    select: {
      id: true,
      quantity: true,
      message: true,
      status: true,
      created_at: true,
      listing: {
        select: {
          id: true,
          title: true,
          vertical: true,
          status: true,
          price: true,
          currency: true,
          city: { select: { name: true } },
          images: {
            orderBy: { sort_order: "asc" },
            take: 1,
            select: {
              url: true,
              thumbnail_url: true,
            },
          },
        },
      },
      buyer: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
    },
  });

  return leads.map((lead) => ({
    id: lead.id,
    quantity: lead.quantity,
    message: lead.message,
    status: lead.status,
    created_at: lead.created_at,
    listing: {
      id: lead.listing.id,
      title: lead.listing.title,
      vertical: lead.listing.vertical,
      status: lead.listing.status,
      city: lead.listing.city?.name ?? null,
      price: lead.listing.price?.toString() ?? null,
      currency: lead.listing.currency ?? null,
      image_url: lead.listing.images[0]?.thumbnail_url ?? lead.listing.images[0]?.url ?? null,
    },
    buyer: lead.buyer,
  }));
}
