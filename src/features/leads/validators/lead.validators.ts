import { z } from "zod";

export const LEAD_MESSAGE_MIN = 5;
export const LEAD_MESSAGE_MAX = 2000;

const trimmedMessage = z
  .string()
  .trim()
  .min(LEAD_MESSAGE_MIN, "Сообщение слишком короткое")
  .max(LEAD_MESSAGE_MAX, "Сообщение слишком длинное");

export const createLeadSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Укажите количество не меньше 1"),
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
