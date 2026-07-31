import type { CargoRequestStatus } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export type PublicCargoRequestCard = {
  id: string;
  created_at: Date;
  item_name: string;
  from_location: string;
  to_location: string;
  quantity: string | null;
  weight: string | null;
  dimensions: string | null;
};

export type SellerCargoRequestItem = {
  id: string;
  created_at: Date;
  name: string;
  phone: string;
  company: string | null;
  from_location: string;
  to_location: string;
  item_name: string;
  description: string | null;
  item_photo_url: string | null;
  quantity: string | null;
  weight: string | null;
  dimensions: string | null;
  urgency: string | null;
  comment: string | null;
  status: CargoRequestStatus;
};

const publicSelect = {
  id: true,
  created_at: true,
  item_name: true,
  from_location: true,
  to_location: true,
  quantity: true,
  weight: true,
  dimensions: true,
} as const;

const sellerSelect = {
  id: true,
  created_at: true,
  name: true,
  phone: true,
  company: true,
  from_location: true,
  to_location: true,
  item_name: true,
  description: true,
  item_photo_url: true,
  quantity: true,
  weight: true,
  dimensions: true,
  urgency: true,
  comment: true,
  status: true,
} as const;

export async function getPublicRecentCargoRequests(
  limit = 6,
): Promise<PublicCargoRequestCard[]> {
  return prisma.cargoRequest.findMany({
    orderBy: { created_at: "desc" },
    take: limit,
    select: publicSelect,
  });
}

export async function getSellerCargoRequests(options?: {
  statusFilter?: CargoRequestStatus | null;
  limit?: number;
}): Promise<SellerCargoRequestItem[]> {
  return prisma.cargoRequest.findMany({
    where: options?.statusFilter ? { status: options.statusFilter } : undefined,
    orderBy: { created_at: "desc" },
    take: options?.limit ?? 100,
    select: sellerSelect,
  });
}
