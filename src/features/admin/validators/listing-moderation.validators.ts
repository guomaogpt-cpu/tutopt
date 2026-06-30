import { z } from "zod";

export const listingModerationSchema = z.object({
  action: z.enum(["approve", "reject"]),
});

export type ListingModerationInput = z.infer<typeof listingModerationSchema>;
