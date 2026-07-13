import { prisma } from "@/shared/lib/prisma";

export type SellerLeadItem = {
  id: string;
  quantity: number;
  message: string | null;
  status: "NEW" | "VIEWED" | "CLOSED";
  created_at: Date;
  listing: {
    id: string;
    title: string;
    image_url: string | null;
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
  status: "NEW" | "VIEWED" | "CLOSED";
  created_at: Date;
  listing: {
    id: string;
    title: string;
    image_url: string | null;
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
      image_url: lead.listing.images[0]?.thumbnail_url ?? lead.listing.images[0]?.url ?? null,
    },
    sellerProfile: lead.sellerProfile,
  }));
}

export async function getSellerLeads(sellerProfileId: string): Promise<SellerLeadItem[]> {
  const leads = await prisma.lead.findMany({
    where: { seller_profile_id: sellerProfileId },
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
      image_url: lead.listing.images[0]?.thumbnail_url ?? lead.listing.images[0]?.url ?? null,
    },
    buyer: lead.buyer,
  }));
}
