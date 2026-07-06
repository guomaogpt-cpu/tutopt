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
  };
  sellerProfile: {
    id: string;
    company_name: string;
  };
};

export async function getBuyerLeads(userId: string): Promise<BuyerLeadItem[]> {
  return prisma.lead.findMany({
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
}

export async function getSellerLeads(sellerProfileId: string): Promise<SellerLeadItem[]> {
  return prisma.lead.findMany({
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
}
