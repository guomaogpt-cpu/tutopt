import { z } from "zod";

export const accountDeletionRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(1000, "Комментарий слишком длинный")
    .optional()
    .or(z.literal("")),
  confirm: z.literal(true, {
    errorMap: () => ({ message: "Подтвердите запрос на удаление аккаунта" }),
  }),
});

export type AccountDeletionRequestInput = z.infer<typeof accountDeletionRequestSchema>;
