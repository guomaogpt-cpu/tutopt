import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { isSellerPhoneComplete } from "@/features/auth/lib/seller-onboarding";
import {
  isCompanyProfileConfigured,
  toCompanyProfileSummary,
} from "@/features/company/lib/company-profile";
import { upsertCompanyProfileSchema } from "@/features/company/validators/company-profile.validators";
import {
  createSellerProfileForUser,
  ensureSellerProfile,
} from "@/features/listings/lib/seller-profile";
import { generateShortId, slugifyTitle } from "@/features/listings/lib/slug";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";
import { getAccountRestrictedMessage, isUserBlocked } from "@/lib/security/user-restrictions";

const companySelect = {
  id: true,
  slug: true,
  company_name: true,
  company_type: true,
  description: true,
  logo_url: true,
  website: true,
  contact_phone: true,
  city_id: true,
  city: { select: { name: true } },
  verification_status: true,
  verified_at: true,
  created_at: true,
} as const;

export async function GET() {
  return withApiHandler(async () => {
    const user = await requireAuth();

    const profile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: companySelect,
    });

    return jsonData({
      company: profile ? toCompanyProfileSummary(profile) : null,
    });
  });
}

export async function PUT(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (
      user.role !== UserRole.BUYER &&
      user.role !== UserRole.SELLER &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenError("Только зарегистрированный аккаунт может создать профиль компании");
    }

    if (isUserBlocked(user)) {
      throw new ForbiddenError(getAccountRestrictedMessage());
    }

    if (!isSellerPhoneComplete(user.phone)) {
      throw new ValidationError(
        "Подтвердите телефон, прежде чем создавать профиль компании.",
      );
    }

    const input = await parseJsonBody(request, upsertCompanyProfileSchema);

    let cityRegionId: string | null = null;
    if (input.city_id) {
      const city = await prisma.city.findFirst({
        where: { id: input.city_id, is_active: true },
        select: { id: true, region_id: true },
      });
      if (!city) {
        throw new NotFoundError("City not found");
      }
      cityRegionId = city.region_id;
    }

    let profile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
    });

    if (!profile) {
      await ensureSellerProfile(user);
      profile = await prisma.sellerProfile.findUnique({
        where: { user_id: user.id },
      });
    }

    if (!profile) {
      profile = await createSellerProfileForUser({
        userId: user.id,
        companyName: input.name,
        contactPhone: input.phone,
        contactEmail: user.email,
      });
    }

    const baseSlug = slugifyTitle(input.name);
    const nextSlug =
      profile.company_name === input.name
        ? profile.slug
        : `${baseSlug}-${generateShortId().slice(0, 6)}`;

    const wasConfigured = isCompanyProfileConfigured(profile);

    const updated = await prisma.sellerProfile.update({
      where: { id: profile.id },
      data: {
        company_name: input.name,
        company_type: input.company_type,
        contact_phone: input.phone,
        description: input.description,
        website: input.website,
        logo_url: input.logo_url,
        city_id: input.city_id ?? null,
        ...(cityRegionId ? { region_id: cityRegionId } : {}),
        slug: nextSlug,
      },
      select: companySelect,
    });

    if (user.role === UserRole.BUYER) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.SELLER },
      });
    }

    return jsonData({
      company: toCompanyProfileSummary(updated),
      created: !wasConfigured,
    });
  });
}
