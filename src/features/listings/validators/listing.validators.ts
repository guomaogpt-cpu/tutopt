import { ListingUnit } from "@prisma/client";
import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(3, "Title is too short").max(200, "Title is too long"),
  description: z.string().min(10, "Description is too short").max(10000, "Description is too long"),
  price: z.coerce.number().positive("Price must be positive"),
  currency: z.string().length(3, "Currency must be 3 characters").default("KGS"),
  moq: z.coerce.number().int().min(1, "MOQ must be at least 1"),
  unit: z.nativeEnum(ListingUnit),
  category_id: z.string().uuid("Invalid category"),
  city_id: z.string().uuid("Invalid city"),
  brand_id: z.string().uuid("Invalid brand").optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0).optional().nullable(),
  image_urls: z
    .array(
      z
        .string()
        .regex(/^\/uploads\/listings\/[a-zA-Z0-9._-]+$/, "Invalid image url"),
    )
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
