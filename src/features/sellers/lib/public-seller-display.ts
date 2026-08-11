import type { CompanyType } from "@prisma/client";
import { isCompanyVerified } from "@/features/company/lib/company-verification";
import type { CompanyVerificationStatus } from "@prisma/client";

export const DEFAULT_PUBLIC_SELLER_NAME = "Пользователь ВсеТут";

export function getPublicSellerDisplayName(profile: {
  company_type: CompanyType | null;
  company_name: string;
  user: { name: string };
}): string {
  if (profile.company_type) {
    return profile.company_name.trim() || profile.user.name.trim() || DEFAULT_PUBLIC_SELLER_NAME;
  }
  return profile.user.name.trim() || profile.company_name.trim() || DEFAULT_PUBLIC_SELLER_NAME;
}

export function isPublicCompanyProfile(
  companyType: CompanyType | null | undefined,
): boolean {
  return Boolean(companyType);
}

export function shouldShowCompanyVerificationBadge(options: {
  postedAsCompany?: boolean;
  companyType?: CompanyType | null;
  verificationStatus?: CompanyVerificationStatus | null;
}): boolean {
  if (!options.verificationStatus || !isCompanyVerified(options.verificationStatus)) {
    return false;
  }
  if (options.postedAsCompany !== undefined) {
    return Boolean(options.postedAsCompany && options.companyType);
  }
  return Boolean(options.companyType);
}
