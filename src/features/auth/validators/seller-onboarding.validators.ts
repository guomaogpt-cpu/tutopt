import { z } from "zod";
import { isValidKgPhone, normalizePhone } from "@/features/auth/lib/phone";
import { isSafeInternalPath } from "@/features/auth/lib/login-redirect";

export const sellerOnboardingSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Укажите название компании или ваше имя")
    .max(200, "Название слишком длинное"),
  phone: z
    .string()
    .min(1, "Укажите телефон")
    .transform((value) => normalizePhone(value))
    .refine((value) => isValidKgPhone(value), {
      message: "Телефон должен быть в формате +996XXXXXXXXX",
    }),
  phoneVerificationToken: z.string().min(1, "Подтвердите телефон по коду из SMS"),
  next: z.string().optional(),
});

export type SellerOnboardingInput = z.infer<typeof sellerOnboardingSchema>;

export const SELLER_ONBOARDING_PATH = "/seller/onboarding";

export function buildSellerOnboardingUrl(next?: string): string {
  if (next && isSafeInternalPath(next) && next !== SELLER_ONBOARDING_PATH) {
    return `${SELLER_ONBOARDING_PATH}?next=${encodeURIComponent(next)}`;
  }
  return SELLER_ONBOARDING_PATH;
}

export function defaultPostAuthPath(role: string, next?: string | null): string {
  if (next && isSafeInternalPath(next) && next !== "/") {
    return next;
  }

  if (role === "SELLER" || role === "BUYER") {
    return "/account";
  }

  return "/";
}
