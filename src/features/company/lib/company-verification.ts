import type { CompanyVerificationStatus } from "@prisma/client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export function isCompanyVerified(
  status: CompanyVerificationStatus | null | undefined,
): boolean {
  return status === "VERIFIED";
}

export function getCompanyVerificationLabelKey(
  status: CompanyVerificationStatus,
): DictionaryKey {
  switch (status) {
    case "VERIFIED":
      return "company.verification.verified";
    case "PENDING":
      return "company.verification.pending";
    case "REJECTED":
      return "company.verification.rejected";
    case "UNVERIFIED":
    default:
      return "company.verification.unverified";
  }
}

export function getPublicVerificationBadgeKey(options: {
  status: CompanyVerificationStatus;
  isCargo?: boolean;
}): DictionaryKey | null {
  if (options.status !== "VERIFIED") {
    return null;
  }
  return options.isCargo
    ? "company.verification.verifiedCargoBadge"
    : "company.verification.verifiedBadge";
}

/** Owner-only statuses shown in cabinet (includes rejected). */
export function getOwnerVerificationLabelKey(
  status: CompanyVerificationStatus,
): DictionaryKey {
  return getCompanyVerificationLabelKey(status);
}
