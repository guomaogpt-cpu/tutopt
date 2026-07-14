import { AuthProvider, type SellerProfile, type User } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { generateShortId, slugifyTitle } from "@/features/listings/lib/slug";
import { NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

type CreateSellerProfileInput = {
  userId: string;
  companyName: string;
  contactPhone: string;
  contactEmail?: string | null;
};

async function resolveDefaultRegionId(): Promise<string> {
  const defaultRegion = await prisma.region.findFirst({
    where: { slug: "bishkek" },
  });

  if (!defaultRegion) {
    throw new NotFoundError("Default region not found. Run database seed first.");
  }

  return defaultRegion.id;
}

export async function createSellerProfileForUser(
  input: CreateSellerProfileInput,
): Promise<SellerProfile> {
  const existing = await prisma.sellerProfile.findUnique({
    where: { user_id: input.userId },
  });

  if (existing) {
    return existing;
  }

  const regionId = await resolveDefaultRegionId();
  const baseSlug = slugifyTitle(input.companyName);
  const slug = `${baseSlug}-${generateShortId().slice(0, 6)}`;

  return prisma.sellerProfile.create({
    data: {
      user_id: input.userId,
      company_name: input.companyName,
      slug,
      contact_phone: input.contactPhone,
      contact_email: input.contactEmail ?? null,
      region_id: regionId,
    },
  });
}

export async function ensureSellerProfile(user: PublicUser): Promise<SellerProfile> {
  if (!user.phone) {
    throw new ValidationError(
      "Укажите телефон в профиле продавца, прежде чем создавать объявления.",
    );
  }

  return createSellerProfileForUser({
    userId: user.id,
    companyName: user.name,
    contactPhone: user.phone,
    contactEmail: user.email,
  });
}

export async function markPasswordAuthProvider(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { auth_provider: AuthProvider.PASSWORD },
  });
}

export type UserWithAuth = Pick<User, "id" | "name" | "email" | "phone" | "role">;
