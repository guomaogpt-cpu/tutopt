import { z } from "zod";
import { isValidKgPhone, normalizePhone } from "@/features/auth/lib/phone";

export const sellerUpgradeSchema = z
  .object({
    company_name: z
      .string()
      .trim()
      .min(2, "Укажите название компании или имя продавца")
      .max(200, "Название слишком длинное"),
    phone: z.string().optional(),
    phoneVerificationToken: z.string().optional(),
    next: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.phone && data.phone.trim().length > 0) {
      const normalized = normalizePhone(data.phone);
      if (!isValidKgPhone(normalized)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Телефон должен быть в формате +996XXXXXXXXX",
          path: ["phone"],
        });
      }
      if (!data.phoneVerificationToken?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Подтвердите телефон по коду из SMS",
          path: ["phoneVerificationToken"],
        });
      }
    }
  })
  .transform((data) => {
    const rawPhone = data.phone?.trim();
    return {
      company_name: data.company_name,
      phone: rawPhone ? normalizePhone(rawPhone) : undefined,
      phoneVerificationToken: data.phoneVerificationToken?.trim() || undefined,
      next: data.next,
    };
  });

export type SellerUpgradeInput = z.infer<typeof sellerUpgradeSchema>;
