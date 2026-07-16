import { ReportReason } from "@prisma/client";
import { z } from "zod";

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  SPAM: "Спам",
  FRAUD: "Мошенничество",
  WRONG_CATEGORY: "Неверная категория",
  PROHIBITED_ITEM: "Запрещённый товар или услуга",
  DUPLICATE: "Дубль объявления",
  CONTACTS_IN_WRONG_PLACE: "Контакты в запрещённом месте",
  OFFENSIVE_CONTENT: "Оскорбительный контент",
  OTHER: "Другое",
};

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

export type CreateReportInput = z.infer<typeof createReportSchema>;

export const updateReportStatusSchema = z.object({
  action: z.enum(["resolve", "dismiss"]),
});

export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
