import type { CompanyType, CompanyVerificationStatus, SellerProfile } from "@prisma/client";

export const COMPANY_TYPES: CompanyType[] = [
  "STORE",
  "SUPPLIER",
  "SERVICE",
  "CARGO",
  "OTHER",
];

export type CompanyProfileSummary = {
  id: string;
  slug: string;
  companyName: string;
  companyType: CompanyType | null;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  contactPhone: string;
  cityId: string | null;
  cityName: string | null;
  isConfigured: boolean;
  verificationStatus: CompanyVerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
};

export function isCompanyProfileConfigured(
  profile: Pick<SellerProfile, "company_type"> | null | undefined,
): boolean {
  return Boolean(profile?.company_type);
}

export function toCompanyProfileSummary(profile: {
  id: string;
  slug: string;
  company_name: string;
  company_type: CompanyType | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  contact_phone: string;
  city_id: string | null;
  city?: { name: string } | null;
  verification_status: CompanyVerificationStatus;
  verified_at: Date | null;
  created_at: Date;
}): CompanyProfileSummary {
  return {
    id: profile.id,
    slug: profile.slug,
    companyName: profile.company_name,
    companyType: profile.company_type,
    description: profile.description,
    logoUrl: profile.logo_url,
    website: profile.website,
    contactPhone: profile.contact_phone,
    cityId: profile.city_id,
    cityName: profile.city?.name ?? null,
    isConfigured: isCompanyProfileConfigured(profile),
    verificationStatus: profile.verification_status,
    verifiedAt: profile.verified_at ? profile.verified_at.toISOString() : null,
    createdAt: profile.created_at.toISOString(),
  };
}

export function buildCompanyProfileHref(
  idOrSlug: string,
  vertical?: string | null,
): string {
  if (!vertical) {
    return `/companies/${idOrSlug}`;
  }
  return `/companies/${idOrSlug}?vertical=${vertical}`;
}

export function resolveListingPublisherDisplay(options: {
  postedAsCompany: boolean;
  companyName: string;
  userName: string;
  companyType: CompanyType | null;
}): {
  displayName: string;
  isCompany: boolean;
} {
  const isCompany =
    options.postedAsCompany && Boolean(options.companyType);
  return {
    isCompany,
    displayName: isCompany
      ? options.companyName.trim() || options.userName
      : options.userName.trim() || options.companyName,
  };
}
