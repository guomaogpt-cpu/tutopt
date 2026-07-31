import { prisma } from "@/shared/lib/prisma";

export async function getCargoSubscriptionForSeller(
  sellerProfileId: string,
): Promise<{ isActive: boolean } | null> {
  const row = await prisma.cargoRequestSubscription.findUnique({
    where: { seller_profile_id: sellerProfileId },
    select: { is_active: true },
  });

  if (!row) {
    return null;
  }

  return { isActive: row.is_active };
}

export async function setCargoSubscription(input: {
  sellerProfileId: string;
  userId: string;
  active: boolean;
}): Promise<{ isActive: boolean }> {
  const row = await prisma.cargoRequestSubscription.upsert({
    where: { seller_profile_id: input.sellerProfileId },
    create: {
      seller_profile_id: input.sellerProfileId,
      user_id: input.userId,
      is_active: input.active,
    },
    update: {
      is_active: input.active,
      user_id: input.userId,
    },
    select: { is_active: true },
  });

  return { isActive: row.is_active };
}
