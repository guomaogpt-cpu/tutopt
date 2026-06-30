import type { SellerProfile } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { generateShortId, slugifyTitle } from "@/features/listings/lib/slug";
import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

export async function ensureSellerProfile(user: PublicUser): Promise<SellerProfile> {
  const existing = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
  });

  if (existing) {
    return existing;
  }

  const defaultRegion = await prisma.region.findFirst({
    where: { slug: "bishkek" },
  });

  if (!defaultRegion) {
    throw new NotFoundError("Default region not found. Run database seed first.");
  }

  const baseSlug = slugifyTitle(user.name);
  const slug = `${baseSlug}-${generateShortId().slice(0, 6)}`;

  return prisma.sellerProfile.create({
    data: {
      user_id: user.id,
      company_name: user.name,
      slug,
      contact_phone: user.phone ?? "+996000000000",
      contact_email: user.email,
      region_id: defaultRegion.id,
    },
  });
}
