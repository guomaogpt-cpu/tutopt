import { z } from "zod";

export const createLeadSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Укажите количество не меньше 1"),
  message: z.string().max(5000, "Сообщение слишком длинное").optional().nullable(),
  contact_phone: z.string().max(20, "Телефон слишком длинный").optional().nullable(),
  contact_email: z
    .string()
    .max(255)
    .optional()
    .nullable()
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Некорректный email",
    }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export function buildLeadMessage(input: CreateLeadInput): string | null {
  const parts: string[] = [];

  if (input.message?.trim()) {
    parts.push(input.message.trim());
  }

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

  return parts.length > 0 ? parts.join("\n\n") : null;
}
