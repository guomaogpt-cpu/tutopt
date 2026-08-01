import { z } from "zod";
import {
  CARGO_DIRECTION_IDS,
  CARGO_SERVICE_TYPE_IDS,
} from "@/features/cargo/lib/cargo-subscription-options";

export const CARGO_NAME_MAX = 100;
export const CARGO_PHONE_MAX = 20;
export const CARGO_COMPANY_MAX = 150;
export const CARGO_LOCATION_MAX = 200;
export const CARGO_ITEM_NAME_MAX = 200;
export const CARGO_DESCRIPTION_MAX = 2000;
export const CARGO_QUANTITY_MAX = 50;
export const CARGO_WEIGHT_MAX = 50;
export const CARGO_DIMENSIONS_MAX = 100;
export const CARGO_URGENCY_MAX = 50;
export const CARGO_COMMENT_MAX = 2000;
export const CARGO_PHOTO_URL_MAX = 500;

const CARGO_PHOTO_URL_PATTERN = /^\/api\/uploads\/(listings|cargo)\/[A-Za-z0-9._-]+$/;

function requiredTrimmed(max: number, requiredMessage: string) {
  return z
    .string({ required_error: requiredMessage })
    .trim()
    .min(1, { message: requiredMessage })
    .max(max);
}

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

export const createCargoRequestSchema = z.object({
  name: requiredTrimmed(CARGO_NAME_MAX, "CARGO_NAME_REQUIRED"),
  phone: requiredTrimmed(CARGO_PHONE_MAX, "CARGO_PHONE_REQUIRED").refine(
    (value) => value.replace(/\D/g, "").length >= 6,
    { message: "CARGO_PHONE_REQUIRED" },
  ),
  company: optionalTrimmed(CARGO_COMPANY_MAX),
  fromLocation: requiredTrimmed(CARGO_LOCATION_MAX, "CARGO_FROM_REQUIRED"),
  toLocation: requiredTrimmed(CARGO_LOCATION_MAX, "CARGO_TO_REQUIRED"),
  itemName: requiredTrimmed(CARGO_ITEM_NAME_MAX, "CARGO_ITEM_REQUIRED"),
  description: optionalTrimmed(CARGO_DESCRIPTION_MAX),
  itemPhotoUrl: z
    .string()
    .trim()
    .max(CARGO_PHOTO_URL_MAX)
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    })
    .refine((value) => value == null || CARGO_PHOTO_URL_PATTERN.test(value), {
      message: "CARGO_PHOTO_INVALID",
    }),
  quantity: optionalTrimmed(CARGO_QUANTITY_MAX),
  weight: optionalTrimmed(CARGO_WEIGHT_MAX),
  dimensions: optionalTrimmed(CARGO_DIMENSIONS_MAX),
  urgency: optionalTrimmed(CARGO_URGENCY_MAX),
  comment: optionalTrimmed(CARGO_COMMENT_MAX),
  serviceType: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    })
    .refine(
      (value) =>
        value == null || (CARGO_SERVICE_TYPE_IDS as readonly string[]).includes(value),
      { message: "CARGO_SERVICE_TYPE_INVALID" },
    ),
  direction: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => {
      if (value == null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    })
    .refine(
      (value) => value == null || (CARGO_DIRECTION_IDS as readonly string[]).includes(value),
      { message: "CARGO_DIRECTION_INVALID" },
    ),
});

export type CreateCargoRequestInput = z.infer<typeof createCargoRequestSchema>;
