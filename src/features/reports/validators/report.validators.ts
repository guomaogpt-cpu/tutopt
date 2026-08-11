import { ReportReason } from "@prisma/client";
import { z } from "zod";

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  SPAM: "Спам",
  FRAUD: "Мошенничество",
  WRONG_CATEGORY: "Неверная категория",
  WRONG_PRICE: "Неверная цена",
  PROHIBITED_ITEM: "Запрещённый товар",
  DUPLICATE: "Дубликат",
  OUTDATED: "Объявление неактуально",
  CONTACTS_IN_WRONG_PLACE: "Контакты в запрещённом месте",
  OFFENSIVE_CONTENT: "Оскорбительный или запрещённый контент",
  OTHER: "Другое",
};

/** Reasons shown when reporting a listing (Phase 125). */
export const LISTING_REPORT_REASONS: ReportReason[] = [
  ReportReason.FRAUD,
  ReportReason.PROHIBITED_ITEM,
  ReportReason.WRONG_CATEGORY,
  ReportReason.WRONG_PRICE,
  ReportReason.OFFENSIVE_CONTENT,
  ReportReason.DUPLICATE,
  ReportReason.OUTDATED,
  ReportReason.OTHER,
];

export const LISTING_REPORT_REASON_OPTIONS = LISTING_REPORT_REASONS.map((value) => ({
  value,
  label: REPORT_REASON_LABELS[value],
}));

export const REPORT_REASON_OPTIONS = (
  Object.keys(REPORT_REASON_LABELS) as ReportReason[]
).map((value) => ({
  value,
  label: REPORT_REASON_LABELS[value],
}));

export const createReportSchema = z
  .object({
    listingId: z.string().uuid("Некорректное объявление").optional().nullable(),
    sellerId: z.string().uuid("Некорректный продавец").optional().nullable(),
    reason: z.nativeEnum(ReportReason, {
      message: "Выберите причину жалобы",
    }),
    message: z
      .string()
      .trim()
      .max(1000, "Сообщение слишком длинное")
      .optional()
      .nullable(),
  })
  .superRefine((value, ctx) => {
    const hasListing = Boolean(value.listingId);
    const hasSeller = Boolean(value.sellerId);

    if (!hasListing && !hasSeller) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Укажите объявление или продавца",
        path: ["listingId"],
      });
    }
  });

export const listingReportSchema = z.object({
  reason: z.nativeEnum(ReportReason, {
    message: "Выберите причину жалобы",
  }),
  message: z
    .string()
    .trim()
    .max(1000, "Сообщение слишком длинное")
    .optional()
    .nullable(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ListingReportInput = z.infer<typeof listingReportSchema>;

export const updateReportStatusSchema = z.object({
  action: z.enum(["resolve", "dismiss"]),
});

export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;

export const adminHideListingSchema = z.object({
  reason: z.string().trim().max(500, "Причина слишком длинная").optional().nullable(),
});

export type AdminHideListingInput = z.infer<typeof adminHideListingSchema>;
