import { z } from "zod";

export const updateCargoSubscriptionSchema = z.object({
  active: z.boolean({
    required_error: "CARGO_SUBSCRIPTION_ACTIVE_REQUIRED",
    invalid_type_error: "CARGO_SUBSCRIPTION_ACTIVE_REQUIRED",
  }),
});

export type UpdateCargoSubscriptionInput = z.infer<typeof updateCargoSubscriptionSchema>;
