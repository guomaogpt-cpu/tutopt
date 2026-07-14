import { isValidKgPhone } from "@/features/auth/lib/phone";

/** Fake placeholder from older Google SELLER flow — treat as incomplete. */
const PLACEHOLDER_PHONE = "+996000000000";

export function isSellerPhoneComplete(phone: string | null | undefined): boolean {
  if (!phone) {
    return false;
  }
  if (phone === PLACEHOLDER_PHONE) {
    return false;
  }
  return isValidKgPhone(phone);
}

export function needsSellerOnboarding(input: {
  role: string;
  phone: string | null | undefined;
}): boolean {
  return input.role === "SELLER" && !isSellerPhoneComplete(input.phone);
}
