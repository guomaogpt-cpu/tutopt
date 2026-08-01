import { CompanyType } from "@prisma/client";
import { z } from "zod";

const optionalWebsite = z
  .string()
  .trim()
  .max(255, "Слишком длинный адрес сайта")
  .optional()
  .nullable()
  .transform((value) => {
    if (!value) {
      return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  });

const optionalLogoUrl = z
  .string()
  .trim()
  .regex(
    /^\/(api\/)?uploads\/listings\/[a-zA-Z0-9._-]+$/,
    "Некорректный адрес логотипа",
  )
  .optional()
  .nullable()
  .transform((value) => (value && value.trim() ? value.trim() : null));

export const upsertCompanyProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Укажите название компании")
    .max(200, "Название слишком длинное"),
  company_type: z.nativeEnum(CompanyType, {
    errorMap: () => ({ message: "Выберите тип компании" }),
  }),
  city_id: z.string().uuid("Выберите город").optional().nullable(),
  phone: z
    .string()
    .trim()
    .min(8, "Укажите телефон")
    .max(20, "Телефон слишком длинный"),
  description: z
    .string()
    .trim()
    .max(5000, "Описание слишком длинное")
    .optional()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
  website: optionalWebsite,
  logo_url: optionalLogoUrl,
});

export type UpsertCompanyProfileInput = z.infer<typeof upsertCompanyProfileSchema>;
