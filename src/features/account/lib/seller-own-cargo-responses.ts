import type { CargoResponseStatus } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export type SellerOwnCargoResponseItem = {
  id: string;
  created_at: Date;
  price: string | null;
  currency: string | null;
  estimated_time: string | null;
  comment: string;
  status: CargoResponseStatus;
  cargoRequest: {
    id: string;
    item_name: string;
    from_location: string;
    to_location: string;
  };
};

export async function getSellerOwnCargoResponses(
  sellerProfileId: string,
): Promise<SellerOwnCargoResponseItem[]> {
  const rows = await prisma.cargoResponse.findMany({
    where: { seller_profile_id: sellerProfileId },
    orderBy: { created_at: "desc" },
    take: 50,
    select: {
      id: true,
      created_at: true,
      price: true,
      currency: true,
      estimated_time: true,
      comment: true,
      status: true,
      cargoRequest: {
        select: {
          id: true,
          item_name: true,
          from_location: true,
          to_location: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    price: row.price,
    currency: row.currency,
    estimated_time: row.estimated_time,
    comment: row.comment,
    status: row.status,
    cargoRequest: row.cargoRequest,
  }));
}
