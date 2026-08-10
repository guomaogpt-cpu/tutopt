import { z } from "zod";

export const LEAD_MESSAGE_MIN = 5;
export const LEAD_MESSAGE_MAX = 1000;
export const LEAD_QUANTITY_MAX = 1_000_000;

const trimmedMessage = z
  .string()
  .trim()
  .min(LEAD_MESSAGE_MIN, { message: "LEAD_MESSAGE_TOO_SHORT" })
  .max(LEAD_MESSAGE_MAX, { message: "LEAD_MESSAGE_TOO_LONG" });

export const createLeadSchema = z.object({
  quantity: z.coerce
    .number({
      invalid_type_error: "LEAD_QUANTITY_INVALID",
      required_error: "LEAD_QUANTITY_INVALID",
    })
    .int({ message: "LEAD_QUANTITY_INVALID" })
    .min(1, { message: "LEAD_QUANTITY_INVALID" })
    .max(LEAD_QUANTITY_MAX, { message: "LEAD_QUANTITY_INVALID" }),
  message: trimmedMessage,
  contact_phone: z.string().trim().max(20, "Телефон слишком длинный").optional().nullable(),
  contact_email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable()
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Некорректный email",
    }),
  force_resend: z.boolean().optional().default(false),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export function buildLeadMessage(input: CreateLeadInput): string {
  const parts: string[] = [input.message.trim()];

  const contactLines: string[] = [];

  if (input.contact_phone?.trim()) {
    contactLines.push(`Телефон: ${input.contact_phone.trim()}`);
  }

  if (input.contact_email?.trim()) {
    contactLines.push(`Email: ${input.contact_email.trim()}`);
  }

  if (contactLines.length > 0) {
    parts.push(contactLines.join("\n"));
  }

  return parts.join("\n\n");
}
