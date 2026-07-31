import { z } from "zod";

export const CARGO_RESPONSE_COMMENT_MIN = 5;
export const CARGO_RESPONSE_COMMENT_MAX = 1000;
export const CARGO_RESPONSE_PRICE_MAX = 50;
export const CARGO_RESPONSE_CURRENCY_MAX = 10;
export const CARGO_RESPONSE_TIME_MAX = 100;
export const CARGO_RESPONSE_CONTACT_NAME_MAX = 100;
export const CARGO_RESPONSE_CONTACT_PHONE_MAX = 20;

function optionalTrimmed(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    });
}

export const createCargoResponseSchema = z.object({
  price: optionalTrimmed(CARGO_RESPONSE_PRICE_MAX),
  currency: optionalTrimmed(CARGO_RESPONSE_CURRENCY_MAX),
  estimatedTime: optionalTrimmed(CARGO_RESPONSE_TIME_MAX),
  comment: z
    .string({ required_error: "CARGO_RESPONSE_COMMENT_REQUIRED" })
    .trim()
    .min(CARGO_RESPONSE_COMMENT_MIN, { message: "CARGO_RESPONSE_COMMENT_TOO_SHORT" })
    .max(CARGO_RESPONSE_COMMENT_MAX, { message: "CARGO_RESPONSE_COMMENT_TOO_LONG" }),
  contactName: optionalTrimmed(CARGO_RESPONSE_CONTACT_NAME_MAX),
  contactPhone: optionalTrimmed(CARGO_RESPONSE_CONTACT_PHONE_MAX),
});

export type CreateCargoResponseInput = z.infer<typeof createCargoResponseSchema>;

export const updateCargoRequestStatusSchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "CONTACTED", "CLOSED"], {
    required_error: "CARGO_STATUS_INVALID",
    invalid_type_error: "CARGO_STATUS_INVALID",
  }),
});

export type UpdateCargoRequestStatusInput = z.infer<typeof updateCargoRequestStatusSchema>;
