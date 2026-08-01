import { z } from "zod";
import {
  CARGO_DIRECTION_IDS,
  CARGO_SERVICE_TYPE_IDS,
} from "@/features/cargo/lib/cargo-subscription-options";

const serviceTypeEnum = z.enum(CARGO_SERVICE_TYPE_IDS);
const directionEnum = z.enum(CARGO_DIRECTION_IDS);

const locationListSchema = z
  .array(z.string().trim().max(120))
  .max(30)
  .transform((items) => items.map((item) => item.trim()).filter((item) => item.length > 0));

const optionalTelegramChatId = z
  .string()
  .trim()
  .max(64)
  .optional()
  .nullable()
  .transform((value) => {
    if (value == null) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  })
  .refine((value) => value == null || /^-?\d{5,64}$/.test(value), {
    message: "CARGO_TELEGRAM_CHAT_ID_INVALID",
  });

const optionalTelegramUsername = z
  .string()
  .trim()
  .max(64)
  .optional()
  .nullable()
  .transform((value) => {
    if (value == null) {
      return null;
    }
    const trimmed = value.trim().replace(/^@+/, "");
    return trimmed.length > 0 ? trimmed : null;
  });

/** Full settings payload for /seller/cargo-settings */
export const updateCargoSubscriptionSettingsSchema = z
  .object({
    enabled: z.boolean({
      required_error: "CARGO_SUBSCRIPTION_ENABLED_REQUIRED",
      invalid_type_error: "CARGO_SUBSCRIPTION_ENABLED_REQUIRED",
    }),
    serviceTypes: z.array(serviceTypeEnum).max(CARGO_SERVICE_TYPE_IDS.length).default([]),
    directions: z.array(directionEnum).max(CARGO_DIRECTION_IDS.length).default([]),
    fromLocations: locationListSchema.optional().default([]),
    toLocations: locationListSchema.optional().default([]),
    notifyInApp: z.boolean().default(true),
    notifyEmail: z.boolean().default(false),
    notifyTelegram: z.boolean().default(false),
    notifyWhatsApp: z.boolean().default(false),
    telegramChatId: optionalTelegramChatId,
    telegramUsername: optionalTelegramUsername,
  })
  .superRefine((data, ctx) => {
    if (data.notifyTelegram && !data.telegramChatId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CARGO_TELEGRAM_CHAT_ID_REQUIRED",
        path: ["telegramChatId"],
      });
    }
  });

/** Legacy simple toggle */
export const updateCargoSubscriptionSchema = z.object({
  active: z.boolean({
    required_error: "CARGO_SUBSCRIPTION_ACTIVE_REQUIRED",
    invalid_type_error: "CARGO_SUBSCRIPTION_ACTIVE_REQUIRED",
  }),
});

export const cargoSubscriptionPostSchema = z.union([
  updateCargoSubscriptionSettingsSchema,
  updateCargoSubscriptionSchema,
]);

export type UpdateCargoSubscriptionSettingsInput = z.infer<
  typeof updateCargoSubscriptionSettingsSchema
>;
export type UpdateCargoSubscriptionInput = z.infer<typeof updateCargoSubscriptionSchema>;

export function isFullCargoSubscriptionPayload(
  value: UpdateCargoSubscriptionSettingsInput | UpdateCargoSubscriptionInput,
): value is UpdateCargoSubscriptionSettingsInput {
  return "enabled" in value;
}
