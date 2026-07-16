import { z } from "zod";

export const userRestrictionActionSchema = z.object({
  action: z.enum([
    "block",
    "unblock",
    "restrict_listings",
    "unrestrict_listings",
    "restrict_leads",
    "unrestrict_leads",
  ]),
  reason: z
    .string()
    .trim()
    .max(500, "Причина слишком длинная")
    .optional()
    .nullable(),
});

export type UserRestrictionActionInput = z.infer<typeof userRestrictionActionSchema>;
